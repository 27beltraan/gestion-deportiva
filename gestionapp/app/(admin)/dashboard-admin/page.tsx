"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  Users,
  CreditCard,
  Dumbbell,
  FileText,
  UserPlus,
  CalendarPlus,
  BadgeDollarSign,
  ArrowRight,
  Bell,
  Activity,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Clock3,
  Trophy,
} from "lucide-react";

interface Pago {
  estado: string;
}

interface Certificado {
  estado: string;
}

interface Entrenamiento {
  id: string;
  tipo: string;
  categoria: string;
  fecha: string;
  hora: string;
}

interface Jugador {
  id: string;
  categoria: string;
}

export default function DashboardAdmin() {

  const [jugadores,
    setJugadores] =
    useState(0);

  const [pagosPendientes,
    setPagosPendientes] =
    useState(0);

  const [certificadosPendientes,
    setCertificadosPendientes] =
    useState(0);

  const [entrenamientos,
    setEntrenamientos] =
    useState(0);

  const [proximoEntrenamiento,
    setProximoEntrenamiento] =
    useState<Entrenamiento | null>(
      null
    );

  const [juveniles,
    setJuveniles] =
    useState(0);

  const [infantiles,
    setInfantiles] =
    useState(0);

  const [adultos,
    setAdultos] =
    useState(0);

  // OBTENER DATOS
  const obtenerDatos =
    async () => {

      // JUGADORES
      const {
        data: jugadoresData,
      } =
        await supabase
          .from("jugadores")
          .select("*");

      setJugadores(
        jugadoresData?.length || 0
      );

      // CATEGORIAS
      setInfantiles(
        jugadoresData?.filter(
          (j) =>
            j.categoria ===
            "Infantil"
        ).length || 0
      );

      setJuveniles(
        jugadoresData?.filter(
          (j) =>
            j.categoria ===
            "Juvenil"
        ).length || 0
      );

      setAdultos(
        jugadoresData?.filter(
          (j) =>
            j.categoria ===
            "Adulto"
        ).length || 0
      );

      // PAGOS
      const {
        data: pagosData,
      } =
        await supabase
          .from("pagos")
          .select("*")
          .eq(
            "estado",
            "Pendiente"
          );

      setPagosPendientes(
        pagosData?.length || 0
      );

      // CERTIFICADOS
      const {
        data: certificadosData,
      } =
        await supabase
          .from("certificados")
          .select("*")
          .eq(
            "estado",
            "Pendiente"
          );

      setCertificadosPendientes(
        certificadosData?.length || 0
      );

      // ENTRENAMIENTOS
      const {
        data: entrenamientosData,
      } =
        await supabase
          .from("entrenamientos")
          .select("*")
          .order(
            "fecha",
            {
              ascending: true,
            }
          );

      setEntrenamientos(
        entrenamientosData?.length || 0
      );

      if (
        entrenamientosData &&
        entrenamientosData.length > 0
      ) {

        setProximoEntrenamiento(
          entrenamientosData[0]
        );
      }
    };

  useEffect(() => {

    obtenerDatos();

  }, []);

  return (
    <div className="
      min-h-screen
      bg-[#f4f7fb]
      p-8
    ">

      {/* HERO */}
      <div className="
        bg-gradient-to-r
        from-black
        via-gray-900
        to-purple-900
        rounded-[35px]
        p-10
        text-white
        mb-10
        shadow-2xl
      ">

        <div className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-10
        ">

          <div>

            <div className="
              flex
              items-center
              gap-4
              mb-5
            ">

              <div className="
                bg-white/10
                p-4
                rounded-2xl
              ">

                <ShieldCheck size={40} />

              </div>

              <div>

                <h1 className="
                  text-5xl
                  font-black
                ">
                  Admin Panel ⚡
                </h1>

                <p className="
                  text-gray-300
                  mt-2
                  text-lg
                ">
                  Sistema profesional
                  de gestión deportiva
                </p>

              </div>

            </div>

            <div className="
              flex
              flex-wrap
              gap-4
              mt-8
            ">

              <div className="
                bg-white/10
                px-6
                py-4
                rounded-2xl
                backdrop-blur-lg
              ">

                <p className="
                  text-gray-300
                  text-sm
                ">
                  Jugadores activos
                </p>

                <h3 className="
                  text-3xl
                  font-bold
                ">
                  {jugadores}
                </h3>

              </div>

              <div className="
                bg-white/10
                px-6
                py-4
                rounded-2xl
                backdrop-blur-lg
              ">

                <p className="
                  text-gray-300
                  text-sm
                ">
                  Pendientes
                </p>

                <h3 className="
                  text-3xl
                  font-bold
                  text-red-400
                ">
                  {pagosPendientes}
                </h3>

              </div>

              <div className="
                bg-white/10
                px-6
                py-4
                rounded-2xl
                backdrop-blur-lg
              ">

                <p className="
                  text-gray-300
                  text-sm
                ">
                  Certificados
                </p>

                <h3 className="
                  text-3xl
                  font-bold
                  text-yellow-300
                ">
                  {
                    certificadosPendientes
                  }
                </h3>

              </div>

            </div>

          </div>

          {/* ALERTA */}
          <div className="
            bg-white/10
            p-8
            rounded-3xl
            backdrop-blur-xl
            w-full
            xl:w-[350px]
          ">

            <div className="
              flex
              items-center
              justify-between
              mb-6
            ">

              <h2 className="
                text-2xl
                font-bold
              ">
                Alertas
              </h2>

              <Bell />

            </div>

            <div className="
              space-y-4
            ">

              <div className="
                bg-red-500/20
                border
                border-red-500/30
                p-4
                rounded-2xl
              ">

                <p className="
                  text-sm
                  text-red-200
                ">
                  Pagos pendientes
                </p>

                <h3 className="
                  text-2xl
                  font-bold
                ">
                  {pagosPendientes}
                </h3>

              </div>

              <div className="
                bg-yellow-500/20
                border
                border-yellow-500/30
                p-4
                rounded-2xl
              ">

                <p className="
                  text-sm
                  text-yellow-100
                ">
                  Certificados pendientes
                </p>

                <h3 className="
                  text-2xl
                  font-bold
                ">
                  {
                    certificadosPendientes
                  }
                </h3>

              </div>

            </div>

          </div>

        </div>

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

        {/* CARD */}
        <div className="
          bg-white
          rounded-3xl
          p-8
          shadow-lg
          hover:shadow-2xl
          transition-all
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Total jugadores
              </p>

              <h2 className="
                text-5xl
                font-black
                mt-3
              ">
                {jugadores}
              </h2>

            </div>

            <div className="
              bg-purple-100
              p-5
              rounded-3xl
            ">

              <Users
                size={40}
                className="
                  text-purple-600
                "
              />

            </div>

          </div>

        </div>

        {/* CARD */}
        <div className="
          bg-white
          rounded-3xl
          p-8
          shadow-lg
          hover:shadow-2xl
          transition-all
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Pagos pendientes
              </p>

              <h2 className="
                text-5xl
                font-black
                text-red-500
                mt-3
              ">
                {pagosPendientes}
              </h2>

            </div>

            <div className="
              bg-red-100
              p-5
              rounded-3xl
            ">

              <Wallet
                size={40}
                className="
                  text-red-500
                "
              />

            </div>

          </div>

        </div>

        {/* CARD */}
        <div className="
          bg-white
          rounded-3xl
          p-8
          shadow-lg
          hover:shadow-2xl
          transition-all
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Entrenamientos
              </p>

              <h2 className="
                text-5xl
                font-black
                text-blue-500
                mt-3
              ">
                {entrenamientos}
              </h2>

            </div>

            <div className="
              bg-blue-100
              p-5
              rounded-3xl
            ">

              <Dumbbell
                size={40}
                className="
                  text-blue-500
                "
              />

            </div>

          </div>

        </div>

        {/* CARD */}
        <div className="
          bg-white
          rounded-3xl
          p-8
          shadow-lg
          hover:shadow-2xl
          transition-all
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Certificados
              </p>

              <h2 className="
                text-5xl
                font-black
                text-yellow-500
                mt-3
              ">
                {
                  certificadosPendientes
                }
              </h2>

            </div>

            <div className="
              bg-yellow-100
              p-5
              rounded-3xl
            ">

              <FileText
                size={40}
                className="
                  text-yellow-500
                "
              />

            </div>

          </div>

        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-10
      ">

        <Link
          href="/registro-jugadores"
          className="
            bg-gradient-to-r
            from-purple-500
            to-purple-700
            text-white
            rounded-3xl
            p-8
            hover:scale-105
            transition-all
            shadow-xl
          "
        >

          <UserPlus
            size={50}
            className="
              mb-8
            "
          />

          <h2 className="
            text-3xl
            font-bold
          ">
            Registrar Jugador
          </h2>

          <div className="
            flex
            items-center
            gap-2
            mt-8
          ">

            <span>
              Abrir módulo
            </span>

            <ArrowRight size={18} />

          </div>

        </Link>

        <Link
          href="/pagos-admin"
          className="
            bg-gradient-to-r
            from-green-500
            to-green-700
            text-white
            rounded-3xl
            p-8
            hover:scale-105
            transition-all
            shadow-xl
          "
        >

          <BadgeDollarSign
            size={50}
            className="
              mb-8
            "
          />

          <h2 className="
            text-3xl
            font-bold
          ">
            Pagos
          </h2>

          <div className="
            flex
            items-center
            gap-2
            mt-8
          ">

            <span>
              Administrar pagos
            </span>

            <ArrowRight size={18} />

          </div>

        </Link>

        <Link
          href="/entrenamientos-admin"
          className="
            bg-gradient-to-r
            from-blue-500
            to-blue-700
            text-white
            rounded-3xl
            p-8
            hover:scale-105
            transition-all
            shadow-xl
          "
        >

          <CalendarPlus
            size={50}
            className="
              mb-8
            "
          />

          <h2 className="
            text-3xl
            font-bold
          ">
            Entrenamientos
          </h2>

          <div className="
            flex
            items-center
            gap-2
            mt-8
          ">

            <span>
              Gestionar
            </span>

            <ArrowRight size={18} />

          </div>

        </Link>

        <Link
          href="/certificados-admin"
          className="
            bg-gradient-to-r
            from-yellow-500
            to-orange-500
            text-white
            rounded-3xl
            p-8
            hover:scale-105
            transition-all
            shadow-xl
          "
        >

          <FileText
            size={50}
            className="
              mb-8
            "
          />

          <h2 className="
            text-3xl
            font-bold
          ">
            Certificados
          </h2>

          <div className="
            flex
            items-center
            gap-2
            mt-8
          ">

            <span>
              Gestionar
            </span>

            <ArrowRight size={18} />

          </div>

        </Link>

      </div>

      {/* GRID INFERIOR */}
      <div className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
      ">

        {/* PROXIMO ENTRENAMIENTO */}
        <div className="
          xl:col-span-2
          bg-white
          rounded-3xl
          shadow-lg
          p-8
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-8
          ">

            <div className="
              bg-blue-100
              p-4
              rounded-2xl
            ">

              <Clock3
                className="
                  text-blue-500
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
                Información programada
              </p>

            </div>

          </div>

          {
            proximoEntrenamiento ? (

              <div className="
                bg-gradient-to-r
                from-blue-500
                to-blue-700
                rounded-3xl
                p-8
                text-white
              ">

                <div className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-8
                ">

                  <div>

                    <h3 className="
                      text-4xl
                      font-black
                    ">
                      {
                        proximoEntrenamiento.tipo
                      }
                    </h3>

                    <p className="
                      text-blue-100
                      mt-3
                    ">
                      Categoría:
                      {" "}
                      {
                        proximoEntrenamiento.categoria
                      }
                    </p>

                  </div>

                  <div>

                    <p className="
                      text-blue-100
                    ">
                      Fecha
                    </p>

                    <h3 className="
                      text-2xl
                      font-bold
                    ">
                      {
                        proximoEntrenamiento.fecha
                      }
                    </h3>

                    <p className="
                      text-blue-100
                      mt-4
                    ">
                      Hora
                    </p>

                    <h3 className="
                      text-2xl
                      font-bold
                    ">
                      {
                        proximoEntrenamiento.hora
                      }
                    </h3>

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

        {/* CATEGORIAS */}
        <div className="
          bg-white
          rounded-3xl
          shadow-lg
          p-8
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-8
          ">

            <div className="
              bg-yellow-100
              p-4
              rounded-2xl
            ">

              <Trophy
                className="
                  text-yellow-500
                "
              />

            </div>

            <div>

              <h2 className="
                text-3xl
                font-bold
              ">
                Categorías
              </h2>

              <p className="
                text-gray-500
              ">
                Distribución
              </p>

            </div>

          </div>

          <div className="
            space-y-6
          ">

            {/* INFANTIL */}
            <div>

              <div className="
                flex
                justify-between
                mb-2
              ">

                <p className="
                  font-semibold
                ">
                  Infantil
                </p>

                <p className="
                  font-bold
                ">
                  {infantiles}
                </p>

              </div>

              <div className="
                h-4
                bg-gray-200
                rounded-full
              ">

                <div
                  className="
                    h-4
                    bg-purple-500
                    rounded-full
                  "
                  style={{
                    width: `${
                      jugadores
                        ? (infantiles / jugadores) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

            {/* JUVENIL */}
            <div>

              <div className="
                flex
                justify-between
                mb-2
              ">

                <p className="
                  font-semibold
                ">
                  Juvenil
                </p>

                <p className="
                  font-bold
                ">
                  {juveniles}
                </p>

              </div>

              <div className="
                h-4
                bg-gray-200
                rounded-full
              ">

                <div
                  className="
                    h-4
                    bg-blue-500
                    rounded-full
                  "
                  style={{
                    width: `${
                      jugadores
                        ? (juveniles / jugadores) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

            {/* ADULTO */}
            <div>

              <div className="
                flex
                justify-between
                mb-2
              ">

                <p className="
                  font-semibold
                ">
                  Adulto
                </p>

                <p className="
                  font-bold
                ">
                  {adultos}
                </p>

              </div>

              <div className="
                h-4
                bg-gray-200
                rounded-full
              ">

                <div
                  className="
                    h-4
                    bg-green-500
                    rounded-full
                  "
                  style={{
                    width: `${
                      jugadores
                        ? (adultos / jugadores) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}