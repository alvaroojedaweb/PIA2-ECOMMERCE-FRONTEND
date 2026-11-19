import { useEffect, useState } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";
import { adminApi as api } from "../../../services/adminApi.js";
import { TablaOrdenes } from "./TablaOrdenes.jsx";
import { ModalVerOrden } from "./ModalVerOrden.jsx";
import { ModalActualizarOrden } from "./ModalActualizarOrden.jsx";

// SERVICIOS (API) - Sin incluir '/api' duplicado
const actualizarOrden = (id, datos) => api.put(`/ordenes-compra/${id}`, datos);

const extraerArray = (respuesta) => {
  if (!respuesta) return [];
  if (Array.isArray(respuesta)) return respuesta;
  if (Array.isArray(respuesta.data)) return respuesta.data;
  return [];
};

export default function AdminOrdenes() {
  const { puedeEscribir } = useAdminAuth();
  const [data, setData] = useState({
    ordenes: [],
    ordenSeleccionada: {},
  });
  const [msj, setMsj] = useState({ error: "", exito: "" });
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_POR_PAGINA = 6;
  const [modal, setModal] = useState({
    abierto: false,
    id: null,
    soloLectura: false,
  });

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

  const onView = (orden) => {
    setData((prev) => ({
      ...prev,
      ordenSeleccionada: orden,
    }));

    setModal({
      abierto: true,
      id: orden.id,
      soloLectura: true,
    });
  };

  const onClose = () => {
    setData((prev) => ({
      ...prev,
      ordenSeleccionada: null,
    }));

    setModal({
      abierto: false,
      id: null,
      soloLectura: true,
    });

    cargarDatos();
  };

  const onEdit = (orden) => {
    setData((prev) => ({
      ...prev,
      ordenSeleccionada: orden,
    }));

    setModal({
      abierto: true,
      id: orden.id,
      soloLectura: false,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData.entries());

    actualizarOrden(modal.id, datos)
      .then((res) => {
        setMsj({ error: "", exito: "Orden actualizada correctamente." });
      })
      .catch((err) => {
        setMsj({
          error: err.message || "Error al actualizar la orden.",
          exito: "",
        });
      })
      .finally(() => {
        onClose();
        cargarDatos();
      });
  };

  useEffect(() => {
    cargarDatos();
  }, [puedeEscribir]);

  const ordenesFiltradas = data.ordenes.filter((o) => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return true;
    return (
      String(o.id).includes(termino) ||
      o.estado?.toLowerCase().includes(termino) ||
      o.CLIENTE?.nombre?.toLowerCase().includes(termino) ||
      o.CLIENTE?.email?.toLowerCase().includes(termino)
    );
  });

  const totalPaginas = Math.max(1, Math.ceil(ordenesFiltradas.length / ITEMS_POR_PAGINA));
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const ordenesPaginadas = ordenesFiltradas.slice(inicio, inicio + ITEMS_POR_PAGINA);

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Órdenes de compra
          </h2>
          <p className="text-sm text-slate-600">
            Gestioná las órdenes de compra.
          </p>
        </div>
      </div>
      {(msj.error || msj.exito) && (
        <div className={`mb-4 rounded-xl border p-4 text-sm font-medium ${msj.error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          {msj.error || msj.exito}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
          placeholder="Buscar por N° orden, cliente, email o estado..."
          className="w-full max-w-md rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-xs text-slate-500">
          Mostrando {ordenesPaginadas.length} de {ordenesFiltradas.length} órdenes
        </span>
      </div>
      <ModalActualizarOrden
        modal={modal}
        onClose={onClose}
        onSubmit={onSubmit}
        data={data.ordenSeleccionada}
      />

      <ModalVerOrden
        modal={modal}
        onClose={onClose}
        data={data.ordenSeleccionada}
      />

      <TablaOrdenes
        ordenes={ordenesPaginadas}
        puedeEscribir={puedeEscribir}
        onView={onView}
        onEdit={onEdit}
      />
      {totalPaginas > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
          <span className="text-slate-600">
            Página <strong>{paginaSegura}</strong> de <strong>{totalPaginas}</strong>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={paginaSegura === 1}
              onClick={() => setPaginaActual((p) => p - 1)}
              className="rounded-lg border px-3 py-1.5 font-medium hover:bg-slate-100 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={paginaSegura === totalPaginas}
              onClick={() => setPaginaActual((p) => p + 1)}
              className="rounded-lg border px-3 py-1.5 font-medium hover:bg-slate-100 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
