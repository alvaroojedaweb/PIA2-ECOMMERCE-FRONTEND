import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../context/AdminAuthContext.jsx';
import { adminApi as api } from '../../../services/adminApi.js';

// Helper para extraer arreglos de forma segura de las respuestas del backend
const extraerArray = (respuesta) => {
    if (!respuesta) return [];
    if (Array.isArray(respuesta)) return respuesta;
    if (Array.isArray(respuesta.data)) return respuesta.data;
    return [];
};

// ============================================================================
// SERVICIOS (API) - Sin incluir '/api' duplicado
// ============================================================================
const limpiarPayload = (datos) => {
    const payload = { ...datos };
    ['id', 'modelo', 'marca', 'categoria'].forEach(k => delete payload[k]);
    return payload;
};

const crearProducto = (datos) => api.post('/productos', limpiarPayload(datos));
const actualizarProducto = (id, datos) => api.put(`/productos/${id}`, limpiarPayload(datos));
const eliminarProducto = (id) => api.delete(`/productos/${id}/hard`);


// ============================================================================
// CONSTANTES Y ESTADOS INICIALES
// ============================================================================
const INITIAL_FORM = {
    nombre: "", descripcion: "", categoriaId: "", categoria: "", precio: "",
    almacenamientoGb: "", stock: "", pesoG: "",
    modeloId: "", modelo: "", marcaId: "", marca: ""
};


// ============================================================================
// COMPONENTES UI REUTILIZABLES
// ============================================================================
const Mensaje = ({ error, exito }) => {
    if (!error && !exito) return null;
    const tipoClase = error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800';
    return <div className={`rounded-xl border p-4 text-sm font-medium mb-4 ${tipoClase}`}>{error || exito}</div>;
};

const CampoForm = ({ label, as: Tag = 'input', children, ...props }) => (
    <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
        <Tag {...props} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            {children}
        </Tag>
    </div>
);

