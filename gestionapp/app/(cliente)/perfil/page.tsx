"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

interface PerfilData {

  nombre: string;

  email: string;

  telefono: string;

  foto_perfil: string;
}

interface Jugador {

  categoria: string;

  mensualidad: number;

  dia_pago: string;
}

export default function Perfil() {

  const [perfil,
    setPerfil] =
    useState<PerfilData | null>(
      null
    );

  const [jugador,
    setJugador] =
    useState<Jugador | null>(
      null
    );

  const [telefono,
    setTelefono] =
    useState("");

  const [avatarSeleccionado,
    setAvatarSeleccionado] =
    useState(
      "/avatars/avatar1.png"
    );

  // AVATARS
  const avatars = [

    "/avatars/avatar1.png",

    "/avatars/avatar2.png",

    "/avatars/avatar3.png",

    "/avatars/avatar4.png",
  ];

  // OBTENER DATOS
  const obtenerDatos =
    async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      // USUARIO
      const { data: usuario } =
        await supabase
          .from("usuarios")
          .select("*")
          .eq(
            "email",
            user.email
          )
          .single();

      if (usuario) {

        setPerfil(usuario);

        setTelefono(
          usuario.telefono || ""
        );

        setAvatarSeleccionado(
          usuario.foto_perfil ||
          "/avatars/avatar1.png"
        );
      }

      // JUGADOR
      const { data: jugadorData } =
        await supabase
          .from("jugadores")
          .select("*")
          .eq(
            "correo",
            user.email
          )
          .single();

      if (jugadorData) {

        setJugador(jugadorData);
      }
    };

  // GUARDAR PERFIL
  const guardarPerfil =
    async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      const { error } =
        await supabase
          .from("usuarios")
          .update({

            telefono,

            foto_perfil:
              avatarSeleccionado,

          })
          .eq(
            "email",
            user.email
          );

      if (error) {

        console.log(error);

        alert(
          "Error actualizando"
        );

        return;
      }

      alert(
        "Perfil actualizado"
      );

      window.location.reload();
    };

  useEffect(() => {

    obtenerDatos();

  }, []);

  return (
    <div>

      {/* TITULO */}
      <div className="
        mb-10
      ">

        <h1 className="
          text-4xl
          font-bold
        ">
          Mi Perfil 👤
        </h1>

        <p className="
          text-gray-500
          mt-2
        ">
          Información personal
        </p>

      </div>

      {/* CARD */}
      <div className="
        bg-white
        p-10
        rounded-3xl
        shadow
        max-w-5xl
      ">

        {/* AVATAR */}
        <div className="
          flex
          items-center
          gap-8
          mb-10
        ">

          {/* FOTO */}
          <div className="
            w-32
            h-32
            rounded-full
            overflow-hidden
            border-4
            border-purple-500
            shadow-lg
          ">

            <img
              src={
                avatarSeleccionado ||
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

          {/* AVATARS */}
          <div>

            <h2 className="
              text-xl
              font-semibold
              mb-4
            ">
              Selecciona tu avatar
            </h2>

            <div className="
              flex
              gap-4
            ">

              {avatars.map(
                (avatar) => (

                <img
                  key={avatar}
                  src={avatar}
                  onClick={() =>
                    setAvatarSeleccionado(
                      avatar
                    )
                  }
                  className={`
                    w-20
                    h-20
                    rounded-full
                    cursor-pointer
                    border-4
                    transition-all

                    ${
                      avatarSeleccionado ===
                      avatar
                        ? "border-purple-600 scale-110"
                        : "border-transparent"
                    }
                  `}
                />

              ))}

            </div>

          </div>

        </div>

        {/* FORM */}
        <div className="
          grid
          grid-cols-2
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
              value={
                perfil?.nombre || ""
              }
              disabled
              className="
                w-full
                border
                rounded-2xl
                p-4
                bg-gray-100
              "
            />

          </div>

          {/* EMAIL */}
          <div>

            <label className="
              block
              mb-2
              font-medium
            ">
              Correo
            </label>

            <input
              value={
                perfil?.email || ""
              }
              disabled
              className="
                w-full
                border
                rounded-2xl
                p-4
                bg-gray-100
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

            <input
              value={
                jugador?.categoria ||
                ""
              }
              disabled
              className="
                w-full
                border
                rounded-2xl
                p-4
                bg-gray-100
              "
            />

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
              value={
                jugador
                  ? `$${jugador.mensualidad}`
                  : ""
              }
              disabled
              className="
                w-full
                border
                rounded-2xl
                p-4
                bg-gray-100
              "
            />

          </div>

          {/* MES */}
          <div>

            <label className="
              block
              mb-2
              font-medium
            ">
              Mes Pago
            </label>

            <input
              value={
                jugador?.dia_pago ||
                ""
              }
              disabled
              className="
                w-full
                border
                rounded-2xl
                p-4
                bg-gray-100
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
              value={telefono}
              onChange={(e) =>
                setTelefono(
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-2xl
                p-4
              "
            />

          </div>

        </div>

        {/* BOTON */}
        <button
          onClick={
            guardarPerfil
          }
          className="
            mt-10
            bg-purple-600
            hover:bg-purple-700
            text-white
            px-8
            py-4
            rounded-2xl
            transition-all
          "
        >
          Guardar Cambios
        </button>

      </div>

    </div>
  );
}