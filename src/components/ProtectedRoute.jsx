import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated }) => {
  // 1. Si no está autenticado, lo enviamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si está autenticado, renderizamos las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;