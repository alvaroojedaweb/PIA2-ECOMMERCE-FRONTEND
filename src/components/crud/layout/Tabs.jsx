// Tabs.jsx muestra los botones para cambiar entre Productos y Usuarios.
// El array TABS contiene las pestañas disponibles.

const TABS = [
  { id: 'productos', label: 'Productos' },
  { id: 'usuarios', label: 'Usuarios' },
];

const Tabs = ({ activeTab, onChange }) => {
  return (
    <div className="tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          // Si la pestaña es la activa, le agregamos la clase 'active' para destacarla.
          className={activeTab === tab.id ? 'active' : ''}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
