// main.jsx es el punto de entrada de la aplicación React.
// Aquí le decimos a React dónde debe renderizar toda nuestra app dentro del HTML.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Buscamos el div con id="root" que está en index.html
// y creamos la "raíz" de React. A partir de ahí, React controla todo lo que se ve.
createRoot(document.getElementById('root')).render(
  // StrictMode es una herramienta de React que ayuda a detectar errores comunes.
  // En desarrollo ejecuta ciertos pasos dos veces para avisarnos si algo está mal.
  <StrictMode>
    <App />
  </StrictMode>,
)
