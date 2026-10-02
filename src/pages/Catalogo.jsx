// pages/Catalogo.jsx
// Catálogo público con filtros, búsqueda y paginación real.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBusqueda } from "../context/BusquedaContext.jsx";
import { api } from "../services/api.js";

const LIMIT = 6; // productos por página

function Catalogo() {
  const { busqueda } = useBusqueda();

  // Estado de datos
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Estado de filtros
  const [categoriaId, setCategoriaId] = useState("");
  const [marcaId, setMarcaId] = useState("");
  const [busquedaLocal, setBusquedaLocal] = useState("");

  // Estado de paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Estado de carga/error
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Sincronizar búsqueda del header con la búsqueda local
  useEffect(() => {
    setBusquedaLocal(busqueda);
    setPage(1);
  }, [busqueda]);

  // Cargar marcas y categorías al inicio
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

  // Cargar productos cada vez que cambian los filtros
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

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [busquedaLocal, categoriaId, marcaId]);

  // Helpers de formato
  const formatPrecio = (n) => {
    if (typeof n !== "number") return "-";
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  };

  const imagenPrincipal = (producto) =>
    producto.imagenes?.[0]?.url ||
    "https://via.placeholder.com/300x300?text=Sin+imagen";

  const limpiarFiltros = () => {
    setCategoriaId("");
    setMarcaId("");
    setBusquedaLocal("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8 lg:px-12">
      {/* BREADCRUMB */}
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <span>Inicio</span>
        <span>›</span>
        <span className="font-medium text-slate-700">Catálogo</span>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
        {/* FILTROS */}
        <aside className="h-fit w-full rounded-xl border border-slate-300 bg-white p-5 shadow-sm lg:w-64">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <span>☷</span> Filtros
            </h2>
            <button
              onClick={limpiarFiltros}
              className="text-xs text-teal-700 hover:underline"
            >
              Limpiar
            </button>
          </div>

          {/* BUSCADOR LOCAL */}
          <div className="mb-8">
            <h3 className="mb-3 text-xs font-semibold tracking-widest text-slate-600">
              BUSCAR
            </h3>
            <input
              type="text"
              value={busquedaLocal}
              onChange={(e) => setBusquedaLocal(e.target.value)}
              placeholder="Nombre del producto..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* CATEGORÍAS */}
          <div className="mb-8">
            <h3 className="mb-3 text-xs font-semibold tracking-widest text-slate-600">
              CATEGORÍA
            </h3>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* MARCAS */}
          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-widest text-slate-600">
              MARCA
            </h3>
            <select
              value={marcaId}
              onChange={(e) => setMarcaId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
            >
              <option value="">Todas</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* PRODUCTOS */}
        <section className="flex-1">
          {/* CABECERA */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-500">
              {cargando ? (
                "Cargando productos..."
              ) : (
                <>
                  Mostrando{" "}
                  <span className="font-semibold text-slate-800">
                    {productos.length}
                  </span>{" "}
                  de{" "}
                  <span className="font-semibold text-slate-800">
                    {totalItems}
                  </span>{" "}
                  productos
                  {busquedaLocal && (
                    <span className="ml-2 text-teal-600">
                      para "{busquedaLocal}"
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* GRID */}
          {cargando ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(LIMIT)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-lg bg-slate-200"
                />
              ))}
            </div>
          ) : productos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {productos.map((producto) => (
                  <article
                    key={producto.id}
                    className="group overflow-hidden rounded-lg border border-slate-300 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* IMAGEN */}
                    <Link to={`/producto/${producto.id}`}>
                      <div className="relative flex h-56 items-center justify-center bg-slate-100 p-6">
                        <img
                          src={imagenPrincipal(producto)}
                          alt={producto.nombre}
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x300?text=Sin+imagen";
                          }}
                        />
                      </div>
                    </Link>

                    {/* INFORMACIÓN */}
                    <div className="p-4">
                      <p className="mb-2 text-[10px] font-semibold tracking-widest text-teal-800">
                        {producto.marca?.toUpperCase() || "SIN MARCA"}
                      </p>
                      <h3 className="mb-3 line-clamp-2 text-base font-medium text-slate-800">
                        {producto.nombre}
                      </h3>

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-slate-800">
                          {formatPrecio(producto.precio)}
                        </p>
                        <Link
                          to={`/producto/${producto.id}`}
                          className="text-xs font-medium text-teal-700 hover:underline"
                        >
                          Ver más →
                        </Link>
                      </div>

                      {producto.stock === 0 && (
                        <p className="mt-2 text-xs font-medium text-red-600">
                          Sin stock
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* PAGINACIÓN */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-slate-600">
                    Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full py-12 text-center">
              <div className="mb-4 text-4xl">🔍</div>
              <h3 className="mb-2 text-xl font-semibold text-slate-800">
                No encontramos resultados
              </h3>
              <p className="text-slate-500">
                Probá con otras palabras o limpiá los filtros.
              </p>
              <button
                onClick={limpiarFiltros}
                className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
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