import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import VisitorDashboard from "./pages/VisitorDashboard";
import StaffDashboard from "./pages/StaffDashboard";

import { AuthProvider } from "./context/AuthContext";


function App(){

  return (

    <AuthProvider>

      <Routes>

        <Route 
          path="/" 
          element={<Login />}
        />


        <Route 
          path="/visitor" 
          element={<VisitorDashboard />}
        />


        <Route 
          path="/staff" 
          element={<StaffDashboard />}
        />

      </Routes>

    </AuthProvider>

  );

}


export default App;