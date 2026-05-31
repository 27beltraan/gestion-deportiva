"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Dumbbell,
  Calendar,
  Clock,
  Trash2,
} from "lucide-react";

interface Entrenamiento {

  id: string;

  tipo: string;

  categoria: string;

  fecha: string;

  hora: string;

  duracion: string;
}

export default function EntrenamientosAdmin() {

  const [tipo,
    setTipo] =
    useState("");

  const [categoria,
    setCategoria] =
    useState("");

  const [fecha,
    setFecha] =
    useState("");

  const [hora,
    setHora] =
    useState("");

  const [duracion,
    setDuracion] =
    useState("");

  const [entrenamientos,
    setEntrenamientos] =
    useState<Entrenamiento[]>([]);

  // OBTENER
  const obtenerEntrenamientos =
    async () => {

      const { data } =
        await supabase
          .from("entrenamientos")
          .select("*")
          .order(
            "fecha",
            { ascending: true }
          );

      setEntrenamientos(
        data || []
      );
    };

  // CREAR
  const crearEntrenamiento =
    async () => {

      if (
        !tipo ||
        !categoria ||
        !fecha ||
        !hora ||
        !duracion
      ) {

        alert(
          "Completa todos los campos"
        );

        return;
      }

      const { error } =
        await supabase
          .from("entrenamientos")
          .insert([
            {
              tipo,
              categoria,
              fecha,
              hora,
              duracion,
            },
          ]);

      if (error) {

        console.log(error);

        alert(
          "Error creando entrenamiento"
        );

        return;
      }

      alert(
        "Entrenamiento creado"
      );

      // LIMPIAR
      setTipo("");
      setCategoria("");
      setFecha("");
      setHora("");
      setDuracion("");

      obtenerEntrenamientos();
    };

  // ELIMINAR
  const eliminarEntrenamiento =
    async (id: string) => {

      await supabase
        .from("entrenamientos")
        .delete()
        .eq("id", id);

      obtenerEntrenamientos();
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
          Entrenamientos ⚽
        </h1>

        <p className="
          text-gray-500
          mt-2
        ">
          Gestión de entrenamientos
        </p>

      </div>

      {/* FORM */}
      <div className="
        bg-white
        rounded-3xl
        shadow
        p-8
        mb-10
      ">

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-5
          gap-6
        ">

          {/* TIPO */}
          <select
            value={tipo}
            onChange={(e) =>
              setTipo(
                e.target.value
              )
            }
            className="
              border
              rounded-2xl
              p-4
              outline-none
              focus:ring-2
              focus:ring-purple-500
            "
          >

            <option value="">
              Tipo
            </option>

            <option>
              Físico
            </option>

            <option>
              Táctico
            </option>

            <option>
              Recuperación
            </option>

            <option>
              Partido
            </option>

          </select>

          {/* CATEGORIA */}
          <select
            value={categoria}
            onChange={(e) =>
              setCategoria(
                e.target.value
              )
            }
            className="
              border
              rounded-2xl
              p-4
              outline-none
              focus:ring-2
              focus:ring-purple-500
            "
          >

            <option value="">
              Categoría
            </option>

            <option>
              Infantil
            </option>

            <option>
              Juvenil
            </option>

            <option>
              Adulto
            </option>

          </select>

          {/* FECHA */}
          <input
            type="date"
            value={fecha}
            onChange={(e) =>
              setFecha(
                e.target.value
              )
            }
            className="
              border
              rounded-2xl
              p-4
              outline-none
              focus:ring-2
              focus:ring-purple-500
            "
          />

          {/* HORA */}
          <input
            type="time"
            value={hora}
            onChange={(e) =>
              setHora(
                e.target.value
              )
            }
            className="
              border
              rounded-2xl
              p-4
              outline-none
              focus:ring-2
              focus:ring-purple-500
            "
          />

          {/* DURACION */}
          <input
            type="text"
            value={duracion}
            onChange={(e) =>
              setDuracion(
                e.target.value
              )
            }
            placeholder="90 min"
            className="
              border
              rounded-2xl
              p-4
              outline-none
              focus:ring-2
              focus:ring-purple-500
            "
          />

        </div>

        {/* BOTON */}
        <button
          onClick={
            crearEntrenamiento
          }
          className="
            mt-8
            bg-gradient-to-r
            from-purple-500
            to-purple-700
            text-white
            px-8
            py-4
            rounded-2xl
            font-semibold
            hover:opacity-90
            transition-all
          "
        >
          Crear Entrenamiento
        </button>

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

              {/* BOTON */}
              <button
                onClick={() =>
                  eliminarEntrenamiento(
                    entrenamiento.id
                  )
                }
                className="
                  w-full
                  mt-4
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  py-3
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-all
                "
              >

                <Trash2 size={18} />

                Eliminar

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}