// adminService.js centraliza las llamadas al backend del panel de administración.
//
// Cada función exportada representa una operación contra la API.
// Usa adminApi, que automáticamente inyecta el token de admin en cada request.
// Esto mantiene la sesión de admin aislada de la sesión de cliente.

import { adminApi } from './adminApi.js';

// POST /auth/admin/login -> Inicia sesión como administrador.
// Recibe email y password del formulario y devuelve token + datos del usuario.
export const loginAdmin = async (email, password) => {
    return adminApi.post('/auth/admin/login', { email, password });
};

// GET /auth/admin/refresh -> Valida el token actual y devuelve uno renovado.
// Se usa al recargar la página para mantener la sesión activa.
export const refreshTokenAdmin = async () => {
    return adminApi.get('/auth/admin/refresh');
};

// GET /auth/admin/perfil -> Obtiene el perfil del administrador logueado.
export const obtenerPerfilAdmin = async () => {
    return adminApi.get('/auth/admin/perfil');
};

// CRUD de administradores bajo /admin.
// Los endpoints POST, PUT y DELETE están protegidos en el backend para rol ADMIN.
export const listarAdministradores = async () => adminApi.get('/admin/usuarios');
export const obtenerAdministradorPorId = async (id) => adminApi.get(`/admin/usuarios/${id}`);
export const crearAdministrador = async (datos) => adminApi.post('/admin/usuarios', datos);
export const actualizarAdministrador = async (id, datos) => adminApi.put(`/admin/usuarios/${id}`, datos);
export const eliminarAdministrador = async (id) => adminApi.delete(`/admin/usuarios/${id}`);
export const listarRolesAdmin = async () => adminApi.get('/admin/roles');
