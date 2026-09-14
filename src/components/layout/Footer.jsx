// Footer.jsx es el pie de página de la aplicación.
// Contiene enlaces rápidos, información institucional y copyright.

import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Footer() {
    const { isAuthenticated } = useAuth();
    const anioActual = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {/* Columna 1: Marca y descripción */}
                    <div className="space-y-3">
                        <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">
                            CeluarTech
                        </Link>
                        <p className="text-sm text-slate-600">
                            Plataforma integral de aprendizaje en desarrollo web con React, Express y bases de datos relacionales.
                        </p>
                    </div>

                    {/* Columna 2: Servicios */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                            Servicios
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            <li>
                                <Link to="/servicios" className="transition hover:text-indigo-600">
                                    Todos los servicios
                                </Link>
                            </li>
                            <li>
                                <Link to="/servicios/diseno-web" className="transition hover:text-indigo-600">
                                    Diseño Web
                                </Link>
                            </li>
                            <li>
                                <Link to="/servicios/desarrollo-apps" className="transition hover:text-indigo-600">
                                    Desarrollo de Apps
                                </Link>
                            </li>
                            <li>
                                <Link to="/servicios/software-gestion" className="transition hover:text-indigo-600">
                                    Software de Gestión
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Cuenta y administración */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                            Mi Cuenta
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            {isAuthenticated ? (
                                <li>
                                    <Link to="/perfil" className="transition hover:text-indigo-600">
                                        Mi Perfil
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/login" className="transition hover:text-indigo-600">
                                            Iniciar sesión
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/registro" className="transition hover:text-indigo-600">
                                            Registrarse
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link to="/admin" className="transition hover:text-indigo-600">
                                    Panel Admin
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                            Contacto
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            <li>Email: hola@Celular.Tech</li>
                            <li>Teléfono: 11 5555-1234</li>
                            <li>Lunes a Viernes, 9 a 18 hs</li>
                        </ul>
                    </div>
                </div>

                {/* Línea divisoria y copyright */}
                <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
                    <p>© {anioActual} INTEGRADO - Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
