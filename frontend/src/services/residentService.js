import api from "./api";

export async function getResidentsNames() {
    const response = await api.get("/api/residents/names");

    return response.data?.data || response.data;
}