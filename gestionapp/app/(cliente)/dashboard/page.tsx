export default function Dashboard() {
  return (
    <div>

      {/* morado */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-8 rounded-3xl shadow-lg mb-8">

        <h2 className="text-3xl font-bold mb-2">
          Bienvenido 👋
        </h2>

        <p className="opacity-90">
          Gestiona tus reservas y pagos fácilmente.
        </p>

      </div>

      {/* cars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-400 mb-2">
            Membresía
          </p>

          <h3 className="text-2xl font-bold text-green-500">
            Activa
          </h3>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-400 mb-2">
            Próximo entrenamiento
          </p>

          <h3 className="text-2xl font-bold">
            Viernes
          </h3>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-400 mb-2">
            Estado Pagos
          </p>

          <h3 className="text-2xl font-bold text-purple-600">
            Al día
          </h3>

        </div>

      </div>

    </div>
  );
}