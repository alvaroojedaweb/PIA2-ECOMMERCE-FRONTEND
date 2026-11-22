import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useBusqueda } from "../context/BusquedaContext.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

const LIMIT = 6;

function Catalogo() {
  const navigate = useNavigate();
  const { busqueda } = useBusqueda();
  const { agregar } = useCarrito();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [categoriaId, setCategoriaId] = useState(searchParams.get("categoriaId") || "");
  const [marcaId, setMarcaId] = useState(searchParams.get("marcaId") || "");
  const [busquedaLocal, setBusquedaLocal] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [agregandoId, setAgregandoId] = useState(null);
  const [agregadoId, setAgregadoId] = useState(null);

  useEffect(() => {
    setBusquedaLocal(busqueda);
    setPage(1);
  }, [busqueda]);

  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const [dataMarcas, dataCategorias] = await Promise.all([
          api.get("/marcas"),
          api.get("/categorias"),
        ]);
        setMarcas(dataMarcas?.data || []);
        setCategorias(dataCategorias?.data || []);
      } catch (err) {
        console.warn("No se pudieron cargar los filtros:", err.message);
      }
    };
    cargarFiltros();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("categoriaId") || "";
    const mar = searchParams.get("marcaId") || "";
    const q = searchParams.get("q") || "";
    const p = parseInt(searchParams.get("page")) || 1;

    if (cat !== categoriaId) setCategoriaId(cat);
    if (mar !== marcaId) setMarcaId(mar);
    if (q !== busquedaLocal) setBusquedaLocal(q);
    if (p !== page) setPage(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (categoriaId) params.set("categoriaId", categoriaId);
    if (marcaId) params.set("marcaId", marcaId);
    if (busquedaLocal) params.set("q", busquedaLocal);
    if (page > 1) params.set("page", page);

    setSearchParams(params, { replace: true });
  }, [categoriaId, marcaId, busquedaLocal, page, setSearchParams]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError("");

        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", LIMIT);
        if (busquedaLocal) params.set("q", busquedaLocal);
        if (categoriaId) params.set("categoriaId", categoriaId);
        if (marcaId) params.set("marcaId", marcaId);

        const data = await api.get(`/productos?${params.toString()}`);
        setProductos(data?.data || []);
        setTotalPages(data?.totalPages || 1);
        setTotalItems(data?.totalItems || 0);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos. Intenta de nuevo.");
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, [page, busquedaLocal, categoriaId, marcaId]);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busquedaLocal, categoriaId, marcaId]);

  const formatPrecio = (n) => {
    const num = Number(n);
    if (isNaN(num)) return "-";
    return num.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  };

  const imagenPrincipal = (producto) =>
    producto.imagenes?.[0]?.url ||
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";

  const limpiarFiltros = () => {
    setCategoriaId("");
    setMarcaId("");
    setBusquedaLocal("");
    setPage(1);
  };

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
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
    } finally {
      setAgregandoId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto mb-6 flex max-w-7xl items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-teal-700">Inicio</Link>
        <span>›</span>
        <span className="font-semibold text-slate-800">Catálogo</span>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
        {/* FILTROS */}
        <aside className="h-fit w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:w-64">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span>☷</span> Filtros
            </h2>
            <button
              onClick={limpiarFiltros}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Limpiar
            </button>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Buscar
            </h3>
            <input
              type="text"
              value={busquedaLocal}
              onChange={(e) => setBusquedaLocal(e.target.value)}
              placeholder="Ej: iPhone, Samsung..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Categoría
            </h3>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Marca
            </h3>
            <select
              value={marcaId}
              onChange={(e) => setMarcaId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
            >
              <option value="">Todas las marcas</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* LISTADO */}
        <section className="flex-1">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-600">
              {cargando ? (
                "Cargando catálogo..."
              ) : (
                <>
                  Mostrando <span className="font-bold text-slate-900">{productos.length}</span> de{" "}
                  <span className="font-bold text-slate-900">{totalItems}</span> productos
                  {busquedaLocal && (
                    <span className="ml-2 font-medium text-teal-700">para "{busquedaLocal}"</span>
                  )}
                </>
              )}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {cargando ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(LIMIT)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : productos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {productos.map((producto) => {
                  const sinStock = Number(producto.stock) <= 0;
                  return (
                    <article
                      key={producto.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div>
                        <Link to={`/producto/${producto.id}`}>
                          <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                            <img
                              src={imagenPrincipal(producto)}
                              alt={producto.nombre}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            {sinStock ? (
                              <span className="absolute right-3 top-3 rounded-full bg-red-600/95 px-3 py-1 text-xs font-semibold text-white shadow">
                                Sin stock
                              </span>
                            ) : producto.stock <= 5 ? (
                              <span className="absolute right-3 top-3 rounded-full bg-amber-500/95 px-3 py-1 text-xs font-semibold text-white shadow">
                                ¡Últimas {producto.stock}!
                              </span>
                            ) : (
                              <span className="absolute right-3 top-3 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[11px] font-medium text-white shadow">
                                En stock
                              </span>
                            )}
                          </div>
                        </Link>

                        <div className="p-5 pb-2">
                          <div className="mb-1.5 flex items-center justify-between">
                            {producto.marca && (
                              <span className="text-[11px] font-bold uppercase tracking-widest text-teal-700">
                                {producto.marca}
                              </span>
                            )}
                            {producto.almacenamientoGb && (
                              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                {producto.almacenamientoGb} GB
                              </span>
                            )}
                          </div>

                          <Link to={`/producto/${producto.id}`}>
                            <h3 className="line-clamp-2 text-base font-bold text-slate-900 transition group-hover:text-teal-700">
                              {producto.nombre}
                            </h3>
                          </Link>

                          <p className="mt-3 text-xl font-extrabold text-slate-900">
                            {formatPrecio(producto.precio)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-5 pt-3">
                        <button
                          onClick={() => handleAgregarRapido(producto)}
                          disabled={sinStock || agregandoId === producto.id}
                          className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                            sinStock
                              ? "cursor-not-allowed bg-slate-200 text-slate-500"
                              : agregadoId === producto.id
                              ? "bg-emerald-600 text-white"
                              : "bg-teal-700 text-white shadow-sm hover:bg-teal-600"
                          }`}
                        >
                          {sinStock
                            ? "Sin stock"
                            : agregadoId === producto.id
                            ? "✓ Agregado al carrito"
                            : agregandoId === producto.id
                            ? "Agregando..."
                            : "Agregar al carrito"}
                        </button>
                        <Link
                          to={`/producto/${producto.id}`}
                          className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Ver más
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-slate-600">
                    Página <strong className="text-slate-900">{page}</strong> de{" "}
                    <strong className="text-slate-900">{totalPages}</strong>
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
              <div className="mb-3 text-4xl">🔍</div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                No encontramos resultados
              </h3>
              <p className="text-sm text-slate-500">
                Probá con otras palabras o limpiá los filtros aplicados.
              </p>
              <button
                onClick={limpiarFiltros}
                className="mt-5 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-600"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Catalogo;
