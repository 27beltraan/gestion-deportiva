"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

interface Pago {
  id: number;
  nombre: string;
  monto: number;
  estado: string;
  comprobante: string;
  observacion: string;
}

export default function PagosAdmin() {

  const [pagos, setPagos] = useState<Pago[]>([]);

  // obtener pagos
  const obtenerPagos = async () => {

    const { data, error } = await supabase
      .from("pagos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setPagos(data);
  };

  // actualizar estado
  const actualizarEstado = async (
    id: number,
    estado: string
  ) => {

    const { error } = await supabase
      .from("pagos")
      .update({
        estado,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    obtenerPagos();
  };

  useEffect(() => {
    obtenerPagos();
  }, []);

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Pagos Admin 💳
      </h1>

      <div className="grid gap-6">

        {pagos.map((pago) => (

          <div
            key={pago.id}
            className="bg-white p-6 rounded-2xl shadow"
          >

            <div className="flex justify-between items-start">

              {/* informacion */}
              <div>

                <h2 className="text-2xl font-bold mb-2">
                  {pago.nombre}
                </h2>

                <p className="text-gray-500 mb-2">
                  💰 ${pago.monto}
                </p>

                <p className="text-gray-500 mb-4">
                  📝 {pago.observacion}
                </p>

                <a
                  href={pago.comprobante}
                  target="_blank"
                  className="text-purple-600 underline"
                >
                  Ver comprobante
                </a>

              </div>

              {/* estado */}
              <span
                className={`
                  px-4 py-2 rounded-full text-white text-sm font-medium

                  ${pago.estado === "aprobado"
                    ? "bg-green-500"
                    : pago.estado === "rechazado"
                    ? "bg-red-500"
                    : "bg-yellow-500"}
                `}
              >
                {pago.estado}
              </span>

            </div>

            {/* botones */}
            <div className="flex gap-4 mt-6">

              <button
                onClick={() =>
                  actualizarEstado(
                    pago.id,
                    "aprobado"
                  )
                }
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition"
              >
                Aprobar
              </button>

              <button
                onClick={() =>
                  actualizarEstado(
                    pago.id,
                    "rechazado"
                  )
                }
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition"
              >
                Rechazar
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}