// context/AdminAuthContext.jsx
// Contexto de autenticación exclusivo del panel de administración.

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginAdmin, obtenerPerfilAdmin } from "../services/adminService.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // logout: elimina el token y los datos del admin del localStorage
  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsuario");
    setToken(null);
    setAdmin(null);
  }, []);

  // validarToken: lee localStorage y valida contra el backend
  const validarToken = useCallback(async () => {
    const tokenGuardado = localStorage.getItem("adminToken");
    const usuarioGuardado = localStorage.getItem("adminUsuario");

    if (!tokenGuardado || !usuarioGuardado) {
      setCargando(false);
      return false;
    }

    // Cargar de localStorage primero (rápido)
    try {
      setToken(tokenGuardado);
      setAdmin(JSON.parse(usuarioGuardado));
    } catch (e) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUsuario");
      setCargando(false);
      return false;
    }

    // Validar con el backend
    try {
      const data = await obtenerPerfilAdmin();
      if (data?.usuario) {
        setAdmin(data.usuario);
        localStorage.setItem("adminUsuario", JSON.stringify(data.usuario));
      }
      setCargando(false);
      return true;
    } catch (error) {
      console.warn("[ADMIN] Sesión inválida, limpiando...", error.message);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUsuario");
      setToken(null);
      setAdmin(null);
      setCargando(false);
      return false;
    }
  }, []);

  useEffect(() => {
    validarToken();
  }, [validarToken]);

  // login: autentica al administrador contra el backend
  const login = async (email, password) => {
    const datos = await loginAdmin(email, password);

    // datos = { estado, token, usuario }
    const nuevoToken = datos.token;
    const nuevoAdmin = datos.usuario;

    if (!nuevoToken || !nuevoAdmin) {
      throw new Error("Respuesta de autenticación inválida");
    }

    localStorage.setItem("adminToken", nuevoToken);
    localStorage.setItem("adminUsuario", JSON.stringify(nuevoAdmin));

    setToken(nuevoToken);
    setAdmin(nuevoAdmin);

    return nuevoAdmin;
  };

  // Actualiza datos del admin en el contexto y localStorage
  const actualizarAdmin = (datos) => {
    const adminActualizado = { ...admin, ...datos };
    localStorage.setItem("adminUsuario", JSON.stringify(adminActualizado));
    setAdmin(adminActualizado);
  };

  // Helpers de rol (rol viene en minúscula del backend)
  const esAdmin = admin?.rol === "admin";
  const esOperador = admin?.rol === "staff";
  const puedeEscribir = esAdmin;

  const value = {
    admin,
    token,
    isAuthenticated: !!admin,
    cargando,
    login,
    logout,
    actualizarAdmin,
    validarToken,
    esAdmin,
    esOperador,
    puedeEscribir,
    rol: admin?.rol || null,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {cargando ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
          <p className="text-sm font-medium">Verificando sesión de administrador...</p>
        </div>
      ) : (
        children
      )}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth debe ser usado dentro de un AdminAuthProvider");
  }
  return context;
}