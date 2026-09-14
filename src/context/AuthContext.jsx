import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Cuando inicia la aplicación, buscamos si existe una sesión guardada
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        const tokenGuardado = localStorage.getItem('token');

        if (usuarioGuardado && tokenGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
            setToken(tokenGuardado);
        }

        setCargando(false);
    }, []);

    // Cerrar sesión
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        setToken(null);
        setUsuario(null);
    }, []);

    // LOGIN DE PRUEBA
    const login = async (email, password) => {
        // Simulamos un pequeño tiempo de espera
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Credenciales de prueba
        if (email === 'admin@test.com' && password === '123456') {
            const usuarioPrueba = {
                id: 1,
                nombre: 'Usuario',
                apellido: 'Prueba',
                email: 'admin@test.com',
            };

            const tokenPrueba = 'token-de-prueba-123456';

            localStorage.setItem('token', tokenPrueba);
            localStorage.setItem('usuario', JSON.stringify(usuarioPrueba));

            setToken(tokenPrueba);
            setUsuario(usuarioPrueba);

            return usuarioPrueba;
        }

        // Si las credenciales son incorrectas
        throw new Error('Email o contraseña incorrectos');
    };

    // Registro de prueba
    const registro = async (datos) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const usuarioNuevo = {
            id: Date.now(),
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
        };

        const tokenPrueba = 'token-de-prueba-' + Date.now();

        localStorage.setItem('token', tokenPrueba);
        localStorage.setItem('usuario', JSON.stringify(usuarioNuevo));

        setToken(tokenPrueba);
        setUsuario(usuarioNuevo);

        return usuarioNuevo;
    };

    // Actualizar usuario
    const actualizarUsuario = (datosActualizados) => {
        const usuarioNuevo = {
            ...usuario,
            ...datosActualizados,
        };

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
        actualizarUsuario,
    };

    return (
        <AuthContext.Provider value={value}>
            {cargando ? (
                <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
                    <p className="text-sm font-medium">
                        Verificando sesión...
                    </p>
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
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    return context;
}