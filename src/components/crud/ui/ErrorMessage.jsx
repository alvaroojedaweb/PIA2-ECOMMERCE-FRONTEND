// ErrorMessage.jsx muestra un mensaje cuando algo falla al cargar o guardar datos.

const ErrorMessage = ({ message }) => {
  return <div className="error">{message}</div>;
};

export default ErrorMessage;
