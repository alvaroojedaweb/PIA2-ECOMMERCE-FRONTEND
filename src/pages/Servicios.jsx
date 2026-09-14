// Servicios.jsx - Componente padre que aloja las rutas hijas de servicios mediante <Outlet />.

import { NavLink, Outlet } from 'react-router-dom';

const categoriasServicios = [
    { to: '/servicios', label: 'Todos los servicios', end: true },
    { to: '/servicios/diseno-web', label: 'Diseño Web' },
    { to: '/servicios/desarrollo-apps', label: 'Desarrollo de Apps' },
    { to: '/servicios/software-gestion', label: 'Software de Gestión' },
];

function Servicios() {
    const tabClass = ({ isActive }) =>
        `rounded-xl px-4 py-2.5 text-sm font-medium transition ${isActive
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
        }`;

    return (
        <div className="space-y-8">
            {/* Encabezado de la sección padre */}
            <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Nuestros Servicios</p>
                <h1 className="mt-1 text-4xl font-bold text-slate-900">Soluciones Tecnológicas</h1>
                <p className="mt-2 max-w-3xl text-lg text-slate-600">
                    Acompañamos a organizaciones y empresas en cada etapa de su transformación digital con soluciones especializadas.
                </p>
            </div>

            {/* Submenú de pestañas para navegar entre rutas hijas */}
            <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">         
                {categoriasServicios.map((cat) => (
                    <NavLink
                        key={cat.to}
                        to={cat.to}
                        end={cat.end}
                        className={tabClass}
                    >
                        {cat.label}
                    </NavLink>
                ))}
            </nav>

            {/* <Outlet /> renderiza el componente de la ruta hija correspondiente */}
            <div>
                <Outlet />
            </div>
        </div>
    );
}

export default Servicios;
