// pages/admin/AdminDashboard.jsx
// Dashboard con métricas del sistema.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { adminApi } from "../../services/adminApi.js";

function AdminDashboard() {
  const { admin, esAdmin, esOperador, puedeEscribir } = useAdminAuth();

  const [metricas, setMetricas] = useState({
    productos: 0,
    ordenes: 0,
    clientes: 0,
    ventas: 0,
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        setCargando(true);
        const [dataProductos, dataOrdenes, dataClientes] = await Promise.all([
          adminApi.get("/productos?limit=1"),
          adminApi.get("/ordenes-compra"),
          adminApi.get("/clientes"),
        ]);

        const totalProductos = dataProductos?.totalItems || 0;
        const ordenes = dataOrdenes?.data || [];
        const totalOrdenes = ordenes.length;
        const totalVentas = ordenes.reduce(
          (acc, o) => acc + Number(o.total || 0),
          0
        );
        const totalClientes = (dataClientes?.data || []).length;

        setMetricas({
          productos: totalProductos,
          ordenes: totalOrdenes,
          clientes: totalClientes,
          ventas: totalVentas,
        });
      } catch (err) {
        console.error("Error al cargar métricas:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarMetricas();
  }, []);

  const formatPrecio = (n) =>
    Number(n || 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

  return (
    <div className="space-y-6">
      {/* BIENVENIDA */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          ¡Hola, {admin?.nombre}! 👋
        </h2>
        <p className="mt-1 text-slate-600">
          Bienvenido al panel de administración de CelularTech.
        </p>
        <div className="mt-3 inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold uppercase text-teal-700">
          Rol: {admin?.rol}
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Productos
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {cargando ? "..." : metricas.productos}
          </p>
          <p className="mt-1 text-xs text-slate-500">En el catálogo</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Órdenes
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {cargando ? "..." : metricas.ordenes}
          </p>
          <p className="mt-1 text-xs text-slate-500">Registradas</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Clientes
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {cargando ? "..." : metricas.clientes}
          </p>
          <p className="mt-1 text-xs text-slate-500">Registrados</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Ventas
          </p>
          <p className="mt-2 text-xl font-bold text-teal-700">
            {cargando ? "..." : formatPrecio(metricas.ventas)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Total facturado</p>
        </div>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            📦 Gestión de productos
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {puedeEscribir
              ? "Creá, editá y eliminá productos del catálogo."
              : "Visualizá el catálogo de productos."}
          </p>
          <Link
            to="/admin/productos"
            className="mt-4 inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
          >
            {puedeEscribir ? "Gestionar productos" : "Ver productos"}
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            👥 Gestión de empleados
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {esAdmin
              ? "Gestioná los empleados del panel y asigná roles."
              : "Visualizá el listado de empleados."}
          </p>
          <Link
            to="/admin/usuarios"
            className="mt-4 inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
          >
            {esAdmin ? "Gestionar empleados" : "Ver empleados"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;