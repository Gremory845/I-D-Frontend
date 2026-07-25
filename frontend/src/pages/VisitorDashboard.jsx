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
  //aquí filtramos las horas que ya hayan pasado, ejemplo si son las 3 pm que no deje elegir de las 3 pm hacía atrás
  let slots = TIME_SLOTS;

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
  const [date, setDate] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState("");

  const [visitorName, setVisitorName] = useState("");

  const [residentId, setResidentId] = useState("");

  const timeSlots = date ? getAvailableSlots(date) : [];

  const [confirmation, setConfirmation] = useState(null);

  const [touched, setTouched] = useState(false); //evita que lanze mensaje de espacio vacio antes que el usuario llene algo

  const missingFieldMessage = getMissingFieldMessage(visitorName, residentId, selectedSlot);

  const canSubmit = !missingFieldMessage;

  function submitAppointment() {
    setTouched(true);
    if (!canSubmit) return; // no continuar si falta algo
    const appointment = {
      visitor_name: visitorName,
      resident_id: Number (residentId), //Modificación para futura conexión con back, mejor castear el dato antes de enviarlo para evitar bugs
      visit_date: formatLocalDate(date), //se usa la función antes creada
      time_slot: selectedSlot,
    };

    console.log(appointment);

    setConfirmation("Visita reservada correctamente.");

    //Reseta el formulario luego de reservar la cita
    setVisitorName("");
    setResidentId("");
    setSelectedSlot("");
    setDate(null);

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