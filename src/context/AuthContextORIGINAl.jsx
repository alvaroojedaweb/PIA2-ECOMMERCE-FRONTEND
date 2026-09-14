// AuthContext.jsx provee el estado global de autenticación para toda la aplicación.
// Guarda el usuario logueado y el token JWT en memoria y en localStorage.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginCliente, registrarCliente, refreshTokenCliente } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [cargando, setCargando] = useState(true);

    // ¿POR QUÉ USAMOS useCallback EN LUGAR DE UNA FUNCIÓN FLECHA TRADICIONAL?
    //
    // Si usáramos: const logout = () => { ... }
    // En cada render de AuthProvider, JavaScript crearía una NUEVA instancia de la función
    // en memoria (distinta referencia de memoria).
    //
    // Como 'validarToken' tiene a 'logout' en su array de dependencias [logout], y a su vez
    // 'useEffect' tiene a 'validarToken' en [validarToken]:
    // 1. Una función flecha simple cambiaría de referencia en cada render.
    // 2. Eso obligaría a 'validarToken' a recrearse.
    // 3. Eso dispararía el 'useEffect' infinitamente (bucle infinito de renders y peticiones).
    //
    // Con useCallback(..., []), React "memoriza" la referencia de la función y la mantiene
    // estable entre renders, garantizando estabilidad referencial y evitando re-ejecuciones.
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
    }, []);

    // Valida el token con el backend y lo renueva si es válido.
    // Si el token expiró o fue alterado, cierra la sesión automáticamente.
    const validarToken = useCallback(async () => {
        const tokenGuardado = localStorage.getItem('token');

        if (!tokenGuardado) {
            setCargando(false);
            return false;
        }

        try {
            const respuesta = await refreshTokenCliente();
            // respuesta = { estado: true, token, cliente }
            const nuevoToken = respuesta.token;
            const clienteActualizado = respuesta.cliente;

            localStorage.setItem('token', nuevoToken);
            localStorage.setItem('usuario', JSON.stringify(clienteActualizado));

            setToken(nuevoToken);
            setUsuario(clienteActualizado);
            return true;
        } catch (error) {
            console.warn('El token guardado no es válido o ha expirado:', error.message);
            logout();
            return false;
        } finally {
            setCargando(false);
        }
    }, [logout]);

    // Al cargar la app o refrescar, validamos el token contra el backend.
    useEffect(() => {
        validarToken();
    }, [validarToken]);

    // Iniciar sesión como cliente
    const login = async (email, password) => {
        const respuesta = await loginCliente(email, password);
        // respuesta = { estado: true, mensaje: '...', token: '...', cliente: { ... } }
        const nuevoToken = respuesta.token;
        const nuevoUsuario = respuesta.cliente;

        localStorage.setItem('token', nuevoToken);
        localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));

        setToken(nuevoToken);
        setUsuario(nuevoUsuario);

        return nuevoUsuario;
    };

    // Registrarse como cliente e iniciar sesión automáticamente
    const registro = async (datos) => {
        const respuesta = await registrarCliente(datos);
        // respuesta = { estado: true, mensaje: '...', token: '...', cliente: { ... } }
        const nuevoToken = respuesta.token;
        const nuevoUsuario = respuesta.cliente;

        localStorage.setItem('token', nuevoToken);
        localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));

        setToken(nuevoToken);
        setUsuario(nuevoUsuario);

        return nuevoUsuario;
    };

    // Actualiza los datos del usuario en el contexto y en localStorage
    const actualizarUsuario = (datosActualizados) => {
        const usuarioNuevo = { ...usuario, ...datosActualizados };
        localStorage.setItem('usuario', JSON.stringify(usuarioNuevo));
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
        validarToken,
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

// Hook personalizado para acceder fácilmente al contexto de autenticación
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}
