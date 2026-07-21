import Navbar from "../components/Navbar";
import VisitCalendar from "../components/Calendar";
import { useState } from "react";

// Datos simulados
const FAKE_FIRST_NAMES = [
  "María",
  "José",
  "Ana",
  "Carlos",
  "Rosa",
  "Luis",
  "Marta",
  "Rafael",
  "Carmen",
  "Fernando",
];

const FAKE_LAST_NAMES = [
  "Rodríguez",
  "Jiménez",
  "Mora",
  "Vargas",
  "Solano",
  "Chacón",
  "Araya",
  "Quesada",
  "Salas",
  "Brenes",
];

const FAKE_RESIDENTS = FAKE_FIRST_NAMES.map((first_name, i) => ({
  id: i + 1,
  first_name,
  last_name: FAKE_LAST_NAMES[i],
  room_number: `${100 + i}`,
  status: "active",
}));

const TIME_SLOTS = [
  { start: "09:00", end: "09:30" },
  { start: "09:30", end: "10:00" },
  { start: "10:00", end: "10:30" },
  { start: "10:30", end: "11:00" },
  { start: "11:00", end: "11:30" },
  { start: "11:30", end: "12:00" },
  { start: "13:00", end: "13:30" },
  { start: "13:30", end: "14:00" },
  { start: "14:00", end: "14:30" },
  { start: "14:30", end: "15:00" },
  { start: "15:00", end: "15:30" },
  { start: "15:30", end: "16:00" },
  { start: "16:00", end: "16:30" },
  { start: "16:30", end: "17:00" },
];

function getAvailableSlots(date) {
  const day = date.getDay();

  if (day === 0 || day === 6) {
    return [];
  }

  return TIME_SLOTS.map((slot) => ({
    value: `${slot.start}-${slot.end}`,
    label: `${slot.start} - ${slot.end}`,
    start: slot.start,
    end: slot.end,
  }));
}

function VisitorDashboard() {
  const [date, setDate] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState("");

  const [visitorName, setVisitorName] = useState("");

  const [residentId, setResidentId] = useState("");

  const timeSlots = date ? getAvailableSlots(date) : [];

  function submitAppointment() {
    const appointment = {
      visitor_name: visitorName,
      resident_id: residentId,
      visit_date: date?.toISOString().slice(0, 10),
      time_slot: selectedSlot,
    };

    console.log(appointment);

    alert("Visita reservada correctamente.");
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
          />

          {/* Horario */}

          {date && (
            <div className="mt-8">

              <h3 className="font-bold text-xl mb-4">
                Horarios disponibles
              </h3>

              <div className="flex flex-wrap gap-3">

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

                {FAKE_RESIDENTS.map((resident) => (
                  <option
                    key={resident.id}
                    value={resident.id}
                  >
                    {resident.first_name}{" "}
                    {resident.last_name}
                  </option>
                ))}
              </select>

              <button
                onClick={submitAppointment}
                className="primary-btn">
                Reservar visita
              </button>

            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default VisitorDashboard;