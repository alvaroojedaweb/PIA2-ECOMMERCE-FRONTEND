// LoginAdmin.jsx - Página de inicio de sesión para administradores.
//
// Esta pantalla es la única ruta pública dentro del área /admin.
// Recolecta email y password, los envía al backend a través del contexto
// AdminAuthContext y, si son correctos, redirige al panel (/admin).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

function LoginAdmin() {
    const navigate = useNavigate();
    const { login } = useAdminAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    // handleSubmit: evita el envío por defecto del formulario, valida que
    // haya datos, llama al login del contexto y redirige al panel si funciona.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Completá email y contraseña.');
            return;
        }

        try {
            setEnviando(true);
            // login viene de AdminAuthContext y hace la petición al backend.
            const admin = await login(email, password);
            console.log('Login admin exitoso:', admin);
            navigate('/admin');
        } catch (err) {
            console.error('Error al iniciar sesión como admin:', err);
            setError(err.message || 'Credenciales inválidas.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-700 bg-teal-800 p-8 shadow-2xl">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Zona restringida</p>
                    <h1 className="mt-1 text-3xl font-bold text-white">Login de administradores</h1>
                  
                </div>

                {error && (
                    <div className="rounded-xl border border-red-700 bg-red-900/30 p-4 text-sm font-medium text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="admin@CelularTech.test"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-300">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full rounded-xl bg-blue-600 py-2.5 text-center font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                    >
                        {enviando ? 'Ingresando...' : 'Ingresar al panel'}
                    </button>
                    
                </form>


                <p className="text-center text-sm text-slate-500">
                    <a href="/" className="text-blue-400 hover:text-green-300">
                        Volver al Inicio
                    </a>
                </p>
            </div>
        </div>
    );
}

export default LoginAdmin;
