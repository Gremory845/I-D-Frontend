import { createContext, useState, useContext } from "react";
import { login as loginRequest, logout as logoutRequest } from "../services/authService";

const AuthContext = createContext();

function getStoredUser() {
  if (typeof window === "undefined") return null;

  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
}

function getRoleFromUser(rawUser) {
  if (!rawUser) return "visitor";
  if (rawUser.role) return rawUser.role;

  const email = (rawUser.email || "").toLowerCase();
  if (email === "admin@example.com") return "admin";
  if (email === "maria@example.com") return "staff";
  return "visitor";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function login(email, password) {
    setLoading(true);
    setError(null);

    try {
      const response = await loginRequest(email, password);
      const token = response.token || response.data?.token;
      const rawUser = response.data || response.user || response;

      const currentUser = {
        id: rawUser.id,
        name: rawUser.name,
        email: rawUser.email,
        role: getRoleFromUser(rawUser),
      };

      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
      if (token) {
        localStorage.setItem("token", token);
      }
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Error al iniciar sesión.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await logoutRequest();
    } catch (requestError) {
      console.warn("Logout request failed:", requestError);
    }

    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
