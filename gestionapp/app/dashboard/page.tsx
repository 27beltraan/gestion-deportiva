'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [perfil, setPerfil] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getPerfil = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userData.user.id)
        .single()

      if (error) {
        console.log(error)
        return
      }

      setPerfil(data)
    }

    getPerfil()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }


return (
  <div style={{ padding: '20px' }}>
    <h1>Dashboard</h1>

    {perfil ? (
      <h2>Bienvenido, {perfil.nombre || 'Usuario'} 👋</h2>
    ) : (
      <p>No se encontró perfil</p>
    )}

    <br />

    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  </div>
)
}