"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
} from "lucide-react";

interface Pago {

  id: string;

  mes: string;

  monto: number;

  estado: string;

  fecha_pago: string;

  metodo_pago: string;
}

export default function PagosCliente() {

  const [pagos,
    setPagos] =
    useState<Pago[]>([]);

  const [totalPagado,
    setTotalPagado] =
    useState(0);

  const [proximoPago,
    setProximoPago] =
    useState("");

  // OBTENER PAGOS
  const obtenerPagos =
    async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      const { data } =
        await supabase
          .from("pagos")
          .select("*")
          .eq(
            "correo",
            user.email
          )
          .order(
            "fecha_pago",
            { ascending: false }
          );

      setPagos(data || []);

      // TOTAL
      const total =
        data?.reduce(
          (acc, pago) =>
            acc + pago.monto,
          0
        ) || 0;

      setTotalPagado(total);

      // PROXIMO
      const pendiente =
        data?.find(
          (p) =>
            p.estado ===
            "Pendiente"
        );

      if (pendiente) {

        setProximoPago(
          pendiente.fecha_pago
        );
      }
    };

  useEffect(() => {

    obtenerPagos();

  }, []);

  // ESTADO GENERAL
  const obtenerEstadoGeneral =
    () => {

      const pendiente =
        pagos.find(
          (p) =>
            p.estado ===
            "Pendiente"
        );

      if (pendiente) {

        return {
          texto:
            "Pago pendiente",
          color:
            "bg-red-500",
          icon:
            <XCircle size={28} />,
        };
      }

      return {
        texto: "Al día",
        color:
          "bg-green-500",
        icon:
          <CheckCircle size={28} />,
      };
    };

  const estado =
    obtenerEstadoGeneral();

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
          Mis Pagos 💳
        </h1>

        <p className="
          text-gray-500
          mt-2
        ">
          Revisa tu estado financiero
        </p>

      </div>

      {/* CARDS */}
      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
        mb-10
      ">

        {/* ESTADO */}
        <div className={`
          ${estado.color}

          rounded-3xl
          p-8
          text-white
          shadow
        `}>

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                opacity-90
              ">
                Estado actual
              </p>

              <h2 className="
                text-3xl
                font-bold
                mt-2
              ">
                {estado.texto}
              </h2>

            </div>

            {estado.icon}

          </div>

        </div>

        {/* PROXIMO */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          p-8
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-4
          ">

            <Calendar
              className="
                text-purple-600
              "
            />

            <h2 className="
              text-xl
              font-bold
            ">
              Próximo pago
            </h2>

          </div>

          <p className="
            text-3xl
            font-bold
          ">
            {
              proximoPago ||
              "Sin pendientes"
            }
          </p>

        </div>

        {/* TOTAL */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          p-8
        ">

          <div className="
            flex
            items-center
            gap-4
            mb-4
          ">

            <CheckCircle
              className="
                text-green-600
              "
            />

            <h2 className="
              text-xl
              font-bold
            ">
              Total pagado
            </h2>

          </div>

          <p className="
            text-3xl
            font-bold
            text-green-600
          ">
            ${totalPagado}
          </p>

        </div>

      </div>

      {/* TIMELINE */}
      <div className="
        bg-white
        rounded-3xl
        shadow
        p-8
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-8
        ">
          Historial de pagos
        </h2>

        <div className="
          space-y-6
        ">

          {pagos.map((pago) => (

            <div
              key={pago.id}
              className="
                border
                rounded-3xl
                p-6
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-6
              "
            >

              {/* LEFT */}
              <div>

                <h3 className="
                  text-2xl
                  font-bold
                ">
                  {pago.mes}
                </h3>

                <p className="
                  text-gray-500
                  mt-1
                ">
                  {
                    pago.fecha_pago
                  }
                </p>

              </div>

              {/* CENTER */}
              <div className="
                flex
                flex-col
                gap-2
              ">

                <p className="
                  text-gray-500
                ">
                  Método pago
                </p>

                <h3 className="
                  font-bold
                ">
                  {
                    pago.metodo_pago
                  }
                </h3>

              </div>

              {/* MONTO */}
              <div>

                <p className="
                  text-gray-500
                ">
                  Monto
                </p>

                <h3 className="
                  text-2xl
                  font-bold
                  text-green-600
                ">
                  $
                  {pago.monto}
                </h3>

              </div>

              {/* ESTADO */}
              <div>

                <span className={`
                  px-5
                  py-2
                  rounded-full
                  text-white
                  font-semibold

                  ${
                    pago.estado ===
                    "Pagado"

                    ? "bg-green-500"

                    : "bg-red-500"
                  }
                `}>

                  {pago.estado}

                </span>

              </div>

              {/* PDF */}
              <button
                className="
                  bg-purple-600
                  hover:bg-purple-700
                  text-white
                  px-6
                  py-3
                  rounded-2xl
                  flex
                  items-center
                  gap-2
                  transition
                "
              >

                <Download size={18} />

                Comprobante

              </button>

            </div>

          ))}

        </div>

      </div>

      {/* VACIO */}
      {
        pagos.length === 0 && (

          <div className="
            bg-white
            rounded-3xl
            shadow
            p-12
            text-center
            mt-10
          ">

            <AlertTriangle
              size={50}
              className="
                mx-auto
                text-yellow-500
                mb-4
              "
            />

            <h2 className="
              text-2xl
              font-bold
              mb-2
            ">
              No hay pagos registrados
            </h2>

            <p className="
              text-gray-500
            ">
              Aún no existen pagos
              en tu cuenta
            </p>

          </div>

        )
      }

    </div>
  );
}