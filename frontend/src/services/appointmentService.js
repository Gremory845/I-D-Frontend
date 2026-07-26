import api from "./api";

//Staff
export async function getAppointments() {
  const response = await api.get("/api/appointments");
  return response.data?.data || [];
}

export async function updateAppointmentStatus(appointmentId, status, rejection_notes = null) {
  const payload = { status };
  if (rejection_notes !== null) {
    payload.rejection_notes = rejection_notes;
  }

  const response = await api.patch(`/api/appointments/${appointmentId}/status`, payload);
  return response.data?.data || response.data;
}

//Visitor
export async function getFreeSlots(date, residentId) {
    const response = await api.get("/api/appointments/free", {
        params: { date, resident_id: residentId },
    });

    return response.data?.data || response.data;
}


export async function getOccupiedDates() {
    const response = await api.get("/api/appointments/occupied");

    return response.data?.data || response.data;
}


export async function createAppointment(data) {
    const response = await api.post("/api/appointments", data);

    return response.data?.data || response.data;
}
