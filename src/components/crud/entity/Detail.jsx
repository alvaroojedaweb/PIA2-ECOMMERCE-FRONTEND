// Detail.jsx muestra la información completa de un registro.
// Usa listas de definición (dl, dt, dd) para presentar los datos ordenados.

const Detail = ({ activeTab, item, onBack, onEdit, onDelete }) => {
  return (
    <div className="detail">
      <h2>
        {activeTab === 'productos'
          ? item.nombre
          : `${item.nombre} ${item.apellido}`}
      </h2>

      {/* Renderizamos los campos según el tipo de recurso. */}
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

      <div className="actions">
        <button onClick={onBack}>Volver al listado</button>
        <button onClick={onEdit}>Editar</button>
        <button className="danger" onClick={onDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default Detail;
