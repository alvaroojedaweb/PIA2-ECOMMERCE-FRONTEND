import { useState } from "react";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const asunto = encodeURIComponent(`Consulta desde CelularTech - ${nombre}`);
    const cuerpo = encodeURIComponent(
      `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
    );
    window.location.href = `mailto:soporte@celulartech.com?subject=${asunto}&body=${cuerpo}`;
  };

  const whatsappUrl = `https://wa.me/5493515551234?text=${encodeURIComponent(
    `Hola CelularTech! Soy ${nombre || "un cliente"} y quería hacer una consulta${
      mensaje ? `: ${mensaje}` : "."
    }`
  )}`;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-teal-600">
          Escribinos
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Contacto</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          ¿Tenés dudas sobre nuestros teléfonos, stock o sobre tu pedido? Completá el
          formulario o escribinos directo por WhatsApp.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Mensaje
            </label>
            <textarea
              rows={4}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Contanos en qué podemos ayudarte..."
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500"
            >
              Enviar consulta por correo
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </form>

        {/* Tarjeta de información */}
        <div className="flex flex-col justify-between rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Datos de contacto</h2>
            <div className="space-y-2.5 text-sm text-slate-300">
              <p>
                <span className="font-semibold text-white">Email:</span>{" "}
                soporte@celulartech.com
              </p>
              <p>
                <span className="font-semibold text-white">WhatsApp:</span>{" "}
                +54 9 351 555-1234
              </p>
              <p>
                <span className="font-semibold text-white">Ubicación:</span>{" "}
                Córdoba, Argentina
              </p>
              <p>
                <span className="font-semibold text-white">Horario:</span>{" "}
                Lunes a viernes, 9 a 18 hs.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-xs text-slate-300">
            Respuesta rápida en horario comercial y seguimiento personalizado de
            todos los envíos.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;
