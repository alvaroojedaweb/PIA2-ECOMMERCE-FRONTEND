// List.jsx muestra una grilla de cards con los registros.
// Cada card permite ver detalle, editar o eliminar un registro.

const List = ({ activeTab, items, onDetail, onEdit, onDelete }) => {
  return (
    <ul className="list">
      {/* Recorremos el array de items con map.
          Cada elemento necesita una key única para que React lo identifique. */}
      {items.map((item) => (
        <li key={item.id} className="card">
          {/* Al hacer clic en la parte superior abrimos el detalle. */}
          <div onClick={() => onDetail(item.id)}>
            <h3>
              {activeTab === 'productos'
                ? item.nombre
                : `${item.nombre} ${item.apellido}`}
            </h3>
            <p>
              {activeTab === 'productos'
                ? `$${Number(item.precio).toLocaleString('es-AR')} — ${item.categoria}`
                : item.email}
            </p>
          </div>

          {/* Botones de acción para editar o eliminar. */}
          <div className="actions">
            <button onClick={() => onEdit(item)}>Editar</button>
            <button className="danger" onClick={() => onDelete(item.id)}>
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default List;
