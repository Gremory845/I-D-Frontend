import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import VisitorDashboard from "./pages/VisitorDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/visitor"
          element={
            <ProtectedRoute allowedRoles={["visitor"]}>
              <VisitorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;