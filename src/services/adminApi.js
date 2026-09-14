// adminApi.js - Instancia de axios dedicada exclusivamente al panel de admin.
//
// ¿Por qué una instancia separada de la que usa el cliente?
// El cliente usa localStorage.getItem('token') y esta usa 'adminToken'.
// Si ambas zonas compartieran el mismo token, un cliente logueado podría
// intentar acceder a rutas de admin o viceversa. Con instancias separadas
// mantenemos el token de admin aislado del token de cliente.
//
// Funcionamiento:
// 1. Crea una instancia de axios con la URL base del backend.
// 2. Interceptor de request: agrega el header Authorization si existe adminToken.
// 3. Interceptor de response: normaliza la respuesta y maneja errores uniformemente.

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const adminApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de petición: se ejecuta antes de enviar cada request.
// Si hay un token de admin guardado, lo incluye en el header Authorization
// con el formato que espera el backend: Bearer <token>.
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de respuesta: se ejecuta con cada respuesta del backend.
// Simplifica el manejo de datos y centraliza el log de errores para debug.
adminApi.interceptors.response.use(
    (response) => {
        console.log(
            `[ADMIN] Respuesta ${response.config.method?.toUpperCase()} ${response.config.url}:`,
            response.data
        );
        if (response.data && response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.mensaje || error.message;
        console.error('[ADMIN] Error en la petición:', message);
        return Promise.reject(new Error(message));
    }
);
