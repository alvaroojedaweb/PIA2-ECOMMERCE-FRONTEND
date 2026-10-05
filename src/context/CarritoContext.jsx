// context/CarritoContext.jsx
// Estado global del carrito. Sincroniza con el backend si el usuario está logueado.

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar carrito al iniciar (si está logueado)
  const cargarCarrito = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    try {
      setCargando(true);
      const data = await api.get("/carrito");
      setItems(data?.data || []);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      setItems([]);
    } finally {
      setCargando(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  // Agregar producto al carrito
  const agregar = async (productoId, cantidad = 1) => {
    const data = await api.post("/carrito", { productoId, cantidad });
    // Recargar el carrito completo para tener los IDs actualizados
    await cargarCarrito();
    return data;
  };

  // Actualizar cantidad de un ítem
  const actualizar = async (itemId, cantidad) => {
    await api.put(`/carrito/${itemId}`, { cantidad });
    await cargarCarrito();
  };

  // Eliminar un ítem
  const eliminar = async (itemId) => {
    await api.delete(`/carrito/${itemId}`);
    await cargarCarrito();
  };

  // Vaciar carrito (después de comprar)
  const vaciar = () => {
    setItems([]);
  };

  // Cálculos derivados
  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.cantidad * Number(item.precio || 0),
    0
  );
  const envio = subtotal > 0 ? 0 : 0; // gratis por ahora
  const total = subtotal + envio;

  const value = {
    items,
    cargando,
    cantidadTotal,
    subtotal,
    envio,
    total,
    agregar,
    actualizar,
    eliminar,
    vaciar,
    recargar: cargarCarrito,
  };

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe ser usado dentro de un CarritoProvider");
  }
  return context;
}