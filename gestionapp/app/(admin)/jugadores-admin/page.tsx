"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function JugadoresAdmin() {

  const [nombre,
    setNombre] =
    useState("");

  const [correo,
    setCorreo] =
    useState("");

  const [telefono,
    setTelefono] =
    useState("");

  const [categoria,
    setCategoria] =
    useState("");

  const [mensualidad,
    setMensualidad] =
    useState("");

  const [diaPago,
    setDiaPago] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  // GUARDAR
  const registrarJugador =
    async () => {

      setLoading(true);

      const { error } =
        await supabase
          .from("jugadores")
          .insert([
            {
              nombre,
              correo,
              telefono,
              categoria,
              mensualidad:
                Number(
                  mensualidad
                ),
              dia_pago:
                diaPago,
              avatar:
                "/avatars/avatar1.png",
            },
          ]);

      setLoading(false);

      if (error) {

        console.log(error);

        alert(
          "Error registrando jugador"
        );

        return;
      }

      alert(
        "Jugador registrado correctamente"
      );

      // LIMPIAR
      setNombre("");
      setCorreo("");
      setTelefono("");
      setCategoria("");
      setMensualidad("");
      setDiaPago("");
    };

  return (
    <div className="
      p-8
      min-h-screen
      bg-[#f5f6fa]
    ">

      {/* HEADER */}
      <div className="
        mb-10
      ">

        <h1 className="
          text-4xl
          font-bold
        ">
          Registrar Jugador ⚽
        </h1>

        <p className="
          text-gray-500
          mt-2
        ">
          Agrega nuevos jugadores
          al sistema
        </p>

      </div>

      {/* CONTENIDO */}
      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-8
      ">

        {/* FORM */}
        <div className="
          lg:col-span-2
          bg-white
          rounded-3xl
          shadow
          p-8
        ">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          ">

            {/* NOMBRE */}
            <div>

              <label className="
                block
                mb-2
                font-medium
              ">
                Nombre
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) =>
                  setNombre(
                    e.target.value
                  )
                }
                placeholder="Nombre jugador"
                className="
                  w-full
                  border
                  rounded-2xl
                  p-4
                  outline-none
                  focus:ring-2
                  focus:ring-purple-500
                "
              />

            </div>

            {/* CORREO */}
            <div>

              <label className="
                block
                mb-2
                font-medium
              ">
                Correo
              </label>

              <input
                type="email"
                value={correo}
                onChange={(e) =>
                  setCorreo(
                    e.target.value
                  )
                }
                placeholder="correo@gmail.com"
                className="
                  w-full
                  border
                  rounded-2xl
                  p-4
                  outline-none
                  focus:ring-2
                  focus:ring-purple-500
                "
              />

            </div>

            {/* TELEFONO */}
            <div>

              <label className="
                block
                mb-2
                font-medium
              ">
                Teléfono
              </label>

              <input
                type="text"
                value={telefono}
                onChange={(e) =>
                  setTelefono(
                    e.target.value
                  )
                }
                placeholder="+56 9..."
                className="
                  w-full
                  border
                  rounded-2xl
                  p-4
                  outline-none
                  focus:ring-2
                  focus:ring-purple-500
                "
              />

            </div>

            {/* CATEGORIA */}
            <div>

              <label className="
                block
                mb-2
                font-medium
              ">
                Categoría
              </label>

              <select
                value={categoria}
                onChange={(e) =>
                  setCategoria(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-2xl
                  p-4
                  outline-none
                  focus:ring-2
                  focus:ring-purple-500
                "
              >

                <option value="">
                  Seleccionar
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

            {/* MENSUALIDAD */}
            <div>

              <label className="
                block
                mb-2
                font-medium
              ">
                Mensualidad
              </label>

              <input
                type="number"
                value={mensualidad}
                onChange={(e) =>
                  setMensualidad(
                    e.target.value
                  )
                }
                placeholder="$"
                className="
                  w-full
                  border
                  rounded-2xl
                  p-4
                  outline-none
                  focus:ring-2
                  focus:ring-purple-500
                "
              />

            </div>

            {/* DIA PAGO */}
            <div>

              <label className="
                block
                mb-2
                font-medium
              ">
                Día Pago
              </label>

              <input
                type="text"
                value={diaPago}
                onChange={(e) =>
                  setDiaPago(
                    e.target.value
                  )
                }
                placeholder="05 de cada mes"
                className="
                  w-full
                  border
                  rounded-2xl
                  p-4
                  outline-none
                  focus:ring-2
                  focus:ring-purple-500
                "
              />

            </div>

          </div>

          {/* BOTON */}
          <button
            onClick={
              registrarJugador
            }
            disabled={loading}
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

            {
              loading
                ? "Registrando..."
                : "Registrar Jugador"
            }

          </button>

        </div>

        {/* PREVIEW */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          p-8
          flex
          flex-col
          items-center
          justify-center
        ">

          <img
            src="/avatars/avatar1.png"
            className="
              w-32
              h-32
              rounded-full
              border-4
              border-purple-500
              mb-6
            "
          />

          <h2 className="
            text-2xl
            font-bold
          ">

            {
              nombre || "Jugador"
            }

          </h2>

          <p className="
            text-gray-500
            mt-2
          ">

            {
              categoria ||
              "Categoría"
            }

          </p>

          <div className="
            mt-6
            w-full
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
                Mensualidad
              </p>

              <h3 className="
                text-xl
                font-bold
                text-green-600
              ">

                {
                  mensualidad
                    ? `$${mensualidad}`
                    : "$0"
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
                Día Pago
              </p>

              <h3 className="
                text-xl
                font-bold
              ">

                {
                  diaPago ||
                  "--"
                }

              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}