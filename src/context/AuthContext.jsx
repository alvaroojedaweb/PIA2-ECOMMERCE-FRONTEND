// context/AuthContext.jsx
// Contexto de autenticación de clientes.
// Maneja login, registro, logout y validación de sesión contra el backend.

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginCliente, registrarCliente, obtenerPerfilCliente } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al iniciar la app, buscamos una sesión guardada en localStorage
  // y la validamos contra el backend con GET /auth/me
  useEffect(() => {
    const inicializar = async () => {
      const usuarioGuardado = localStorage.getItem("usuario");
      const tokenGuardado = localStorage.getItem("token");

      if (!usuarioGuardado || !tokenGuardado) {
        setCargando(false);
        return;
      }

      // Cargamos lo que hay en localStorage primero (respuesta rápida)
      try {
        setUsuario(JSON.parse(usuarioGuardado));
        setToken(tokenGuardado);
      } catch (e) {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
      }

      // Después validamos contra el backend (por si el token expiró)
      try {
        const data = await obtenerPerfilCliente();
        if (data?.usuario) {
          setUsuario(data.usuario);
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
        }
      } catch (error) {
        // Token expirado o inválido: limpiamos sesión
        console.warn("Sesión inválida, limpiando...", error.message);
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        setUsuario(null);
        setToken(null);
      } finally {
        setCargando(false);
      }
    };

    inicializar();
  }, []);

  // Cerrar sesión
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }, []);

  // Login real contra el backend
  const login = async (email, password) => {
    const data = await loginCliente(email, password);

    // data = { estado, token, usuario }
    if (!data?.token || !data?.usuario) {
      throw new Error("Respuesta de autenticación inválida");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    setToken(data.token);
    setUsuario(data.usuario);

    return data.usuario;
  };

  // Registro real contra el backend
  const registro = async (datos) => {
    const data = await registrarCliente(datos);

    // data = { estado, data: { id, nombre, email, ... } }
    if (!data?.data) {
      throw new Error("No se pudo registrar el usuario");
    }

    // Después de registrar, hacemos login automático
    return await login(datos.email, datos.password);
  };

  // Actualizar datos del usuario logueado (sin volver a pedir al backend)
  const actualizarUsuario = (datosActualizados) => {
    const usuarioNuevo = { ...usuario, ...datosActualizados };
    localStorage.setItem("usuario", JSON.stringify(usuarioNuevo));
    setUsuario(usuarioNuevo);
  };

  const value = {
    usuario,
    token,
    isAuthenticated: !!usuario,
    cargando,
    login,
    registro,
    logout,
    actualizarUsuario,
  };

  return (
    <AuthContext.Provider value={value}>
      {cargando ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
          <p className="text-sm font-medium">Verificando sesión...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}