// SimplePanel.jsx es la versión básica del panel.
// Solo lista registros y muestra su detalle. No permite crear, editar ni eliminar.

import { useEffect, useState } from 'react';
import { obtenerItems, obtenerDetalle } from '../../services/api.js';
import Loading from '../crud/ui/Loading.jsx';
import ErrorMessage from '../crud/ui/ErrorMessage.jsx';
import SimpleList from './SimpleList.jsx';
import SimpleDetail from './SimpleDetail.jsx';

const SimplePanel = ({ resource }) => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga la lista al montar el componente o cambiar de recurso.
  useEffect(() => {
    let cancelled = false;

    obtenerItems(resource)
      .then((data) => {
        if (!cancelled) setItems(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [resource]);

  // Muestra el detalle de un registro.
  const showDetail = (id) => {
    setLoading(true);
    setError(null);

    obtenerDetalle(resource, id)
      .then((data) => setSelected(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (loading) return <Loading resource={resource} />;
  if (error) return <ErrorMessage message={error} />;

  if (selected) {
    return (
      <SimpleDetail
        activeTab={resource}
        item={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <SimpleList
      activeTab={resource}
      items={items}
      onDetail={showDetail}
    />
  );
};

export default SimplePanel;
