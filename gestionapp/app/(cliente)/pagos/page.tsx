"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload
} from "lucide-react";

interface Mensualidad {

  id:number;

  mes:string;

  anio:number;

  monto:number;

  estado:string;

  fecha_pago:string | null;

  comprobante:string | null;

}

export default function PagosCliente(){

  const [mensualidades,
  setMensualidades]=
  useState<Mensualidad[]>([]);

  const [totalPagado,
  setTotalPagado]=
  useState(0);

  const [proximoPago,
  setProximoPago]=
  useState("");

  useEffect(()=>{

    cargarMensualidades();

  },[]);
    const cargarMensualidades = async () => {

    // Obtener usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Buscar el jugador asociado al usuario
    const { data: jugador, error: jugadorError } = await supabase

      .from("jugadores")

      .select("id")

      .eq("auth_id", user.id)

      .single();

    if (jugadorError) {

      console.error(jugadorError);

      return;

    }

    // Obtener las mensualidades del jugador
    const { data, error } = await supabase

      .from("mensualidades")

      .select("*")

      .eq("jugador_id", jugador.id)

      .order("anio", { ascending: false })

      .order("id", { ascending: false });

    if (error) {

      console.error(error);

      return;

    }

    setMensualidades(data || []);

    // Total pagado
    const total = (data || [])

      .filter((m) => m.estado === "Pagado")

      .reduce((acc, m) => acc + m.monto, 0);

    setTotalPagado(total);

    // Próxima deuda pendiente
    const pendiente = (data || []).find(
      (m) => m.estado === "Pendiente"
    );

    if (pendiente) {

      setProximoPago(
        `${pendiente.mes} ${pendiente.anio}`
      );

    } else {

      setProximoPago("Sin deudas");

    };

  };



  const obtenerEstadoGeneral = () => {

    const pendiente = mensualidades.find(
      (m) => m.estado === "Pendiente"
    );

    if (pendiente) {

      return {

        texto: "Pago pendiente",

        color: "bg-red-500",

        icon: <XCircle size={28} />,

      };

    }

    return {

      texto: "Al día",

      color: "bg-green-500",

      icon: <CheckCircle size={28} />,

    };

  };



  const estado = obtenerEstadoGeneral();
    const subirComprobante = async (
    id: number,
    archivo: File
  ) => {

    if (!archivo) return;

    const extension =
      archivo.name.split(".").pop();

    const nombreArchivo =
      `${id}-${Date.now()}.${extension}`;

    const { error: storageError } =
      await supabase.storage

        .from("comprobantes")

        .upload(
          nombreArchivo,
          archivo
        );

    if (storageError) {

      alert(storageError.message);

      return;

    }

    const {
      data: { publicUrl },
    } = supabase.storage

      .from("comprobantes")

      .getPublicUrl(nombreArchivo);

    const { error } = await supabase

      .from("mensualidades")

      .update({

        comprobante: publicUrl,

        estado: "En revisión",

      })

      .eq("id", id);

    if (error) {

      alert(error.message);

      return;

    }

    await cargarMensualidades();

    alert(
      "Comprobante enviado correctamente."
    );

  };
  return (

  <div className="min-h-screen bg-[#f5f6fa] p-8">

    {/* HEADER */}

    <div className="mb-10">

      <h1 className="text-4xl font-bold">
        Mis Pagos 💳
      </h1>

      <p className="text-gray-500 mt-2">
        Revisa el estado de tus mensualidades
      </p>

    </div>

    {/* TARJETAS */}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

      {/* ESTADO */}

      <div
        className={`
          ${estado.color}
          rounded-3xl
          shadow
          p-8
          text-white
        `}
      >

        <div className="flex items-center justify-between">

          <div>

            <p className="opacity-90">
              Estado actual
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {estado.texto}
            </h2>

          </div>

          {estado.icon}

        </div>

      </div>

      {/* PRÓXIMO PAGO */}

      <div className="bg-white rounded-3xl shadow p-8">

        <div className="flex items-center gap-3 mb-4">

          <Calendar className="text-purple-600" />

          <h2 className="text-xl font-bold">

            Próxima mensualidad

          </h2>

        </div>

        <p className="text-3xl font-bold">

          {proximoPago}

        </p>

      </div>

      {/* TOTAL PAGADO */}

      <div className="bg-white rounded-3xl shadow p-8">

        <div className="flex items-center gap-3 mb-4">

          <CheckCircle className="text-green-600" />

          <h2 className="text-xl font-bold">

            Total Pagado

          </h2>

        </div>

        <p className="text-3xl font-bold text-green-600">

          $

          {totalPagado.toLocaleString("es-CL")}

        </p>

      </div>

    </div>
        {/* MENSUALIDADES */}

    <div className="bg-white rounded-3xl shadow p-8">

      <h2 className="text-2xl font-bold mb-8">

        Mis Mensualidades

      </h2>

      <div className="space-y-6">

        {mensualidades.length === 0 ? (

          <div className="text-center py-16">

            <AlertTriangle
              size={55}
              className="mx-auto text-yellow-500 mb-5"
            />

            <h2 className="text-2xl font-bold mb-2">

              No tienes mensualidades

            </h2>

            <p className="text-gray-500">

              El administrador aún no ha generado tus mensualidades.

            </p>

          </div>

        ) : (

          mensualidades.map((mensualidad) => (

            <div
              key={mensualidad.id}
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

              {/* MES */}

              <div>

                <h3 className="text-2xl font-bold">

                  {mensualidad.mes} {mensualidad.anio}

                </h3>

                <p className="text-gray-500 mt-1">

                  {mensualidad.fecha_pago
                    ? `Pagado el ${new Date(
                        mensualidad.fecha_pago
                      ).toLocaleDateString("es-CL")}`
                    : "Aún no pagado"}

                </p>

              </div>

              {/* MONTO */}

              <div>

                <p className="text-gray-500">

                  Mensualidad

                </p>

                <h3 className="text-2xl font-bold text-green-600">

                  $

                  {mensualidad.monto.toLocaleString("es-CL")}

                </h3>

              </div>

              {/* ESTADO */}

              <div>

                <span
                  className={`
                    px-5
                    py-2
                    rounded-full
                    text-white
                    font-semibold

                    ${
                      mensualidad.estado === "Pagado"

                        ? "bg-green-500"

                        : mensualidad.estado === "Pendiente"

                        ? "bg-red-500"

                        : "bg-yellow-500"

                    }
                  `}
                >

                  {mensualidad.estado}

                </span>

              </div>

              {/* BOTONES */}

              <div className="flex gap-3">

                <label
  className="
    bg-purple-600
    hover:bg-purple-700
    text-white
    px-6
    py-3
    rounded-2xl
    transition
    cursor-pointer
  "
>

  <Upload
    size={18}
    className="inline mr-2"
  />

  Subir comprobante

  <input
    type="file"
    accept=".jpg,.jpeg,.png,.pdf"
    hidden
    onChange={(e) => {

      if (!e.target.files?.length) return;

      subirComprobante(
        mensualidad.id,
        e.target.files[0]
      );

    }}
  />

</label>

                {mensualidad.comprobante && (

                  <a
                    href={mensualidad.comprobante}
                    target="_blank"
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-6
                      py-3
                      rounded-2xl
                      transition
                    "
                  >

                    Ver comprobante

                  </a>

                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  </div>

);
}