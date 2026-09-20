// AdminLayout.jsx - Layout del panel de administración.
//
// Este componente define la estructura visual de la zona /admin. Contiene:
// - Una barra lateral (sidebar) con el menú de navegación propio del admin.
// - Un encabezado que muestra el rol del usuario logueado.
// - La zona de contenido donde se renderizan las rutas hijas mediante <Outlet />.
//
// NavLink marca automáticamente el enlace activo con la clase de estilos.
// useNavigate permite redirigir al login después de cerrar sesión.

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

// Array con las opciones del menú lateral. Cada opción indica la ruta (to),
// el texto visible (label) y un emoji/icono (icon).
const menuItems = [
    { to: '/admin', label: 'Inicio', icon: '🏠' },
    { to: '/admin/usuarios', label: 'Empleados', icon: '👥' },
    { to: '/admin/productos', label: 'Productos', icon: '📦' },
];

function AdminLayout() {
    const { admin, logout, esAdmin, esOperador, puedeEscribir, cargando } = useAdminAuth();
    const navigate = useNavigate();

    // handleLogout: cierra la sesión del contexto y redirige a /admin/login
    // para que el usuario no siga viendo el panel sin autenticación.
    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    if (cargando) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-teal-900 text-slate-400">
                <p className="text-sm font-medium">Cargando panel...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
            {/* Sidebar */}
            <aside className="w-full border-b border-slate-700 bg-teal-900 md:w-64 md:border-b-0 md:border-r">
                <div className="p-5">
                    <h2 className="text-lg font-bold text-white">Panel Admin</h2>
                    <p className="text-xs text-slate-400">CeluarTech</p>
                </div>

                <nav className="flex flex-col gap-1 px-3 pb-4">
                    {menuItems.map((item) => (
                        // NavLink es un componente de react-router-dom que sabe
                        // si la ruta actual coincide con el 'to'. La función
                        // isActive permite aplicar estilos diferentes al enlace activo.
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                    ? 'bg-grey-200 text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto border-t border-slate-800 p-4">
                    <div className="mb-3 text-sm text-slate-300">
                        <p className="font-semibold text-white">{admin?.nombre}</p>
                        <p className="text-xs text-slate-400">Rol: <span className="uppercase text-indigo-300">{admin?.rol}</span></p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full rounded-lg border border-red-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-red-800 hover:text-white"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Contenido principal */}
            <div className="flex flex-1 flex-col">
                {/* Header del panel */}
                <header className="border-b border-slate-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Panel de Gestión</h1>
                            <p className="text-sm text-slate-500">
                                {/* Mensaje dinámico según el rol. Esto permite que
                                    ADMIN y OPERADOR vean descripciones distintas. */}
                                {esAdmin
                                    ? 'Acceso total: podés gestionar usuarios y roles.'
                                    : esOperador
                                        ? 'Acceso de solo lectura: podés ver la lista de administradores.'
                                        : 'Sesión de administración'}
                            </p>
                        </div>
                        <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600 md:block">
                            {admin?.rol}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6">
                    {/* Outlet renderiza el componente de la ruta hija activa.
                        Le pasamos el contexto con los permisos por si alguna
                        página hija necesita consultarlos directamente. */}
                    <Outlet context={{ esAdmin, esOperador, puedeEscribir }} />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
