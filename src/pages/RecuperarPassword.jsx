import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";

function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!email) {
      setError("Por favor, ingresá tu email.");
      return;
    }

    try {
      setEnviando(true);
      const data = await api.post("/auth/forgot-password", { email });
      setMensaje(data.mensaje || "Revisá tu bandeja de entrada para Poder continuar.");
      setEmail("");
    } catch (err) {
      console.error("Error al solicitar recuperación:", err);
      setError(err.message || "No se pudo enviar el mail. Verificá el email.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-teal-600">
            Recuperar acceso
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Olvidaste tu contraseña?
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              placeholder="tu@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-teal-600 py-2.5 font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RecuperarPassword;