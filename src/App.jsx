import { Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'

// Páginas del Ecommerce
import Home from './pages/Home'
import LoginCliente from './pages/LoginCliente'
import LoginEmpleado from './pages/LoginEmpleado'
import RegistrationCliente from './pages/RegistrationCliente'
import PerfilCliente from './pages/PerfilCliente'
import PerfilEmpleado from './pages/PerfilEmpleado'
import Checkout from './pages/Checkout'

function App() {
  // Este estado vendrá después desde tu contexto global de autenticación
  const isAuthenticated = true; // Provisorio para probar

  return (
    <>
      <Routes>
        {/* 🌐 RUTAS PÚBLICAS (Cualquiera puede entrar) */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginCliente />} />
        <Route path='/registration' element={<RegistrationCliente />} />
        <Route path='/admin' element={<LoginEmpleado />} />

        {/* 🔒 RUTAS PROTEGIDAS (Solo usuarios autenticados) */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/perfil" element={<PerfilCliente />} />
          <Route path="/admin/perfil" element={<PerfilEmpleado />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
