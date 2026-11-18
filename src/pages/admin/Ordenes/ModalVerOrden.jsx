const formatPrecio = (valor) => {
    if (valor === null || valor === undefined || valor === '') return '-';
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return '-';
    return numero.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
};

const formatFecha = (valor) => {
    if (!valor) return '-';
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return '-';
    return fecha.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const coloresEstado = {
    pendiente: 'bg-amber-100 text-amber-800',
    confirmada: 'bg-blue-100 text-blue-800',
    enviada: 'bg-violet-100 text-violet-800',
    entregada: 'bg-emerald-100 text-emerald-800',
    cancelada: 'bg-red-100 text-red-800',
};

export const ModalVerOrden = ({ modal, onClose, data }) => {
    if (!modal.soloLectura || !modal.abierto) return null;

    const orden = data ?? {};
    const cliente = orden.CLIENTE ?? {};
    const items = Array.isArray(orden.items) ? orden.items : [];
    const estado = orden.estado || 'Sin estado';

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-orden-titulo"
                className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
            >
                <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h2 id="modal-orden-titulo" className="text-lg font-bold text-slate-900">
                            Detalle de la orden de compra
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Orden #{orden.id ?? modal.id}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar detalle de la orden"
                        className="rounded-lg px-2 text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        &times;
                    </button>
                </header>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha</p>
                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {formatFecha(orden.fecha || orden.createdAt)}
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</p>
                            <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${coloresEstado[estado.toLowerCase()] || 'bg-slate-100 text-slate-700'}`}>
                                {estado}
                            </span>
                        </div>
                    </div>

                    <section className="rounded-xl border border-slate-200 p-4">
                        <h3 className="mb-3 text-sm font-semibold text-slate-800">Cliente</h3>
                        <dl className="grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-slate-500">Nombre</dt>
                                <dd className="mt-0.5 font-medium text-slate-800">{cliente.nombre || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Email</dt>
                                <dd className="mt-0.5 break-words font-medium text-slate-800">{cliente.email || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Dirección de envío</dt>
                                <dd className="mt-0.5 font-medium text-slate-800">{orden.direccionEnvio || '-'}</dd>
                            </div>
                        </dl>
                    </section>

                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-800">Productos</h3>
                            <span className="text-sm text-slate-500">{items.length} {items.length === 1 ? 'artículo' : 'artículos'}</span>
                        </div>
                        {items.length ? (
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <ul className="divide-y divide-slate-100">
                                    {items.map((item, index) => (
                                        <li key={item.id ?? index} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {item.PRODUCTO?.nombre || `Producto #${item.productoId ?? ''}`}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {item.cantidad ?? 0} × {formatPrecio(item.precioUnitario)}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-slate-800">{formatPrecio(item.subtotal)}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
                                Esta orden no tiene productos registrados.
                            </p>
                        )}
                    </section>

                    {orden.notas && (
                        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h3 className="text-sm font-semibold text-slate-800">Notas</h3>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{orden.notas}</p>
                        </section>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                        <span className="font-semibold text-slate-700">Total</span>
                        <span className="text-xl font-bold text-slate-900">{formatPrecio(orden.total)}</span>
                    </div>
                </div>

                <footer className="flex justify-end border-t border-slate-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Cerrar
                    </button>
                </footer>
            </section>
        </div>
    );
};
