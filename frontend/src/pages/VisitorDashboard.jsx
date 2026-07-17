import Navbar from "../components/Navbar";
import VisitCalendar from "../components/Calendar";
import { useState } from "react";


function VisitorDashboard() {


  const [date, setDate] = useState(new Date());


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
            setDate={setDate} />

          <div className="mt-8 rounded-xl p-5">

            <h3 className="font-bold">
              Horarios disponibles
            </h3>

            <p className="mt-2">
              Selecciona una fecha para consultar horarios.
            </p>

          </div>

        </div>

      </main>

    </>

  )

}


export default VisitorDashboard;