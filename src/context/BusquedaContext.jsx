import { createContext, useContext, useState } from 'react';

const BusquedaContext = createContext();

export function BusquedaProvider({ children }) {
    const [busqueda, setBusqueda] = useState('');

    return (
        <BusquedaContext.Provider value={{ busqueda, setBusqueda }}>
            {children}
        </BusquedaContext.Provider>
    );
}

export function useBusqueda() {
    return useContext(BusquedaContext);
}