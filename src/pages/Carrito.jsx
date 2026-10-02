// pages/Carrito.jsx
// Página del carrito: lista de items, cantidades, subtotal y total.

import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Carrito() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    cargando,
    cantidadTotal,
    subtotal,
    total,
    actualizar,
    eliminar,
  } = useCarrito();

  const formatPrecio = (n) => {
    if (typeof n !== "number") return "-";
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  };

  const imagenProducto = (item) =>
    item.PRODUCTO?.imagenes?.[0]?.url ||
    item.producto?.imagenes?.[0]?.url ||
    "";

  const nombreProducto = (item) =>
    item.PRODUCTO?.nombre || item.producto?.nombre || "Producto";

  // Si no está logueado, mostrar aviso
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="mb-3 text-2xl font-bold text-slate-800">
            Tu carrito
          </h1>
          <p className="mb-6 text-slate-600">
            Necesitás iniciar sesión para ver tu carrito.
          </p>
          <Link
            to="/login"
            className="inline-block rounded-lg bg-teal-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-600"
          >
            Iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center">
          <div className="mb-4 text-5xl">🛒</div>
          <h1 className="mb-3 text-2xl font-bold text-slate-800">
            Tu carrito está vacío
          </h1>
          <p className="mb-6 text-slate-600">
            Agregá productos desde el catálogo para verlos acá.
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
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">
          Tu carrito ({cantidadTotal} {cantidadTotal === 1 ? "ítem" : "ítems"})
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LISTA DE ITEMS */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
              >
                {/* IMAGEN */}
                <Link
                  to={`/producto/${item.productoId}`}
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-2"
                >
                  {imagenProducto(item) ? (
                    <img
                      src={imagenProducto(item)}
                      alt={nombreProducto(item)}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl">📱</span>
                  )}
                </Link>

                {/* INFO */}
                <div className="flex flex-1 flex-col">
                  <Link
                    to={`/producto/${item.productoId}`}
                    className="font-medium text-slate-800 hover:text-teal-700"
                  >
                    {nombreProducto(item)}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatPrecio(Number(item.precio))} c/u
                  </p>

                  <div className="mt-auto flex items-center gap-3">
                    {/* Cantidad */}
                    <div className="flex items-center rounded-lg border border-slate-300">
                      <button
                        onClick={() =>
                          actualizar(item.id, Math.max(1, item.cantidad - 1))
                        }
                        className="px-3 py-1 text-slate-600 hover:bg-slate-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizar(item.id, item.cantidad + 1)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => eliminar(item.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* SUBTOTAL */}
                <div className="text-right">
                  <p className="font-semibold text-slate-800">
                    {formatPrecio(Number(item.precio) * item.cantidad)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* RESUMEN */}
          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Resumen
            </h2>
            <div className="space-y-2 text-sm">
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

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-lg bg-teal-700 py-3 font-medium text-white transition hover:bg-teal-600"
            >
              Finalizar compra
            </button>
            <Link
              to="/catalogo"
              className="mt-3 block text-center text-sm text-teal-700 hover:underline"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Carrito;