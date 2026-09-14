// AdminAuthContext.jsx - Contexto de autenticación exclusivo del panel de administración.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Creamos el contexto. El valor por defecto es null hasta que se provea.
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(null);
    const [cargando, setCargando] = useState(true);

    // logout: elimina el token y los datos del admin del localStorage
    const logout = useCallback(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsuario');
        setToken(null);
        setAdmin(null);
    }, []);

    // validarToken: ahora solo revisa localStorage, sin backend
    const validarToken = useCallback(async () => {
        const tokenGuardado = localStorage.getItem("adminToken");
        const usuarioGuardado = localStorage.getItem("adminUsuario");

        if (tokenGuardado && usuarioGuardado) {
            setToken(tokenGuardado);
            setAdmin(JSON.parse(usuarioGuardado));
        }
        setCargando(false);
        return true;
    }, []);

    useEffect(() => {
        validarToken();
    }, [validarToken]);

    // login: ignora email y password, siempre devuelve un admin de prueba
    const login = async (email, password) => {
        const nuevoToken = "token-falso";
        const nuevoAdmin = {
            id: 1,
            nombre: "Admin Demo",
            email: email || "demo@admin.test",
            rol: "ADMIN",
            rolId: 1,
        };

        localStorage.setItem("adminToken", nuevoToken);
        localStorage.setItem("adminUsuario", JSON.stringify(nuevoAdmin));

        setToken(nuevoToken);
        setAdmin(nuevoAdmin);

        return nuevoAdmin;
    };

    // Actualiza datos del admin en el contexto y localStorage
    const actualizarAdmin = (datos) => {
        const adminActualizado = { ...admin, ...datos };
        localStorage.setItem('adminUsuario', JSON.stringify(adminActualizado));
        setAdmin(adminActualizado);
    };

    // Helpers de rol
    const esAdmin = admin?.rol?.toUpperCase() === 'ADMIN';
    const esOperador = admin?.rol?.toUpperCase() === 'OPERADOR';
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

// useAdminAuth: hook que devuelve el contexto
export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth debe ser usado dentro de un AdminAuthProvider');
    }
    return context;
}
