"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  Home,
  Dumbbell,
  CreditCard,
  User,
  Bell,
  Search,
} from "lucide-react";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  const router = useRouter();

  // proteger rutas
  useEffect(() => {

    const verificarUsuario = async () => {

      const { data: authData } = await supabase.auth.getUser();

      // no logueado
      if (!authData.user) {

        router.push("/login");

        return;
      }

      setLoading(false);
    };

    verificarUsuario();

  }, []);

  // loading
  if (loading) {

    return (
      <div className="h-screen flex items-center justify-center">

        <p className="text-xl font-semibold">
          Cargando...
        </p>

      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">

      {/* sidebar */}
      <aside
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`bg-white shadow-md transition-all duration-300 flex flex-col
        ${open ? "w-64" : "w-24"}
        `}
      >

        {/* logo */}
        <div className="flex items-center justify-center p-6">

          <Image
            src="/logosecundario.png"
            alt="Logo"
            width={open ? 120 : 60}
            height={60}
            className="object-contain transition-all"
          />

        </div>

        {/* menu */}
        <nav className="flex flex-col gap-4 mt-10 px-4">

          {/* dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-4 p-4 rounded-xl transition w-full

            ${pathname === "/dashboard"
              ? "bg-purple-100 text-purple-600"
              : "text-gray-500 hover:bg-gray-100 hover:text-purple-600"
            }
            `}
          >

            <Home />

            {open && (
              <span className="font-medium">
                Inicio
              </span>
            )}

          </Link>

          {/* entrenamientos */}
          <Link
            href="/entrenamientos"
            className={`flex items-center gap-4 p-4 rounded-xl transition w-full

            ${pathname === "/entrenamientos"
              ? "bg-purple-100 text-purple-600"
              : "text-gray-500 hover:bg-gray-100 hover:text-purple-600"
            }
            `}
          >

            <Dumbbell />

            {open && (
              <span>
                Entrenamientos
              </span>
            )}

          </Link>

          {/* pagos */}
          <Link
            href="/pagos"
            className={`flex items-center gap-4 p-4 rounded-xl transition w-full

            ${pathname === "/pagos"
              ? "bg-purple-100 text-purple-600"
              : "text-gray-500 hover:bg-gray-100 hover:text-purple-600"
            }
            `}
          >

            <CreditCard />

            {open && (
              <span>
                Pagos
              </span>
            )}

          </Link>

          {/* perfil */}
          <Link
            href="/perfil"
            className={`flex items-center gap-4 p-4 rounded-xl transition w-full

            ${pathname === "/perfil"
              ? "bg-purple-100 text-purple-600"
              : "text-gray-500 hover:bg-gray-100 hover:text-purple-600"
            }
            `}
          >

            <User />

            {open && (
              <span>
                Perfil
              </span>
            )}

          </Link>

        </nav>

      </aside>

      {/* contenido */}
      <main className="flex-1 p-8">

        {/* TOPBAR */}
        <div className="flex justify-between items-center mb-8">

          {/* buscar*/}
          <div className="flex items-center bg-white px-4 py-3 rounded-xl shadow w-[350px]">

            <Search className="text-gray-400 w-5 h-5" />

            <input
              type="text"
              placeholder="Buscar..."
              className="ml-3 outline-none w-full"
            />

          </div>

          {/* perfil */}
          <div className="flex items-center gap-4">

            <Bell className="text-gray-500" />

            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow">

              <div className="w-10 h-10 bg-purple-500 rounded-full"></div>

              <div>

                <p className="font-semibold">
                  Cliente
                </p>

                <p className="text-sm text-gray-400">
                  Usuario
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* CONTENIDO */}
        {children}

      </main>

    </div>
  );
}