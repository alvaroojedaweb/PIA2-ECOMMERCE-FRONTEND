// pages/admin/Productos/AdminProductos.jsx
// CRUD de productos desde el panel de administración.

import { useEffect, useState } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";
import { adminApi } from "../../../services/adminApi.js";

const crearProducto = async (datos) => {
  const payload = {
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: Number(datos.precio),
    categoriaId: Number(datos.categoriaId),
    modeloId: Number(datos.modeloId),
    stock: Number(datos.stock) || 0,
    pesoG: Number(datos.pesoG) || 0,
    almacenamientoGb: datos.almacenamientoGb
      ? Number(datos.almacenamientoGb)
      : null,
  };
  return adminApi.post("/productos", payload);
};

const actualizarProducto = async (id, datos) => {
  const payload = {
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: Number(datos.precio),
    categoriaId: Number(datos.categoriaId),
    modeloId: Number(datos.modeloId),
    stock: Number(datos.stock) || 0,
    pesoG: Number(datos.pesoG) || 0,
    almacenamientoGb: datos.almacenamientoGb
      ? Number(datos.almacenamientoGb)
      : null,
  };
  return adminApi.put(`/productos/${id}`, payload);
};

const eliminarProducto = async (id) => {
  return adminApi.delete(`/productos/${id}/hard`);
};

const formVacio = {
  nombre: "",
  descripcion: "",
  categoriaId: "",
  precio: "",
  almacenamientoGb: "",
  stock: "",
  pesoG: "",
  modeloId: "",
};

function AdminProductos() {
  const { puedeEscribir } = useAdminAuth();

  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [modoFormulario, setModoFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ ...formVacio });
  const [marcaFiltro, setMarcaFiltro] = useState("");

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const [dataProductos, dataMarcas, dataModelos, dataCategorias] =
        await Promise.all([
          adminApi.get("/productos?limit=100"),
          adminApi.get("/marcas"),
          adminApi.get("/modelos"),
          adminApi.get("/categorias"),
        ]);

      setProductos(dataProductos?.data || []);
      setMarcas(dataMarcas?.data || []);
      setModelos(dataModelos?.data || []);
      setCategorias(dataCategorias?.data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError(err.message || "Error al cargar los datos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [puedeEscribir]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "marcaFiltro") {
      setMarcaFiltro(value);
      setForm((prev) => ({ ...prev, modeloId: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const iniciarCreacion = () => {
    setEditandoId(null);
    setForm({ ...formVacio });
    setMarcaFiltro("");
    setModoFormulario(true);
    setError("");
    setMensaje("");
  };

  const iniciarEdicion = (producto) => {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      categoriaId: producto.categoriaId || "",
      precio: producto.precio || "",
      almacenamientoGb: producto.almacenamientoGb || "",
      stock: producto.stock || "",
      pesoG: producto.pesoG || "",
      modeloId: producto.modeloId || "",
    });
    setMarcaFiltro(producto.marcaId || "");
    setModoFormulario(true);
    setError("");
    setMensaje("");
  };

  const cancelarFormulario = () => {
    setModoFormulario(false);
    setEditandoId(null);
    setForm({ ...formVacio });
    setMarcaFiltro("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (
      !form.nombre ||
      !form.descripcion ||
      !form.precio ||
      !form.categoriaId ||
      !form.modeloId
    ) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    try {
      if (editandoId) {
        await actualizarProducto(editandoId, form);
        setMensaje("Producto actualizado correctamente.");
      } else {
        await crearProducto(form);
        setMensaje("Producto creado correctamente.");
      }

      setModoFormulario(false);
      setEditandoId(null);
      setForm({ ...formVacio });
      setMarcaFiltro("");
      await cargarDatos();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setError(err.message || "Error al guardar el producto.");
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Estás seguro de que querés eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      setMensaje("Producto eliminado correctamente.");
      await cargarDatos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError(err.message || "Error al eliminar el producto.");
    }
  };

  if (cargando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Productos</h2>
          <p className="text-sm text-slate-600">
            {puedeEscribir
              ? "Gestioná los productos del catálogo."
              : "Vista de solo lectura del listado de productos."}
          </p>
        </div>
        {puedeEscribir && !modoFormulario && (
          <button
            onClick={iniciarCreacion}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            + Nuevo producto
          </button>
        )}
      </div>

      {mensaje && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          {mensaje}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* MODAL */}
      {modoFormulario && puedeEscribir && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelarFormulario();
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editandoId ? "Editar producto" : "Nuevo producto"}
              </h3>
              <button
                type="button"
                onClick={cancelarFormulario}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Cerrar"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Categoría *</label>
                  <select
                    name="categoriaId"
                    value={form.categoriaId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Marca *</label>
                  <select
                    name="marcaFiltro"
                    value={marcaFiltro}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Seleccionar marca</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Modelo *</label>
                  <select
                    name="modeloId"
                    value={form.modeloId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                    required
                    disabled={!marcaFiltro}
                  >
                    <option value="">
                      {marcaFiltro ? "Seleccionar modelo" : "Primero elegí una marca"}
                    </option>
                    {modelos
                      .filter((m) => String(m.marcaId) === String(marcaFiltro))
                      .map((modelo) => (
                        <option key={modelo.id} value={modelo.id}>
                          {modelo.nombre}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Precio (ARS) *</label>
                  <input
                    type="number"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Almacenamiento (GB)</label>
                  <select
                    name="almacenamientoGb"
                    value={form.almacenamientoGb}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Sin especificar</option>
                    <option value="32">32 GB</option>
                    <option value="64">64 GB</option>
                    <option value="128">128 GB</option>
                    <option value="256">256 GB</option>
                    <option value="512">512 GB</option>
                    <option value="1024">1024 GB</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Peso (gramos)</label>
                  <input
                    type="number"
                    name="pesoG"
                    value={form.pesoG}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Descripción *</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={cancelarFormulario}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  {editandoId ? "Guardar cambios" : "Crear producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLA */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Marca</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Modelo</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Precio</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Stock</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Categoría</th>
              {puedeEscribir && (
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-700">
  Acciones
</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productos.length === 0 ? (
              <tr>
                <td
                  colSpan={puedeEscribir ? 7 : 6}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{p.marca || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{p.modelo || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    ${Number(p.precio || 0).toLocaleString("es-AR")}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.stock ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{p.categoria || "-"}</td>
                  {puedeEscribir && (
                    <td className="whitespace-nowrap px-4 py-3">
  <div className="flex items-center justify-end gap-1">
                        {/* VER */}
                        <button
                          onClick={() =>
                            alert(
                              `${p.nombre}\n\nMarca: ${p.marca}\nModelo: ${p.modelo}\nPrecio: $${Number(p.precio || 0).toLocaleString("es-AR")}\nStock: ${p.stock}\nCategoría: ${p.categoria}`
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                          title="Ver detalle"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver
                        </button>

                        {/* EDITAR */}
                        <button
                          onClick={() => iniciarEdicion(p)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                          title="Editar"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>

                        {/* ELIMINAR */}
                        <button
                          onClick={() => handleEliminar(p.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          title="Eliminar"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductos;