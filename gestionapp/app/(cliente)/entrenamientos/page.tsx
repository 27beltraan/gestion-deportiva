"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

interface Entrenamiento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
}

export default function Entrenamientos() {

  const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([]);

  // obtener entrenamientos
  const obtenerEntrenamientos = async () => {

    const { data, error } = await supabase
      .from("entrenamientos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setEntrenamientos(data);
  };

  useEffect(() => {
    obtenerEntrenamientos();
  }, []);

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Entrenamientos 🏋️
      </h1>

      <div className="grid gap-6">

        {entrenamientos.map((entrenamiento) => (

          <div
            key={entrenamiento.id}
            className="bg-white p-6 rounded-2xl shadow"
          >

            <h2 className="text-2xl font-bold mb-2">
              {entrenamiento.titulo}
            </h2>

            <p className="text-gray-500 mb-4">
              {entrenamiento.descripcion}
            </p>

            <div className="flex gap-6 text-sm text-gray-400">

              <span>
                📅 {entrenamiento.fecha}
              </span>

              <span>
                ⏰ {entrenamiento.hora}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}