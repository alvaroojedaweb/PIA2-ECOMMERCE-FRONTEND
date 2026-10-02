// components/layout/Header.jsx
// Header público: logo, buscador, navegación, autenticación y carrito.

import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useBusqueda } from "../../context/BusquedaContext.jsx";
import { useCarrito } from "../../context/CarritoContext.jsx";

function Header() {
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();

  const { usuario, isAuthenticated, logout } = useAuth();
  const { busqueda, setBusqueda } = useBusqueda();
  const { cantidadTotal } = useCarrito();

  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-teal-600 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    navigate("/catalogo");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <NavLink
          to="/"
          className="shrink-0 text-xl font-bold tracking-tight text-teal-900"
        >
          Celular<span className="text-slate-700">Tech</span>
        </NavLink>

        {/* BUSCADOR (solo visible en desktop) */}
        <div className="hidden md:flex w-full max-w-md items-center">
          <div className="flex w-full items-center gap-2 rounded-lg bg-slate-100 px-4 py-2">
            <svg
              className="h-5 w-5 text-slate-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
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
            Catálogo
          </NavLink>

          <NavLink to="/contacto" className={navClass}>
            Contacto
          </NavLink>

          {/* CARRITO con contador */}
          <NavLink
            to="/carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.3 2.3c-.63.63-.18 1.7.7 1.7H17M17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"
              />
            </svg>
            {cantidadTotal > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                {cantidadTotal}
              </span>
            )}
          </NavLink>

          <div className="mx-2 h-5 w-px bg-slate-200" />

          {/* Estado de autenticación */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <NavLink to="/mis-pedidos" className={navClass}>
                Mis Pedidos
              </NavLink>
              <NavLink to="/perfil" className={navClass}>
                Mi Perfil
              </NavLink>
              <span className="text-sm font-medium text-slate-700">
                Hola,{" "}
                <strong className="text-slate-900">{usuario?.nombre}</strong>
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

        {/* Botones móviles */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/catalogo"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </Link>

          {/* Carrito móvil con contador */}
          <Link
            to="/carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.3 2.3c-.63.63-.18 1.7.7 1.7H17M17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"
              />
            </svg>
            {cantidadTotal > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                {cantidadTotal}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="rounded-lg border border-teal-200 px-3 py-2 text-sm text-teal-700"
            onClick={() => setAbierto(!abierto)}
          >
            {abierto ? "Cerrar" : "Menú"}
          </button>
        </div>

        {/* Buscador móvil desplegado */}
        {abierto && (
          <div className="w-full px-4 py-2 md:hidden">
            <div className="flex w-full items-center gap-2 rounded-lg bg-slate-100 px-4 py-2">
              <svg
                className="h-5 w-5 text-slate-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
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
        <nav className="flex flex-col gap-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <NavLink
            to="/"
            className={navClass}
            end
            onClick={() => setAbierto(false)}
          >
            Inicio
          </NavLink>

          <NavLink
            to="/catalogo"
            className={navClass}
            onClick={() => setAbierto(false)}
          >
            Catálogo
          </NavLink>

          <NavLink
            to="/contacto"
            className={navClass}
            onClick={() => setAbierto(false)}
          >
            Contacto
          </NavLink>

          <NavLink
            to="/carrito"
            className={navClass}
            onClick={() => setAbierto(false)}
          >
            Carrito
          </NavLink>

          <div className="my-2 border-t border-slate-200" />

          {isAuthenticated ? (
            <div className="flex flex-col gap-2 py-1">
              <NavLink
                to="/mis-pedidos"
                className={navClass}
                onClick={() => setAbierto(false)}
              >
                Mis Pedidos
              </NavLink>
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
