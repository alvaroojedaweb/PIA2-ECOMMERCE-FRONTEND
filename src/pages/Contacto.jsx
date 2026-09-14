// Contacto.jsx - Página de contacto.

function Contacto() {
    return (
        <div className="space-y-8">
            <section>
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">Escribinos</p>
                <h1 className="mb-4 text-4xl font-bold text-slate-900">Contacto</h1>
                <p className="max-w-3xl text-lg text-slate-600">
                    Este formulario es de relleno. Más adelante se puede conectar a una ruta del backend.
                </p>
            </section>

            <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                <form className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
                        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Tu nombre" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="tu@email.com" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Mensaje</label>
                        <textarea className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Tu consulta" />
                    </div>
                    <button type="button" className="rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-500">
                        Enviar consulta
                    </button>
                </form>

                <aside className="rounded-2xl bg-slate-900 p-6 text-white">
                    <h2 className="mb-3 text-xl font-semibold text-white">Datos de contacto</h2>
                    <p className="mb-2 text-slate-300">Email: hola@integrado.test</p>
                    <p className="mb-2 text-slate-300">Teléfono: 11 5555-1234</p>
                    <p className="text-slate-300">Horario: lunes a viernes, 9 a 18 hs.</p>
                </aside>
            </section>
        </div>
    );
}

export default Contacto;
