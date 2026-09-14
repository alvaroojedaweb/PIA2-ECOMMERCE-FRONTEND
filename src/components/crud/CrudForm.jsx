// CrudForm.jsx es la vista de formulario.
// No tiene lógica propia, solo muestra el componente Form con los datos y handlers.

import Form from './entity/Form.jsx';

const CrudForm = ({ resource, item, onSave, onCancel }) => {
  return (
    <Form
      activeTab={resource}
      item={item}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};

export default CrudForm;
