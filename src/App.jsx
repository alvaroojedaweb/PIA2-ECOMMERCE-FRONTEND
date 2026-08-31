import { Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import LoginCliente from './pages/LoginCliente'
import LoginEmpleado from './pages/LoginEmpleado'
import RegistrationCliente from './pages/RegistrationCliente'

function App() {

  return (
    <>
   <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/login' element={<LoginCliente />} />
    <Route path='/registration' element={<RegistrationCliente />} />
    <Route path='/admin' element={<LoginEmpleado />} />
   </Routes>
    </>
  )
}

export default App
