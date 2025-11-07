import { supabase } from "../supabase/supabaseClient";

// ============================================
// FUNCIONES PARA OBTENER USUARIOS POR TIPO
// ============================================

//Función para obtener todos los usuarios del sistema (Se va a llamar en todos lados. luego localmente es que vamos a dividirlos)

export async function getAllUsers() {
  const session = (await supabase.auth.getSession()).data.session;
  const token = session?.access_token;

  if (!token) {
    return { data: null, error: "No hay sesión activa" };
  }

  const res = await fetch(
    "https://wjjldroqretgfpcufbnc.supabase.co/functions/v1/get-users",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return { data: null, error: data.error || "Error al obtener usuarios" };
  }

  return { data: data.users, error: null };
}

/**
 * Obtener estadísticas generales del sistema
 * Usa getAllUsers y calcula las estadísticas localmente
 */
export async function getSystemStats() {
  const { data, error } = await getAllUsers();

  if (error || !data) {
    console.error("Error al obtener estadísticas:", error);
    return {
      data: null,
      error: error || "Error al obtener datos",
    };
  }
  console.log("Datos de usuarios para estadísticas:", data);

  const stats = {
    totalUsers: data.length,
    totalDoctors: data.filter((u) => u.tipo_usuario === "Doctor").length,
    totalPatients: data.filter((u) => u.tipo_usuario === "Paciente").length,
    totalCaregivers: data.filter((u) => u.tipo_usuario === "Cuidador").length,
  };

  return { data: stats, error: null };
}

// ============================================
// FUNCIONES CRUD (CREATE, UPDATE, DELETE)
// ============================================

/**
 * Crear un nuevo usuario
 * Utiliza edge function en Supabase para crear usuarios con rol específico
 * @param {Object} userData - Datos del usuario a crear
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.password - Contraseña del usuario
 * @param {string} userData.nombre - Nombre completo del usuario
 * @param {string} userData.tipo_usuario - Tipo de usuario (Doctor, Paciente, Cuidador)
 */
export async function createUser({ email, password, nombre, tipo_usuario }) {
  try {
    const session = (await supabase.auth.getSession()).data.session;
    const token = session?.access_token;

    if (!token) {
      return { data: null, error: "No hay sesión activa" };
    }

    const res = await fetch(
      "https://wjjldroqretgfpcufbnc.supabase.co/functions/v1/create-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password, nombre, tipo_usuario }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { data: null, error: data.error || "Error al crear usuario" };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return { data: null, error: error.message };
  }
}

/**
 * Eliminar un usuario
 * Utiliza edge function en Supabase
 * @param {string} id - ID del usuario a eliminar
 */
export async function deleteUser(id) {
  try {
    const session = (await supabase.auth.getSession()).data.session;
    const token = session?.access_token;

    if (!token) {
      return { data: null, error: "No hay sesión activa" };
    }

    const res = await fetch(
      "https://wjjldroqretgfpcufbnc.supabase.co/functions/v1/delete-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { data: null, error: data.error || "Error al eliminar usuario" };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { data: null, error: error.message };
  }
}

/**
 * Actualizar información de un usuario
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} updateData - Datos a actualizar
 * @param {string} updateData.nombre - Nuevo nombre (opcional)
 * @param {string} updateData.tipo_usuario - Nuevo tipo de usuario (opcional)
 */
export async function updateUser(id, updateData) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error al actualizar usuario:", error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return { data: null, error: error.message };
  }
}
