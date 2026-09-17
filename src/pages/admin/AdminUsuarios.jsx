// AdminUsuarios.jsx - CRUD de usuarios administrativos con control de roles.
//
// Página que muestra la tabla de administradores. Los OPERADORES solo pueden
// ver la tabla. Los usuarios con rol ADMIN pueden abrir el modal para crear,
// editar o eliminar otros administradores.
//
// Flujo general:
// 1. Al montar, carga la lista de administradores y (si es ADMIN) los roles.
// 2. El botón "Nuevo administrador" abre el modal en modo creación.
// 3. El botón "Editar" abre el modal con los datos del usuario seleccionado.
// 4. El botón "Eliminar" borra el usuario tras una confirmación.

import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import {
    listarAdministradores,
    listarRolesAdmin,
    crearAdministrador,
    actualizarAdministrador,
    eliminarAdministrador,
} from '../../services/adminService.js';

function AdminUsuarios() {
    const { esAdmin, esOperador, puedeEscribir, admin } = useAdminAuth();

    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Estado del formulario usado por el modal.
    // modoFormulario: controla si el modal está abierto.
    // editandoId: null en modo creación, id del usuario en modo edición.
    const [modoFormulario, setModoFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rolId: '',
    });

    // cargarDatos: trae del backend la lista de usuarios y, si el admin
    // tiene permiso de escritura, también los roles para el select del modal.
    const cargarDatos = async () => {
        try {
            setCargando(true);
            console.log('Cargando lista de administradores...');
            const dataUsuarios = await listarAdministradores();
            console.log('Administradores recibidos:', dataUsuarios);
            setUsuarios(dataUsuarios || []);

            if (puedeEscribir) {
                console.log('Cargando roles...');
                const dataRoles = await listarRolesAdmin();
                console.log('Roles recibidos:', dataRoles);
                setRoles(dataRoles || []);
            }
        } catch (err) {
            console.error('Error al cargar administradores:', err);
            setError(err.message || 'Error al cargar los datos.');
        } finally {
            setCargando(false);
        }
    };

    // useEffect que carga los datos al montar el componente.
    // Depende de puedeEscribir porque el admin necesita roles solo si puede crear/editar.
    useEffect(() => {
        cargarDatos();
    }, [puedeEscribir]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // iniciarCreacion: limpia el formulario y abre el modal en modo creación.
    const iniciarCreacion = () => {
        setEditandoId(null);
        setForm({ nombre: '', apellido: '', email: '', password: '', rolId: '' });
        setModoFormulario(true);
        setError('');
        setMensaje('');
    };

    // iniciarEdicion: carga los datos del usuario en el formulario y abre
    // el modal en modo edición. La contraseña se deja vacía para no cambiarla.
    const iniciarEdicion = (usuario) => {
        setEditandoId(usuario.id);
        setForm({
            nombre: usuario.nombre || '',
            apellido: usuario.apellido || '',
            email: usuario.email || '',
            password: '',
            rolId: usuario.rolId || '',
        });
        setModoFormulario(true);
        setError('');
        setMensaje('');
    };

    const cancelarFormulario = () => {
        setModoFormulario(false);
        setEditandoId(null);
        setForm({ nombre: '', apellido: '', email: '', password: '', rolId: '' });
        setError('');
    };

    // handleSubmit: valida el formulario y decide si crear o actualizar.
    // En edición, si la contraseña está vacía no se envía al backend.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (!form.nombre || !form.email || !form.rolId) {
            setError('Nombre, email y rol son obligatorios.');
            return;
        }

        if (!editandoId && !form.password) {
            setError('La contraseña es obligatoria al crear un usuario.');
            return;
        }

        try {
            const datos = { ...form };
            // Si la contraseña está vacía en edición, no la enviamos.
            if (editandoId && !datos.password.trim()) {
                delete datos.password;
            }

            if (editandoId) {
                console.log('Actualizando usuario:', editandoId, datos);
                await actualizarAdministrador(editandoId, datos);
                setMensaje('Usuario actualizado correctamente.');
            } else {
                console.log('Creando usuario:', datos);
                await crearAdministrador(datos);
                setMensaje('Usuario creado correctamente.');
            }

            setModoFormulario(false);
            setEditandoId(null);
            setForm({ nombre: '', apellido: '', email: '', password: '', rolId: '' });
            await cargarDatos();
        } catch (err) {
            console.error('Error al guardar usuario:', err);
            setError(err.message || 'Error al guardar el usuario.');
        }
    };

    // handleEliminar: pide confirmación y elimina el usuario. Evita que
    // un admin se elimine a sí mismo.
    const handleEliminar = async (id) => {
        if (id === admin?.id) {
            setError('No podés eliminar tu propio usuario.');
            return;
        }

        if (!confirm('¿Estás seguro de que querés eliminar este usuario?')) {
            return;
        }

        try {
            console.log('Eliminando usuario:', id);
            await eliminarAdministrador(id);
            setMensaje('Usuario eliminado correctamente.');
            await cargarDatos();
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            setError(err.message || 'Error al eliminar el usuario.');
        }
    };

    if (cargando) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Cargando administradores...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Administradores</h2>
                    <p className="text-sm text-slate-600">
                        {puedeEscribir
                            ? 'Gestioná los usuarios del panel y asigná roles.'
                            : 'Vista de solo lectura del listado de usuarios.'}
                    </p>
                </div>
                {puedeEscribir && !modoFormulario && (
                    <button
                        onClick={iniciarCreacion}
                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                        + Nuevo administrador
                    </button>
                )}
            </div>

            {mensaje && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                    {mensaje}
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            {modoFormulario && puedeEscribir && (
                // ===================================================================
                // MODAL (POPUP) PARA CREAR/EDITAR ADMINISTRADORES
                // ===================================================================
                // Un modal es una ventana flotante que se superpone al contenido
                // principal de la página. Se usa para mantener al usuario en el
                // contexto de la tabla mientras completa el formulario.
                //
                // Estructura del modal:
                // 1. Contenedor principal (fondo oscuro):
                //    - fixed inset-0: ocupa toda la pantalla y se mantiene fijo al
                //      hacer scroll.
                //    - z-50: alto índice z para que quede por encima de todo.
                //    - bg-slate-900/60: fondo semitransparente que oscurece la página.
                //    - backdrop-blur-sm: difumina ligeramente el fondo.
                //    - onClick en el contenedor: cierra el modal si se hace click
                //      fuera de la caja (en el fondo, no en el modal).
                //
                // 2. Caja del modal:
                //    - w-full max-w-2xl: ancho completo en móvil, máximo 2xl en desktop.
                //    - rounded-2xl y shadow-2xl: bordes redondeados y sombra grande.
                //
                // 3. Encabezado:
                //    - Título dinámico según estemos creando o editando.
                //    - Botón de cierre (×) que ejecuta cancelarFormulario().
                //
                // 4. Formulario:
                //    - Mismos campos y validaciones que antes, pero ahora dentro del
                //      modal. Al enviarlo se crea o actualiza el usuario.
                // ===================================================================
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
                    onClick={(e) => {
                        // e.target es el elemento que recibió el click.
                        // e.currentTarget es el contenedor del modal.
                        // Si son iguales, el usuario hizo click en el fondo oscuro
                        // y no en la caja del modal, por lo que se cierra.
                        if (e.target === e.currentTarget) cancelarFormulario();
                    }}
                >
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editandoId ? 'Editar usuario' : 'Nuevo usuario'}
                            </h3>
                            <button
                                type="button"
                                onClick={cancelarFormulario}
                                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                aria-label="Cerrar"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Apellido</label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={form.apellido}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña {editandoId ? '(dejar vacía para no cambiar)' : '*'}</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        required={!editandoId}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Rol *</label>
                                    <select
                                        name="rolId"
                                        value={form.rolId}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Seleccionar rol</option>
                                        {roles.map((rol) => (
                                            <option key={rol.id} value={rol.id}>
                                                {rol.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={cancelarFormulario}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                                >
                                    {editandoId ? 'Guardar cambios' : 'Crear usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">ID</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Nombre</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Apellido</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Rol</th>
                            {puedeEscribir && (
                                <th className="px-4 py-3 text-right font-semibold text-slate-700">Acciones</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {usuarios.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={puedeEscribir ? 6 : 5}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        ) : (
                            usuarios.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-slate-600">{u.id}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{u.nombre}</td>
                                    <td className="px-4 py-3 text-slate-600">{u.apellido || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${u?.rol === 'ADMIN'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-slate-100 text-slate-700'
                                                }`}
                                        >
                                            {u?.rol || '-'}
                                        </span>
                                    </td>
                                    {puedeEscribir && (
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => iniciarEdicion(u)}
                                                className="mr-2 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
                                            >
                                                Editar
                                            </button>
                                            {u.id !== admin?.id && (
                                                <button
                                                    onClick={() => handleEliminar(u.id)}
                                                    className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsuarios;
