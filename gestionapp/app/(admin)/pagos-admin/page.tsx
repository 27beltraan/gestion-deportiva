"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Search,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";

interface Pago {

  id: string;

  nombre: string;

  correo: string;

  categoria: string;

  monto: number;

  estado: string;

  fecha_pago: string;

  metodo_pago: string;

  avatar: string;
}

export default function PagosAdmin() {

  const [pagos,
    setPagos] =
    useState<Pago[]>([]);

  const [busqueda,
    setBusqueda] =
    useState("");

  const [estadoFiltro,
    setEstadoFiltro] =
    useState("");

  const [categoriaFiltro,
    setCategoriaFiltro] =
    useState("");

  // OBTENER
  const obtenerPagos =
    async () => {

      const { data } =
        await supabase
          .from("pagos")
          .select("*")
          .order(
            "fecha_pago",
            { ascending: false }
          );

      setPagos(data || []);
    };

  // ACTUALIZAR
  const cambiarEstado =
    async (
      id: string,
      estado: string
    ) => {

      await supabase
        .from("pagos")
        .update({ estado })
        .eq("id", id);

      obtenerPagos();
    };

  useEffect(() => {

    obtenerPagos();

  }, []);

  // FILTROS
  const pagosFiltrados =
    pagos.filter((p) => {

      const coincideBusqueda =
        p.nombre
          .toLowerCase()
          .includes(
            busqueda.toLowerCase()
          );

      const coincideEstado =
        estadoFiltro === ""
          ? true
          : p.estado ===
            estadoFiltro;

      const coincideCategoria =
        categoriaFiltro === ""
          ? true
          : p.categoria ===
            categoriaFiltro;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideCategoria
      );
    });

  // STATS
  const totalRecaudado =
    pagos
      .filter(
        (p) =>
          p.estado ===
          "Pagado"
      )
      .reduce(
        (acc, pago) =>
          acc + pago.monto,
        0
      );

  const pendientes =
    pagos.filter(
      (p) =>
        p.estado ===
        "Pendiente"
    ).length;

  const pagados =
    pagos.filter(
      (p) =>
        p.estado ===
        "Pagado"
    ).length;

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
          Gestión Pagos 💳
        </h1>

        <p className="
          text-gray-500
          mt-2
        ">
          Administración financiera
        </p>

      </div>

      {/* STATS */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
        mb-10
      ">

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
            justify-between
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Total recaudado
              </p>

              <h2 className="
                text-3xl
                font-bold
                text-green-600
                mt-2
              ">
                $
                {totalRecaudado}
              </h2>

            </div>

            <DollarSign
              size={40}
              className="
                text-green-600
              "
            />

          </div>

        </div>

        {/* PAGADOS */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          p-8
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
                Pagos realizados
              </p>

              <h2 className="
                text-3xl
                font-bold
                text-blue-600
                mt-2
              ">
                {pagados}
              </h2>

            </div>

            <CheckCircle
              size={40}
              className="
                text-blue-600
              "
            />

          </div>

        </div>

        {/* PENDIENTES */}
        <div className="
          bg-white
          rounded-3xl
          shadow
          p-8
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
                Pendientes
              </p>

              <h2 className="
                text-3xl
                font-bold
                text-red-600
                mt-2
              ">
                {pendientes}
              </h2>

            </div>

            <AlertTriangle
              size={40}
              className="
                text-red-600
              "
            />

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
        mb-10
      ">

        {/* BUSCAR */}
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

        {/* ESTADO */}
        <select
          value={estadoFiltro}
          onChange={(e) =>
            setEstadoFiltro(
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
            Todos estados
          </option>

          <option>
            Pagado
          </option>

          <option>
            Pendiente
          </option>

        </select>

        {/* CATEGORIA */}
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
        xl:grid-cols-2
        gap-6
      ">

        {pagosFiltrados.map(
          (pago) => (

          <div
            key={pago.id}
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
              justify-between
              mb-6
            ">

              <div className="
                flex
                items-center
                gap-4
              ">

                <img
                  src={
                    pago.avatar ||
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
                    text-2xl
                    font-bold
                  ">
                    {pago.nombre}
                  </h2>

                  <p className="
                    text-gray-500
                  ">
                    {pago.categoria}
                  </p>

                </div>

              </div>

              {/* ESTADO */}
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

            {/* INFO */}
            <div className="
              grid
              grid-cols-2
              gap-4
              mb-6
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

              <div className="
                bg-gray-100
                rounded-2xl
                p-4
              ">

                <p className="
                  text-sm
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

              <div className="
                bg-gray-100
                rounded-2xl
                p-4
                col-span-2
              ">

                <p className="
                  text-sm
                  text-gray-500
                ">
                  Fecha pago
                </p>

                <h3 className="
                  font-bold
                ">
                  {
                    pago.fecha_pago
                  }
                </h3>

              </div>

            </div>

            {/* BOTONES */}
            <div className="
              flex
              flex-wrap
              gap-4
            ">

              <button
                onClick={() =>
                  cambiarEstado(
                    pago.id,
                    "Pagado"
                  )
                }
                className="
                  flex-1
                  bg-green-500
                  hover:bg-green-600
                  text-white
                  py-3
                  rounded-2xl
                  transition
                "
              >
                Marcar Pagado
              </button>

              <button
                onClick={() =>
                  cambiarEstado(
                    pago.id,
                    "Pendiente"
                  )
                }
                className="
                  flex-1
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  py-3
                  rounded-2xl
                  transition
                "
              >
                Pendiente
              </button>

              <button
                className="
                  bg-purple-600
                  hover:bg-purple-700
                  text-white
                  px-5
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  transition
                "
              >

                <Download size={18} />

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* VACIO */}
      {
        pagosFiltrados.length === 0 && (

          <div className="
            bg-white
            rounded-3xl
            shadow
            p-12
            text-center
            mt-10
          ">

            <XCircle
              size={50}
              className="
                mx-auto
                text-red-500
                mb-4
              "
            />

            <h2 className="
              text-2xl
              font-bold
              mb-2
            ">
              No hay pagos 😢
            </h2>

            <p className="
              text-gray-500
            ">
              No existen pagos registrados
            </p>

          </div>

        )
      }

    </div>
  );
}