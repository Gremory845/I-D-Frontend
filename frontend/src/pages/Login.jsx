import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  function submit(role) {

    login(role);

    if (role === "visitor") {
      navigate("/visitor");
    }
    else {
      navigate("/staff");
    }
  }


  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
    >
      <div
        className="card w-full max-w-md p-10">
        <div
          className="text-center mb-8 ">

          <h1
            className="text-3xl mb-4 font-light">
            Bienvenido
          </h1>

          <p>Ingresa al sistema de citas para visitas</p>
        </div>

        <input
          className="w-full border rounded-xl p-4 mb-4 outline-none focus:border-purple-500"
          placeholder="Correo electrónico" />

        <input
          className="w-full border rounded-xl p-4 outline-none focus:border-purple-500"
          placeholder="Contraseña" />

        <div className="space-y-3 mt-6">


<button

onClick={()=>submit("visitor")}

className="
primary-btn
w-full
">

Entrar como visitante

</button>



<button

onClick={()=>submit("staff")}

className="
secondary-btn
w-full
">

Entrar como encargado

</button>


</div>
      </div>
    </div>
  );

}


export default Login;