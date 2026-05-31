"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import jsPDF from "jspdf";

import {
  FileText,
  Search,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react";

interface Certificado {

  id: string;

  nombre: string;

  correo: string;

  tipo: string;

  estado: string;

  fecha_solicitud: string;

  pdf_url: string;
}

export default function CertificadosAdmin() {

  const [certificados,
    setCertificados] =
    useState<Certificado[]>([]);

  const [busqueda,
    setBusqueda] =
    useState("");

  // OBTENER CERTIFICADOS
  const obtenerCertificados =
    async () => {

      const { data } =
        await supabase
          .from("certificados")
          .select("*")
          .order(
            "created_at",
            { ascending: false }
          );

      setCertificados(
        data || []
      );
    };


  // GENERAR PDF
  const generarPDF =
    async (
      certificado: Certificado
    ) => {

      try {

        const doc =
          new jsPDF();

        // TITULO
        doc.setFontSize(24);

        doc.text(
          "CERTIFICADO",
          70,
          30
        );

        // CONTENIDO
        doc.setFontSize(14);

        doc.text(
          "Se certifica que:",
          20,
          60
        );

        doc.setFontSize(20);

        doc.text(
          certificado.nombre,
          20,
          80
        );

        doc.setFontSize(14);

        doc.text(
          "Ha solicitado el certificado de tipo:",
          20,
          110
        );

        doc.setFontSize(18);

        doc.text(
          certificado.tipo,
          20,
          130
        );

        doc.setFontSize(12);

        doc.text(
          `Fecha solicitud: ${certificado.fecha_solicitud}`,
          20,
          170
        );

        doc.text(
          "Club Deportivo",
          20,
          190
        );

        // PDF BLOB
        const pdfBlob =
          doc.output("blob");

        // NOMBRE
        const fileName =
          `certificado-${certificado.id}.pdf`;

        // SUBIR STORAGE
        const {
          error: uploadError,
        } =
          await supabase.storage
            .from("certificados")
            .upload(
              fileName,
              pdfBlob,
              {
                contentType:
                  "application/pdf",

                upsert: true,
              }
            );

        if (uploadError) {

          console.log(
            uploadError
          );

          alert(
            "Error subiendo PDF"
          );

          return;
        }

        // URL PUBLICA
        const {
          data: publicUrlData,
        } =
          supabase.storage
            .from("certificados")
            .getPublicUrl(
              fileName
            );

        const pdfUrl =
          publicUrlData.publicUrl;

        // GUARDAR URL
        const {
          error: updateError,
        } =
          await supabase
            .from("certificados")
            .update({

              estado:
                "Generado",

              pdf_url:
                pdfUrl,

            })
            .eq(
              "id",
              certificado.id
            );

        if (updateError) {

          console.log(
            updateError
          );

          alert(
            "Error guardando URL"
          );

          return;
        }

        alert(
          "PDF generado correctamente 😎"
        );

        obtenerCertificados();

      } catch (error) {

        console.log(error);

        alert(
          "Error generando PDF"
        );
      }
    };

  
  // CAMBIAR ESTADO

  const cambiarEstado =
    async (
      id: string,
      estado: string
    ) => {

      await supabase
        .from("certificados")
        .update({ estado })
        .eq("id", id);

      obtenerCertificados();
    };

  useEffect(() => {

    obtenerCertificados();

  }, []);

  // FILTRO

  const certificadosFiltrados =
    certificados.filter(
      (c) =>
        c.nombre
          ?.toLowerCase()
          .includes(
            busqueda.toLowerCase()
          )
    );

 
  // STATS
 
  const pendientes =
    certificados.filter(
      (c) =>
        c.estado ===
        "Pendiente"
    ).length;

  const entregados =
    certificados.filter(
      (c) =>
        c.estado ===
        "Entregado"
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
          Certificados Admin 🎓
        </h1>

        <p className="
          text-gray-500
          mt-2
        ">
          Gestiona solicitudes
          de certificados
        </p>

      </div>

      {/* STATS */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
        mb-10
      ">

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
                text-4xl
                font-bold
                text-yellow-500
                mt-2
              ">
                {pendientes}
              </h2>

            </div>

            <Clock
              size={45}
              className="
                text-yellow-500
              "
            />

          </div>

        </div>

        {/* ENTREGADOS */}
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
                Entregados
              </p>

              <h2 className="
                text-4xl
                font-bold
                text-green-500
                mt-2
              ">
                {entregados}
              </h2>

            </div>

            <CheckCircle
              size={45}
              className="
                text-green-500
              "
            />

          </div>

        </div>

      </div>

      {/* BUSCADOR */}
      <div className="
        bg-white
        rounded-3xl
        shadow
        p-6
        mb-10
      ">

        <div className="
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

      </div>

      {/* GRID */}
      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
      ">

        {certificadosFiltrados.map(
          (certificado) => (

          <div
            key={certificado.id}
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

                  <h2 className="
                    text-2xl
                    font-bold
                  ">
                    {
                      certificado.nombre
                    }
                  </h2>

                  <p className="
                    text-gray-500
                  ">
                    {
                      certificado.correo
                    }
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
                  certificado.estado ===
                  "Pendiente"

                  ? "bg-yellow-500"

                  : certificado.estado ===
                    "Generado"

                  ? "bg-blue-500"

                  : "bg-green-500"
                }
              `}>

                {
                  certificado.estado
                }

              </span>

            </div>

            {/* INFO */}
            <div className="
              bg-gray-100
              rounded-2xl
              p-5
              mb-6
            ">

              <div className="
                flex
                justify-between
                mb-4
              ">

                <div>

                  <p className="
                    text-gray-500
                    text-sm
                  ">
                    Tipo
                  </p>

                  <h3 className="
                    font-bold
                    text-lg
                  ">
                    {
                      certificado.tipo
                    }
                  </h3>

                </div>

                <div>

                  <p className="
                    text-gray-500
                    text-sm
                  ">
                    Fecha
                  </p>

                  <h3 className="
                    font-bold
                  ">
                    {
                      certificado.fecha_solicitud
                    }
                  </h3>

                </div>

              </div>

            </div>

            {/* BOTONES */}
            <div className="
              flex
              flex-wrap
              gap-4
            ">

              {/* GENERAR PDF */}
              <button
                onClick={() =>
                  generarPDF(
                    certificado
                  )
                }
                className="
                  flex-1
                  bg-blue-500
                  hover:bg-blue-600
                  text-white
                  py-3
                  rounded-2xl
                  transition
                "
              >
                Generar PDF
              </button>

              {/* ENTREGAR */}
              <button
                onClick={() =>
                  cambiarEstado(
                    certificado.id,
                    "Entregado"
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
                Entregar
              </button>

              {/* DESCARGAR */}
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
                        px-5
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        h-full
                        transition
                      "
                    >

                      <Download
                        size={18}
                      />

                    </button>

                  </a>

                )
              }

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}