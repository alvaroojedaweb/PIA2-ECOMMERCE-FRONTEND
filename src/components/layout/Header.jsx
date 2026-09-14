// Header.jsx - Cabecera completa del sitio con navegación, autenticación y búsqueda
// Usa NavLink de React Router para marcar el enlace activo, incluye menú desplegable de servicios
// AuthContext para el estado de sesión y BusquedaContext para la búsqueda global

import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useBusqueda } from '../../context/BusquedaContext.jsx';

const subServicios = [
    { to: '/servicios', label: 'Todos los servicios', end: true, desc: 'Visión general de soluciones' },
    { to: '/servicios/diseno-web', label: 'Diseño Web', desc: 'UI/UX y sitios responsive' },
    { to: '/servicios/desarrollo-apps', label: 'Desarrollo de Apps', desc: 'Web apps y móviles con React' },
    { to: '/servicios/software-gestion', label: 'Software de Gestión', desc: 'Paneles y sistemas a medida' },
];

function Header() {
    const [abierto, setAbierto] = useState(false);
    const [serviciosAbierto, setServiciosAbierto] = useState(false);
    const [serviciosMovilAbierto, setServiciosMovilAbierto] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const { usuario, isAuthenticated, logout } = useAuth();
    const { busqueda, setBusqueda } = useBusqueda();

    const estaEnServicios = location.pathname.startsWith('/servicios');

    // Cerrar el dropdown al hacer click fuera
    useEffect(() => {
        const handleClickFuera = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setServiciosAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClickFuera);
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, []);

    // Cerrar menús al cambiar de ruta
    useEffect(() => {
        setServiciosAbierto(false);
        setAbierto(false);
    }, [location.pathname]);

    const navClass = ({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
            ? 'bg-teal-600 text-white'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`;

    // Manejar cambios en la búsqueda
    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
        navigate('/catalogo');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                
                {/* LOGO */}
                <NavLink to="/" className="shrink-0 text-xl font-bold tracking-tight text-teal-900">
                    Celular<span className="text-slate-700">Tech</span>
                </NavLink>

                {/* BUSCADOR (solo visible en desktop) */}
                <div className="hidden md:flex w-full max-w-md items-center">
                    <div className="flex w-full items-center gap-2 rounded-lg bg-slate-100 px-4 py-2">
                        <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                        </svg>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={handleBusquedaChange}
                            placeholder="Buscar dispositivos..."
                            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Navegación Desktop */}
                <nav className="hidden items-center gap-1 md:flex">
                    <NavLink to="/" className={navClass} end>
                        Inicio
                    </NavLink>

                    <NavLink to="/catalogo" className={navClass}>
                        Catalogo
                    </NavLink>
                    <NavLink to="/contacto" className={navClass}>
                        Contacto
                    </NavLink>

                    {/* Menú desplegable de Servicios */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setServiciosAbierto(!serviciosAbierto)}
                            className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${estaEnServicios || serviciosAbierto
                                    ? 'bg-teal-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <span>Servicios</span>
                            <svg
                                className={`h-4 w-4 transition-transform duration-200 ${serviciosAbierto ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown flotante */}
                        {serviciosAbierto && (
                            <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-1">
                                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Nuestras Soluciones
                                </p>
                                {subServicios.map((sub) => (
                                    <NavLink
                                        key={sub.to}
                                        to={sub.to}
                                        end={sub.end}
                                        onClick={() => setServiciosAbierto(false)}
                                        className={({ isActive }) =>
                                            `block rounded-xl px-3 py-2 transition ${isActive
                                                ? 'bg-indigo-50 text-indigo-900 font-semibold'
                                                : 'text-slate-700 hover:bg-slate-50'
                                            }`
                                        }
                                    >
                                        <div className="text-sm font-medium">{sub.label}</div>
                                        <div className="text-xs text-slate-500">{sub.desc}</div>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mx-2 h-5 w-px bg-slate-200" />

                    {/* Estado de autenticación */}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <NavLink to="/perfil" className={navClass}>
                                Mi Perfil
                            </NavLink>
                            <span className="text-sm font-medium text-slate-700">
                                Hola, <strong className="text-slate-900">{usuario?.nombre}</strong>
                            </span>
                            <button
                                onClick={logout}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <NavLink to="/login" className={navClass}>
                                Ingresar
                            </NavLink>
                            <Link
                                to="/registro"
                                className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Botones móviles (menú + carrito) */}
                <div className="flex items-center gap-2 md:hidden">
                    {/* Buscador móvil (icono) */}
                    <Link 
                        to="/catalogo" 
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                        </svg>
                    </Link>

                    {/* Carrito */}
                    <Link to="/carrito" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.3 2.3c-.63.63-.18 1.7.7 1.7H17M17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
                        </svg>
                        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                            0
                        </span>
                    </Link>

                    {/* Botón hamburguesa móvil */}
                    <button
                        type="button"
                        className="rounded-lg border border-teal-200 px-3 py-2 text-sm text-teal-700"
                        onClick={() => setAbierto(!abierto)}
                    >
                        {abierto ? 'Cerrar' : 'Menú'}
                    </button>
                </div>

                {/* Buscador móvil (en línea) - visible solo en móvil cuando está desplegado */}
                {abierto && (
                    <div className="w-full px-4 py-2 md:hidden">
                        <div className="flex w-full items-center gap-2 rounded-lg bg-slate-100 px-4 py-2">
                            <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                            </svg>
                            <input
                                type="text"
                                value={busqueda}
                                onChange={handleBusquedaChange}
                                placeholder="Buscar dispositivos..."
                                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Menú móvil desplegado */}
            {abierto && (
                <nav className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 md:hidden bg-white">
                    <NavLink to="/" className={navClass} end onClick={() => setAbierto(false)}>
                        Inicio
                    </NavLink>

                    <NavLink to="/catalogo" className={navClass} onClick={() => setAbierto(false)}>
                        Catalogo
                    </NavLink>

                    {/* Acordeón móvil de Servicios */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setServiciosMovilAbierto(!serviciosMovilAbierto)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            <span>Servicios</span>
                            <svg
                                className={`h-4 w-4 transition-transform ${serviciosMovilAbierto ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {serviciosMovilAbierto && (
                            <div className="ml-3 mt-1 flex flex-col gap-1 border-l-2 border-teal-200 pl-3">
                                {subServicios.map((sub) => (
                                    <NavLink
                                        key={sub.to}
                                        to={sub.to}
                                        end={sub.end}
                                        onClick={() => setAbierto(false)}
                                        className={({ isActive }) =>
                                            `rounded-lg px-2 py-1.5 text-sm transition ${isActive
                                                ? 'font-semibold text-teal-600 bg-teal-50'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`
                                        }
                                    >
                                        {sub.label}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>

                    <NavLink to="/contacto" className={navClass} onClick={() => setAbierto(false)}>
                        Contacto
                    </NavLink>

                    <div className="my-2 border-t border-slate-200" />

                    {isAuthenticated ? (
                        <div className="flex flex-col gap-2 py-1">
                            <NavLink
                                to="/perfil"
                                className={navClass}
                                onClick={() => setAbierto(false)}
                            >
                                Mi Perfil
                            </NavLink>
                            <span className="text-sm font-medium text-slate-700">
                                Conectado como <strong>{usuario?.nombre}</strong>
                            </span>
                            <button
                                onClick={() => {
                                    logout();
                                    setAbierto(false);
                                }}
                                className="rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 py-1">
                            <NavLink
                                to="/login"
                                className={navClass}
                                onClick={() => setAbierto(false)}
                            >
                                Ingresar
                            </NavLink>
                            <NavLink
                                to="/registro"
                                className={navClass}
                                onClick={() => setAbierto(false)}
                            >
                                Registrarse
                            </NavLink>
                        </div>
                    )}
                </nav>
            )}
        </header>
    );
}

export default Header;