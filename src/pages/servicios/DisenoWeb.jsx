// DisenoWeb.jsx - Ruta hija: /servicios/diseno-web

function DisenoWeb() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">🎨</span>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Diseño Web Pofesional</h2>
                    <p className="text-sm text-slate-600">Creación de experiencias visuales únicas y funcionales</p>
                </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
                Diseñamos sitios web institucionales, tiendas virtuales y landing pages orientadas a la conversión.
                Nos enfocamos en la jerarquía visual, la tipografía adecuada y el diseño responsivo para garantizar que tu sitio luzca impecable en celulares, tablets y computadoras.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">Diseño UI/UX Centrado en el Usuario</h3>
                    <p className="mt-1 text-sm text-slate-600">Prototipado interactivo, wireframes y pruebas de usabilidad previas al desarrollo.</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">Diseño Responsive & Accesibilidad</h3>
                    <p className="mt-1 text-sm text-slate-600">Optimización para cualquier resolución cumpliendo con estándares de accesibilidad web.</p>
                </div>
            </div>
        </div>
    );
}

export default DisenoWeb;
