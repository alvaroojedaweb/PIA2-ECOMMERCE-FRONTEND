// services/api.js
// Centraliza todas las llamadas al backend usando axios.
// El baseURL ya incluye /api para no repetirlo en cada función.

import axios from "axios";

// URL del backend (de .env.local o .env)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2222";

// Instancia de axios con configuración base
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// Interceptor de peticiones: agrega el token JWT si existe
// ============================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// Interceptor de respuestas: simplifica el manejo de datos
// y centraliza el manejo de 401 (logout automático)
// ============================================================
api.interceptors.response.use(
  (response) => {
    // Loguear para debug
    console.log(
      `[API] ${response.config.method?.toUpperCase()} ${response.config.url}:`,
      response.data
    );

    // Devolver toda la respuesta para que el AuthContext pueda acceder
    // a `token`, `usuario`, `data`, etc. sin perder campos.
    return response.data;
  },
  (error) => {
    // Manejo específico de 401: token expirado o inválido
    if (error.response?.status === 401) {
      // Limpiar sesión
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.mensaje || error.message || "Error de red";
    console.error("[API] Error:", message);
    return Promise.reject(new Error(message));
  }
);

// ============================================================
// Helpers genéricos (opcionales, para CRUD rápido)
// ============================================================
export const obtenerItems = (tipo) => api.get(`/${tipo}`);
export const obtenerDetalle = (tipo, id) => api.get(`/${tipo}/${id}`);
export const crearItem = (tipo, body) => api.post(`/${tipo}`, body);
export const actualizarItem = (tipo, id, body) => api.put(`/${tipo}/${id}`, body);
export const eliminarItem = (tipo, id) => api.delete(`/${tipo}/${id}`);