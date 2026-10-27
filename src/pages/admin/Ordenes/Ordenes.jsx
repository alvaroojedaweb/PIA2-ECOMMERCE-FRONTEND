import Registros from "./Registros";

export default function AdminOrdenes() {
  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Productos</h2>
          <p className="text-sm text-slate-600">
            Gestioná las ordenes de compra.
          </p>
        </div>
      </div>

      <Registros />
    </div>
  );
}
