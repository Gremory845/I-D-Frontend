import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

function getStoredUser() {
  if (typeof window === "undefined") return null;

  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  function login(role) {
    const visitor = {
      name: "Carlos Pérez",
      role: "visitor",
      permissions: [],
    };

    const staff = {
      name: "Ana Rodríguez",
      role: "staff",
      permissions: ["view-all-appointments", "approve-appointments"],
    };

    const selectedUser = role === "visitor" ? visitor : staff;

    setUser(selectedUser);
    localStorage.setItem("user", JSON.stringify(selectedUser));
    localStorage.setItem("token", "fake-token");
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
