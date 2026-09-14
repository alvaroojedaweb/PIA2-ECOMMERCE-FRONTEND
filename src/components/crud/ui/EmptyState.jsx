// EmptyState.jsx se muestra cuando no hay registros para listar.
// Incluye un botón para agregar el primer registro.

const label = (resource) => (resource === 'productos' ? 'producto' : 'usuario');

const EmptyState = ({ resource, onAdd }) => {
  return (
    <div className="empty">
      <p>No hay {resource} para mostrar.</p>
      <button className="primary" onClick={() => onAdd()}>
        + Agregar {label(resource)}
      </button>
    </div>
  );
};

export default EmptyState;
