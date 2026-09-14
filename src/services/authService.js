// authService.js maneja las peticiones de autenticación al backend.

import { api } from './api.js';

// POST /auth/cliente/login -> Inicia sesión como cliente.
export const loginCliente = async (email, password) => {
    return api.post('/auth/cliente/login', { email, password });
};

// POST /auth/cliente/registro -> Registra un nuevo cliente.
export const registrarCliente = async ({ nombre, apellido, email, password }) => {
    return api.post('/auth/cliente/registro', { nombre, apellido, email, password });
};

// GET /auth/cliente/refresh -> Valida el token actual y devuelve un token renovado.
export const refreshTokenCliente = async () => {
    return api.get('/auth/cliente/refresh');
};

// GET /auth/cliente/perfil -> Obtiene los datos completos del perfil del cliente.
export const obtenerPerfilCliente = async () => {
    return api.get('/auth/cliente/perfil');
};

// PUT /auth/cliente/perfil -> Actualiza los datos del cliente logueado.
export const actualizarPerfilCliente = async (datos) => {
    return api.put('/auth/cliente/perfil', datos);
};
