// pages/MisPedidos.jsx
// Historial de pedidos del cliente.

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function MisPedidos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const cargarOrdenes = async () => {
      try {
        setCargando(true);
        const data = await api.get("/ordenes-compra/mis-ordenes");
        setOrdenes(data?.data || []);
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
        setError("No se pudieron cargar tus pedidos.");
      } finally {
        setCargando(false);
      }
    };
    cargarOrdenes();
  }, [isAuthenticated, navigate]);

  const formatPrecio = (n) => {
    if (typeof n !== "number") return "-";
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const colorEstado = (estado) => {
    const colores = {
      pendiente: "bg-yellow-100 text-yellow-800",
      confirmada: "bg-blue-100 text-blue-800",
      enviada: "bg-purple-100 text-purple-800",
      entregada: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800",
    };
    return colores[estado] || "bg-slate-100 text-slate-800";
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg bg-slate-200"
            />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  if (ordenes.length === 0) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center">
          <div className="mb-4 text-5xl">📦</div>
          <h1 className="mb-3 text-2xl font-bold text-slate-800">
            Todavía no tenés pedidos
          </h1>
          <p className="mb-6 text-slate-600">
            Cuando hagas tu primera compra vas a verla acá.
          </p>
          <Link
            to="/catalogo"
            className="inline-block rounded-lg bg-teal-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-600"
          >
            Ir al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Mis pedidos</h1>

        <div className="space-y-4">
          {ordenes.map((orden) => (
            <div
              key={orden.id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">
                    Orden #{orden.id}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFecha(orden.fecha || orden.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${colorEstado(
                    orden.estado
                  )}`}
                >
                  {orden.estado}
                </span>
              </div>

              <div className="mb-3 text-sm text-slate-600">
                <p>
                  {orden.ITEM_ORDEN_COMPRAs?.length ||
                    orden.items?.length ||
                    0}{" "}
                  producto(s) · Total:{" "}
                  <strong className="text-slate-800">
                    {formatPrecio(Number(orden.total))}
                  </strong>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Envío: {orden.direccionEnvio}
                </p>
              </div>

              <Link
                to={`/orden/${orden.id}`}
                className="text-sm font-medium text-teal-700 hover:underline"
              >
                Ver detalle →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default MisPedidos;