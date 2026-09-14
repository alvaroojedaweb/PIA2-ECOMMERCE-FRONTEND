// CrudPanel.jsx es el "cerebro" del CRUD.
// Administra los datos y los estados, y decide qué vista mostrar:
// listado, detalle o formulario.

import { useEffect, useState } from 'react';
import {
  obtenerItems,
  obtenerDetalle,
  crearItem,
  actualizarItem,
  eliminarItem,
} from '../../services/api.js';
import Loading from './ui/Loading.jsx';
import ErrorMessage from './ui/ErrorMessage.jsx';
import CrudList from './CrudList.jsx';
import CrudDetail from './CrudDetail.jsx';
import CrudForm from './CrudForm.jsx';

const CrudPanel = ({ resource }) => {
  // Estados del panel
  // items: array con todos los registros del recurso actual.
  // selected: registro cuyo detalle queremos ver (null = ninguno).
  // editing: registro que estamos editando.
  //   - undefined = no se muestra el formulario.
  //   - null = se muestra el formulario para crear uno nuevo.
  //   - objeto = se muestra el formulario para editar ese objeto.
  // loading: indica si estamos esperando respuesta del servidor.
  // error: guarda el mensaje si algo falla.
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect se ejecuta después del primer renderizado del componente.
  // Aquí lo usamos para pedirle al backend la lista de registros.
  // El array [resource] al final indica que se vuelve a ejecutar si cambia el recurso.
  useEffect(() => {
    let cancelled = false;

    obtenerItems(resource)
      .then((data) => {
        // Solo actualizamos el estado si el componente sigue montado.
        if (!cancelled) setItems(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Esta función se ejecuta si el componente se desmonta o si cambia el recurso.
    // Evita actualizar estados de una petición vieja.
    return () => {
      cancelled = true;
    };
  }, [resource]);

  // Recarga la lista completa desde el backend.
  const reloadItems = () => {
    setLoading(true);
    setError(null);
    setSelected(null);
    setEditing(undefined);

    obtenerItems(resource)
      .then((data) => setItems(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Pide al backend los datos de un registro y los muestra en detalle.
  const showDetail = (id) => {
    setLoading(true);
    setError(null);
    setEditing(undefined);

    obtenerDetalle(resource, id)
      .then((data) => setSelected(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Abre el formulario.
  // Si no recibe un item, se entiende que se quiere crear uno nuevo.
  const showForm = (item = null) => {
    setSelected(null);
    setEditing(item);
  };

  // Guarda un registro nuevo o editado.
  const saveItem = (payload) => {
    setLoading(true);
    setError(null);

    // Si editing tiene un id, actualizamos; si no, creamos.
    const promise = editing
      ? actualizarItem(resource, editing.id, payload)
      : crearItem(resource, payload);

    promise
      .then(() => {
        setEditing(undefined);
        reloadItems(); // Refrescamos la lista para ver el cambio.
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Elimina un registro previa confirmación del usuario.
  const deleteItem = (id) => {
    if (!confirm('¿Estás seguro de que querés eliminar este registro?')) return;

    setLoading(true);
    setError(null);

    eliminarItem(resource, id)
      .then(() => {
        setSelected(null);
        reloadItems();
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Render condicional según el estado.
  // Solo se muestra una vista a la vez: carga, error, formulario, detalle o listado.
  if (loading) return <Loading resource={resource} />;
  if (error) return <ErrorMessage message={error} />;

  if (editing !== undefined) {
    return (
      <CrudForm
        resource={resource}
        item={editing}
        onSave={saveItem}
        onCancel={() => setEditing(undefined)}
      />
    );
  }

  if (selected) {
    return (
      <CrudDetail
        resource={resource}
        item={selected}
        onBack={() => setSelected(null)}
        onEdit={() => showForm(selected)}
        onDelete={() => deleteItem(selected.id)}
      />
    );
  }

  return (
    <CrudList
      resource={resource}
      items={items}
      onDetail={showDetail}
      onEdit={showForm}
      onDelete={deleteItem}
      onAdd={showForm}
    />
  );
};

export default CrudPanel;
