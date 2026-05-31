"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const handleRegister = async () => {

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: errorInsert } = await supabase
        .from("usuarios")
        .insert([
          {
            id: user.id,
            email,
            nombre,
            rol: "cliente",
            foto_perfil:
              "/avatars/avatar1.png",
          },
        ]);

      if (errorInsert) {
        alert("Error guardando datos");
        return;
      }
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex h-screen">
      
      {/* 🔹 lado izqui */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10">
        
        <h1 className="text-3xl font-bold mb-4">
          ¡Crea tu cuenta!
        </h1>

        <p className="text-gray-500 mb-6">
          Completa tus datos para comenzar
        </p>

        <div className="absolute top-6 left-6">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-100 p-2 rounded-full hover:bg-purple-500 hover:text-white transition"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* nombre */}
        <input
          type="text"
          placeholder="Nombre"
          className="border p-3 rounded mb-3 w-full"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        {/* email */}
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded mb-3 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="border p-3 rounded mb-3 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* boton */}
        <button
          onClick={handleRegister}
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded font-semibold hover:opacity-90 transition"
        >
          Registrarme
        </button>

        <p className="mt-4 text-sm">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-purple-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Inicia sesión
          </span>
        </p>
      </div>

      {/* imagen derecha */}
      <div className="hidden md:block w-1/2 relative">

        <img
          src="/registerff.png"
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