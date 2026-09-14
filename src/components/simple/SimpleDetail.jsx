// SimpleDetail.jsx muestra la información completa de un registro
// sin botones de editar ni eliminar. Solo tiene el botón para volver.

const SimpleDetail = ({ activeTab, item, onBack }) => {
  return (
    <div className="detail">
      <h2>
        {activeTab === 'productos'
          ? item.nombre
          : `${item.nombre} ${item.apellido}`}
      </h2>

      {activeTab === 'productos' ? (
        <dl>
          <dt>ID</dt>
          <dd>{item.id}</dd>
          <dt>Precio</dt>
          <dd>${Number(item.precio).toLocaleString('es-AR')}</dd>
          <dt>Categoría</dt>
          <dd>{item.categoria}</dd>
          <dt>Stock</dt>
          <dd>{item.stock}</dd>
          <dt>Descripción</dt>
          <dd>{item.descripcion}</dd>
        </dl>
      ) : (
        <dl>
          <dt>ID</dt>
          <dd>{item.id}</dd>
          <dt>Email</dt>
          <dd>{item.email}</dd>
          <dt>Edad</dt>
          <dd>{item.edad}</dd>
          <dt>Teléfono</dt>
          <dd>{item.telefono}</dd>
          <dt>Dirección</dt>
          <dd>{item.direccion}</dd>
        </dl>
      )}

      <button className="back" onClick={onBack}>
        Volver al listado
      </button>
    </div>
  );
};

export default SimpleDetail;
