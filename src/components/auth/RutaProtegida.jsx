import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function RutaProtegida({ children }) {
  const { isAuthenticated, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Guardamos la ruta actual en state para redirigir después del login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default RutaProtegida;