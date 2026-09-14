// App.jsx es el componente principal de la aplicación.
//
// Aquí se configura el enrutamiento general. La clave está en separar dos
// zonas con necesidades distintas:
//
// 1. Sitio público (/, /empresa, /servicios, /login, etc.):
//    - Usa el AuthProvider de clientes.
//    - Muestra Header y Footer.
//
// 2. Panel de administración (/admin/*):
//    - Usa su propio AdminAuthProvider (token, sesión y roles separados).
//    - Tiene su propio layout con sidebar (AdminLayout).
//    - No muestra el Header ni Footer del sitio público.
//
// De esta forma un token de cliente nunca puede usarse en /admin y viceversa.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import RutaProtegida from './components/auth/RutaProtegida.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Inicio from './pages/Inicio.jsx';
import Catalogo from './pages/Catalogo.jsx';
import Servicios from './pages/Servicios.jsx';
import ServiciosIndex from './pages/servicios/ServiciosIndex.jsx';
import DisenoWeb from './pages/servicios/DisenoWeb.jsx';
import DesarrolloApps from './pages/servicios/DesarrolloApps.jsx';
import SoftwareGestion from './pages/servicios/SoftwareGestion.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Perfil from './pages/Perfil.jsx';
import AdminRoutes from './pages/admin/AdminRoutes.jsx';
import { BusquedaProvider } from './context/BusquedaContext.jsx';
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
          
          <Route path="/servicios" element={<Servicios />}>
            <Route index element={<ServiciosIndex />} />
            <Route path="diseno-web" element={<DisenoWeb />} />
            <Route path="desarrollo-apps" element={<DesarrolloApps />} />
            <Route path="software-gestion" element={<SoftwareGestion />} />
          </Route>
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
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
      <BusquedaProvider>
      <BrowserRouter>
        <Routes>
          {/* Cualquier ruta que empiece con /admin entra en esta rama.
              AdminAuthProvider envuelve todo el área de admin, de modo que
              cualquier componente de /admin puede acceder a useAdminAuth().
              AdminRoutes es un segundo <Routes> con las rutas internas. */}
          <Route
            path="/admin/*"
            element={
              <AdminAuthProvider>
                <AdminRoutes />
              </AdminAuthProvider>
            }
          />

          {/* Sitio público con Header y Footer */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </BrowserRouter>
      </BusquedaProvider>
    </AuthProvider>
  );
}

export default App;
