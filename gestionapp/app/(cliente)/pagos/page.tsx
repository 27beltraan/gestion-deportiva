"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Pagos() {

  const [monto, setMonto] = useState("");
  const [observacion, setObservacion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);

  const subirPago = async () => {

    if (!archivo) {
      alert("Debes subir un comprobante");
      return;
    }

    // para que archivo adjuntado no tenga espacios que dan error 
    const nombreLimpio = archivo.name.replace(/\s+/g, "-");
    const nombreArchivo = `${Date.now()}-${nombreLimpio}`;
    // subir a storage (base de datos)
    const { error: uploadError } = await supabase.storage
      .from("comprobantes")
      .upload(nombreArchivo, archivo);

    if (uploadError) {
      console.log(uploadError);
      alert(JSON.stringify(uploadError));
      console.log(uploadError);
      return;
    }

    // obtener url pública
    const { data } = supabase.storage
      .from("comprobantes")
      .getPublicUrl(nombreArchivo);

    const urlArchivo = data.publicUrl;

    // guardar en tabla pagos
    const { error } = await supabase
      .from("pagos")
      .insert([
        {
          nombre: "Adonis",
          monto: Number(monto),
          estado: "pendiente",
          comprobante: urlArchivo,
          observacion,
        },
      ]);

    if (error) {
      console.log(error);
      alert("Error guardando pago");
      return;
    }

    alert("Pago enviado correctamente");

    setMonto("");
    setObservacion("");
    setArchivo(null);
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Pagos 💳
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow max-w-2xl">

        {/* monto */}
        <div className="mb-6">

          <label className="block mb-2 font-medium">
            Monto
          </label>

          <input
            type="number"
            placeholder="Ingresa el monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full border rounded-xl p-4 outline-none"
          />

        </div>

        {/* observacion */}
        <div className="mb-6">

          <label className="block mb-2 font-medium">
            Observación
          </label>

          <textarea
            placeholder="Ej: pago mensual mayo"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            className="w-full border rounded-xl p-4 outline-none h-32"
          />

        </div>

        {/* archivo */}
        <div className="mb-6">

          <label className="block mb-2 font-medium">
            Comprobante
          </label>

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                setArchivo(e.target.files[0]);
              }
            }}
            className="w-full"
          />

        </div>

        {/* boton */}
        <button
          onClick={subirPago}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition"
        >
          Enviar Pago
        </button>

      </div>

    </div>
  );
}