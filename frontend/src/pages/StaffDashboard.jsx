import Navbar from "../components/Navbar";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentModal from "../components/AppointmentModal";
import { useState } from "react";


function StaffDashboard() {

  const [appointments, setAppointments] = useState([

    {
      id: 1,
      visitor: "Juan Pérez",
      resident: "María López",
      date: "20 Julio 2026",
      time: "10:00 AM",
      status: "pending"
    },

    {
      id: 2,
      visitor: "Pedro Díaz",
      resident: "Carlos Mora",
      date: "21 Julio 2026",
      time: "2:00 PM",
      status: "pending"
    }

  ]);

  const [showModal, setShowModal] = useState(false);

const [reason, setReason] = useState("");

const [selectedAppointment, setSelectedAppointment] = useState(null);


  function approve(id) {

    setAppointments(prev =>
      prev.map(item =>

        item.id === id
          ?
          {
            ...item,
            status: "approved"
          }
          :
          item
      )

    )

  }

  function openRejectModal(id){

  setSelectedAppointment(id);

  setShowModal(true);

  }

  function reject(){

  setAppointments(prev =>
    prev.map(item =>

      item.id === selectedAppointment

      ?
      {
        ...item,
        status:"rejected",
 rejection_notes: reason
      }

      :
      item

    )
  );


  setShowModal(false);

  setReason("");

}

  return (

    <>

      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-10">

        <div className="mb-10">


          <h1 className="text-4xl font-bold">
            Agenda de visitas
          </h1>


          <p className="mt-2">
            Revisa y gestiona solicitudes pendientes
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6">


          {
            appointments.map(item => (

              <AppointmentCard

                key={item.id}

                appointment={item}

                canApprove={true}

                onApprove={() => approve(item.id)}

                onReject={() => openRejectModal(item.id)}

              />
            ))
          }

        </div>
      </main>
       {
        showModal && (

          <AppointmentModal

            close={() => setShowModal(false)}

            reason={reason}

            setReason={setReason}

            submit={reject}

          />

        )
      }
    </>
  )
}


export default StaffDashboard;