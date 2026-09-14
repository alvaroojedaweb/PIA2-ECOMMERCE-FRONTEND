// SoftwareGestion.jsx - Ruta hija: /servicios/software-gestion

function SoftwareGestion() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">📊</span>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Software de Gestión a Medida</h2>
                    <p className="text-sm text-slate-600">Automatización de procesos administrativos y paneles de control</p>
                </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
                Desarrollamos sistemas de gestión comercial, paneles administrativos, módulos de facturación y control de inventarios.
                Proporcionamos herramientas robustas para que tu negocio funcione de forma automatizada y ordenada.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">Paneles y Dashboards</h3>
                    <p className="mt-1 text-sm text-slate-600">Visualización de métricas en tiempo real, tablas interactivas con filtros y reportes exportables.</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">Control de Accesos y Roles</h3>
                    <p className="mt-1 text-sm text-slate-600">Permisos diferenciados para administradores, supervisores y clientes con autenticación JWT.</p>
                </div>
            </div>
        </div>
    );
}

export default SoftwareGestion;
