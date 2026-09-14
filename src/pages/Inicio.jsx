import { useNavigate } from 'react-router-dom';


function Inicio() {
const navigate = useNavigate();


    const productos = [
        {
            id: 1,
            marca: 'Apple',
            nombre: 'iPhone 15 Pro',
            precio: '$999.00',
            imagen: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 2,
            marca: 'Samsung',
            nombre: 'Galaxy S24 Ultra',
            precio: '$1,199.00',
            imagen: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 3,
            marca: 'Google',
            nombre: 'Pixel 8 Pro',
            precio: '$899.00',
            imagen: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 4,
            marca: 'Apple',
            nombre: 'iPad Air',
            precio: '$599.00',
            imagen: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 5,
            marca: 'Sony',
            nombre: 'WF-1000XM5',
            precio: '$299.00',
            imagen: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 6,
            marca: 'Apple',
            nombre: 'Apple Watch S9',
            precio: '$399.00',
            imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 7,
            marca: 'Bose',
            nombre: 'QuietComfort Ultra',
            precio: '$429.00',
            imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 8,
            marca: 'Marshall',
            nombre: 'Emberton II',
            precio: '$169.00',
            imagen: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80'
        }
    ];

    return (

        <main className="w-full bg-[#f5f7fc]">

            {/* HERO*/}

            <section
                className=" relative h-[370px] bg-cover bg-center flex items-center text-white"
                style={{
                    backgroundImage: `linear-gradient( 90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.25)),
                        url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1800&q=85')`
                }}
            >

                {/* CONTENIDO DEL HERO */}

                <div className="w-full max-w-[1200px] mx-auto px-8">

                    <h1 className="text-[42px] leading-[1.1] font-bold mb-5">
                        Los mejores equipos
                        <br />
                        están aquí
                    </h1>

                    <p className="text-base mb-6">
                        Descubre la nueva generación de conectividad y potencia.
                    </p>

                    <button
                        onClick={() => navigate('/catalogo')}
                        className="bg-[#008b83] hover:bg-[#006f69] text-white px-6 py-3 rounded text-sm transition duration-200">
                        Explorar ahora
                    </button>

                </div>


                {/* INDICADORES */}

                <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 "
                >

                    <span className="w-5 h-[3px] bg-[#00a89d] rounded"></span>

                    <span className="w-5 h-[3px] bg-gray-300 rounded"></span>

                    <span className="w-5 h-[3px] bg-gray-300 rounded"></span>

                </div>

            </section>


            {/*CATEGORÍAS */}

            <section
                className=" max-w-[1200px] mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-5" >

                {/* CELULARES */}

                <div
                    className=" relative h-[185px] overflow-hidden rounded-md group " >

                    <img
                        src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80"
                        alt="Celulares"
                        className=" w-full h-fullobject-cover transition duration-300 group-hover:scale-105" />

                    {/* OSCURECER IMAGEN */}

                    <div
                        className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"> </div>


                    {/* TEXTO */}

                    <div
                        className=" absolute left-5 bottom-5 text-white"
                    >

                        <h2 className="text-lg font-semibold">
                            Celulares
                        </h2>

                        <p className="text-xs mb-3">
                            Lo último en tecnología móvil
                        </p>

                        <button className="text-xs hover:underline">
                            Ver catálogo →
                        </button>

                    </div>

                </div>


                {/* ACCESORIOS */}

                <div
                    className=" relative h-[185px] overflow-hidden rounded-md group"
                >

                    <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
                        alt="Accesorios"
                        className=" w-full h-full object-cover transition duration-300 group-hover:scale-105"  />

                    <div className=" absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" ></div>

                    <div className="absolute left-5 bottom-5 text-white">

                        <h2 className="text-lg font-semibold">
                            Accesorios
                        </h2>

                        <p className="text-xs mb-3">
                            Complementa tu experiencia
                        </p>

                        <button className="text-xs hover:underline">
                            Ver catálogo →
                        </button>

                    </div>

                </div>

            </section>


            {/* PRODUCTOS*/}

            <section className="bg-[#edf3ff] px-8 py-12">

                {/* HEADER PRODUCTOS */}

                <div
                    className=" max-w-[1200px] mx-auto mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"   >
                  <div>

                        <span  className="  block text-[#006e69] text-[11px] tracking-[2px] mb-2"  >
                            SELECCIÓN PREMIUM
                        </span>

                        <h2 className="text-2xl font-medium text-gray-900">
                            Los más vendidos
                        </h2>

                    </div>

                    <button
                        onClick={() => navigate('/catalogo')}
                        className=" text-[#006e69] text-sm hover:underline">
                        Ver todos los productos →
                    </button>

                </div>


                {/* GRID */}

                <div
                    className="   max-w-[1200px]mx-auto  grid  grid-cols-1 sm:grid-cols-2   lg:grid-cols-4  gap-4 " >

                    {productos.map((producto) => (

                        <article
                            key={producto.id}
                            className=" bg-white rounded p-4  transition duration-200 hover:-translate-y-1 hover:shadow-lg " >

                            {/* IMAGEN */}

                            <div
                                className=" h-[150px] bg-[#eef3fc] p-3 mb-4  flex items-center justify-center " >

                      <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className=" w-full h-full object-contain " />
                                      </div>

                            {/* INFORMACIÓN */}
                            <div>

                                <span className="text-[11px] text-gray-500">
                                    {producto.marca}
                                </span>

                                <h3
                                    className=" text-sm text-gray-900  font-medium  mt-1  mb-2 "  >
                                    {producto.nombre}
                                </h3>

                                <strong
                                    className=" block text-[#006e69] text-sm mb-4 "  >
                                    {producto.precio}
                                </strong>

                                <button
                                    className="text-xs  text-gray-500 hover:text-[#006e69] transition "  >
                                    Ver más →
                                </button>

                            </div>

                        </article>

                    ))}

                </div>

            </section>

        </main>
    );
}

export default Inicio;