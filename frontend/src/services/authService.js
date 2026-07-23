import api from "./api";

export async function login(email, password) {
  const response = await api.post("/api/login", {
    email,
    password,
  });

  return response.data;
}

export async function logout() {
  await api.post("/api/logout");
}
