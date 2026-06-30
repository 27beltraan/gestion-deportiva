import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nombre,
      apellido,
      correo,
      password,
      telefono,
      categoria,
      mensualidad,
      diaPago,
    } = body;

    // Crear usuario en Authentication
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: correo,
        password,
        email_confirm: true,
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Guardar jugador
    const { error: jugadorError } = await supabaseAdmin
      .from("jugadores")
      .insert({
        auth_id: authData.user.id,
        nombre_jugador: nombre,
        apellido_jugador: apellido,
        edad: 0,
        categoria,
        posicion: "",
        nombre_apoderado: "",
        telefono,
        correo,
        mensualidad: Number(mensualidad),
        dia_pago: diaPago,
      });

    if (jugadorError) {
      return NextResponse.json(
        { error: jugadorError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}