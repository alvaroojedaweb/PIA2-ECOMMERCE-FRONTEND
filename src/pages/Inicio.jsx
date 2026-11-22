import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Inicio() {
  const navigate = useNavigate();
  const { agregar } = useCarrito();
  const { isAuthenticated } = useAuth();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [agregandoId, setAgregandoId] = useState(null);
  const [agregadoId, setAgregadoId] = useState(null);

  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        setCargando(true);
        const data = await api.get("/productos?page=1&limit=8");
        setProductos(data?.data || []);
      } catch (error) {
        console.error("Error al cargar destacados:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDestacados();
  }, []);

  const formatPrecio = (n) => {
    const num = Number(n);
    if (isNaN(num)) return "-";
    return num.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  };

  const imagenPrincipal = (producto) =>
    producto.imagenes?.[0]?.url ||
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";

  const handleAgregarRapido = async (producto) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      setAgregandoId(producto.id);
      await agregar(producto.id, 1);
      setAgregadoId(producto.id);
      setTimeout(() => setAgregadoId(null), 1600);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    } finally {
      setAgregandoId(null);
    }
  };

  return (
    <main className="w-full bg-slate-50">
      {/* HERO COMERCIAL */}
      <section
        className="relative flex min-h-[440px] items-center bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(15, 23, 42, 0.92) 0%, rgba(13, 148, 136, 0.72) 60%, rgba(15, 23, 42, 0.45) 100%),
            url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1800&q=85')`,
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
          <span className="mb-4 inline-block rounded-full border border-teal-300/40 bg-teal-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-teal-200">
            Tienda Oficial de Tecnología • Envíos a todo el país
          </span>
          <h1 className="mb-5 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Tu próximo smartphone y sus accesorios, en un solo lugar
          </h1>
          <p className="mb-8 max-w-xl text-base text-slate-200 md:text-lg">
            Equipos originales con garantía oficial, compra segura y seguimiento automático de tu pedido paso a paso por correo.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/catalogo")}
              className="rounded-lg bg-teal-500 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition hover:bg-teal-400"
            >
              Explorar catálogo completo
            </button>
            <button
              onClick={() => navigate("/catalogo?categoriaId=1")}
              className="rounded-lg border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Ver celulares destacados →
            </button>
          </div>
        </div>
      </section>

      {/* BENEFICIOS COMERCIALES */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-7 md:grid-cols-3 md:px-10">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl text-teal-700">
              🚚
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Envío rápido y asegurado</h3>
              <p className="mt-0.5 text-xs text-slate-500">Despacho inmediato con seguimiento en tiempo real.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl text-teal-700">
              🛡️
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Garantía oficial de 12 meses</h3>
              <p className="mt-0.5 text-xs text-slate-500">Equipos 100% originales sellados de fábrica.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl text-teal-700">
              📩
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notificaciones al instante</h3>
              <p className="mt-0.5 text-xs text-slate-500">Recibí comprobantes y actualizaciones de estado en tu email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS CON FILTRO DIRECTO */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-12 md:grid-cols-2 md:px-10">
        <Link to="/catalogo?categoriaId=1">
          <div className="group relative h-[210px] overflow-hidden rounded-2xl shadow-md">
            <img
              src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80"
              alt="Celulares"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <span className="mb-1 inline-block text-xs font-semibold uppercase tracking-wider text-teal-300">
                Categoría principal
              </span>
              <h2 className="text-2xl font-bold">Teléfonos celulares</h2>
              <p className="mb-3 text-xs text-slate-200">Samsung, Apple, Xiaomi y Motorola con entrega inmediata</p>
              <span className="inline-flex items-center gap-1 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition group-hover:bg-teal-500">
                Ver celulares →
              </span>
            </div>
          </div>
        </Link>

        <Link to="/catalogo?categoriaId=2">
          <div className="group relative h-[210px] overflow-hidden rounded-2xl shadow-md">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
              alt="Accesorios para teléfonos"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <span className="mb-1 inline-block text-xs font-semibold uppercase tracking-wider text-teal-300">
                Complementos
              </span>
              <h2 className="text-2xl font-bold">Accesorios y Audio</h2>
              <p className="mb-3 text-xs text-slate-200">Cargadores rápidos, auriculares inalámbricos, cables y fundas</p>
              <span className="inline-flex items-center gap-1 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition group-hover:bg-teal-500">
                Ver accesorios →
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="bg-slate-100/80 px-6 py-14 md:px-10">
        <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-[2px] text-teal-700">
              Selección CelularTech
            </span>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Productos destacados
            </h2>
          </div>
          <button
            onClick={() => navigate("/catalogo")}
            className="text-sm font-semibold text-teal-700 hover:text-teal-800 hover:underline"
          >
            Ver todo el catálogo →
          </button>
        </div>

        {cargando ? (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[340px] animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productos.map((producto) => {
              const sinStock = Number(producto.stock) <= 0;
              return (
                <article
                  key={producto.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
                    <Link to={`/producto/${producto.id}`}>
                      <div className="relative flex h-48 items-center justify-center bg-slate-50 p-4">
                        <img
                          src={imagenPrincipal(producto)}
                          alt={producto.nombre}
                          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                        />
                        {sinStock ? (
                          <span className="absolute right-3 top-3 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">
                            Sin stock
                          </span>
                        ) : producto.stock <= 5 ? (
                          <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                            Últimas {producto.stock} u.
                          </span>
                        ) : null}
                      </div>
                    </Link>

                    <div className="p-4 pb-2">
                      {producto.marca && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                          {producto.marca}
                        </span>
                      )}
                      <Link to={`/producto/${producto.id}`}>
                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 transition group-hover:text-teal-700">
                          {producto.nombre}
                        </h3>
                      </Link>
                      <strong className="mt-2 block text-lg font-extrabold text-slate-900">
                        {formatPrecio(producto.precio)}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 pt-2">
                    <button
                      onClick={() => handleAgregarRapido(producto)}
                      disabled={sinStock || agregandoId === producto.id}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        sinStock
                          ? "cursor-not-allowed bg-slate-200 text-slate-500"
                          : agregadoId === producto.id
                          ? "bg-emerald-600 text-white"
                          : "bg-teal-700 text-white hover:bg-teal-600"
                      }`}
                    >
                      {sinStock
                        ? "Agotado"
                        : agregadoId === producto.id
                        ? "✓ Agregado"
                        : agregandoId === producto.id
                        ? "Agregando..."
                        : "+ Al carrito"}
                    </button>
                    <Link
                      to={`/producto/${producto.id}`}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Detalle
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Inicio;
