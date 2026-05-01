'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    const user = data.user

    if (!user) {
      alert('Usuario no creado')
      return
    }

    // insertar en tabla usuarios
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert([
        {
          id: user.id,
          email: email,
          nombre: nombre,
        },
      ])

    if (insertError) {
      console.log(insertError)
      alert('Error guardando usuario')
      return
    }

    alert('Usuario registrado correctamente 🔥')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Registro</h1>

      <input
        type="text"
        placeholder="Nombre"
        onChange={(e) => setNombre(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Correo"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleRegister}>
        Registrarse
      </button>
    </div>
  )
}