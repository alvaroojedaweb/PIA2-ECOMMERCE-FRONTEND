// Form.jsx muestra el formulario para crear o editar un registro.
// Maneja su propio estado interno con los valores de los campos.

import { useState } from 'react';

const Form = ({ activeTab, item, onSave, onCancel }) => {
  // isProducto nos dice si estamos en la pestaña de productos o usuarios.
  const isProducto = activeTab === 'productos';

  // isEdit es true si recibimos un item existente para editar.
  // item === null significa que estamos creando uno nuevo.
  const isEdit = !!item;

  // Estado local del formulario.
  // Si item existe, lo usamos como valores iniciales; si no, empezamos con campos vacíos.
  const [form, setForm] = useState(
    item || {
      nombre: '',
      precio: '',
      categoria: '',
      stock: '',
      descripcion: '',
      apellido: '',
      email: '',
      edad: '',
      telefono: '',
      direccion: '',
    }
  );

  // Cada vez que el usuario escribe en un campo, actualizamos el estado.
  // Usamos spread (...) para copiar el estado anterior y solo cambiar el campo modificado.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Al enviar el formulario, prevenimos el comportamiento por defecto del navegador
  // y llamamos a onSave con los datos listos para enviar al backend.
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = isProducto
      ? {
        nombre: form.nombre,
        precio: Number(form.precio),
        categoria: form.categoria,
        stock: Number(form.stock),
        descripcion: form.descripcion,
      }
      : {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        edad: Number(form.edad),
        telefono: form.telefono,
        direccion: form.direccion,
      };

    onSave(payload);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Editar' : 'Nuevo'} {isProducto ? 'producto' : 'usuario'}</h2>

      <div className="form-row">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>

      {/* Mostramos los campos correspondientes al recurso activo. */}
      {isProducto ? (
        <>
          <div className="form-row">
            <label htmlFor="precio">Precio</label>
            <input
              id="precio"
              name="precio"
              type="number"
              step="0.01"
              value={form.precio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="categoria">Categoría</label>
            <input
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>
        </>
      ) : (
        <>
          <div className="form-row">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="edad">Edad</label>
            <input
              id="edad"
              name="edad"
              type="number"
              value={form.edad}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="direccion">Dirección</label>
            <input
              id="direccion"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <div className="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default Form;
