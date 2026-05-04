'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  const handleRegister = async () => {
    //VALIDACIÓN
    if (!nombre || !email || !password) {
      alert('Completa todos los campos')
      return
    }

    console.log('Registrando:', { nombre, email })

    //CREAR USUARIO EN AUTH
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
      alert('No se pudo crear el usuario')
      return
    }

    //GUARDAR EN TABLA USUARIOS
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert([
        {
          id: user.id,
          email: user.email,
          nombre: nombre,
        },
      ])

    if (insertError) {
      console.log(insertError)
      alert('Error guardando datos')
      return
    }

    alert('Usuario registrado correctamente 🔥')

    //REDIRIGIR 
    router.push('/login')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Registro</h1>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button type="button" onClick={handleRegister}>
        Registrarse
      </button>
    </div>
  )
}