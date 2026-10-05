// pages/ConfirmacionOrden.jsx
// Pantalla de confirmación después de crear una orden.

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function ConfirmacionOrden() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const cargarOrden = async () => {
      try {
        setCargando(true);
        const data = await api.get(`/ordenes-compra/${id}`);
        setOrden(data?.data || null);
      } catch (err) {
        console.error("Error al cargar orden:", err);
        setError("No se pudo cargar la orden.");
      } finally {
        setCargando(false);
      }
    };
    cargarOrden();
  }, [id, isAuthenticated, navigate]);

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

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !orden) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error || "Orden no encontrada."}</p>
          <Link
            to="/catalogo"
            className="mt-4 inline-block rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
          >
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        {/* BANNER DE ÉXITO */}
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
          <div className="mb-3 text-5xl">🎉</div>
          <h1 className="mb-2 text-2xl font-bold text-green-900">
            ¡Compra confirmada!
          </h1>
          <p className="text-sm text-green-800">
            Tu pedido <strong>#{orden.id}</strong> fue registrado correctamente.
          </p>
        </div>

        {/* DETALLE */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Detalle del pedido
          </h2>

          <div className="mb-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-slate-500">Número de orden</p>
              <p className="font-semibold text-slate-800">#{orden.id}</p>
            </div>
            <div>
              <p className="text-slate-500">Fecha</p>
              <p className="font-semibold text-slate-800">
                {formatFecha(orden.fecha || orden.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Estado</p>
              <p className="font-semibold capitalize text-slate-800">
                {orden.estado}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Dirección de envío</p>
              <p className="font-semibold text-slate-800">
                {orden.direccionEnvio}
              </p>
            </div>
          </div>

          {/* ITEMS */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Productos
            </h3>
            <div className="space-y-3">
              {(orden.items || orden.ITEM_ORDEN_COMPRAs || []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {item.PRODUCTO?.nombre || `Producto #${item.productoId}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.cantidad} ×{" "}
                      {formatPrecio(Number(item.precioUnitario))}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-800">
                    {formatPrecio(Number(item.subtotal))}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL */}
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-800">
            <span>Total</span>
            <span>{formatPrecio(Number(orden.total))}</span>
          </div>

          {orden.notas && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
              <p className="text-slate-500">Notas</p>
              <p className="text-slate-700">{orden.notas}</p>
            </div>
          )}
        </div>

        {/* ACCIONES */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/mis-pedidos"
            className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600"
          >
            Ver mis pedidos
          </Link>
          <Link
            to="/catalogo"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ConfirmacionOrden;
