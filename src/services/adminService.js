// adminService.js centraliza las llamadas al backend del panel de administración.
//
// Cada función exportada representa una operación contra la API.
// Usa adminApi, que automáticamente inyecta el token de admin en cada request.
// Esto mantiene la sesión de admin aislada de la sesión de cliente.

import { adminApi } from './adminApi.js';

// POST /auth/admin/login -> Inicia sesión como administrador.
// Recibe email y password del formulario y devuelve token + datos del usuario.
export const loginAdmin = async (email, password) => {
    return adminApi.post('api/auth/login-admin', { email, password });
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
export const listarAdministradores = async () => adminApi.get('/api/empleados');
export const obtenerAdministradorPorId = async (id) => adminApi.get(`/api/empleados/${id}`);
export const crearAdministrador = async (datos) => adminApi.post('/api/empleados', datos);
export const actualizarAdministrador = async (id, datos) => adminApi.put(`/api/empleados/${id}`, datos);
export const eliminarAdministrador = async (id) => adminApi.delete(`/api/empleados/${id}`);
export const listarRolesAdmin = async () => adminApi.get('/api/roles');
