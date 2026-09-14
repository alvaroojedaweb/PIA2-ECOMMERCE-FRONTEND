// Login.jsx - Página de inicio de sesión para clientes.

//import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react'; 
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();  

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor completá todos los campos.');
            return;
        }

        try {
            setEnviando(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError(err.message || 'Error al iniciar sesión. Verificá tus credenciales.');
        } finally {
            setEnviando(false);
        }
    };
    return (
        <div className="bg-gray-300 flex items-center justify-center  border rounded-xl">
        <div className="mx-auto max-w-md space-y-6 ">
            <div className="text-center ">
                <p className="text-sm font-bold uppercase tracking-widest text-teal-600 ">Bienvenido!</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">Iniciar sesión</h1>
                <p className="mt-2 text-sm text-slate-600 text-teal-600 text font-bold">
                    Ingresá con tu cuenta.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
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
                    <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
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
                    className="w-full rounded-xl bg-teal-600 py-2.5 text-center font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
                >
                    {enviando ? 'Iniciando sesión...' : 'Ingresar'}
                </button>
            </form>

            <p className="text-center text-sm text-slate-600">
                ¿No tenés cuenta?{' '}
                <Link to="/registro" className="font-semibold text-teal-600">
                    Registrate acá
                </Link>
            </p>
            


                                    {/* botones de  de inicio redes sociales */}
                        <div className="space-y-3">
                            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continuar con Google
                            </button>
                            
                            <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                                </svg>
                                Continuar con Facebook
                            </button>
                        </div>

        </div>

        
        </div>
    );
}

export default Login;
