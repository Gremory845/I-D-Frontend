import api from "./api";

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
