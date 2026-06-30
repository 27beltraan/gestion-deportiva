"use client";

import { useState } from "react";

export default function JugadoresAdmin() {

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensualidad, setMensualidad] = useState("");
  const [diaPago, setDiaPago] = useState("");
  const [loading, setLoading] = useState(false);

  const registrarJugador = async () => {

    setLoading(true);

    try {

      const response = await fetch("/api/create-player", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          nombre,
          apellido,
          correo,
          password,
          telefono,
          categoria,
          mensualidad,
          diaPago,

        }),

      });

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {

        alert(data.error);

        return;

      }

      alert("Jugador registrado correctamente 😎");

      setNombre("");
      setApellido("");
      setCorreo("");
      setPassword("");
      setTelefono("");
      setCategoria("");
      setMensualidad("");
      setDiaPago("");

    } catch (error) {

      setLoading(false);

      alert("Error al conectar con el servidor.");

    }

  };

  return (

    <div className="p-8 min-h-screen bg-[#f5f6fa]">

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">

          Registrar Jugador ⚽

        </h1>

        <p className="text-gray-500 mt-2">

          Agrega nuevos jugadores al sistema

        </p>

      </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* FORMULARIO */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NOMBRE */}
            <div>

              <label className="block mb-2 font-medium">
                Nombre
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del jugador"
                className="w-full border rounded-2xl p-4"
              />

            </div>

            {/* APELLIDO */}
            <div>

              <label className="block mb-2 font-medium">
                Apellido
              </label>

              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Apellido del jugador"
                className="w-full border rounded-2xl p-4"
              />

            </div>

            {/* CORREO */}
            <div>

              <label className="block mb-2 font-medium">
                Correo electrónico
              </label>

              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@gmail.com"
                className="w-full border rounded-2xl p-4"
              />

            </div>

            {/* CONTRASEÑA */}
            <div>

              <label className="block mb-2 font-medium">
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full border rounded-2xl p-4"
              />

            </div>

            {/* TELÉFONO */}
            <div>

              <label className="block mb-2 font-medium">
                Teléfono
              </label>

              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+56 9..."
                className="w-full border rounded-2xl p-4"
              />

            </div>

            {/* CATEGORÍA */}
            <div>

              <label className="block mb-2 font-medium">
                Categoría
              </label>

              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full border rounded-2xl p-4"
              >

                <option value="">Seleccionar</option>
                <option>Infantil</option>
                <option>Juvenil</option>
                <option>Adulto</option>

              </select>

            </div>

            {/* MENSUALIDAD */}
            <div>

              <label className="block mb-2 font-medium">
                Mensualidad
              </label>

              <input
                type="number"
                value={mensualidad}
                onChange={(e) => setMensualidad(e.target.value)}
                placeholder="$35.000"
                className="w-full border rounded-2xl p-4"
              />

            </div>

            {/* DÍA DE PAGO */}
            <div>

              <label className="block mb-2 font-medium">
                Día de pago
              </label>

              <input
                type="text"
                value={diaPago}
                onChange={(e) => setDiaPago(e.target.value)}
                placeholder="05"
                className="w-full border rounded-2xl p-4"
              />

            </div>

          </div>

          <button
            onClick={registrarJugador}
            disabled={loading}
            className="
              mt-8
              w-full
              bg-purple-600
              hover:bg-purple-700
              text-white
              py-4
              rounded-2xl
              font-semibold
              transition
            "
          >

            {
              loading
                ? "Registrando..."
                : "Registrar Jugador"
            }

          </button>

        </div>
                {/* TARJETA */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow
            p-8
            flex
            flex-col
            items-center
          "
        >

          <img
            src="/avatars/avatar1.png"
            alt="Avatar"
            className="
              w-32
              h-32
              rounded-full
              border-4
              border-purple-500
              mb-6
            "
          />

          <h2 className="text-3xl font-bold">

            {nombre || apellido
              ? `${nombre} ${apellido}`
              : "Jugador"}

          </h2>

          <p className="text-gray-500 mt-2">

            {categoria || "Categoría"}

          </p>

          <div className="mt-8 w-full">

            <div className="bg-gray-100 rounded-2xl p-4 mb-4">

              <p className="text-gray-500">
                Mensualidad
              </p>

              <h3 className="font-bold text-2xl">
                ${mensualidad || 0}
              </h3>

            </div>

            <div className="bg-gray-100 rounded-2xl p-4">

              <p className="text-gray-500">
                Día de pago
              </p>

              <h3 className="font-bold text-2xl">
                {diaPago || "--"}
              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}