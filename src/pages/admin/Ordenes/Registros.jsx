import { useEffect, useState } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";
import { adminApi as api } from "../../../services/adminApi.js";

// Helper para extraer arreglos de forma segura de las respuestas del backend
const extraerArray = (respuesta) => {
  if (!respuesta) return [];
  if (Array.isArray(respuesta)) return respuesta;
  if (Array.isArray(respuesta.data)) return respuesta.data;
  return [];
};

// SERVICIOS (API) - Sin incluir '/api' duplicado
const actualizarOrden = (id, datos) => api.put(`/ordenes-compra/${id}`, datos);

const TablaOrdenes = ({ ordenes = [], puedeEscribir, onView, onEdit }) => {
  const arrOrdenes = extraerArray(ordenes);

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm mt-6">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            {["Nro. Orden", "Fecha", "Estado", "Total", "Acciones"].map((h) => (
              <th
                key={h}
                className={`px-4 py-3 font-semibold ${h === "Total" ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {!arrOrdenes.length ? (
            <tr>
              <td colSpan="8" className="p-8 text-center text-slate-500">
                No hay Ordenes registrados.
              </td>
            </tr>
          ) : (
            arrOrdenes.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 text-slate-600">
                <td className="px-4 py-3 font-medium text-slate-900">
                  #{p.id}
                </td>
                <td className="px-4 py-3">{p.fecha || "-"}</td>

                <td className="px-4 py-3">{p.estado || "-"}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                  ${p.total != null ? Number(p.total).toFixed(2) : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onView(p)}
                      title="Ver detalle"
                      className="inline-flex items-center gap-1 rounded px-2 py-1 font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Ver
                    </button>
                    {puedeEscribir && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(p)}
                          title="Editar"
                          className="inline-flex items-center gap-1 rounded px-2 py-1 font-medium text-blue-600 hover:bg-blue-50"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Cambiar Estado
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function Registros() {
  const { puedeEscribir } = useAdminAuth();

  const [data, setData] = useState({
    ordenes: [],
    items: [],
  });
  const [msj, setMsj] = useState({ error: "", exito: "" });
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [ordRes] = await Promise.all([
        api.get("/ordenes-compra").catch(() => null),
      ]);

      setData({
        ordenes: extraerArray(ordRes),
      });
    } catch (err) {
      setMsj({ error: err.message || "Error al cargar los datos.", exito: "" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [puedeEscribir]);

  return (
    <div>
      <TablaOrdenes
        ordenes={data.ordenes}
        puedeEscribir={puedeEscribir}
        onView={() => alert("onView")}
        onEdit={() => alert("onEdit")}
      />
    </div>
  );
}
