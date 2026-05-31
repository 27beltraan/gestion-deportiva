"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Search,
  Users,
} from "lucide-react";

interface Jugador {

  id: string;

  nombre: string;

  correo: string;

  telefono: string;

  categoria: string;

  mensualidad: number;

  dia_pago: string;

  avatar: string;
}

export default function ListadoJugadores() {

  const [jugadores,
    setJugadores] =
    useState<Jugador[]>([]);

  const [busqueda,
    setBusqueda] =
    useState("");

  const [categoriaFiltro,
    setCategoriaFiltro] =
    useState("");

  // OBTENER JUGADORES
  const obtenerJugadores =
    async () => {

      const { data, error } =
        await supabase
          .from("jugadores")
          .select("*")
          .order(
            "nombre",
            { ascending: true }
          );

      if (error) {

        console.log(error);

        return;
      }

      setJugadores(data || []);
    };

  useEffect(() => {

    obtenerJugadores();

  }, []);

  // FILTRO
  const jugadoresFiltrados =
    jugadores.filter((j) => {

      const coincideBusqueda =
        j.nombre
          .toLowerCase()
          .includes(
            busqueda.toLowerCase()
          );

      const coincideCategoria =
        categoriaFiltro === ""
          ? true
          : j.categoria ===
            categoriaFiltro;

      return (
        coincideBusqueda &&
        coincideCategoria
      );
    });

  return (
    <div className="
      min-h-screen
      bg-[#f5f6fa]
      p-8
    ">

      {/* HEADER */}
      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-6
        mb-10
      ">

        <div>

          <h1 className="
            text-4xl
            font-bold
          ">
            Listado Jugadores ⚽
          </h1>

          <p className="
            text-gray-500
            mt-2
          ">
            Administra todos los jugadores
          </p>

        </div>

        {/* TOTAL */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          px-6
          py-4
          flex
          items-center
          gap-4
        ">

          <div className="
            bg-purple-100
            p-3
            rounded-2xl
          ">

            <Users className="
              text-purple-600
            "/>

          </div>

          <div>

            <p className="
              text-gray-500
              text-sm
            ">
              Total jugadores
            </p>

            <h2 className="
              text-2xl
              font-bold
            ">
              {
                jugadoresFiltrados.length
              }
            </h2>

          </div>

        </div>

      </div>

      {/* FILTROS */}
      <div className="
        bg-white
        rounded-3xl
        shadow
        p-6
        flex
        flex-col
        lg:flex-row
        gap-4
        mb-8
      ">

        {/* BUSCADOR */}
        <div className="
          flex-1
          relative
        ">

          <Search
            className="
              absolute
              left-4
              top-4
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Buscar jugador..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
            className="
              w-full
              border
              rounded-2xl
              py-4
              pl-12
              pr-4
              outline-none
              focus:ring-2
              focus:ring-purple-500
            "
          />

        </div>

        {/* FILTRO */}
        <select
          value={categoriaFiltro}
          onChange={(e) =>
            setCategoriaFiltro(
              e.target.value
            )
          }
          className="
            border
            rounded-2xl
            px-6
            py-4
            outline-none
            focus:ring-2
            focus:ring-purple-500
          "
        >

          <option value="">
            Todas categorías
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

      </div>

      {/* GRID */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        {jugadoresFiltrados.map(
          (jugador) => (

          <div
            key={jugador.id}
            className="
              bg-white
              rounded-3xl
              shadow
              p-6
              hover:shadow-xl
              transition-all
            "
          >

            {/* TOP */}
            <div className="
              flex
              items-center
              gap-4
              mb-6
            ">

              <img
                src={
                  jugador.avatar ||
                  "/avatars/avatar1.png"
                }
                className="
                  w-20
                  h-20
                  rounded-full
                  border-4
                  border-purple-500
                "
              />

              <div>

                <h2 className="
                  text-xl
                  font-bold
                ">
                  {jugador.nombre}
                </h2>

                <p className="
                  text-gray-500
                ">
                  {jugador.categoria}
                </p>

              </div>

            </div>

            {/* INFO */}
            <div className="
              space-y-4
            ">

              <div className="
                bg-gray-100
                rounded-2xl
                p-4
              ">

                <p className="
                  text-sm
                  text-gray-500
                ">
                  Correo
                </p>

                <h3 className="
                  font-semibold
                ">
                  {jugador.correo}
                </h3>

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
                  Teléfono
                </p>

                <h3 className="
                  font-semibold
                ">
                  {jugador.telefono}
                </h3>

              </div>

              <div className="
                grid
                grid-cols-2
                gap-4
              ">

                <div className="
                  bg-gray-100
                  rounded-2xl
                  p-4
                ">

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Mensualidad
                  </p>

                  <h3 className="
                    font-bold
                    text-green-600
                  ">
                    $
                    {
                      jugador.mensualidad
                    }
                  </h3>

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
                    Día pago
                  </p>

                  <h3 className="
                    font-bold
                  ">
                    {
                      jugador.dia_pago
                    }
                  </h3>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}