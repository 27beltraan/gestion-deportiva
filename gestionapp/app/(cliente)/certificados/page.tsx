"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  FileText,
  Clock,
  CheckCircle,
  Download,
  Plus,
} from "lucide-react";

interface Certificado {

  id: string;

  tipo: string;

  estado: string;

  fecha_solicitud: string;

  pdf_url: string;
}

export default function CertificadosCliente() {

  const [tipo,
    setTipo] =
    useState("");

  const [certificados,
    setCertificados] =
    useState<Certificado[]>([]);

  const [loading,
    setLoading] =
    useState(false);

  // OBTENER
  const obtenerCertificados =
    async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      const { data } =
        await supabase
          .from("certificados")
          .select("*")
          .eq(
            "correo",
            user.email
          )
          .order(
            "created_at",
            { ascending: false }
          );

      setCertificados(
        data || []
      );
    };

  // SOLICITAR
  const solicitarCertificado =
    async () => {

      if (!tipo) {

        alert(
          "Selecciona un certificado"
        );

        return;
      }

      setLoading(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      // OBTENER NOMBRE
      const { data: usuario } =
        await supabase
          .from("usuarios")
          .select("*")
          .eq(
            "email",
            user.email
          )
          .single();

      const fechaActual =
        new Date()
          .toLocaleDateString();

      const { error } =
        await supabase
          .from("certificados")
          .insert([
            {
              nombre:
                usuario?.nombre,
              correo:
                user.email,
              tipo,
              estado:
                "Pendiente",
              fecha_solicitud:
                fechaActual,
            },
          ]);

      setLoading(false);

      if (error) {

        console.log(error);

        alert(
          "Error solicitando certificado"
        );

        return;
      }

      alert(
        "Solicitud enviada correctamente"
      );

      setTipo("");

      obtenerCertificados();
    };

  useEffect(() => {

    obtenerCertificados();

  }, []);

  // COLOR
  const obtenerEstado =
    (estado: string) => {

      switch (estado) {

        case "Pendiente":
          return "bg-yellow-500";

        case "Generado":
          return "bg-blue-500";

        case "Entregado":
          return "bg-green-500";

        default:
          return "bg-gray-500";
      }
    };

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
          Certificados 🎓
        </h1>

        <p className="
          text-gray-500
          mt-2
        ">
          Solicita y descarga
          tus certificados
        </p>

      </div>

      {/* SOLICITAR */}
      <div className="
        bg-white
        rounded-3xl
        shadow
        p-8
        mb-10
      ">

        <div className="
          flex
          items-center
          gap-4
          mb-6
        ">

          <div className="
            bg-purple-100
            p-4
            rounded-2xl
          ">

            <Plus
              className="
                text-purple-600
              "
            />

          </div>

          <div>

            <h2 className="
              text-2xl
              font-bold
            ">
              Nueva Solicitud
            </h2>

            <p className="
              text-gray-500
            ">
              Solicita un nuevo certificado
            </p>

          </div>

        </div>

        {/* FORM */}
        <div className="
          flex
          flex-col
          lg:flex-row
          gap-6
        ">

          {/* SELECT */}
          <select
            value={tipo}
            onChange={(e) =>
              setTipo(
                e.target.value
              )
            }
            className="
              flex-1
              border
              rounded-2xl
              p-4
              outline-none
              focus:ring-2
              focus:ring-purple-500
            "
          >

            <option value="">
              Seleccionar certificado
            </option>

            <option>
              Alumno regular
            </option>

            <option>
              Participación
            </option>

            <option>
              Pago al día
            </option>

            <option>
              Asistencia
            </option>

          </select>

          {/* BOTON */}
          <button
            onClick={
              solicitarCertificado
            }
            disabled={loading}
            className="
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
                ? "Enviando..."
                : "Solicitar"
            }

          </button>

        </div>

      </div>

      {/* HISTORIAL */}
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
          mb-8
        ">

          <FileText
            className="
              text-purple-600
            "
          />

          <h2 className="
            text-2xl
            font-bold
          ">
            Historial solicitudes
          </h2>

        </div>

        <div className="
          space-y-6
        ">

          {certificados.map(
            (certificado) => (

            <div
              key={certificado.id}
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
              <div className="
                flex
                items-center
                gap-4
              ">

                <div className="
                  bg-purple-100
                  p-4
                  rounded-2xl
                ">

                  <FileText
                    className="
                      text-purple-600
                    "
                  />

                </div>

                <div>

                  <h3 className="
                    text-2xl
                    font-bold
                  ">
                    {
                      certificado.tipo
                    }
                  </h3>

                  <p className="
                    text-gray-500
                    mt-1
                  ">
                    Solicitud:
                    {" "}
                    {
                      certificado.fecha_solicitud
                    }
                  </p>

                </div>

              </div>

              {/* ESTADO */}
              <div>

                <span className={`
                  ${obtenerEstado(
                    certificado.estado
                  )}

                  px-5
                  py-2
                  rounded-full
                  text-white
                  font-semibold
                `}>

                  {
                    certificado.estado
                  }

                </span>

              </div>

              {/* ICON */}
              <div className="
                flex
                items-center
                gap-4
              ">

                {
                  certificado.estado ===
                  "Pendiente" && (

                    <Clock
                      className="
                        text-yellow-500
                      "
                    />

                  )
                }

                {
                  certificado.estado ===
                  "Entregado" && (

                    <CheckCircle
                      className="
                        text-green-500
                      "
                    />

                  )
                }

                {/* PDF */}
                {
                  certificado.pdf_url && (

                    <a
                      href={
                        certificado.pdf_url
                      }
                      target="_blank"
                    >

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

                        <Download
                          size={18}
                        />

                        Descargar

                      </button>

                    </a>

                  )
                }

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* VACIO */}
      {
        certificados.length === 0 && (

          <div className="
            bg-white
            rounded-3xl
            shadow
            p-12
            text-center
            mt-10
          ">

            <FileText
              size={50}
              className="
                mx-auto
                text-purple-500
                mb-4
              "
            />

            <h2 className="
              text-2xl
              font-bold
              mb-2
            ">
              Sin solicitudes
            </h2>

            <p className="
              text-gray-500
            ">
              Aún no has solicitado
              certificados
            </p>

          </div>

        )
      }

    </div>
  );
}