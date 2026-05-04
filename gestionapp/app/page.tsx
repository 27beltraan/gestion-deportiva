export default function Home() {
  return (
    <div className="h-screen w-full relative text-white">

      {/* fondoprincipal */}
      <div className="absolute inset-0">
        <img
          src="/portada.png"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-purple-900/60 to-transparent"></div>
      </div>

      {/* navbar */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <img src="/logoprincipal.PNG" alt="logo" className="h-30" />

        <div className="flex gap-4">
          <a href="/login" className="px-4 py-2 bg-white text-black rounded-lg">
            Iniciar Sesión
          </a>
          <a href="/register" className="px-4 py-2 border border-white rounded-lg">
            Crear Cuenta
          </a>
        </div>
      </div>

      {/* texto */}
      <div className="relative z-10 flex h-[80%] items-center px-10">

        <div className="max-w-xl">
          <h1 className="text-6xl font-bold leading-tight">
            Gestión Inteligente <br />
            para tu <span className="text-purple-400">Club.</span>
          </h1>

          <p className="mt-6 text-gray-300 text-lg">
            Automatiza procesos y optimiza la experiencia de tus socios con tecnología moderna.
          </p>

          <a href="/register">
            <button className="mt-6 px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition">
              ver
            </button>
          </a>
        </div>

      </div>
    </div>
  )
}
