// RutaAdminProtegida.jsx - Protege las rutas del panel de administración.
//
// Este componente se usa como envoltorio de rutas privadas. Consulta el
// contexto de autenticación de admin y decide qué renderizar:
// - Si todavía se está validando el token: muestra una pantalla de carga.
// - Si no hay sesión: redirige a /admin/login con replace (no deja entrada
//   en el historial del navegador).
// - Si hay sesión: renderiza el contenido protegido (children).

import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

function RutaAdminProtegida({ children }) {
    const { isAuthenticated, cargando } = useAdminAuth();

    if (cargando) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
                <p className="text-sm font-medium">Cargando panel...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // replace evita que el usuario pueda volver con el botón atrás
        // a una ruta a la que no tenía acceso.
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

export default RutaAdminProtegida;
