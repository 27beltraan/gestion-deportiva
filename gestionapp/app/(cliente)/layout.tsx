"use client";

import Link from "next/link";

import {
  Home,
  CreditCard,
  Dumbbell,
  User,
  LogOut,
  FileText,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

interface Usuario {

  nombre: string;

  email: string;

  foto_perfil: string;
}

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router =
    useRouter();

  const [usuario,
    setUsuario] =
    useState<Usuario | null>(
      null
    );

  // OBTENER USUARIO
  useEffect(() => {

    const obtenerUsuario =
      async () => {

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) return;

        const { data } =
          await supabase
            .from("usuarios")
            .select("*")
            .eq(
              "email",
              user.email
            )
            .single();

        if (data) {

          setUsuario(data);
        }
      };

    obtenerUsuario();

  }, []);

  // LOGOUT
  const cerrarSesion =
    async () => {

      await supabase.auth.signOut();

      router.push("/login");
    };

  return (
    <div className="
      flex
      min-h-screen
      bg-[#f5f6fa]
    ">

      {/* SIDEBAR FIJA */}
      <aside className="
        fixed
        left-0
        top-0
        h-screen
        w-24
        bg-white
        shadow-lg
        flex
        flex-col
        items-center
        py-6
        gap-6
        z-50
      ">

        {/* LOGO */}
        <div className="
          mb-8
        ">

          <img
            src="/logosecundario.png"
            alt="logo"
            className="
              w-14
              h-14
              object-contain
            "
          />

        </div>

        {/* MENU */}
        <nav className="
          flex
          flex-col
          gap-4
          items-center
        ">

          <Link
            href="/dashboard"
            className="
              p-4
              rounded-2xl
              hover:bg-purple-100
              hover:text-purple-600
              transition-all
              duration-300
            "
          >
            <Home />
          </Link>

          <Link
            href="/pagos"
            className="
              p-4
              rounded-2xl
              hover:bg-purple-100
              hover:text-purple-600
              transition-all
              duration-300
            "
          >
            <CreditCard />
          </Link>

          <Link
            href="/entrenamientos"
            className="
              p-4
              rounded-2xl
              hover:bg-purple-100
              hover:text-purple-600
              transition-all
              duration-300
            "
          >
            <Dumbbell />
          </Link>

          <Link
            href="/certificados"
            className="
              p-4
              rounded-2xl
              hover:bg-purple-100
              hover:text-purple-600
              transition-all
              duration-300
            "
          >
            <FileText />
          </Link>

          <Link
            href="/perfil"
            className="
              p-4
              rounded-2xl
              hover:bg-purple-100
              hover:text-purple-600
              transition-all
              duration-300
            "
          >
            <User />
          </Link>

        </nav>

        {/* AVATAR */}
        <div className="
          mt-auto
          flex
          flex-col
          items-center
          gap-3
        ">

          <div className="
            w-14
            h-14
            rounded-full
            overflow-hidden
            border-4
            border-purple-500
            shadow-lg
          ">

            <img
              src={
                usuario?.foto_perfil ||
                "/avatars/avatar1.png"
              }
              alt="avatar"
              className="
                w-full
                h-full
                object-cover
              "
            />

          </div>

          <button
            onClick={
              cerrarSesion
            }
            className="
              p-3
              rounded-xl
              hover:bg-red-100
              text-red-500
              transition-all
            "
          >
            <LogOut size={20} />
          </button>

        </div>

      </aside>

      {/* CONTENIDO */}
      <div className="
        flex-1
        ml-24
        flex
        flex-col
      ">

        {/* PAGE */}
        <main className="
          flex-1
          p-8
        ">

          {children}

        </main>

      </div>

    </div>
  );
}