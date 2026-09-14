// DesarrolloApps.jsx - Ruta hija: /servicios/desarrollo-apps

function DesarrolloApps() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl">📱</span>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Desarrollo de Aplicaciones</h2>
                    <p className="text-sm text-slate-600">Soluciones interactivas, escalables y multiplataforma</p>
                </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
                Construimos aplicaciones web progresivas (PWA) y Single Page Applications (SPA) con React y ecosistemas modernos.
                Integramos APIs RESTful, gestión de estados complejos y arquitecturas desacopladas para lograr máxima velocidad y estabilidad.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">Single Page Applications (SPA)</h3>
                    <p className="mt-1 text-sm text-slate-600">Navegación instantánea sin recargas gracias a enrutadores cliente como React Router.</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">Integración con APIs REST</h3>
                    <p className="mt-1 text-sm text-slate-600">Conexión con backends seguros basados en Node.js, Express y bases de datos SQL/NoSQL.</p>
                </div>
            </div>
        </div>
    );
}

export default DesarrolloApps;
