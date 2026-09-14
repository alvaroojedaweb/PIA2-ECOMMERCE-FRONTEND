// Loading.jsx muestra un mensaje mientras esperamos respuesta del servidor.

const Loading = ({ resource }) => {
  return <div className="loading">Cargando {resource}...</div>;
};

export default Loading;
