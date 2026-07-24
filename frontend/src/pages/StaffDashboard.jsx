import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentModal from "../components/AppointmentModal";
import Loader from "../components/Loader";
import { getAppointments, updateAppointmentStatus } from "../services/appointmentService";

function StaffDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      setError(null);

      try {
        const data = await getAppointments();
        setAppointments(data.map(formatAppointment));
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "No se pudo cargar la lista de citas."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  function formatAppointment(appointment) {
    return {
      id: appointment.id,
      visitor: appointment.visitor_name || "Sin visitante",
      resident: appointment.resident_name || "Sin residente",
      date: appointment.visit_date,
      time: formatTime(appointment.start_time, appointment.end_time),
      status: appointment.status,
      rejection_notes: appointment.rejection_notes,
    };
  }

  function formatTime(start, end) {
    const normalize = (value) => {
      if (!value) return "--";
      return value.length >= 5 ? value.slice(0, 5) : value;
    };

    return `${normalize(start)} - ${normalize(end)}`;
  }

  async function approve(id) {
    setError(null);

    try {
      await updateAppointmentStatus(id, "approved");
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "approved" } : item
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "No se pudo aprobar la cita."
      );
    }
  }

  function openRejectModal(id) {
    setSelectedAppointment(id);
    setShowModal(true);
  }

  async function reject() {
    if (!selectedAppointment) return;

    setError(null);

    try {
      await updateAppointmentStatus(selectedAppointment, "rejected", reason);
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === selectedAppointment
            ? { ...item, status: "rejected", rejection_notes: reason }
            : item
        )
      );
      setShowModal(false);
      setReason("");
      setSelectedAppointment(null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "No se pudo rechazar la cita."
      );
    }
  }

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Agenda de visitas</h1>
          <p className="mt-2">Revisa y gestiona solicitudes pendientes</p>
        </div>

        {loading ? (
          <div className="card p-8">
            <Loader />
          </div>
        ) : error ? (
          <div className="card p-8 text-red-500">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="card p-8">
            <p>No hay citas registradas aún.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {appointments.map((item) => (
              <AppointmentCard
                key={item.id}
                appointment={item}
                canApprove={true}
                onApprove={() => approve(item.id)}
                onReject={() => openRejectModal(item.id)}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <AppointmentModal
          close={() => setShowModal(false)}
          reason={reason}
          setReason={setReason}
          submit={reject}
        />
      )}
    </>
  );
}


export default StaffDashboard;