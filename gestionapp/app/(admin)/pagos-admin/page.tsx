"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Mensualidad {

  id: number;

  jugador_id: number;

  mes: string;

  anio: number;

  monto: number;

  estado: string;

  fecha_pago: string | null;

  comprobante: string | null;

  jugadores: {

  nombre_jugador: string;

  apellido_jugador: string;

  categoria: string;

}[];

}

export default function PagosAdmin() {

  const [mensualidades,
    setMensualidades] =
    useState<Mensualidad[]>([]);

  const [generando,
    setGenerando] =
    useState(false);

  const [busqueda,
    setBusqueda] =
    useState("");

  const [estadoFiltro,
    setEstadoFiltro] =
    useState("");

  const [categoriaFiltro,
    setCategoriaFiltro] =
    useState("");

  const [totalRecaudado,
    setTotalRecaudado] =
    useState(0);

  const [pagados,
    setPagados] =
    useState(0);

  const [pendientes,
    setPendientes] =
    useState(0);

  useEffect(() => {

    cargarMensualidades();

  }, []);

  const cargarMensualidades = async () => {

    const { data, error } = await supabase

      .from("mensualidades")

      .select(`
  id,
  jugador_id,
  mes,
  anio,
  monto,
  estado,
  fecha_pago,
  comprobante,
  jugadores(
    nombre_jugador,
    apellido_jugador,
    categoria
  )
`)

      .order("id", {
        ascending: false,
      });

    if (error) {

      console.error(error);

      return;

    }
    console.log(data);
    setMensualidades(data || []);

    const total =
      (data || [])
      .filter(
        x => x.estado === "Pagado"
      )
      .reduce(
        (a, b) => a + b.monto,
        0
      );

    setTotalRecaudado(total);

    setPagados(

      (data || [])
      .filter(
        x => x.estado === "Pagado"
      ).length

    );

    setPendientes(

      (data || [])
      .filter(
        x => x.estado === "Pendiente"
      ).length

    );

  };

    const generarMensualidades = async () => {

    setGenerando(true);

    try {

      const fecha = new Date();

      const mes = fecha.toLocaleString("es-CL", {
        month: "long",
      });

      const anio = fecha.getFullYear();

      const { data: jugadores, error } = await supabase

        .from("jugadores")

        .select("*")

        .order("id");

      if (error) {

        alert(error.message);

        setGenerando(false);

        return;

      }

      let creadas = 0;

      for (const jugador of jugadores || []) {

        const { data: existente } = await supabase

          .from("mensualidades")

          .select("id")

          .eq("jugador_id", jugador.id)

          .eq("mes", mes)

          .eq("anio", anio)

          .maybeSingle();

        if (existente) {

          continue;

        }

        const { error: insertarError } = await supabase

          .from("mensualidades")

          .insert({

            jugador_id: jugador.id,

            mes,

            anio,

            monto: jugador.mensualidad,

            estado: "Pendiente",

            fecha_pago: null,

          });

        if (insertarError) {

          console.error(insertarError);

          alert(insertarError.message);

          setGenerando(false);

          return;

        }

        creadas++;

      }

      alert(
        `Se generaron ${creadas} mensualidades correctamente.`
      );

      await cargarMensualidades();

    } catch (error) {

      console.error(error);

      alert("Ocurrió un error.");

    }

    setGenerando(false);

  };
    const marcarPagado = async (id: number) => {

    const { error } = await supabase

      .from("mensualidades")

      .update({

        estado: "Pagado",

        fecha_pago: new Date().toISOString(),

      })

      .eq("id", id);

    if (error) {

      alert(error.message);

      return;

    }

    await cargarMensualidades();

  };



  const volverPendiente = async (id: number) => {

    const { error } = await supabase

      .from("mensualidades")

      .update({

        estado: "Pendiente",

        fecha_pago: null,

      })

      .eq("id", id);

    if (error) {

      alert(error.message);

      return;

    }

    await cargarMensualidades();

  };



  const mensualidadesFiltradas = mensualidades.filter((m) => {

    const nombreCompleto =
  `${m.jugadores?.[0]?.nombre_jugador || ""} ${m.jugadores?.[0]?.apellido_jugador || ""}`
    .toLowerCase();

    const coincideBusqueda =
      nombreCompleto.includes(busqueda.toLowerCase());

    const coincideEstado =
      estadoFiltro === ""
        ? true
        : m.estado === estadoFiltro;

    const coincideCategoria =
      categoriaFiltro === ""
        ? true
        : m.jugadores?.[0]?.categoria === categoriaFiltro;

    return (
      coincideBusqueda &&
      coincideEstado &&
      coincideCategoria
    );

  });
    return (

    <div className="min-h-screen bg-[#f5f6fa] p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Gestión de Pagos 💳
          </h1>

          <p className="text-gray-500 mt-2">
            Administración de mensualidades
          </p>

        </div>

        <button
          onClick={generarMensualidades}
          disabled={generando}
          className="
            bg-purple-600
            hover:bg-purple-700
            text-white
            px-8
            py-4
            rounded-2xl
            font-semibold
            transition
          "
        >

          {
            generando
              ? "Generando..."
              : "🗓️ Generar mensualidades"
          }

        </button>

      </div>

      {/* TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white rounded-3xl shadow p-8">

          <p className="text-gray-500">
            Total Recaudado
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">

            $
            {totalRecaudado.toLocaleString("es-CL")}

          </h2>

        </div>

        <div className="bg-white rounded-3xl shadow p-8">

          <p className="text-gray-500">
            Pagadas
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">

            {pagados}

          </h2>

        </div>

        <div className="bg-white rounded-3xl shadow p-8">

          <p className="text-gray-500">
            Pendientes
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-3">

            {pendientes}

          </h2>

        </div>

      </div>

      {/* FILTROS */}

      <div className="bg-white rounded-3xl shadow p-6 mb-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Buscar jugador..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            className="border rounded-2xl p-4"
          />

          <select
            value={estadoFiltro}
            onChange={(e) =>
              setEstadoFiltro(e.target.value)
            }
            className="border rounded-2xl p-4"
          >

            <option value="">
              Todos los estados
            </option>

            <option value="Pendiente">
              Pendiente
            </option>

            <option value="Pagado">
              Pagado
            </option>

          </select>

          <select
            value={categoriaFiltro}
            onChange={(e) =>
              setCategoriaFiltro(e.target.value)
            }
            className="border rounded-2xl p-4"
          >

            <option value="">
              Todas las categorías
            </option>

            <option value="Infantil">
              Infantil
            </option>

            <option value="Juvenil">
              Juvenil
            </option>

            <option value="Adulto">
              Adulto
            </option>

          </select>

        </div>

      </div>
            {/* TABLA */}

      <div className="bg-white rounded-3xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">Jugador</th>

              <th className="text-left p-4">Categoría</th>

              <th className="text-left p-4">Mes</th>

              <th className="text-left p-4">Monto</th>

              <th className="text-left p-4">Estado</th>

             <th className="text-center p-4">

  Comprobante

</th>

<th className="text-center p-4">

  Acción

</th>

            </tr>

          </thead>

          <tbody>

            {mensualidadesFiltradas.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >

                  No existen mensualidades.

                </td>

              </tr>

            ) : (

              mensualidadesFiltradas.map((pago) => (

                <tr
                  key={pago.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">

                    {pago.jugadores?.[0]?.nombre_jugador}{" "}
                    {pago.jugadores?.[0]?.apellido_jugador}

                  </td>

                  <td className="p-4">

                    {pago.jugadores?.[0]?.categoria}

                  </td>

                  <td className="p-4">

                    {pago.mes} {pago.anio}

                  </td>

                  <td className="p-4 font-semibold">

                    $
                    {pago.monto.toLocaleString("es-CL")}

                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                        pago.estado === "Pagado"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >

                      {pago.estado}

                    </span>

                  </td>

                  {/* COMPROBANTE */}

<td className="p-4 text-center">

  {pago.comprobante ? (

    <a
      href={pago.comprobante}
      target="_blank"
      rel="noopener noreferrer"
      className="
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-4
        py-2
        rounded-xl
        transition
      "
    >

      👁️ Ver

    </a>

  ) : (

    <span className="text-gray-400">

      Sin comprobante

    </span>

  )}

</td>

{/* ACCIONES */}

<td className="p-4 text-center">

  {pago.estado === "En revisión" ? (

    <button
      onClick={() => marcarPagado(pago.id)}
      className="
        bg-green-600
        hover:bg-green-700
        text-white
        px-4
        py-2
        rounded-xl
        transition
      "
    >

      ✅ Aprobar

    </button>

  ) : pago.estado === "Pendiente" ? (

    <span className="text-gray-400">

      Esperando comprobante

    </span>

  ) : (

    <button
      onClick={() => volverPendiente(pago.id)}
      className="
        bg-yellow-500
        hover:bg-yellow-600
        text-white
        px-4
        py-2
        rounded-xl
        transition
      "
    >

      ↩️ Volver pendiente

    </button>

  )}

</td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>
          </div>

  );

}