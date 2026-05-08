"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

interface Entrenamiento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
}

export default function EntrenamientosAdmin() {

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([]);

  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

  const [editandoId, setEditandoId] = useState<number | null>(null);

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

  // crear entrenamiento
  const crearEntrenamiento = async () => {

    const { error } = await supabase
      .from("entrenamientos")
      .insert([
        {
          titulo,
          descripcion,
          fecha,
          hora,
        },
      ]);

    if (error) {
      console.log(error);
      alert("Error creando entrenamiento");
      return;
    }

    alert("Entrenamiento creado");

    setTitulo("");
    setDescripcion("");
    setFecha("");
    setHora("");

    obtenerEntrenamientos();
  };

  // eliminar entrenamiento
  const eliminarEntrenamiento = async (id: number) => {

    const confirmar = confirm(
      "¿Eliminar entrenamiento?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("entrenamientos")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    obtenerEntrenamientos();
  };

  // editar entrenamiento
  const editarEntrenamiento = async (id: number) => {

    const { error } = await supabase
      .from("entrenamientos")
      .update({
        titulo,
        descripcion,
        fecha,
        hora,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    alert("Entrenamiento actualizado");

    setEditandoId(null);

    setTitulo("");
    setDescripcion("");
    setFecha("");
    setHora("");

    obtenerEntrenamientos();
  };

  // cargar datos para editar
  const cargarEdicion = (
    entrenamiento: Entrenamiento
  ) => {

    setTitulo(entrenamiento.titulo);
    setDescripcion(entrenamiento.descripcion);
    setFecha(entrenamiento.fecha);
    setHora(entrenamiento.hora);

    setEditandoId(entrenamiento.id);
  };

  useEffect(() => {
    obtenerEntrenamientos();
  }, []);

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Entrenamientos 🏋️
      </h1>

      {/* formulario */}
      <div className="bg-white p-8 rounded-2xl shadow mb-10">

        <div className="grid grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="border rounded-xl p-4"
          />

          <input
            type="text"
            placeholder="Fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border rounded-xl p-4"
          />

          <input
            type="text"
            placeholder="Hora"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="border rounded-xl p-4"
          />

        </div>

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border rounded-xl p-4 w-full mt-6 h-32"
        />

        <button
          onClick={() => {

            if (editandoId) {

              editarEntrenamiento(editandoId);

            } else {

              crearEntrenamiento();

            }
          }}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
        >
          {editandoId
            ? "Guardar cambios"
            : "Crear entrenamiento"}
        </button>

      </div>

      {/* lista */}
      <div className="grid gap-6">

        {entrenamientos.map((entrenamiento) => (

          <div
            key={entrenamiento.id}
            className="bg-white p-6 rounded-2xl shadow relative"
          >

            {/* menu */}
            <div className="absolute top-6 right-6">

              <button
                onClick={() =>
                  setMenuAbierto(
                    menuAbierto === entrenamiento.id
                      ? null
                      : entrenamiento.id
                  )
                }
              >
                <MoreVertical />
              </button>

              {menuAbierto === entrenamiento.id && (

                <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-lg w-44 z-50">

                  <button
                    onClick={() => {
                      cargarEdicion(entrenamiento);
                      setMenuAbierto(null);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100"
                  >
                    <Pencil size={18} />
                    Editar
                  </button>

                  <button
                    onClick={() => {
                      eliminarEntrenamiento(
                        entrenamiento.id
                      );
                      setMenuAbierto(null);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-red-500"
                  >
                    <Trash2 size={18} />
                    Eliminar
                  </button>

                </div>

              )}

            </div>

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
