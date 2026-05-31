"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Calendar,
  Clock,
  Dumbbell,
} from "lucide-react";

interface Entrenamiento {

  id: string;

  tipo: string;

  categoria: string;

  fecha: string;

  hora: string;

  duracion: string;
}

export default function EntrenamientosCliente() {

  const [entrenamientos,
    setEntrenamientos] =
    useState<Entrenamiento[]>([]);

  const [categoriaJugador,
    setCategoriaJugador] =
    useState("");

  // OBTENER DATOS
  const obtenerEntrenamientos =
    async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      // OBTENER JUGADOR
      const { data: jugador } =
        await supabase
          .from("jugadores")
          .select("*")
          .eq(
            "correo",
            user.email
          )
          .single();

      if (!jugador) return;

      setCategoriaJugador(
        jugador.categoria
      );

      // ENTRENAMIENTOS
      const { data } =
        await supabase
          .from("entrenamientos")
          .select("*")
          .eq(
            "categoria",
            jugador.categoria
          )
          .order(
            "fecha",
            { ascending: true }
          );

      setEntrenamientos(
        data || []
      );
    };

  // COLOR
  const obtenerColor =
    (tipo: string) => {

      switch (tipo) {

        case "Físico":
          return "bg-green-500";

        case "Táctico":
          return "bg-blue-500";

        case "Recuperación":
          return "bg-yellow-500";

        case "Partido":
          return "bg-red-500";

        default:
          return "bg-purple-500";
      }
    };

  useEffect(() => {

    obtenerEntrenamientos();

  }, []);

  return (
    <div className="
      min-h-screen
      bg-[#f5f6fa]
      p-8
    ">

      {/* HEADER */}
      <div className="
        mb-10
      ">

        <h1 className="
          text-4xl
          font-bold
        ">
          Mis Entrenamientos ⚽
        </h1>

        <p className="
          text-gray-500
          mt-2
        ">
          Categoría:
          {" "}
          <span className="
            font-semibold
            text-purple-600
          ">
            {categoriaJugador}
          </span>
        </p>

      </div>

      {/* GRID */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        {entrenamientos.map(
          (entrenamiento) => (

          <div
            key={entrenamiento.id}
            className="
              bg-white
              rounded-3xl
              shadow
              overflow-hidden
              hover:shadow-xl
              transition-all
            "
          >

            {/* TOP */}
            <div className={`
              ${obtenerColor(
                entrenamiento.tipo
              )}

              p-6
              text-white
            `}>

              <div className="
                flex
                items-center
                justify-between
              ">

                <div>

                  <h2 className="
                    text-2xl
                    font-bold
                  ">
                    {
                      entrenamiento.tipo
                    }
                  </h2>

                  <p className="
                    opacity-90
                  ">
                    {
                      entrenamiento.categoria
                    }
                  </p>

                </div>

                <Dumbbell size={32} />

              </div>

            </div>

            {/* BODY */}
            <div className="
              p-6
              space-y-4
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <Calendar
                  className="
                    text-purple-500
                  "
                />

                <span>
                  {
                    entrenamiento.fecha
                  }
                </span>

              </div>

              <div className="
                flex
                items-center
                gap-3
              ">

                <Clock
                  className="
                    text-purple-500
                  "
                />

                <span>
                  {
                    entrenamiento.hora
                  }
                </span>

              </div>

              <div className="
                bg-gray-100
                rounded-2xl
                p-4
              ">

                <p className="
                  text-sm
                  text-gray-500
                ">
                  Duración
                </p>

                <h3 className="
                  text-xl
                  font-bold
                ">
                  {
                    entrenamiento.duracion
                  }
                </h3>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* VACIO */}
      {
        entrenamientos.length === 0 && (

          <div className="
            bg-white
            rounded-3xl
            shadow
            p-12
            text-center
            mt-10
          ">

            <h2 className="
              text-2xl
              font-bold
              mb-2
            ">
              No hay entrenamientos 😢
            </h2>

            <p className="
              text-gray-500
            ">
              Aún no existen entrenamientos
              para tu categoría
            </p>

          </div>

        )
      }

    </div>
  );
}