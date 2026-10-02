// pages/DetalleProducto.jsx
// Vista detalle de un producto con galería, info ampliada y botón agregar al carrito.

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [producto, setProducto] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setCargando(true);
        setError("");
        const data = await api.get(`/productos/${id}`);
        setProducto(data?.data || null);
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError("No se pudo cargar el producto.");
      } finally {
        setCargando(false);
      }
    };
    cargarProducto();
  }, [id]);

  const formatPrecio = (n) => {
    if (typeof n !== "number") return "-";
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  };

  const handleAgregarAlCarrito = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // TODO: conectar con CarritoContext en la próxima tanda
    alert(`Agregar ${cantidad} unidad(es) de "${producto.nombre}" al carrito (próximamente)`);
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-96 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-6xl rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error || "Producto no encontrado."}</p>
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

  const imagenes = producto.imagenes?.length
    ? producto.imagenes
    : [{ url: "https://via.placeholder.com/600x600?text=Sin+imagen" }];

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* BREADCRUMB */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-teal-700">Inicio</Link>
          <span>›</span>
          <Link to="/catalogo" className="hover:text-teal-700">Catálogo</Link>
          <span>›</span>
          <span className="font-medium text-slate-700">{producto.nombre}</span>
        </div>

        <div className="grid gap-8 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-2">
          {/* GALERÍA */}
          <div>
            <div className="mb-3 flex h-96 items-center justify-center rounded-lg bg-slate-50 p-4">
              <img
                src={imagenes[imagenActiva].url}
                alt={producto.nombre}
                className="h-full w-full object-contain"
              />
            </div>
            {imagenes.length > 1 && (
              <div className="flex gap-2">
                {imagenes.map((img, i) => (
                  <button
                    key={img.id || i}
                    onClick={() => setImagenActiva(i)}
                    className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition ${
                      imagenActiva === i
                        ? "border-teal-700"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${producto.nombre} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            <p className="mb-2 text-xs font-semibold tracking-widest text-teal-700">
              {producto.marca?.toUpperCase() || "SIN MARCA"}
            </p>
            <h1 className="mb-3 text-3xl font-bold text-slate-900">
              {producto.nombre}
            </h1>
            <p className="mb-4 text-2xl font-bold text-teal-800">
              {formatPrecio(producto.precio)}
            </p>

            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              {producto.descripcion}
            </p>

            {/* ESPECIFICACIONES */}
            <div className="mb-6 space-y-2 text-sm">
              {producto.categoria && (
                <p>
                  <span className="font-medium text-slate-700">Categoría:</span>{" "}
                  <span className="text-slate-600">{producto.categoria}</span>
                </p>
              )}
              {producto.modelo && (
                <p>
                  <span className="font-medium text-slate-700">Modelo:</span>{" "}
                  <span className="text-slate-600">{producto.modelo}</span>
                </p>
              )}
              {producto.almacenamientoGb && (
                <p>
                  <span className="font-medium text-slate-700">Almacenamiento:</span>{" "}
                  <span className="text-slate-600">{producto.almacenamientoGb} GB</span>
                </p>
              )}
              {producto.pesoG && (
                <p>
                  <span className="font-medium text-slate-700">Peso:</span>{" "}
                  <span className="text-slate-600">{producto.pesoG} g</span>
                </p>
              )}
              <p>
                <span className="font-medium text-slate-700">Stock:</span>{" "}
                <span
                  className={
                    producto.stock > 0 ? "text-green-700" : "text-red-600"
                  }
                >
                  {producto.stock > 0
                    ? `${producto.stock} disponibles`
                    : "Sin stock"}
                </span>
              </p>
            </div>

            {/* CANTIDAD + AGREGAR */}
            {producto.stock > 0 && (
              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700">
                    Cantidad:
                  </label>
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-50"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-medium">
                      {cantidad}
                    </span>
                    <button
                      onClick={() =>
                        setCantidad((c) => Math.min(producto.stock, c + 1))
                      }
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAgregarAlCarrito}
                  className="w-full rounded-lg bg-teal-700 py-3 font-medium text-white transition hover:bg-teal-600"
                >
                  Agregar al carrito
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default DetalleProducto;