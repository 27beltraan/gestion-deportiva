"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";


export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // cone subase
    if (email && password) {
      router.push("/dashboard");
    } else {
      alert("Completa los campos");
    }
  };

  return (
        
    <div className="h-screen flex">

      {/* formulari izq */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10">

        {/* logo */}
        <img
        src="/logosecundario.png"
        alt="logo"
        className="h-50 w-auto object-contain"
/>

<div className="absolute top-6 left-6">
  <button
    onClick={() => router.push("/")}
    className="bg-gray-100 p-2 rounded-full hover:bg-purple-500 hover:text-white transition"
  >
    <ArrowLeft size={20} />
  </button>
</div>

        <h1 className="text-3xl font-bold mb-2">
          ¿Listo para comenzar?
        </h1>

        <p className="text-gray-500 mb-6">
          Ingresa tus datos para acceder a tu cuenta
        </p>

        {/* email */}
        <input
          type="email"
          placeholder="Ingresa tu email"
          className="border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* contra*/}
        <input
          type="password"
          placeholder="Contraseña"
          className="border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition"
        >
          Ingresar
        </button>

        <p className="mt-4 text-sm">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-purple-500 font-semibold">
            Regístrate
          </a>
        </p>
      </div>

      {/* imagen derecha) */}
      <div className="hidden md:block w-1/2 relative">

        <img
          src="/fotoiniciarsesion.jpg"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black-600/90 to-pink-500/50"></div>

        <div className="absolute top-10 left-10 text-white max-w-xs">
          <h2 className="text-2xl font-bold">
            Controla tu club de forma inteligente
          </h2>
        </div>



      </div>
    </div>



  );
}

