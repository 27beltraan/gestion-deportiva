"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import jsPDF from "jspdf";

import {
  Search,
  Users,
  UserCheck,
  Download,
  FileText
  
} from "lucide-react";

interface Jugador {

  id:number;

  nombre_jugador:string;

  apellido_jugador:string;

  edad:number;

  categoria:string;

  posicion:string;

  nombre_apoderado:string;

  telefono:string;

  correo: string;

  mensualidad:number;

  dia_pago:string;
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

    const [jugadorSeleccionado,
  setJugadorSeleccionado] =
  useState<Jugador | null>(null);

  const [jugadorHistorial,
  setJugadorHistorial] =
  useState<Jugador | null>(null);

  const [historialAsistencias,
  setHistorialAsistencias] =
  useState<any[]>([]);

  const [estadoAsistencia,
  setEstadoAsistencia] =
  useState("Presente");




  // OBTENER JUGADORES
  const obtenerJugadores =
    async () => {

      const { data, error } =
        await supabase
          .from("jugadores")
          .select("*")
          .order(
            "nombre_jugador",
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

  const guardarAsistencia =
  async () => {

    if (!jugadorSeleccionado)
      return;

    const { error } =
      await supabase
        .from("asistencias")
        .insert({
          jugador_id:
            jugadorSeleccionado.id,

          estado:
            estadoAsistencia,
        });

   if (error) {

  console.log(error);

  alert(error.message);

  return;
}

    alert(
      "Asistencia guardada correctamente"
    );

    setJugadorSeleccionado(null);

};

const exportarPDF =
() => {

  const doc =
    new jsPDF();

  doc.setFontSize(20);

  doc.text(
    "CLUB DEPORTIVO FUTBOLEROS",
    20,
    20
  );

  doc.setFontSize(16);

  doc.text(
    `Listado de jugadores ${
      categoriaFiltro || ""
    }`,
    20,
    35
  );

  let y = 55;

  jugadoresFiltrados.forEach(
    (jugador) => {

      doc.setFontSize(12);

      doc.text(
        `${jugador.nombre_jugador} ${jugador.apellido_jugador}`,
        20,
        y
      );

      doc.text(
        jugador.posicion,
        90,
        y
      );

      doc.text(
        jugador.telefono,
        140,
        y
      );

      y += 10;

    }
  );

  doc.save(
    `jugadores-${categoriaFiltro || "todos"}.pdf`
  );

};

const exportarAsistenciaPDF =
async () => {

  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text(
    "CLUB DEPORTIVO REAL SAN JOAQUÍN",
    20,
    20
  );

  doc.setFontSize(16);

  doc.text(
    `ASISTENCIA ${
      categoriaFiltro || ""
    }`,
    20,
    35
  );

  doc.text(
    `Fecha: ${
      new Date().toLocaleDateString()
    }`,
    20,
    45
  );

  let y = 65;

  for (const jugador of jugadoresFiltrados) {

    const { data } =
      await supabase
        .from("asistencias")
        .select("*")
        .eq(
          "jugador_id",
          jugador.id
        )
        .order(
          "fecha",
          {
            ascending:false
          }
        )
        .limit(1);

    const estado =
      data?.length
      ? data[0].estado
      : "Sin registro";

    doc.setFontSize(12);

    doc.text(
      `${jugador.nombre_jugador} ${jugador.apellido_jugador}`,
      20,
      y
    );

    doc.text(
      estado,
      120,
      y
    );

    y += 10;

  }

  doc.save(
    `asistencia-${categoriaFiltro || "todos"}.pdf`
  );

};

const exportarPagosPDF =
async () => {

  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text(
    "CLUB DEPORTIVO REAL SAN JOAQUÍN",
    20,
    20
  );

  doc.setFontSize(16);

  doc.text(
    "REPORTE DE PAGOS",
    20,
    35
  );

  const {
    data,
    error
  } = await supabase
    .from("pagos")
    .select("*");

  if(error){

    alert(
      "Error cargando pagos"
    );

    return;
  }

  let y = 55;

  let totalRecaudado = 0;

  data.forEach(
    (pago:any) => {

      doc.setFontSize(12);

      doc.text(
        pago.nombre,
        20,
        y
      );

      doc.text(
        pago.estado,
        90,
        y
      );

      doc.text(
        `$${pago.monto}`,
        140,
        y
      );

      if(
        pago.estado ===
        "Aprobado"
      ){

        totalRecaudado +=
        pago.monto;

      }

      y += 10;

    }
  );

  y += 20;

  doc.setFontSize(14);

  doc.text(
    `Total recaudado: $${totalRecaudado}`,
    20,
    y
  );

  doc.save(
    "pagos.pdf"
  );

};

const obtenerHistorial =
async (jugadorId:number) => {

  const { data, error } =
    await supabase
      .from("asistencias")
      .select("*")
      .eq(
        "jugador_id",
        jugadorId
      )
      .order(
        "fecha",
        { ascending:false }
      );

  if(error){

    console.log(error);

    return;
  }

  setHistorialAsistencias(
    data || []
  );

};

const calcularPorcentaje =
() => {

  if (
    historialAsistencias.length === 0
  )
    return 0;

  const presentes =
    historialAsistencias.filter(
      (a) =>
        a.estado === "Presente"
    ).length;

  return Math.round(
    (
      presentes /
      historialAsistencias.length
    ) * 100
  );

};

  // FILTRO
  const jugadoresFiltrados =
    jugadores.filter((j) => {

      const coincideBusqueda =
        j.nombre_jugador
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

        <button
  onClick={exportarPDF}
  className="
    bg-red-600
    hover:bg-red-700
    text-white
    px-6
    py-4
    rounded-2xl
    flex
    items-center
    gap-2
  "
>

  <Download size={20} />

  Exportar PDF

</button>

<button
  onClick={exportarAsistenciaPDF}
  className="
    bg-green-600
    hover:bg-green-700
    text-white
    px-6
    py-4
    rounded-2xl
    flex
    items-center
    gap-2
  "
>

  <FileText size={20} />

  PDF Asistencia

</button>

<button
  onClick={exportarPagosPDF}
  className="
    bg-yellow-500
    hover:bg-yellow-600
    text-white
    px-6
    py-4
    rounded-2xl
    flex
    items-center
    gap-2
  "
>

  💰 PDF Pagos

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
                src={"/avatars/avatar1.png"
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
                  {jugador.nombre_jugador}
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
            {/* BOTÓN ASISTENCIA */}
            <div className="
            mt-6
            ">

  <button
    onClick={() =>
      setJugadorSeleccionado(
        jugador
      )
    }

    className="
      w-full
      bg-purple-600
      hover:bg-purple-700
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

    <UserCheck size={20} />

    Marcar asistencia

  </button>

</div>

<div className="mt-3">

  <button
   onClick={() => {

  setJugadorHistorial(
    jugador
  );

  obtenerHistorial(
    jugador.id
  );

}}
    className="
      w-full
      bg-blue-600
      hover:bg-blue-700
      text-white
      py-3
      rounded-2xl
      transition-all
    "
  >

    📋 Historial

  </button>

</div>



          </div>

        ))}

      </div>
{

  jugadorHistorial && (

    <div className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
    ">

      <div className="
        bg-white
        rounded-3xl
        p-8
        w-[500px]
        shadow-2xl
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-2
        ">
          Historial de asistencia
        </h2>

        <p className="
          text-gray-500
          mb-6
        ">
          {jugadorHistorial.nombre_jugador}
        </p>

        {/* PORCENTAJE */}
        <div className="
          bg-gray-100
          rounded-2xl
          p-4
          mb-6
        ">

          <h3
            className={`
              text-xl
              font-bold

              ${
                calcularPorcentaje() >= 80
                  ? "text-green-600"
                  : calcularPorcentaje() >= 60
                  ? "text-yellow-500"
                  : "text-red-600"
              }
            `}
          >

            Asistencia: {calcularPorcentaje()}%

          </h3>

          <p className="mt-2">

            {
              calcularPorcentaje() >= 80

                ? "🟢 Excelente asistencia"

                : calcularPorcentaje() >= 60

                ? "🟡 Asistencia regular"

                : "🔴 Baja asistencia"

            }

          </p>

        </div>

        {/* HISTORIAL */}
        <div className="
          space-y-3
        ">

          {
            historialAsistencias.map(
              (asistencia) => (

                <div
                  key={asistencia.id}
                  className="
                    bg-gray-100
                    p-4
                    rounded-2xl
                  "
                >

                  {asistencia.fecha}

                  {" - "}

                  {
                    asistencia.estado === "Presente"

                      ? "✅ Presente"

                      : "❌ Ausente"
                  }

                </div>

              ))
          }

        </div>

        <button
          onClick={() =>
            setJugadorHistorial(
              null
            )
          }
          className="
            mt-6
            w-full
            bg-red-500
            hover:bg-red-600
            text-white
            py-3
            rounded-2xl
          "
        >

          Cerrar

        </button>

      </div>

    </div>

  )
}

      {
  jugadorSeleccionado && (

    <div className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
    ">

      <div className="
        bg-white
        rounded-3xl
        p-8
        w-[400px]
        shadow-2xl
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-2
        ">
          Registrar asistencia
        </h2>

        <p className="
          text-gray-500
          mb-6
        ">
          {jugadorSeleccionado.nombre_jugador}
        </p>

        <select
          value={estadoAsistencia}
          onChange={(e) =>
            setEstadoAsistencia(
              e.target.value
            )
          }
          className="
            w-full
            border
            rounded-2xl
            p-4
            mb-6
            outline-none
          "
        >

          <option>
            Presente
          </option>

          <option>
            Ausente
          </option>

        </select>

        

        <div className="
          flex
          gap-4
        ">

          <button
            onClick={
              guardarAsistencia
            }
            className="
              flex-1
              bg-green-600
              hover:bg-green-700
              text-white
              py-3
              rounded-2xl
            "
          >
            Guardar
          </button>

          <button
            onClick={() =>
              setJugadorSeleccionado(
                null
              )
            }
            className="
              flex-1
              bg-red-500
              hover:bg-red-600
              text-white
              py-3
              rounded-2xl
            "
          >
            Cancelar
          </button>

        </div>

      </div>

    </div>

  )
}

    </div>
  );
}