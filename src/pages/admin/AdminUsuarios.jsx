// pages/admin/AdminUsuarios.jsx
// CRUD de empleados del panel de administración.

import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import {
  listarAdministradores,
  listarRolesAdmin,
  crearAdministrador,
  actualizarAdministrador,
  eliminarAdministrador,
} from "../../services/adminService.js";

const formVacio = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  rolId: "",
};

function AdminUsuarios() {
  const { esAdmin, esOperador, puedeEscribir, admin } = useAdminAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [modoFormulario, setModoFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ ...formVacio });

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const dataUsuarios = await listarAdministradores();
      setUsuarios(dataUsuarios?.data || []);

      if (puedeEscribir) {
        const dataRoles = await listarRolesAdmin();
        setRoles(dataRoles?.data || []);
      }
    } catch (err) {
      console.error("Error al cargar empleados:", err);
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const iniciarCreacion = () => {
    setEditandoId(null);
    setForm({ ...formVacio });
    setModoFormulario(true);
    setError("");
    setMensaje("");
  };

  const iniciarEdicion = (usuario) => {
    setEditandoId(usuario.id);
    setForm({
      nombre: usuario.nombre || "",
      apellido: usuario.apellido || "",
      email: usuario.email || "",
      password: "",
      rolId: usuario.rolId || "",
    });
    setModoFormulario(true);
    setError("");
    setMensaje("");
  };

  const cancelarFormulario = () => {
    setModoFormulario(false);
    setEditandoId(null);
    setForm({ ...formVacio });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!form.nombre || !form.email || !form.rolId) {
      setError("Nombre, email y rol son obligatorios.");
      return;
    }

    if (!editandoId && !form.password) {
      setError("La contraseña es obligatoria al crear un empleado.");
      return;
    }

    try {
      const datos = { ...form };
      if (editandoId && !datos.password.trim()) {
        delete datos.password;
      }

      if (editandoId) {
        await actualizarAdministrador(editandoId, datos);
        setMensaje("Empleado actualizado correctamente.");
      } else {
        await crearAdministrador(datos);
        setMensaje("Empleado creado correctamente.");
      }

      setModoFormulario(false);
      setEditandoId(null);
      setForm({ ...formVacio });
      await cargarDatos();
    } catch (err) {
      console.error("Error al guardar empleado:", err);
      setError(err.message || "Error al guardar el empleado.");
    }
  };

  const handleEliminar = async (id) => {
    if (id === admin?.id) {
      setError("No podés eliminar tu propio usuario.");
      return;
    }
    if (!confirm("¿Estás seguro de que querés eliminar este empleado?")) return;

    try {
      await eliminarAdministrador(id);
      setMensaje("Empleado eliminado correctamente.");
      await cargarDatos();
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
      setError(err.message || "Error al eliminar el empleado.");
    }
  };

  if (cargando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Cargando empleados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Empleados</h2>
          <p className="text-sm text-slate-600">
            {puedeEscribir
              ? "Gestioná los empleados del panel y asigná roles."
              : "Vista de solo lectura del listado de empleados."}
          </p>
        </div>
        {puedeEscribir && !modoFormulario && (
          <button
            onClick={iniciarCreacion}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            + Nuevo empleado
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
                {editandoId ? "Editar empleado" : "Nuevo empleado"}
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

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Nombre *
                  </label>
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Contraseña {editandoId ? "(dejar vacía para no cambiar)" : "*"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required={!editandoId}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Rol *
                  </label>
                  <select
                    name="rolId"
                    value={form.rolId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
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
                  {editandoId ? "Guardar cambios" : "Crear empleado"}
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
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Apellido</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Rol</th>
              {puedeEscribir && (
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-700">
  Acciones
</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan={puedeEscribir ? 5 : 4}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No hay empleados registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {u.nombre}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {u.apellido || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                        u?.rol === "Admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {u?.rol || "-"}
                    </span>
                  </td>
                  {puedeEscribir && (
                    <td className="whitespace-nowrap px-4 py-3">
  <div className="flex items-center justify-end gap-1">
                        {/* VER */}
                        <button
                          onClick={() =>
                            alert(
                              `Empleado: ${u.nombre} ${u.apellido || ""}\nEmail: ${u.email}\nRol: ${u.rol}`
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
                          onClick={() => iniciarEdicion(u)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                          title="Editar"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
<button
  onClick={() => u.id !== admin?.id && handleEliminar(u.id)}
  disabled={u.id === admin?.id}
  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
    u.id === admin?.id
      ? "cursor-not-allowed text-slate-300"
      : "text-red-600 hover:bg-red-50"
  }`}
  title={u.id === admin?.id ? "No podés eliminarte a vos mismo" : "Eliminar"}
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

export default AdminUsuarios;