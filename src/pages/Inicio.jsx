// pages/Inicio.jsx
// Home pública con hero, categorías y productos destacados desde el backend.

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api.js";

function Inicio() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar los primeros 4 productos como "más vendidos"
  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        setCargando(true);
        const data = await api.get("/productos?page=1&limit=4");
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
    if (typeof n !== "number") return "-";
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  };

  const imagenPrincipal = (producto) =>
    producto.imagenes?.[0]?.url || "";

  return (
    <main className="w-full bg-[#f5f7fc]">
      {/* HERO */}
      <section
        className="relative flex h-[370px] items-center bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.25)),
            url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1800&q=85')`,
        }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-8">
          <h1 className="mb-5 text-[42px] font-bold leading-[1.1]">
            Los mejores equipos
            <br />
            están aquí
          </h1>
          <p className="mb-6 text-base">
            Descubrí la nueva generación de conectividad y potencia.
          </p>
          <button
            onClick={() => navigate("/catalogo")}
            className="rounded bg-[#008b83] px-6 py-3 text-sm text-white transition duration-200 hover:bg-[#006f69]"
          >
            Explorar ahora
          </button>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 px-8 py-12 md:grid-cols-2">
        {/* CELULARES */}
        <Link to="/catalogo?categoriaId=1">
          <div className="group relative h-[185px] overflow-hidden rounded-md">
            <img
              src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80"
              alt="Celulares"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            <div className="absolute bottom-5 left-5 text-white">
              <h2 className="text-lg font-semibold">Celulares</h2>
              <p className="mb-3 text-xs">Lo último en tecnología móvil</p>
              <span className="text-xs hover:underline">Ver catálogo →</span>
            </div>
          </div>
        </Link>

        {/* ACCESORIOS */}
        <Link to="/catalogo?categoriaId=2">
          <div className="group relative h-[185px] overflow-hidden rounded-md">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
              alt="Accesorios"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            <div className="absolute bottom-5 left-5 text-white">
              <h2 className="text-lg font-semibold">Accesorios</h2>
              <p className="mb-3 text-xs">Complementá tu experiencia</p>
              <span className="text-xs hover:underline">Ver catálogo →</span>
            </div>
          </div>
        </Link>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="bg-[#edf3ff] px-8 py-12">
        <div className="mx-auto mb-8 flex max-w-[1200px] flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-2 block text-[11px] tracking-[2px] text-[#006e69]">
              SELECCIÓN PREMIUM
            </span>
            <h2 className="text-2xl font-medium text-gray-900">
              Los más vendidos
            </h2>
          </div>
          <button
            onClick={() => navigate("/catalogo")}
            className="text-sm text-[#006e69] hover:underline"
          >
            Ver todos los productos →
          </button>
        </div>

        {/* GRID */}
        {cargando ? (
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[300px] animate-pulse rounded bg-slate-200"
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productos.map((producto) => (
              <article
                key={producto.id}
                className="group rounded bg-white p-4 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/producto/${producto.id}`}>
                  <div className="mb-4 flex h-[150px] items-center justify-center bg-[#eef3fc] p-3">
                    <img
                      src={imagenPrincipal(producto)}
                      alt={producto.nombre}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </Link>

                <div>
                  <span className="text-[11px] text-gray-500">
                    {producto.marca?.toUpperCase() || "SIN MARCA"}
                  </span>
                  <h3 className="mb-2 mt-1 text-sm font-medium text-gray-900">
                    {producto.nombre}
                  </h3>
                  <strong className="mb-4 block text-sm text-[#006e69]">
                    {formatPrecio(producto.precio)}
                  </strong>
                  <Link
                    to={`/producto/${producto.id}`}
                    className="text-xs text-gray-500 transition hover:text-[#006e69]"
                  >
                    Ver más →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Inicio;