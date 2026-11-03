export const ModalActualizarOrden = ({ modal, onClose, onSubmit, data }) => {
  if (modal.soloLectura || !modal.abierto) return null;

  const orden = data ?? {};

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-actualizar-orden-titulo"
        className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2
              id="modal-actualizar-orden-titulo"
              className="text-lg font-bold text-slate-900"
            >
              Actualizar estado de la orden
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Orden #{orden.id ?? modal.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar actualización de la orden"
            className="rounded-lg px-2 text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            &times;
          </button>
        </header>

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
            <label
              htmlFor="estado"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              defaultValue={orden.estado}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="enviada">Enviada</option>
              <option value="entregada">Entregada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <footer className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Actualizar estado
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};
