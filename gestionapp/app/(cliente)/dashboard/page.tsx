"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  User,
  CreditCard,
  Dumbbell,
  FileText,
  Calendar,
  CheckCircle,
} from "lucide-react";

interface Usuario {

  nombre: string;

  foto_perfil: string;

  telefono: string;
}

interface Jugador {

  categoria: string;
}

interface Entrenamiento {

  tipo: string;

  fecha: string;

  hora: string;
}

interface Pago {

  estado: string;

  fecha_pago: string;
}

interface Certificado {

  id: string;
}

export default function DashboardCliente() {

  const [usuario,
    setUsuario] =
    useState<Usuario | null>(
      null
    );

  const [jugador,
    setJugador] =
    useState<Jugador | null>(
      null
    );

  const [entrenamiento,
    setEntrenamiento] =
    useState<Entrenamiento | null>(
      null
    );

  const [pago,
    setPago] =
    useState<Pago | null>(
      null
    );

  const [certificados,
    setCertificados] =
    useState(0);

  // OBTENER DATOS
  const obtenerDatos =
    async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      // USUARIO
      const { data: usuarioData } =
        await supabase
          .from("usuarios")
          .select("*")
          .eq(
            "email",
            user.email
          )
          .single();

      setUsuario(usuarioData);

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

      setJugador(jugadorData);

      // ENTRENAMIENTO
      if (jugadorData) {

        const {
          data: entrenamientoData,
        } =
          await supabase
            .from("entrenamientos")
            .select("*")
            .eq(
              "categoria",
              jugadorData.categoria
            )
            .order(
              "fecha",
              {
                ascending: true,
              }
            )
            .limit(1)
            .single();

        setEntrenamiento(
          entrenamientoData
        );
      }

      // PAGO
      const { data: pagoData } =
        await supabase
          .from("pagos")
          .select("*")
          .eq(
            "correo",
            user.email
          )
          .order(
            "fecha_pago",
            {
              ascending: false,
            }
          )
          .limit(1)
          .single();

      setPago(pagoData);

      // CERTIFICADOS
      const {
        data: certificadosData,
      } =
        await supabase
          .from("certificados")
          .select("*")
          .eq(
            "correo",
            user.email
          );

      setCertificados(
        certificadosData?.length || 0
      );
    };

  useEffect(() => {

    obtenerDatos();

  }, []);

  return (
    <div className="
      min-h-screen
      bg-[#f5f6fa]
      p-8
    ">

      {/* HEADER */}
      <div className="
        bg-gradient-to-r
        from-purple-600
        to-purple-800
        rounded-3xl
        p-10
        text-white
        mb-10
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-8
      ">

        <div>

          <h1 className="
            text-5xl
            font-bold
          ">
            Hola,
            {" "}
            {
              usuario?.nombre
            }
            👋
          </h1>

          <p className="
            text-purple-100
            mt-4
            text-lg
          ">
            Bienvenido nuevamente
            al sistema deportivo
          </p>

        </div>

        <img
          src={
            usuario?.foto_perfil ||
            "/avatars/avatar1.png"
          }
          className="
            w-36
            h-36
            rounded-full
            border-4
            border-white
            shadow-2xl
          "
        />

      </div>

      {/* STATS */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-10
      ">

        {/* PERFIL */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          p-6
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-4
          ">

            <div className="
              bg-purple-100
              p-4
              rounded-2xl
            ">

              <User
                className="
                  text-purple-600
                "
              />

            </div>

            <h2 className="
              text-xl
              font-bold
            ">
              Mi Perfil
            </h2>

          </div>

          <p className="
            text-gray-500
          ">
            Categoría
          </p>

          <h3 className="
            text-2xl
            font-bold
            mt-2
          ">
            {
              jugador?.categoria ||
              "--"
            }
          </h3>

        </div>

        {/* PAGOS */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          p-6
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-4
          ">

            <div className="
              bg-green-100
              p-4
              rounded-2xl
            ">

              <CreditCard
                className="
                  text-green-600
                "
              />

            </div>

            <h2 className="
              text-xl
              font-bold
            ">
              Pagos
            </h2>

          </div>

          <p className="
            text-gray-500
          ">
            Estado actual
          </p>

          <h3 className={`
            text-2xl
            font-bold
            mt-2

            ${
              pago?.estado ===
              "Pagado"

              ? "text-green-600"

              : "text-red-500"
            }
          `}>

            {
              pago?.estado ||
              "Sin pagos"
            }

          </h3>

        </div>

        {/* ENTRENAMIENTO */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          p-6
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-4
          ">

            <div className="
              bg-blue-100
              p-4
              rounded-2xl
            ">

              <Dumbbell
                className="
                  text-blue-600
                "
              />

            </div>

            <h2 className="
              text-xl
              font-bold
            ">
              Próximo
            </h2>

          </div>

          <p className="
            text-gray-500
          ">
            Entrenamiento
          </p>

          <h3 className="
            text-2xl
            font-bold
            mt-2
          ">

            {
              entrenamiento?.tipo ||
              "--"
            }

          </h3>

        </div>

        {/* CERTIFICADOS */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          p-6
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-4
          ">

            <div className="
              bg-yellow-100
              p-4
              rounded-2xl
            ">

              <FileText
                className="
                  text-yellow-600
                "
              />

            </div>

            <h2 className="
              text-xl
              font-bold
            ">
              Certificados
            </h2>

          </div>

          <p className="
            text-gray-500
          ">
            Solicitudes
          </p>

          <h3 className="
            text-2xl
            font-bold
            mt-2
          ">
            {certificados}
          </h3>

        </div>

      </div>

      {/* MAIN GRID */}
      <div className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
      ">

        {/* ENTRENAMIENTO */}
        <div className="
          xl:col-span-2
          bg-white
          rounded-3xl
          shadow
          p-8
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-8
          ">

            <div className="
              bg-purple-100
              p-4
              rounded-2xl
            ">

              <Calendar
                className="
                  text-purple-600
                "
              />

            </div>

            <div>

              <h2 className="
                text-3xl
                font-bold
              ">
                Próximo Entrenamiento
              </h2>

              <p className="
                text-gray-500
              ">
                Información deportiva
              </p>

            </div>

          </div>

          {
            entrenamiento ? (

              <div className="
                bg-gradient-to-r
                from-purple-500
                to-purple-700
                rounded-3xl
                p-8
                text-white
              ">

                <h3 className="
                  text-4xl
                  font-bold
                  mb-4
                ">
                  {
                    entrenamiento.tipo
                  }
                </h3>

                <div className="
                  flex
                  flex-col
                  md:flex-row
                  gap-6
                  mt-6
                ">

                  <div>

                    <p className="
                      text-purple-100
                    ">
                      Fecha
                    </p>

                    <h4 className="
                      text-2xl
                      font-bold
                    ">
                      {
                        entrenamiento.fecha
                      }
                    </h4>

                  </div>

                  <div>

                    <p className="
                      text-purple-100
                    ">
                      Hora
                    </p>

                    <h4 className="
                      text-2xl
                      font-bold
                    ">
                      {
                        entrenamiento.hora
                      }
                    </h4>

                  </div>

                </div>

              </div>

            ) : (

              <div className="
                bg-gray-100
                rounded-3xl
                p-10
                text-center
              ">

                <h3 className="
                  text-2xl
                  font-bold
                ">
                  No hay entrenamientos
                </h3>

              </div>

            )
          }

        </div>

        {/* PANEL DERECHO */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          p-8
        ">

          <h2 className="
            text-3xl
            font-bold
            mb-8
          ">
            Resumen ⚡
          </h2>

          <div className="
            space-y-6
          ">

            {/* PAGO */}
            <div className="
              bg-gray-100
              rounded-2xl
              p-5
            ">

              <p className="
                text-gray-500
              ">
                Último pago
              </p>

              <h3 className="
                text-2xl
                font-bold
                mt-2
              ">
                {
                  pago?.fecha_pago ||
                  "--"
                }
              </h3>

            </div>

            {/* TELEFONO */}
            <div className="
              bg-gray-100
              rounded-2xl
              p-5
            ">

              <p className="
                text-gray-500
              ">
                Teléfono
              </p>

              <h3 className="
                text-2xl
                font-bold
                mt-2
              ">
                {
                  usuario?.telefono ||
                  "--"
                }
              </h3>

            </div>

            {/* ESTADO */}
            <div className="
              bg-gray-100
              rounded-2xl
              p-5
            ">

              <p className="
                text-gray-500
              ">
                Estado cuenta
              </p>

              <div className="
                flex
                items-center
                gap-3
                mt-3
              ">

                <CheckCircle
                  className="
                    text-green-500
                  "
                />

                <h3 className="
                  text-xl
                  font-bold
                  text-green-600
                ">
                  Activa
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}