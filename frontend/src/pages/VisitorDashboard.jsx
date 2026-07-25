import Navbar from "../components/Navbar";
import VisitCalendar from "../components/Calendar";
import { useEffect, useState } from "react";
import { getResidentsNames } from "../services/residentService";
import { getFreeSlots, getOccupiedDates, createAppointment } from "../services/appointmentService";
import { useAuth } from "../context/AuthContext";

//para mantrener la zona horaria del país, se puede hacer igual con una biblioteca pero es lo mismo
function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
//obtiene la hora y fecha actual
function isToday(date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function getAvailableSlots(date) {
  const day = date.getDay();

  if (day === 0 || day === 6) return [];

  if (isToday(date)) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    slots = slots.filter((slot) => {
      const [hours, minutes] = slot.start.split(":").map(Number);
      const slotMinutes = hours * 60 + minutes;
      return slotMinutes > currentMinutes;
    });
  }

  return slots.map((slot) => ({
    value: `${slot.start}-${slot.end}`,
    label: `${slot.start} - ${slot.end}`,
    start: slot.start,
    end: slot.end,
  }));
}
//verifica que los espacios estén llenos para enviar el form
function getMissingFieldMessage(visitorName, residentId, selectedSlot) {
  if (!visitorName.trim()) {
    return "Ingresa el nombre del visitante para continuar";
  }
  if (!residentId) {
    return "Selecciona un residente para continuar";
  }
  if (!selectedSlot) {
    return "Selecciona un horario para continuar";
  }
  return null;
}

function VisitorDashboard() {
  const { user } = useAuth();
  const [date, setDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [residentId, setResidentId] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [touched, setTouched] = useState(false); //evita que lanze mensaje de espacio vacio antes que el usuario llene algo
  const [residents, setResidents] = useState([]);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false)
  const missingFieldMessage = getMissingFieldMessage(visitorName, residentId, selectedSlot);
  const canSubmit = !missingFieldMessage;

  useEffect(() => {

    async function loadData() {

      try {
        const residentsData = await getResidentsNames();
        setResidents(residentsData);

        const occupied = await getOccupiedDates();
        setOccupiedDates(occupied);

      } catch (error) {
        console.error(error);
      }

    }


    loadData();

  }, []);

  useEffect(() => {

    async function loadSlots() {

      if (!date) return;

      try {

        setLoadingSlots(true);

        const formatted = formatLocalDate(date);
        const slots = await getFreeSlots(formatted);
        const formattedSlots = slots.map(slot => ({
          value: `${slot.start_time}-${slot.end_time}`,
          label: `${slot.start_time} - ${slot.end_time}`,
          start: slot.start_time,
          end: slot.end_time
        }));

        setTimeSlots(formattedSlots);

      } catch (error) {

        console.error(error);
        setTimeSlots([]);

      }
      finally {
        setLoadingSlots(false);
      }

    }

    loadSlots();

  }, [date]);

  async function submitAppointment() {

    setTouched(true);

    if (!canSubmit) return;

    const [start_time, end_time] = selectedSlot.split("-");

    const appointment = {

  user_id:user.id,

  visitor_name:visitorName,

  resident_id:Number(residentId),

  visit_date:formatLocalDate(date),

  start_time,

  end_time

};

    try {

      await createAppointment(appointment);

      setConfirmation(
        "Visita reservada correctamente."
      );


      setVisitorName("");
      setResidentId("");
      setSelectedSlot("");
      setDate(null);


    } catch (error) {

      console.error(error);

      setConfirmation(
        "Error al reservar la visita."
      );

    }

  }

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-4xl font-bold mb-2">
          Nueva visita
        </h1>

        <p className="mb-8">
          Selecciona el día de tu visita
        </p>

        <div className="card p-8">

          <VisitCalendar
            date={date}
            setDate={setDate}
            occupiedDates={occupiedDates}
          />

          {/* Horario */}

          {date && (
            <div className="mt-8">

              <h3 className="font-bold text-xl mb-4">
                Horarios disponibles
              </h3>

              <div className="flex flex-wrap gap-3">

                {loadingSlots && (
                  <p key="loading">
                    Buscando horarios disponibles...
                  </p>
                )}

                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => setSelectedSlot(slot.value)}
                    className={
                      selectedSlot === slot.value
                        ? "primary-btn"
                        : "secondary-btn"
                    }
                  >
                    {slot.label}
                  </button>
                ))}

              </div>

            </div>
          )}

          {/* Formulario */}

          {selectedSlot && (
            <div className="mt-10 space-y-5">

              <h3 className="font-bold text-xl">
                Información de la visita
              </h3>

              <input
                placeholder="Nombre del visitante"
                value={visitorName}
                onChange={(e) =>
                  setVisitorName(e.target.value)}
                className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]" />

              <select
                value={residentId}
                onChange={(e) =>
                  setResidentId(e.target.value)}
                className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                <option value="">
                  Seleccione un residente
                </option>

                {residents.map((resident) => (
                  <option
                    key={resident.id}
                    value={resident.id}
                  >
                    {resident.first_name}{" "}
                    {resident.last_name}
                  </option>
                ))}
              </select>

              {touched && missingFieldMessage && (
                <p className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                  {missingFieldMessage}
                </p>
              )}

              <button
                onClick={submitAppointment}
                disabled={touched && !canSubmit} //confirma que los campos vayan llenos antes de enviar el form
                className="primary-btn">
                Reservar visita
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