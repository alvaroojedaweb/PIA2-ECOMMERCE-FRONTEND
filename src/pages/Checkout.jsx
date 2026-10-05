// pages/Checkout.jsx
// Pantalla de checkout: formulario de envío + resumen + confirmar compra.

import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";

function Checkout() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated } = useAuth();
  const { items, subtotal, total, cantidadTotal, vaciar } = useCarrito();

  const [direccionEnvio, setDireccionEnvio] = useState(usuario?.direccion || "");
  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [ordenId, setOrdenId] = useState(null); // ← cuando se crea la orden

  const formatPrecio = (n) => {
    if (typeof n !== "number") return "-";
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  };

  // Si no está logueado, al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si NO hay items Y NO se creó una orden todavía, al carrito
  // (si ya se creó una orden, dejamos que el navigate se encargue)
  if (items.length === 0 && !ordenId) {
    return <Navigate to="/carrito" replace />;
  }

  const handleConfirmar = async (e) => {
    e.preventDefault();
    setError("");

    if (!direccionEnvio.trim()) {
      setError("La dirección de envío es obligatoria.");
      return;
    }

    try {
      setEnviando(true);
      const data = await api.post("/ordenes-compra", {
        direccionEnvio: direccionEnvio.trim(),
        notas: notas.trim() || null,
      });

      if (!data?.data?.id) {
        throw new Error("No se pudo crear la orden");
      }

      // 1. Guardar el id para que el redirect de "carrito vacío" no dispare
      setOrdenId(data.data.id);

      // 2. Vaciar carrito
      vaciar();

      // 3. Navegar
      navigate(`/orden/${data.data.id}`, { replace: true });
    } catch (err) {
      console.error("Error al crear orden:", err);
      setError(err.message || "No se pudo procesar la compra.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">
          Finalizar compra
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* FORMULARIO */}
          <form
            onSubmit={handleConfirmar}
            className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2"
          >
            <div>
              <h2 className="mb-4 text-lg font-semibold text-slate-800">
                Datos de envío
              </h2>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={`${usuario?.nombre || ""} ${usuario?.apellido || ""}`.trim()}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={usuario?.email || ""}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Dirección de envío *
                </label>
                <input
                  type="text"
                  value={direccionEnvio}
                  onChange={(e) => setDireccionEnvio(e.target.value)}
                  placeholder="Calle, número, piso, ciudad"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Notas para el envío (opcional)
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={3}
                  placeholder="Ej: Entregar por la tarde, llamar antes..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3 border-t border-slate-200 pt-5">
              <Link
                to="/carrito"
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Volver al carrito
              </Link>
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 rounded-lg bg-teal-700 py-2.5 font-medium text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enviando ? "Procesando..." : "Confirmar compra"}
              </button>
            </div>
          </form>

          {/* RESUMEN */}
          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Tu pedido ({cantidadTotal} {cantidadTotal === 1 ? "ítem" : "ítems"})
            </h2>

            <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => {
                const prod = item.PRODUCTO || item.producto || {};
                const img = prod.imagenes?.[0]?.url || "";
                return (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-slate-50">
                      {img ? (
                        <img
                          src={img}
                          alt={prod.nombre}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span>📱</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 line-clamp-1">
                        {prod.nombre}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.cantidad} × {formatPrecio(Number(item.precio))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrecio(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío</span>
                <span className="text-green-700">Gratis</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-800">
                <span>Total</span>
                <span>{formatPrecio(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;