// ServiciosIndex.jsx - Vista inicial cuando se accede a /servicios.
// Muestra una visión general y enlaces a cada una de las especialidades.

import { Link } from 'react-router-dom';

const items = [
    {
        to: '/servicios/diseno-web',
        titulo: 'Diseño Web',
        descripcion: 'Interfaces atractivas, accesibles y adaptadas a cualquier dispositivo con foco en experiencia de usuario (UX/UI).',
        icono: '🎨',
    },
    {
        to: '/servicios/desarrollo-apps',
        titulo: 'Desarrollo de Apps',
        descripcion: 'Aplicaciones web dinámicas y móviles con tecnologías modernas como React, optimizadas para alto rendimiento.',
        icono: '📱',
    },
    {
        to: '/servicios/software-gestion',
        titulo: 'Software de Gestión',
        descripcion: 'Paneles de administración, sistemas de inventario, facturación y reportes a medida para empresas.',
        icono: '📊',
    },
];

function ServiciosIndex() {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
                <h2 className="text-xl font-bold text-indigo-950">Nuestras Soluciones Digitales</h2>
                <p className="mt-1 text-sm text-indigo-800">
                    Seleccioná una de las siguientes áreas para conocer más detalles sobre nuestras propuestas y metodología de trabajo.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {items.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                    >
                        <div>
                            <span className="text-3xl">{item.icono}</span>
                            <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-indigo-600">
                                {item.titulo}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                {item.descripcion}
                            </p>
                        </div>
                        <span className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 group-hover:underline">
                            Ver especialidad →
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ServiciosIndex;
