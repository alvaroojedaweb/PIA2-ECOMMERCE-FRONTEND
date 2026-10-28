export const ModalActualizarOrden = ({ modal, onClose, onSubmit, data }) => {
  if (modal.soloLectura) return null;
  if (!modal.abierto) return null;
  const { id } = modal;

  // Aseguramos que siempre sean arreglos iterables (.map)
  const ordenData = data ?? {};
  const {
    id: ordenId,
    fecha,
    estado,
    total,
    direccionEnvio,
    notas,
    CLIENTE: cliente,
    items,
  } = ordenData || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <h2>Actualizar estado de la Orden de Compra</h2>
        <form onSubmit={onSubmit} className="p-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="estado"
              className="block text-sm font-medium text-slate-700"
            >
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              defaultValue={estado}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="enviada">Enviada</option>
              <option value="entregada">Entregada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <button
              type="submit"
              className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Actualizar Estado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
