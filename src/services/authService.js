// services/authService.js
// Maneja las peticiones de autenticación al backend para clientes.

import { api } from "./api.js";

// POST /auth/login -> Inicia sesión como cliente.
// El backend devuelve { estado, token, usuario }.
export const loginCliente = async (email, password) => {
  return api.post("/auth/login", { email, password });
};

// POST /auth/register -> Registra un nuevo cliente.
// El backend devuelve { estado, data: { id, nombre, email, ... } }.
export const registrarCliente = async ({ nombre, apellido, email, password }) => {
  return api.post("/auth/register", { nombre, apellido, email, password });
};

// GET /auth/me -> Obtiene los datos del usuario logueado (cliente o admin).
export const obtenerPerfilCliente = async () => {
  return api.get("/auth/me");
};

// PUT /clientes/:id -> Actualiza los datos de un cliente.
// Nota: en el backend actual este endpoint está protegido con verificarAdmin.
// En Etapa 5 agregaremos un PUT /auth/me para que el cliente edite su propio perfil.
export const actualizarPerfilCliente = async (id, datos) => {
  return api.put(`/clientes/${id}`, datos);
};