"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  LayoutDashboard,
  CreditCard,
  Users,
  Dumbbell,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const verificarAdmin = async () => {

      // usuario auth
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/login");
        return;
      }

      // usuario tabla
      const { data: usuario } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", authData.user.email)
        .single();

      // si NO es admin
      if (usuario?.rol !== "admin") {

        router.push("/dashboard");

        return;
      }

      setLoading(false);
    };

    verificarAdmin();

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
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white p-6">

        <h1 className="text-2xl font-bold mb-10">
          Admin Panel
        </h1>

        <nav className="space-y-4">

          <Link
            href="/dashboard-admin"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            href="/pagos-admin"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition"
          >
            <CreditCard size={20} />
            Pagos
          </Link>

          <Link
            href="/usuarios-admin"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition"
          >
            <Users size={20} />
            Usuarios
          </Link>

          <Link
            href="/entrenamientos-admin"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition"
          >
            <Dumbbell size={20} />
            Entrenamientos
          </Link>

        </nav>

      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}