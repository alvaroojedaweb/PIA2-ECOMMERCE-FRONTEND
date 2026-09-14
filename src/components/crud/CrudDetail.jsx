// CrudDetail.jsx es la vista de detalle.
// No tiene lógica propia, solo muestra el componente Detail con los datos y handlers.

import Detail from './entity/Detail.jsx';

const CrudDetail = ({ resource, item, onBack, onEdit, onDelete }) => {
  return (
    <Detail
      activeTab={resource}
      item={item}
      onBack={onBack}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default CrudDetail;
