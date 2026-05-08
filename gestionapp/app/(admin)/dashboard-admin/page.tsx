export default function DashboardAdmin() {
  return (
    <div>

      <h1 className="text-4xl font-bold mb-6">
        Dashboard Admin 🛠️
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">
            Usuarios
          </h2>

          <p className="text-3xl font-bold mt-2">
            24
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">
            Pagos Pendientes
          </h2>

          <p className="text-3xl font-bold mt-2 text-yellow-500">
            5
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">
            Entrenamientos
          </h2>

          <p className="text-3xl font-bold mt-2 text-purple-600">
            8
          </p>
        </div>

      </div>

    </div>
  );
}