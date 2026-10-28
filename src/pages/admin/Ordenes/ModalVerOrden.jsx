export const ModalVerOrden = ({ modal, onClose, data }) => {
    if (!modal.soloLectura) return null;
    if (!modal.abierto) return null;
    const { id } = modal;
    
    // Aseguramos que siempre sean arreglos iterables (.map)
    const ordenData = data ?? {};
    const { id: ordenId, fecha, estado, total, direccionEnvio, notas, CLIENTE:cliente , items } = ordenData || {};

    return (    
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div>Orden #{ordenId}</div>
                <div>Fecha: {fecha}</div>
                <div>Estado: {estado}</div>
                <div>Total: {total}</div>
                <div>Dirección de Envío: {direccionEnvio}</div>
                <div>Notas: {notas}</div>
                <div>Cliente: {cliente?.id}</div>
                <div>Cliente: {cliente?.nombre}</div>
                <div>Cliente: {cliente?.email}</div>
                <div>Productos de la Orden: {items?.length || 0}</div>
                <div>
                    Detalle de Productos:
                    <ul>
                        {items?.map((item, index) => (
                            <li key={index}>
                                <div>Producto: {item?.PRODUCTO.nombre}</div>
                                <div>Cantidad: {item?.cantidad}</div>
                                <div>Precio: {item?.precioUnitario}</div>
                                <div>Subtotal: {item?.subtotal}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};