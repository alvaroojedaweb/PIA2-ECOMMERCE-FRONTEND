import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import RutaProtegida from './components/auth/RutaProtegida.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Inicio from './pages/Inicio.jsx';
import Catalogo from './pages/Catalogo.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Perfil from './pages/Perfil.jsx';
import AdminRoutes from './pages/admin/AdminRoutes.jsx';
import { BusquedaProvider } from './context/BusquedaContext.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import Carrito from './pages/Carrito.jsx';
import './App.css';

// PublicLayout agrupa todas las rutas públicas con el mismo Header, Footer
// y estilo. Dentro contiene otro <Routes> con las rutas del sitio.
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-700">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <Perfil />
              </RutaProtegida>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BusquedaProvider>
          <BrowserRouter>
            <Routes>
              {/* Rama de administración */}
              <Route
                path="/admin/*"
                element={
                  <AdminAuthProvider>
                    <AdminRoutes />
                  </AdminAuthProvider>
                }
              />
              {/* Rama pública */}
              <Route path="/*" element={<PublicLayout />} />
            </Routes>
          </BrowserRouter>
        </BusquedaProvider>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;