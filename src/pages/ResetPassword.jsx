// pages/ResetPassword.jsx
// Formulario para establecer la nueva contraseña (lee el token de la URL).

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Validación por si no hay token en la URL
  useEffect(() => {
    if (!token) {
      setError("El enlace no es válido o expiró. Por favor, solicitá uno nuevo.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!nuevaPassword || !confirmarPassword) {
      setError("Completá ambos campos.");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (nuevaPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setEnviando(true);
      const data = await api.post("/auth/reset-password", {
        token,
        nuevaPassword,
      });
      setMensaje(data.mensaje || "Contraseña actualizada. Redirigiendo...");
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Error al resetear contraseña:", err);
      setError(err.message || "No se pudo cambiar la contraseña. El enlace puede haber expirado.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-teal-600">
            Nueva contraseña
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Creá tu nueva contraseña
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Elegí una contraseña segura de al menos 6 caracteres.
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

        {!token ? (
          <p className="text-center text-sm text-slate-600">
            <Link to="/recuperar-password" className="font-semibold text-teal-600 hover:text-teal-500">
              Solicitar un nuevo enlace
            </Link>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-xl bg-teal-600 py-2.5 font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
            >
              {enviando ? "Guardando..." : "Cambiar contraseña"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;