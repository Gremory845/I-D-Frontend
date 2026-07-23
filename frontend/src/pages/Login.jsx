import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { user, login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "staff" || user.role === "admin" ? "/staff" : "/visitor", {
        replace: true,
      });
    }
  }, [navigate, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Por favor ingresa correo y contraseña.");
      return;
    }

    try {
      await login(email, password);
    } catch (loginError) {
      setFormError(loginError.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="card w-full max-w-md p-10">
        <div className="text-center mb-8 ">
          <h1 className="text-3xl mb-4 font-light">Bienvenido</h1>
          <p>Ingresa al sistema de citas para visitas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-4 outline-none focus:border-purple-500"
            placeholder="Correo electrónico"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-4 outline-none focus:border-purple-500"
            placeholder="Contraseña"
          />

          {(formError || error) && (
            <p className="text-sm text-red-500">{formError || error}</p>
          )}

          <button type="submit" disabled={loading} className="primary-btn w-full">
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;