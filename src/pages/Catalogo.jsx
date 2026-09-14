// Catalogo.jsx - Página de catálogo con filtros y búsqueda

import { useState } from 'react';
import { useBusqueda } from '../context/BusquedaContext.jsx';

function Catalogo() {
    const { busqueda } = useBusqueda();
    const [marcaSeleccionada, setMarcaSeleccionada] = useState([]);
    const [almacenamiento, setAlmacenamiento] = useState('128GB');
   

    const productos = [
        {
            id: 1,
            marca: 'APPLE',
            nombre: 'iPhone 15 Pro',
            precio: '$1,199.00',
            imagen: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
            etiqueta: 'NUEVO',
            colorEtiqueta: 'bg-teal-800',
            colores: true,
        },
        {
            id: 2,
            marca: 'SAMSUNG',
            nombre: 'Galaxy S24 Ultra',
            precio: '$1,299.00',
            imagen: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 3,
            marca: 'XIAOMI',
            nombre: 'Xiaomi 14',
            precio: '$899.00',
            precioAnterior: '$1,049.00',
            imagen: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
            etiqueta: 'OFERTA',
            colorEtiqueta: 'bg-amber-800',
        },
        {
            id: 4,
            marca: 'GOOGLE',
            nombre: 'Pixel 8 Pro',
            precio: '$999.00',
            imagen: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 5,
            marca: 'APPLE',
            nombre: 'iPhone 14',
            precio: '$799.00',
            imagen: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 6,
            marca: 'SAMSUNG',
            nombre: 'Galaxy A54',
            precio: '$449.00',
            imagen: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 7,
            marca: 'XIAOMI',
            nombre: 'Redmi Note 13',
            precio: '$299.00',
            imagen: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 8,
            marca: 'NOTHING',
            nombre: 'Phone (2)',
            precio: '$599.00',
            imagen: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 9,
            marca: 'APPLE',
            nombre: 'iPhone 13',
            precio: '$599.00',
            imagen: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 10,
            marca: 'SAMSUNG',
            nombre: 'Galaxy S23',
            precio: '$799.00',
            imagen: 'https://images.unsplash.com/photo-1678911820864-e5c18f8f7c5c?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 11,
            marca: 'XIAOMI',
            nombre: 'Poco F5 Pro',
            precio: '$499.00',
            imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 12,
            marca: 'APPLE',
            nombre: 'iPhone SE',
            precio: '$429.00',
            imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        },
    ];

    const cambiarMarca = (marca) => {
        if (marcaSeleccionada.includes(marca)) {
            setMarcaSeleccionada(marcaSeleccionada.filter((item) => item !== marca));
        } else {
            setMarcaSeleccionada([...marcaSeleccionada, marca]);
        }
    };

    // FILTRO COMBINADO: BÚSQUEDA + MARCAS
    const productosFiltrados = productos.filter((producto) => {
        // Coincidencia con la búsqueda (nombre o marca)
        const coincideBusqueda =
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            producto.marca.toLowerCase().includes(busqueda.toLowerCase());

        // Coincidencia con las marcas seleccionadas
        const coincideMarca =
            marcaSeleccionada.length === 0 ||
            marcaSeleccionada.includes(producto.marca);

        // Ambos filtros deben cumplirse
        return coincideBusqueda && coincideMarca;
    });

    return (
        <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8 lg:px-12">

            {/* BREADCRUMB */}
            <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                <span>Inicio</span>
                <span>›</span>
                <span className="font-medium text-slate-700">
                    Celulares
                </span>
            </div>

            <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">

                {/* ================= FILTROS ================= */}
                <aside className="h-fit w-full rounded-xl border border-slate-300 bg-white p-5 shadow-sm lg:w-64">
                    <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <span>☷</span>
                        Filtros
                    </h2>

                    {/* MARCAS */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-xs font-semibold tracking-widest text-slate-600">
                            MARCAS
                        </h3>

                        {['APPLE', 'SAMSUNG', 'XIAOMI'].map((marca) => (
                            <label key={marca} className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={marcaSeleccionada.includes(marca)}
                                    onChange={() => cambiarMarca(marca)}
                                    className="h-4 w-4 rounded border-slate-300 accent-teal-700"
                                />
                                {marca.charAt(0) + marca.slice(1).toLowerCase()}
                            </label>
                        ))}
                    </div>

                    {/* PRECIO */}
                    <div className="mb-8">
                        <h3 className="mb-5 text-xs font-semibold tracking-widest text-slate-600">
                            RANGO DE PRECIO
                        </h3>
                        <input
                            type="range"
                            min="200"
                            max="2500"
                            defaultValue="1200"
                            className="w-full accent-teal-800"
                        />
                        <div className="mt-3 flex justify-between text-xs text-slate-600">
                            <span>$200</span>
                            <span>$2500</span>
                        </div>
                    </div>

                    {/* ALMACENAMIENTO */}
                    <div>
                        <h3 className="mb-4 text-xs font-semibold tracking-widest text-slate-600">
                            ALMACENAMIENTO
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {['64GB', '128GB', '256GB', '512GB'].map((capacidad) => (
                                <button
                                    key={capacidad}
                                    onClick={() => setAlmacenamiento(capacidad)}
                                    className={`rounded border px-3 py-2 text-xs font-medium transition ${
                                        almacenamiento === capacidad
                                            ? 'border-teal-800 bg-teal-800 text-white'
                                            : 'border-slate-300 bg-white text-slate-600 hover:border-teal-700'
                                    }`}
                                >
                                    {capacidad}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ================= PRODUCTOS ================= */}
                <section className="flex-1">

                    {/* CABECERA */}
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <p className="text-sm text-slate-500">
                            Mostrando <span className="font-semibold text-slate-800">{productosFiltrados.length}</span> de <span className="font-semibold text-slate-800">{productos.length}</span> celulares
                            {busqueda && (
                                <span className="ml-2 text-teal-600">
                                    para "{busqueda}"
                                </span>
                            )}
                        </p>

                        <select className="cursor-pointer border-none bg-transparent text-sm text-slate-600 outline-none">
                            <option>Más recientes</option>
                            <option>Menor precio</option>
                            <option>Mayor precio</option>
                            <option>Más vendidos</option>
                        </select>
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                                <article key={producto.id} className="group overflow-hidden rounded-lg border border-slate-300 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                                    {/* IMAGEN */}
                                    <div className="relative flex h-56 items-center justify-center bg-slate-100 p-6">

                                        {producto.etiqueta && (
                                            <span className={`absolute left-3 top-3 z-10 px-3 py-2 text-[10px] font-bold tracking-widest text-white ${producto.colorEtiqueta}`}>
                                                {producto.etiqueta}
                                            </span>
                                        )}

                                        <img
                                            src={producto.imagen}
                                            alt={producto.nombre}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* INFORMACIÓN */}
                                    <div className="p-4">
                                        <p className="mb-2 text-[10px] font-semibold tracking-widest text-teal-800">
                                            {producto.marca}
                                        </p>
                                        <h3 className="mb-3 text-base font-medium text-slate-800">
                                            {producto.nombre}
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-semibold text-slate-800">
                                                {producto.precio}
                                            </p>

                                            {producto.precioAnterior && (
                                                <span className="text-xs text-slate-400 line-through">
                                                    {producto.precioAnterior}
                                                </span>
                                            )}

                                            {producto.colores && (
                                                <div className="flex gap-1">
                                                    <span className="h-3 w-3 rounded-full bg-slate-900"></span>
                                                    <span className="h-3 w-3 rounded-full bg-slate-300"></span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            // Mensaje cuando no hay resultados
                            <div className="col-span-full py-12 text-center">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                    No encontramos resultados
                                </h3>
                                <p className="text-slate-500">
                                    No hay productos que coincidan con "{busqueda}"
                                </p>
                                <p className="text-sm text-slate-400 mt-1">
                                    Prueba con otras palabras o revisa los filtros
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Catalogo;