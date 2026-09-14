// SimpleList.jsx muestra la grilla de cards sin botones de CRUD.
// Solo permite hacer clic para ver el detalle.

const SimpleList = ({ activeTab, items, onDetail }) => {
  return (
    <ul className="list">
      {items.map((item) => (
        <li
          key={item.id}
          className="card"
          onClick={() => onDetail(item.id)}
        >
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
        </li>
      ))}
    </ul>
  );
};

export default SimpleList;
