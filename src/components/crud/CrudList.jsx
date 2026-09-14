// CrudList.jsx muestra la vista de listado de un recurso.
// Combina el botón de agregar, el mensaje de vacío y la grilla de cards.

import List from './entity/List.jsx';
import Toolbar from './ui/Toolbar.jsx';
import EmptyState from './ui/EmptyState.jsx';

// Los parámetros que recibe se llaman "props" en React.
// Son datos y funciones que el componente padre (CrudPanel) le pasa.
const CrudList = ({ resource, items, onDetail, onEdit, onDelete, onAdd }) => {
  return (
    <>
      {/* Toolbar muestra el botón para crear un nuevo registro. */}
      <Toolbar resource={resource} onAdd={onAdd} />

      {/* Si no hay items, mostramos el mensaje de estado vacío.
          Si hay items, renderizamos la lista. */}
      {items.length === 0 ? (
        <EmptyState resource={resource} onAdd={onAdd} />
      ) : (
        <List
          activeTab={resource}
          items={items}
          onDetail={onDetail}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default CrudList;
