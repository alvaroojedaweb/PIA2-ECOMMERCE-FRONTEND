// api.js centraliza todas las llamadas al backend usando axios.
// Cada función exportada representa una operación del CRUD.

import axios from 'axios';

// La URL del backend viene de una variable de entorno (VITE_API_URL).
// Si no está definida, usamos localhost:3000 como valor por defecto.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Creamos una instancia de axios con configuración base.
// baseURL evita tener que escribir la URL completa en cada petición.
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones: agrega el token JWT en el header Authorization si existe.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuestas: se ejecuta automáticamente con cada respuesta.
// Extraemos el campo data del backend y manejamos errores de forma uniforme.
api.interceptors.response.use(
  (response) => {
    console.log(
      `Respuesta ${response.config.method?.toUpperCase()} ${response.config.url}:`,
      response.data
    );
    // Si el backend envuelve sus datos en { estado: true, data: ... }, devolvemos data.
    // Para endpoints como auth ({ token, cliente }), devolvemos todo response.data.
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.mensaje || error.message;
    console.error('Error en la petición:', message);
    return Promise.reject(new Error(message));
  }
);

// GET /{tipo} -> devuelve el listado de registros.
export const obtenerItems = (tipo) => api.get(`/${tipo}`);

// GET /{tipo}/{id} -> devuelve un registro específico.
export const obtenerDetalle = (tipo, id) => api.get(`/${tipo}/${id}`);





///////// BACKEND - CRUD ////////


// POST /{tipo} -> crea un nuevo registro.
export const crearItem = (tipo, body) => api.post(`/${tipo}`, body);

// PUT /{tipo}/{id} -> actualiza un registro existente.
export const actualizarItem = (tipo, id, body) => api.put(`/${tipo}/${id}`, body);

// DELETE /{tipo}/{id} -> elimina un registro.
export const eliminarItem = (tipo, id) => api.delete(`/${tipo}/${id}`);
