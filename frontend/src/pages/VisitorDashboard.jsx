import Navbar from "../components/Navbar";
import VisitCalendar from "../components/Calendar";
import NewVisitForm from "../components/NewVisitForm";
import { useState } from "react";


function VisitorDashboard() {

  const [date, setDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  function openNewVisit() {
    setShowForm(true);
    setShowCalendar(false);
  }

  function cancelForm() {
    setShowForm(false);
  }

  function handleCreate(appointment) {
    // Aquí se podría enviar a la API. Por ahora, mostramos en consola.
    console.log("Nueva visita creada:", appointment);

    // Mostrar calendario y centrar en la fecha de la visita
    try {
      if (appointment.visit_date) setDate(new Date(appointment.visit_date));
    } catch (e) {
      // ignore invalid date
    }

    setShowForm(false);
    setShowCalendar(true);
  }

  return (
    <>

      <Navbar />

      <main className="max-w-5xl mx-auto px-8 py-10">


        <h1 className="text-4xl font-normal mb-2">Bienevido a Casa Aurora </h1>


        <p className="mb-8">¿Qué deseas hacer?</p>

        <div className="card p-8">

          <div className="flex gap-4 mb-6">
            <button onClick={openNewVisit} className="primary-btn">Nueva visita</button>
            <button onClick={() => { setShowCalendar(true); setShowForm(false); }} className="secondary-btn">Ver calendario</button>
          </div>

          {showForm && (
            <NewVisitForm onSubmit={handleCreate} onCancel={cancelForm} />
          )}

          {showCalendar ? (
            <>
              <VisitCalendar date={date} setDate={setDate} />

              <div className="mt-8 rounded-xl p-5">
                <h3 className="font-bold">Horarios disponibles</h3>
                <p className="mt-2">Selecciona una fecha para consultar horarios.</p>
              </div>
            </>
          ) : (
            !showForm && (
              <div className="mt-6 text-gray-600">Puedes crear una nueva visita o ver el calendario.</div>
            )
          )}

        </div>

      </main>

    </>
  );
}

export default VisitorDashboard;