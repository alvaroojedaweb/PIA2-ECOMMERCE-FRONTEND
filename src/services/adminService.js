// services/adminService.js
// Peticiones de autenticación y CRUD del panel de administración.

import { adminApi } from "./adminApi.js";

// ============================================================
// AUTENTICACIÓN
// ============================================================

// POST /auth/login-admin
export const loginAdmin = async (email, password) => {
  return adminApi.post("/auth/login-admin", { email, password });
};

// GET /auth/me (funciona para cliente y admin)
export const obtenerPerfilAdmin = async () => {
  return adminApi.get("/auth/me");
};

// ============================================================
// CRUD DE EMPLEADOS
// ============================================================

export const listarAdministradores = async () => {
  return adminApi.get("/empleados");
};

export const obtenerAdministradorPorId = async (id) => {
  return adminApi.get(`/empleados/${id}`);
};

export const crearAdministrador = async (datos) => {
  return adminApi.post("/empleados", datos);
};

export const actualizarAdministrador = async (id, datos) => {
  return adminApi.put(`/empleados/${id}`, datos);
};

export const eliminarAdministrador = async (id) => {
  return adminApi.delete(`/empleados/${id}`);
};

// ============================================================
// ROLES
// ============================================================

export const listarRolesAdmin = async () => {
  return adminApi.get("/roles");
};