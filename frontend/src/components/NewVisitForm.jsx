import { useState } from "react";
import VisitCalendar from "./Calendar";

// --- Simulación de datos que vendrían del API ---
// En la BD real, first_name y last_name son columnas separadas de la tabla "residents".
// Cuando llegue el objeto real, ya viene con esa forma: { id, first_name, last_name, room_number, status }
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

// Simulamos la respuesta del API: un arreglo de residentes con first_name y last_name separados
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
  if (day === 0 || day === 6) return [];

  return TIME_SLOTS.map((slot) => ({
    value: `${slot.start}-${slot.end}`,
    label: `${slot.start} - ${slot.end}`,
    start: slot.start,
    end: slot.end,
  }));
}

function NewVisitForm({ onSubmit, onCancel }) {
  // En vez de un input libre, guardamos residents en un array de estado.
  // Cuando conectes el API real, reemplazá FAKE_RESIDENTS por el fetch correspondiente
  // (por ejemplo con useEffect + useState([])).
  const [residents] = useState(FAKE_RESIDENTS);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState(getAvailableSlots(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(
    timeSlots[0]?.value || ""
  );

  const [form, setForm] = useState({
    id: "",
    visitor_name: "",
    resident_id: "", // guardamos el id del residente seleccionado, no el nombre concatenado
    visit_date: new Date().toISOString().slice(0, 10),
    start_time: timeSlots[0]?.start || "",
    end_time: timeSlots[0]?.end || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSlotChange(e) {
    const value = e.target.value;
    const [start_time, end_time] = value.split("-");
    setSelectedSlot(value);
    setForm((s) => ({ ...s, start_time, end_time }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const now = new Date().toISOString();

    // Buscamos el residente seleccionado para armar su nombre completo
    const selectedResident = residents.find(
      (r) => String(r.id) === String(form.resident_id)
    );
    const resident_name = selectedResident
      ? `${selectedResident.first_name} ${selectedResident.last_name}`
      : "";

    const appointment = {
      id: form.id || String(Date.now()),
      visitor_name: form.visitor_name,
      resident_id: form.resident_id,
      resident_name, // nombre concatenado, útil para mostrar/mandar al backend
      visit_date: form.visit_date,
      start_time: form.start_time,
      end_time: form.end_time,
      // Campos que no se piden al usuario
      status: "pendiente",
      notes: "",
      rejection_notes: "",
      timestamps: {
        created_at: now,
        updated_at: now,
      },
    };

    if (onSubmit) onSubmit(appointment);
  }

  function handleDateChange(date) {
    setSelectedDate(date);
    const formatted = date.toISOString().slice(0, 10);
    const slots = getAvailableSlots(date);
    const nextSlot = slots[0] || { value: "", start: "", end: "" };

    setTimeSlots(slots);
    setSelectedSlot(nextSlot.value);
    setForm((s) => ({
      ...s,
      visit_date: formatted,
      start_time: nextSlot.start,
      end_time: nextSlot.end,
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)]">
      <h2 className="text-3xl font-normal">Reservar nueva visita</h2>

      <div className="my-2">
        <label className="block text-md">Nombre del visitante</label>
        <input
          placeholder="Ingrese su nombre completo"
          name="visitor_name"
          value={form.visitor_name}
          onChange={handleChange}
          required
          className="w-full border rounded-xl p-4 my-4 outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-md">¿A Quien va a Visitar?</label>
        <select
          name="resident_id"
          value={form.resident_id}
          onChange={handleChange}
          required
          className="w-full border rounded-xl p-4 my-4 outline-none focus:border-purple-500"
        >
          <option value="" disabled>
            Seleccione un adulto mayor
          </option>
          {residents.map((r) => (
            <option key={r.id} value={r.id}>
              {r.first_name} {r.last_name}
            </option>
          ))}
        </select>
      </div>
        <div>
          <label className="block text-md my-4 font-bold">Fecha de la visita</label>
          <VisitCalendar date={selectedDate} setDate={handleDateChange} />
          <p className="mt-2 text-sm text-gray-600">Fecha seleccionada: {form.visit_date}</p>
        </div>

      <div>
        <label className="block text-sm">Horario disponible</label>
        <select
          name="time_slot"
          value={selectedSlot}
          onChange={handleSlotChange}
          className="w-full border rounded-xl p-4 my-4 outline-none focus:border-purple-500"
          required
        >
          {timeSlots.length === 0 ? (
            <option value="" disabled>
              No hay horarios disponibles para esta fecha
            </option>
          ) : (
            <>
              <option value="" disabled>
                Seleccione un horario
              </option>
              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      <p className="text-sm text-gray-500">Los campos "status", "notes" y "rejection_notes" se completan internamente.</p>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="secondary-btn">Cancelar</button>
        <button type="submit" className="primary-btn">Reservar</button>
      </div>
    </form>
  );
}

export default NewVisitForm;