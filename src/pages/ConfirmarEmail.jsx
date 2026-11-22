import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api.js";

function ConfirmarEmail() {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState("cargando"); // cargando | ok | error
  const [texto, setTexto] = useState("Confirmando tu cuenta...");
  const ejecutado = useRef(false);

  useEffect(() => {
    if (ejecutado.current) return;
    ejecutado.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setEstado("error");
      setTexto("Falta el token de confirmación en el enlace.");
      return;
    }

    api
      .get(`/auth/confirmar-email?token=${token}`)
      .then((data) => {
        setEstado("ok");
        setTexto(data.mensaje || "¡Email confirmado con éxito! Ya podés iniciar sesión.");
      })
      .catch((err) => {
        setEstado("error");
        setTexto(err.message || "El enlace es inválido o ya fue utilizado.");
      });
  }, [searchParams]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-3 text-4xl">
          {estado === "ok" ? "✅" : estado === "error" ? "⚠️" : "⏳"}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Confirmación de cuenta</h1>

        {estado === "cargando" && (
          <p className="mt-4 text-sm text-slate-600">{texto}</p>
        )}

        {estado === "ok" && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
            {texto}
          </p>
        )}

        {estado === "error" && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            {texto}
          </p>
        )}

        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
        >
          Ir al Login
        </Link>
      </div>
    </div>
  );
}

export default ConfirmarEmail;
