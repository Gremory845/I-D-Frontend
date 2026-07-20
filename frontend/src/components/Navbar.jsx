import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();


  function handleLogout(){

    logout();

    navigate("/");

  }


  return (
    <header
      className="border-b sticky top-0 z-20 bg-purple-950">

      <div
        className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

        <div>

          <h1
            className="text-2xl font-light">
            Casa Aurora
          </h1>


          <p
            className="text-sm">
            Gestión de visitas familiares
          </p>

        </div>



        <div
          className="flex items-center gap-5">


          <div
            className="text-right hidden sm:block">

            <p
              className="font-semibold">
              {user?.name}
            </p>


            <p className="text-sm">
              {user?.role}
            </p>

          </div>



          <button

            onClick={handleLogout}

            className="secondary-btn">

            Cerrar sesión

          </button>


        </div>


      </div>

    </header>
  );
}

export default Navbar;