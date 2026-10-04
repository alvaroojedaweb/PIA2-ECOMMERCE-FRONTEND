// services/adminApi.js
// Instancia de axios exclusiva para el panel de administración.
// Usa adminToken en lugar de token, y tiene baseURL con /api.

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2222";

export const adminApi = axios.create({
  baseURL: `${API_URL}/api`, // ← incluye /api
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: agrega el token de admin
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta
adminApi.interceptors.response.use(
  (response) => {
    console.log(
      `[ADMIN] ${response.config.method?.toUpperCase()} ${response.config.url}:`,
      response.data
    );
    // Devolver toda la respuesta para que los componentes accedan a `data`, `token`, etc.
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expirado o sin permiso: redirigir al login admin
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUsuario");
      if (window.location.pathname.startsWith("/admin") &&
          window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    const message =
      error.response?.data?.mensaje || error.message || "Error de red";
    console.error("[ADMIN] Error:", message);
    return Promise.reject(new Error(message));
  }
);