
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react'; 
function Login() {
    const navigate = useNavigate();
    const location = useLocation()
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
            const destino = location.state?.from || '/';
            navigate(destino, { replace: true }); 
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError(err.message || 'Error al iniciar sesión. Verificá tus credenciales.');
        } finally {
            setEnviando(false);
        }
    };
    return (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 p-6 sm:p-10">
        <div className="mx-auto max-w-md space-y-6 ">
            <div className="text-center ">
                <p className="text-sm font-bold uppercase tracking-widest text-teal-600 ">Bienvenido!</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">Iniciar sesión</h1>
                <p className="mt-2 text-sm font-semibold text-teal-600">
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
                    <div className="mb-1 flex items-center justify-between">
                        <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                        <Link to="/recuperar-password" className="text-xs font-medium text-teal-600 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                        </div>
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
            


        </div>

        
        </div>
    );
}

export default Login;
