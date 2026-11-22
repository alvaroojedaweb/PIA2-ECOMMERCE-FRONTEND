// Footer.jsx es el pie de página de la aplicación.
// Contiene enlaces rápidos, información institucional y copyright.

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function Footer() {
  const { isAuthenticated } = useAuth();
  const anioActual = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Columna 1: Marca y descripción */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-white">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-400"></span>
              CelularTech
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Tu tienda oficial de smartphones y accesorios tecnológicos. Calidad garantizada y seguimiento en tiempo real.
            </p>
          </div>

          {/* Columna 2: Tienda */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Tienda
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/catalogo" className="transition hover:text-teal-400">
                  Catálogo completo
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoriaId=1" className="transition hover:text-teal-400">
                  Teléfonos celulares
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoriaId=2" className="transition hover:text-teal-400">
                  Accesorios y Audio
                </Link>
              </li>
              <li>
                <Link to="/carrito" className="transition hover:text-teal-400">
                  Mi carrito
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="transition hover:text-teal-400">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Cuenta y administración */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Mi Cuenta
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              {isAuthenticated ? (
                <li>
                  <Link to="/perfil" className="transition hover:text-teal-400">
                    Mi Perfil y Pedidos
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="transition hover:text-teal-400">
                      Iniciar sesión
                    </Link>
                  </li>
                  <li>
                    <Link to="/registro" className="transition hover:text-teal-400">
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/admin" className="transition hover:text-teal-400">
                  Panel Administrador
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Atención al Cliente
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>Email: celulartech.demo@gmail.com</li>
              <li>Teléfono: +54 351 555-1234</li>
              <li>Lunes a Viernes, 9 a 18 hs</li>
              <li className="pt-1 text-xs text-teal-400">Envíos asegurados a todo el país</li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {anioActual} CelularTech. Todos los derechos reservados.</p>
          <p>Proyecto Integrador II — Desarrollo Web y Aplicaciones Digitales</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
