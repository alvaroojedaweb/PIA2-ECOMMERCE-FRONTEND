import { useEffect, useState } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";
import { adminApi as api } from "../../../services/adminApi.js";
import { TablaOrdenes } from "./TablaOrdenes.jsx";
import { ModalVerOrden } from "./ModalVerOrden.jsx";

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
  };

  useEffect(() => {
    cargarDatos();
  }, [puedeEscribir]);
  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Ordenes de Compra
          </h2>
          <p className="text-sm text-slate-600">
            Gestioná las ordenes de compra.
          </p>
        </div>
      </div>
      <ModalVerOrden
        modal={modal}
        onClose={onClose}
        data={data.ordenSeleccionada}
      />
      <TablaOrdenes
        ordenes={data.ordenes}
        puedeEscribir={puedeEscribir}
        onView={onView}
        onEdit={() => alert("onEdit")}
      />
    </div>
  );
}
