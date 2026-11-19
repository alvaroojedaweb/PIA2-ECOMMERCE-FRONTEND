import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api.js";

function ConfirmarEmail() {
  const [searchParams] = useSearchParams();
  const [mensaje, setMensaje] = useState("Confirmando...");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return setError("Token faltante");
    api.get(`/auth/confirmar-email?token=${token}`)
      .then(data => setMensaje(data.mensaje))
      .catch(err => setError(err.message));
  }, [searchParams]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 text-center">
        <h1 className="text-2xl font-bold">Confirmación de cuenta</h1>
        {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
        <Link to="/login" className="mt-6 block text-teal-600">Ir al Login</Link>
      </div>
    </div>
  );
}
export default ConfirmarEmail;