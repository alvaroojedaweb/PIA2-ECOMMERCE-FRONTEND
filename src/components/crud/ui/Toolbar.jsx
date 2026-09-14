// Toolbar.jsx muestra el botón principal para agregar un nuevo registro.

// Función auxiliar que devuelve la palabra correcta según el recurso.
const label = (resource) => (resource === 'productos' ? 'producto' : 'usuario');

const Toolbar = ({ resource, onAdd }) => {
  return (
    <div className="toolbar">
      <button className="primary" onClick={() => onAdd()}>
        + Agregar {label(resource)}
      </button>
    </div>
  );
};

export default Toolbar;
