// AdminRoutes.jsx - Enrutador interno del panel de administración.
//
// React Router permite anidar <Routes>. Este componente se monta bajo /admin/*
// (definido en App.jsx). Las rutas internas son relativas a /admin:
//   - /admin/login
//   - /admin/
//   - /admin/usuarios
//
// El login es público dentro del área admin. El resto de las rutas están
// protegidas por <RutaAdminProtegida />, que redirige a /admin/login
// si no hay un admin autenticado. Las rutas protegidas se renderizan dentro
// de <AdminLayout /> usando <Outlet />.

import { Routes, Route } from 'react-router-dom';
import RutaAdminProtegida from '../../components/auth/RutaAdminProtegida.jsx';
import AdminLayout from './AdminLayout.jsx';
import LoginAdmin from './LoginAdmin.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import AdminUsuarios from './AdminUsuarios.jsx';

function AdminRoutes() {
    return (
        <Routes>
            {/* Login: ruta pública dentro del área de administración.
                No requiere autenticación porque es donde el usuario ingresa. */}
            <Route path="login" element={<LoginAdmin />} />

            {/* Ruta comodín (path="*") que protege todo lo demás bajo /admin.
                Si el admin no está logueado, RutaAdminProtegida redirige al login.
                AdminLayout actúa como layout y sus <Outlet /> muestran las rutas hijas. */}
            <Route
                path="*"
                element={
                    <RutaAdminProtegida>
                        <AdminLayout />
                    </RutaAdminProtegida>
                }
            >
                {/* index: ruta por defecto cuando la URL es /admin */}
                <Route index element={<AdminDashboard />} />
                {/* /admin/usuarios: CRUD de administradores */}
                <Route path="usuarios" element={<AdminUsuarios />} />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;
