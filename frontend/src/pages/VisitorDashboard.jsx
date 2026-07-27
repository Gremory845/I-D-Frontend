import Navbar from "../components/Navbar";
import VisitCalendar from "../components/Calendar";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { getResidentsNames } from "../services/residentService";
import { getFreeSlots, createAppointment } from "../services/appointmentService";
import { useAuth } from "../context/AuthContext";

function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isToday(date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function filterPastSlotsIfToday(slots, date) {
  if (!isToday(date)) return slots;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return slots.filter((slot) => {
    const [hours, minutes] = slot.start.split(":").map(Number);
    const slotMinutes = hours * 60 + minutes;
    return slotMinutes > currentMinutes;
  });
}

function getMissingFieldMessage(visitorName, residentId, selectedSlot, notes) {
  if (!residentId) {
    return "Selecciona un residente para continuar";
  }
  if (!selectedSlot) {
    return "Selecciona un horario para continuar";
  }
  if (!visitorName.trim()) {
    return "Ingresa el nombre del visitante para continuar";
  }
  if (!notes.trim()) {
    return "Ingresa la razón o detalles de la visita para continuar";
  }
  return null;
}

function VisitorDashboard() {
  const { user } = useAuth();

  const [date, setDate] = useState(null);
  const [residentId, setResidentId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [notes, setNotes] = useState("");

  const [confirmation, setConfirmation] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const [residents, setResidents] = useState([]);
  const [loadingResidents, setLoadingResidents] = useState(true);
  const [residentsError, setResidentsError] = useState(null);

  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  const missingFieldMessage = getMissingFieldMessage(visitorName, residentId, selectedSlot, notes);
  const canSubmit = !missingFieldMessage;

  // Cargar residentes una sola vez al montar
  useEffect(() => {
    getResidentsNames()
      .then(setResidents)
      .catch(() => setResidentsError("No se pudo cargar la lista de residentes"))
      .finally(() => setLoadingResidents(false));
  }, []);

  // Cargar horarios libres cada vez que cambien la fecha o el residente elegido
  useEffect(() => {
    setSelectedSlot(""); // evita arrastrar un slot que ya no aplica

    async function loadSlots() {
      if (!date || !residentId) {
        setTimeSlots([]);
        return;
      }

      setLoadingSlots(true);
      setSlotsError(null);

      try {
        const formatted = formatLocalDate(date);
        const slots = await getFreeSlots(formatted, residentId);

        const formattedSlots = slots.map((slot) => ({
          value: `${slot.start_time}-${slot.end_time}`,
          label: `${slot.start_time} - ${slot.end_time}`,
          start: slot.start_time,
          end: slot.end_time,
        }));

        setTimeSlots(filterPastSlotsIfToday(formattedSlots, date));
      } catch (error) {
        console.error(error);
        setSlotsError("No se pudieron cargar los horarios disponibles");
        setTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
  }, [date, residentId]);

  async function submitAppointment() {
    setTouched(true);
    setSubmitError(null);

    if (!canSubmit) return;

    const [start_time, end_time] = selectedSlot.split("-");

    const selectedResident = residents.find(
      (r) => String(r.id) === String(residentId)
    );

    const appointment = {
      user_id: user.id,
      visitor_name: visitorName,
      resident_id: Number(residentId),
      resident_name: selectedResident
        ? `${selectedResident.first_name} ${selectedResident.last_name}`
        : "",
      visit_date: formatLocalDate(date),
      start_time,
      end_time,
      notes,
    };

    setSubmitting(true);

    try {
      await createAppointment(appointment);

      setConfirmation("Visita reservada correctamente.");

      setVisitorName("");
      setNotes("");
      setResidentId("");
      setSelectedSlot("");
      setDate(null);
      setTouched(false);
    } catch (error) {
      console.error(error);
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        "No se pudo reservar la visita."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-4xl font-bold mb-2">Nueva visita</h1>
        <p className="mb-8">Selecciona el día de tu visita</p>

        <div className="card p-8">
          {/* 1. Fecha */}
          <VisitCalendar date={date} setDate={setDate} />

          {/* 2. Residente a visitar */}
          {date && (
            <div className="mt-8">
              <h3 className="font-bold text-xl mb-4">
                ¿A quién va a visitar?
              </h3>

              {loadingResidents && <Loader />}

              {residentsError && (
                <p className="text-red-400">{residentsError}</p>
              )}

              {!loadingResidents && !residentsError && (
                <select
                  value={residentId}
                  onChange={(e) => setResidentId(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                >
                  <option value="">Seleccione un residente</option>
                  {residents.map((resident) => (
                    <option key={resident.id} value={resident.id}>
                      {resident.first_name} {resident.last_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* 3. Horario disponible para ESE residente en ESA fecha */}
          {date && residentId && (
            <div className="mt-8">
              <h3 className="font-bold text-xl mb-4">
                Horarios disponibles
              </h3>
                  <p className="text-xs text-yellow-400/80 mb-4">
      ⚠ Cada horario permite hasta 3 visitas. Si seleccionas un bloque,
      tu cita quedará sujeta a aprobación según el cupo disponible.
    </p>

              <div className="flex flex-wrap gap-3">
                {loadingSlots && <Loader />}

                {slotsError && <p className="text-red-400">{slotsError}</p>}

                {!loadingSlots && !slotsError && timeSlots.length === 0 && (
                  <p className="text-sm">
                    No hay horarios disponibles para esta fecha con este residente
                  </p>
                )}

                {!loadingSlots && timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => setSelectedSlot(slot.value)}
                    className={
                      selectedSlot === slot.value ? "primary-btn" : "secondary-btn"
                    }
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Nombre del visitante */}
          {selectedSlot && (
            <div className="mt-10 space-y-5">
              <h3 className="font-bold text-xl">Información de la visita</h3>

              <label htmlFor="visitorName" className="block text-md">
                Nombre del visitante
              </label>
              <input
                id="visitorName"
                placeholder="Nombre del visitante"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
              />

              <label htmlFor="notes" className="block text-md mt-4">
                Razón de la visita / Detalles
              </label>
              <textarea
                id="notes"
                placeholder="Describe la razón de la visita y cualquier detalle adicional"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] min-h-[140px]"
              />

              {touched && missingFieldMessage && (
                <p className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                  {missingFieldMessage}
                </p>
              )}

              {submitError && (
                <p className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  {submitError}
                </p>
              )}

              <button
                onClick={submitAppointment}
                disabled={(touched && !canSubmit) || submitting}
                className="primary-btn"
              >
                {submitting ? "Reservando..." : "Reservar visita"}
              </button>
            </div>
          )}

          {confirmation && (
            <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
              {confirmation}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default VisitorDashboard;