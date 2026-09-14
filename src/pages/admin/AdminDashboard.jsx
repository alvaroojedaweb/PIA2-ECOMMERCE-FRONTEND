// AdminDashboard.jsx - Página de inicio del panel de administración.
//
// Es la primera pantalla que ve un admin al entrar a /admin.
// Muestra un resumen del usuario logueado, una tarjeta de acceso rápido a
// administradores y un listado visual de permisos según el rol.

import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    const { admin, esAdmin, esOperador, puedeEscribir } = useAdminAuth();

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900">
                    ¡Hola, {admin?.nombre}!
                </h2>
                <p className="mt-1 text-slate-600">
                    Este es el panel de administración de CelularTech. Desde acá podés gestionar el sistema.
                </p>
                <div className="mt-3 inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700 uppercase">
                    Rol: {admin?.rol}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Administradores</h3>
                    <p className="mt-1 text-sm text-slate-600">
                        {/* Texto condicional: si es ADMIN ofrece gestión,
                            si es OPERADOR ofrece solo visualización. */}
                        {esAdmin
                            ? 'Gestioná los usuarios del panel, asigná roles y controlá el acceso.'
                            : 'Visualizá el listado de usuarios del panel.'}
                    </p>
                    <Link
                        to="/admin/usuarios"
                        className="mt-4 inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                        {/* El texto del botón también cambia según el rol. */}
                        {esAdmin ? 'Gestionar administradores' : 'Ver administradores'}
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-blue-900">Permisos </h3>
                    <ul className="mt-2 space-y-2 text-sm text-slate-600">
                        {/* Los puntos de color indican visualmente qué permisos
                            tiene el rol actual. Verde = permitido, gris = no. */}
                        <li className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${esAdmin || esOperador ? 'bg-green-500' : 'bg-slate-300'}`} />
                            Ver listado de administradores
                        </li>
                        <li className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${puedeEscribir ? 'bg-green-500' : 'bg-slate-300'}`} />
                            Crear, editar y eliminar usuarios
                        </li>
                        <li className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${puedeEscribir ? 'bg-green-500' : 'bg-slate-300'}`} />
                            Asignar roles
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
