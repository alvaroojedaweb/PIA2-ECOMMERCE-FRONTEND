// Perfil.jsx - Página de gestión de perfil del cliente.
// Permite visualizar y actualizar los datos personales.

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { obtenerPerfilCliente, actualizarPerfilCliente } from '../services/authService.js';

function Perfil() {
    const { usuario, actualizarUsuario } = useAuth();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [password, setPassword] = useState('');

    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [error, setError] = useState('');

    // Cargamos los datos más recientes del perfil desde la API
    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                setCargandoDatos(true);
                const data = await obtenerPerfilCliente();
                if (data) {
                    setNombre(data.nombre || '');
                    setApellido(data.apellido || '');
                    setEmail(data.email || '');
                    setTelefono(data.telefono || '');
                    setDireccion(data.direccion || '');
                }
            } catch (err) {
                console.error('Error al cargar perfil:', err);
                // Si falla la petición, usamos los datos guardados en el contexto
                if (usuario) {
                    setNombre(usuario.nombre || '');
                    setApellido(usuario.apellido || '');
                    setEmail(usuario.email || '');
                }
                setError('No se pudieron obtener todos los datos del servidor.');
            } finally {
                setCargandoDatos(false);
            }
        };

        cargarPerfil();
    }, [usuario]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        if (!nombre || !email) {
            setError('El nombre y el email son campos obligatorios.');
            return;
        }

        try {
            setGuardando(true);
            const datosAEnviar = {
                nombre,
                apellido,
                email,
                telefono,
                direccion,
            };

            // Solo enviamos contraseña si el usuario escribió una nueva
            if (password.trim() !== '') {
                datosAEnviar.password = password;
            }

            const respuesta = await actualizarPerfilCliente(datosAEnviar);
            // respuesta = { estado: true, mensaje: '...', cliente: { ... } }
            const clienteActualizado = respuesta.cliente || datosAEnviar;

            actualizarUsuario(clienteActualizado);
            setPassword('');
            setMensajeExito(respuesta.mensaje || '¡Datos actualizados con éxito!');
        } catch (err) {
            console.error('Error al actualizar perfil:', err);
            setError(err.message || 'Ocurrió un error al guardar los cambios.');
        } finally {
            setGuardando(false);
        }
    };

    if (cargandoDatos) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Cargando perfil...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Mi Cuenta</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">Perfil de cliente</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Consultá y modificá tu información personal y datos de contacto.
                </p>
            </div>

            {mensajeExito && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                    {mensajeExito}
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Ej: 11 1234-5678"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Dirección</label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Ej: Av. San Martín 123"
                        />
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Nueva contraseña <span className="text-xs font-normal text-slate-500">(opcional, dejala vacía para no cambiarla)</span>
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Dejar en blanco para mantener la actual"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={guardando}
                        className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {guardando ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Perfil;
