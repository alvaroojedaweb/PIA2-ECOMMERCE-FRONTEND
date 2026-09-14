// Admin.jsx contiene el panel de gestión para administradores.
// Permite alternar entre el modo simple y el modo CRUD.
// Más adelante esta ruta se protegerá para usuarios con rol admin.

import { useState } from 'react';
import Tabs from '../components/crud/layout/Tabs.jsx';
import CrudPanel from '../components/crud/CrudPanel.jsx';
import SimplePanel from '../components/simple/SimplePanel.jsx';
import '../App.css';

// El modo inicial se puede definir desde el archivo .env con VITE_APP_MODE.
// Si no está definido, arrancamos en modo simple.
const DEFAULT_MODE = import.meta.env.VITE_APP_MODE || 'simple';

function Admin() {
    // useState nos permite guardar información que cambia con el tiempo.
    // activeTab guarda la pestaña activa: 'productos' o 'usuarios'.
    const [activeTab, setActiveTab] = useState('productos');

    // mode guarda el modo actual de la app: 'simple' o 'crud'.
    const [mode, setMode] = useState(DEFAULT_MODE);

    const isCrud = mode === 'crud';

    return (
        <div className="container">
            <h1>Panel de gestión</h1>

            {/* Selector de modo: permite cambiar entre la versión simple y la completa. */}
            <div className="mode-toggle">
                <span>Modo:</span>
                <button
                    className={!isCrud ? 'active' : ''}
                    onClick={() => setMode('simple')}
                >
                    Simple
                </button>
                <button
                    className={isCrud ? 'active' : ''}
                    onClick={() => setMode('crud')}
                >
                    CRUD
                </button>
            </div>

            {/* Tabs muestra los botones Productos / Usuarios. */}
            <Tabs activeTab={activeTab} onChange={setActiveTab} />

            {/* Renderizamos el panel correspondiente al modo seleccionado.
                key={activeTab} fuerza a React a reiniciar el panel cuando cambia la pestaña. */}
            {isCrud ? (
                <CrudPanel key={activeTab} resource={activeTab} />
            ) : (
                <SimplePanel key={activeTab} resource={activeTab} />
            )}
        </div>
    );
}

export default Admin;
