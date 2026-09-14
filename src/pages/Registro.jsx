// Registro.jsx - Página de registro para nuevos clientes.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Registro() {
    const navigate = useNavigate();
    const { registro } = useAuth();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!nombre || !email || !password) {
            setError('Por favor completá los campos obligatorios (Nombre, Email y Contraseña).');
            return;
        }

        try {
            setEnviando(true);
            await registro({ nombre, apellido, email, password });
            navigate('/');
        } catch (err) {
            console.error('Error al registrar cliente:', err);
            setError(err.message || 'Error al registrar la cuenta. Intentá nuevamente.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4">
        <div className="mx-auto max-w-md space-y-6">
            <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-teal-600">Crear cuenta</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">Registro de cliente</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Completá tus datos para crear una cuenta en el sitio.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Juan"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Apellido</label>
                    <input
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Pérez"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="tu@email.com"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña *</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={enviando}
                    className="w-full rounded-xl bg-teal-600 py-2.5 text-center font-medium text-white transition hover:bg-teal-400 disabled:opacity-50"
                >
                    {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
            </form>

            <p className="text-center text-sm text-slate-600">
                ¿Ya tenés una cuenta?{' '}
                <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-400">
                    Iniciá sesión acá
                </Link>
            </p>
        </div>
        </div>
    );
}

export default Registro;
