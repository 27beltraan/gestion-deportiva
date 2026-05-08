"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import Image from "next/image";

import { ArrowLeft } from "lucide-react";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    // buscar usuario en tabla usuarios
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (usuarioError) {
      alert("No se encontró el usuario");
      return;
    }

    // verificar rol
    if (usuario?.rol === "admin") {

      router.push("/dashboard-admin");

    } else {

      router.push("/dashboard");

    }
  };

  return (
    <div className="flex min-h-screen">

      {/* izqui */}
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

      {/* dere */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10 relative">

        {/* volver*/}
        <div className="absolute top-6 left-6">
  <button
    onClick={() => router.push("/")}
    className="bg-gray-100 p-2 rounded-full hover:bg-purple-500 hover:text-white transition"
  >
    <ArrowLeft size={20} />
  </button>
</div>

        <div className="w-full max-w-md">

          <h2 className="text-4xl font-bold mb-2">
            Iniciar sesión
          </h2>

          <p className="text-gray-500 mb-8">
            Ingresa tus credenciales
          </p>

          {/* email */}
          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl p-4 outline-none focus:border-purple-600"
            />

          </div>

          {/* contra */}
          <div className="mb-6">

            <label className="block mb-2 font-medium">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl p-4 outline-none focus:border-purple-600"
            />

          </div>

          {/* boton */}
          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition font-medium"
          >
            Ingresar
          </button>

          {/* registrar */}
          <p className="mt-6 text-center text-gray-500">

            ¿No tienes cuenta?{" "}

            <Link
              href="/register"
              className="text-purple-600 font-medium hover:underline"
            >
              Regístrate
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}