const ModalForm = ({ modal, onChange, onAgregarNuevo, onSubmit, onClose, marcas = [], modelos = [], categorias = [] }) => {
    if (!modal.abierto) return null;
    const { id, form, soloLectura } = modal;
    
    // Aseguramos que siempre sean arreglos iterables (.map)
    const arrCategorias = extraerArray(categorias);
    const arrMarcas = extraerArray(marcas);
    const arrModelos = extraerArray(modelos);

    const modelosFiltrados = form.marcaId ? arrModelos.filter(m => m.marcaId == form.marcaId) : [];

    const handleSelectChange = (e, tipo) => {
        if (e.target.value === '__NUEVO__') {
            onAgregarNuevo(tipo);
        } else {
            onChange(e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h3 className="text-lg font-bold">{soloLectura ? 'Detalle del producto' : `${id ? 'Editar' : 'Nuevo'} producto`}</h3>
                    <button type="button" onClick={onClose} className="text-slate-400 text-2xl hover:text-slate-600">&times;</button>
                </div>
                <form onSubmit={onSubmit} className="p-6 grid gap-4 sm:grid-cols-2">
                    <CampoForm label="Nombre" name="nombre" value={form.nombre} onChange={onChange} required disabled={soloLectura} />
                    
                    <CampoForm label="Categoría" as="select" name="categoriaId" value={form.categoriaId} onChange={e => handleSelectChange(e, 'categoria')} required disabled={soloLectura}>
                        <option value="">Seleccionar...</option>
                        {arrCategorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        <option value="__NUEVO__" className="font-semibold text-indigo-600">+ Agregar nueva categoría</option>
                    </CampoForm>

                    <CampoForm label="Marca" as="select" name="marcaId" value={form.marcaId} onChange={e => handleSelectChange(e, 'marca')} required disabled={soloLectura}>
                        <option value="">Seleccionar...</option>
                        {arrMarcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        <option value="__NUEVO__" className="font-semibold text-indigo-600">+ Agregar nueva marca</option>
                    </CampoForm>

                    <CampoForm label="Modelo" as="select" name="modeloId" value={form.modeloId} onChange={e => handleSelectChange(e, 'modelo')} required disabled={soloLectura}>
                        <option value="">Seleccionar...</option>
                        {modelosFiltrados.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        <option value="__NUEVO__" className="font-semibold text-indigo-600">+ Agregar nuevo modelo</option>
                    </CampoForm>

                    <CampoForm label="Precio" type="number" name="precio" value={form.precio} onChange={onChange} required disabled={soloLectura} />
                    <CampoForm label="Stock" type="number" name="stock" value={form.stock} onChange={onChange} required disabled={soloLectura} />
                    
                    <CampoForm label="Almacenamiento (GB)" as="select" name="almacenamientoGb" value={form.almacenamientoGb} onChange={onChange} required disabled={soloLectura}>
                        <option value="">Seleccionar...</option>
                        {['32', '64', '128', '256', '512', '1024'].map(v => <option key={v} value={v}>{v} GB</option>)}
                    </CampoForm>
                    
                    <CampoForm label="Peso (g)" type="number" name="pesoG" value={form.pesoG} onChange={onChange} required disabled={soloLectura} />
                    
                    <div className="col-span-2">
                        <CampoForm label="Descripción" as="textarea" name="descripcion" value={form.descripcion} onChange={onChange} required={!id} disabled={soloLectura} />
                    </div>
                    
                    <div className="col-span-2 mt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100">{soloLectura ? 'Cerrar' : 'Cancelar'}</button>
                        {!soloLectura && <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Guardar</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

const TablaProductos = ({ productos = [], puedeEscribir, onView, onEdit, onDelete }) => {
    const arrProductos = extraerArray(productos);
    
    return (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm mt-6">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700">
                    <tr>
                        {['ID', 'Nombre', 'Marca', 'Modelo', 'Precio', 'Stock', 'Categoría', 'Acciones'].map(h => (
                            <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {!arrProductos.length ? (
                        <tr><td colSpan="8" className="p-8 text-center text-slate-500">No hay productos registrados.</td></tr>
                    ) : arrProductos.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 text-slate-600">
                            <td className="px-4 py-3">{p.id}</td>
                            <td className="px-4 py-3 font-medium text-slate-900">{p.nombre}</td>
                            <td className="px-4 py-3">{p.marca || '-'}</td>
                            <td className="px-4 py-3">{p.modelo || '-'}</td>
                            <td className="px-4 py-3">${p.precio != null ? Number(p.precio).toFixed(2) : '-'}</td>
                            <td className="px-4 py-3">{p.stock || '-'}</td>
                            <td className="px-4 py-3">{p.categoria || '-'}</td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap items-center gap-1">
                                <button type="button" onClick={() => onView(p)} title="Ver detalle" aria-label={`Ver detalle de ${p.nombre}`} className="inline-flex items-center gap-1 rounded px-2 py-1 font-medium text-indigo-600 hover:bg-indigo-50">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Ver
                                </button>
                                {puedeEscribir && (
                                    <>
                                        <button type="button" onClick={() => onEdit(p)} title="Editar" aria-label={`Editar ${p.nombre}`} className="inline-flex items-center gap-1 rounded px-2 py-1 font-medium text-blue-600 hover:bg-blue-50">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar
                                        </button>
                                        <button type="button" onClick={() => onDelete(p.id)} title="Eliminar" aria-label={`Eliminar ${p.nombre}`} className="inline-flex items-center gap-1 rounded px-2 py-1 font-medium text-red-600 hover:bg-red-50">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Eliminar
                                        </button>
                                    </>
                                )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function AdminProductos() {
    const { puedeEscribir } = useAdminAuth();
    
    const [data, setData] = useState({ productos: [], marcas: [], modelos: [], categorias: [] });
    const [msj, setMsj] = useState({ error: '', exito: '' });
    const [cargando, setCargando] = useState(true);
    const [modal, setModal] = useState({ abierto: false, id: null, form: INITIAL_FORM, soloLectura: false });

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const [prodRes, marcRes, modRes, catRes] = await Promise.all([
                api.get('/productos').catch(() => null),
                api.get('/marcas').catch(() => null),
                api.get('/modelos').catch(() => null),
                api.get('/categorias').catch(() => null)
            ]);

            setData({ 
                productos: extraerArray(prodRes), 
                marcas: extraerArray(marcRes), 
                modelos: extraerArray(modRes), 
                categorias: extraerArray(catRes) 
            });
        } catch (err) {
            setMsj({ error: err.message || 'Error al cargar los datos.', exito: '' });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargarDatos(); }, [puedeEscribir]);

    const abrirModal = (prod = null, soloLectura = false) => {
        setModal({ abierto: true, id: prod?.id || null, form: prod ? { ...INITIAL_FORM, ...prod } : INITIAL_FORM, soloLectura });
        setMsj({ error: '', exito: '' });
    };

    const cerrarModal = () => setModal({ abierto: false, id: null, form: INITIAL_FORM, soloLectura: false });

    const handleChange = (e) => setModal(m => ({ ...m, form: { ...m.form, [e.target.name]: e.target.value } }));

    const handleAgregarNuevo = async (tipo) => {
        if (tipo === 'modelo' && !modal.form.marcaId) {
            alert('Por favor, selecciona primero una marca para poder agregar un modelo.');
            return;
        }

        const nombre = window.prompt(`Ingrese el nombre de la nueva ${tipo}:`);
        if (!nombre?.trim()) return;

        const endpoints = {
            categoria: '/categorias',
            marca: '/marcas',
            modelo: '/modelos'
        };

        const payload = tipo === 'modelo' 
            ? { nombre: nombre.trim(), marcaId: modal.form.marcaId }
            : { nombre: nombre.trim() };

        try {
            const res = await api.post(endpoints[tipo], payload);
            const nuevaEntidad = res?.data || res;
            
            await cargarDatos();
            
            if (nuevaEntidad?.id) {
                setModal(m => ({
                    ...m,
                    form: { ...m.form, [`${tipo}Id`]: nuevaEntidad.id }
                }));
            }
        } catch (err) {
            setMsj({ error: err.message || `Error al crear ${tipo}.`, exito: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsj({ error: '', exito: '' });

        const payloadFinal = {
            ...modal.form,
            precio: parseFloat(modal.form.precio) || 0,
            stock: parseInt(modal.form.stock, 10) || 0,
            pesoG: parseInt(modal.form.pesoG, 10) || 0,
            almacenamientoGb: parseInt(modal.form.almacenamientoGb, 10) || 0,
            categoriaId: Number(modal.form.categoriaId),
            marcaId: Number(modal.form.marcaId),
            modeloId: Number(modal.form.modeloId),
        };

        try {
            modal.id ? await actualizarProducto(modal.id, payloadFinal) : await crearProducto(payloadFinal);
            setMsj({ error: '', exito: `Producto ${modal.id ? 'actualizado' : 'creado'} con éxito.` });
            cerrarModal();
            cargarDatos();
        } catch (err) {
            setMsj({ error: err.message || 'Error al guardar.', exito: '' });
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await eliminarProducto(id);
            setMsj({ error: '', exito: 'Producto eliminado correctamente.' });
            cargarDatos();
        } catch (err) {
            setMsj({ error: err.message || 'Error al eliminar.', exito: '' });
        }
    };

    if (cargando) return <div className="flex min-h-[40vh] items-center justify-center text-slate-500 font-medium">Cargando Productos...</div>;

    return (
        <div>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Productos</h2>
                    <p className="text-sm text-slate-600">
                        {puedeEscribir ? 'Gestioná los productos del panel.' : 'Vista de solo lectura del listado.'}
                    </p>
                </div>
                {puedeEscribir && (
                    <button onClick={() => abrirModal()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        + Nuevo producto
                    </button>
                )}
            </div>

            <Mensaje error={msj.error} exito={msj.exito} />

            <TablaProductos 
                productos={data.productos} 
                puedeEscribir={puedeEscribir} 
                onView={p => abrirModal(p, true)}
                onEdit={abrirModal} 
                onDelete={handleEliminar} 
            />

            <ModalForm 
                modal={modal} 
                marcas={data.marcas} 
                modelos={data.modelos}
                categorias={data.categorias}
                onChange={handleChange} 
                onAgregarNuevo={handleAgregarNuevo}
                onSubmit={handleSubmit} 
                onClose={cerrarModal} 
            />
        </div>
    );
}
