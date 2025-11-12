import { supabase } from "../supabase/supabaseClient";






/**
 * Envía una invitación a un usuario mediante la edge function
 * @param {string} grupoId - UUID del grupo médico
 * @param {string} email - Email del usuario a invitar
 * @param {string} tipo - Tipo de usuario ('medico', 'cuidador', 'paciente')
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function inviteUser(grupoId, email, tipo) {
  try {
    // 🔑 Obtener el token del doctor autenticado
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("No hay sesión activa");

    // 🧠 Construir los datos a enviar
    const body = {
      grupo_id: grupoId,
      email,
      tipo_usuario: tipo,
    };

    // 🚀 Hacer la petición al Edge Function
    const res = await fetch(
      "https://wjjldroqretgfpcufbnc.supabase.co/functions/v1/send-invite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Error enviando invitación");

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.error("Error al enviar invitación:", err);
    return {
      success: false,
      error: err.message || "Error al enviar la invitación",
    };
  }
}

/**
 * Crea un nuevo grupo en la base de datos
 * @param {string} medicoId - UUID del médico
 * @param {string|null} cuidadorId - UUID del cuidador (opcional, puede ser null)
 * @param {string|null} pacienteId - UUID del paciente (opcional, puede ser null)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createGrupo(
  medicoId,
  cuidadorId = null,
  pacienteId = null
) {
  try {
    const { data, error } = await supabase
      .from("grupos")
      .insert({
        medico_id: medicoId,
        ciudador_id: cuidadorId,
        paciente_id: pacienteId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error al crear grupo:", error);
      return {
        success: false,
        error: error.message || "Error al crear el grupo",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error al crear grupo:", error);
    return {
      success: false,
      error: "Error al conectar con el servidor",
    };
  }
}

/**
 * Actualiza un grupo existente con los IDs del cuidador y/o paciente
 * @param {number} grupoId - ID del grupo a actualizar
 * @param {object} updates - Objeto con los campos a actualizar
 * @param {string} updates.cuidadorId - UUID del cuidador
 * @param {string} updates.pacienteId - UUID del paciente
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function updateGrupo(grupoId, { cuidadorId, pacienteId }) {
  try {
    const updates = {};

    if (cuidadorId) updates.ciudador_id = cuidadorId;
    if (pacienteId) updates.paciente_id = pacienteId;

    const { data, error } = await supabase
      .from("grupos")
      .update(updates)
      .eq("id", grupoId)
      .select()
      .single();

    if (error) {
      console.error("Error al actualizar grupo:", error);
      return {
        success: false,
        error: error.message || "Error al actualizar el grupo",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error al actualizar grupo:", error);
    return {
      success: false,
      error: "Error al conectar con el servidor",
    };
  }
}

/**
 * Obtiene todos los grupos de un médico específico
 * @param {string} medicoId - UUID del médico
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export async function getGruposByMedico(medicoId) {
  try {
    const { data, error } = await supabase
      .from("grupos")
      .select(
        `
        *,
        medico:profiles!grupos_medico_id_fkey(id, nombre, email),
        cuidador:profiles!grupos_ciudador_id_fkey(id, nombre, email),
        paciente:profiles!grupos_paciente_id_fkey(id, nombre, email)
      `
      )
      .eq("medico_id", medicoId);

    if (error) {
      console.error("Error al obtener grupos:", error);
      return {
        success: false,
        error: error.message || "Error al obtener los grupos",
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error al obtener grupos:", error);
    return {
      success: false,
      error: "Error al conectar con el servidor",
    };
  }
}

/**
 * Obtiene un grupo específico por su ID
 * @param {number} grupoId - ID del grupo
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function getGrupoById(grupoId) {
  try {
    const { data, error } = await supabase
      .from("grupos")
      .select(
        `
        *,
        medico:profiles!grupos_medico_id_fkey(id, nombre, email),
        cuidador:profiles!grupos_ciudador_id_fkey(id, nombre, email),
        paciente:profiles!grupos_paciente_id_fkey(id, nombre, email)
      `
      )
      .eq("id", grupoId)
      .single();

    if (error) {
      console.error("Error al obtener grupo:", error);
      return {
        success: false,
        error: error.message || "Error al obtener el grupo",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error al obtener grupo:", error);
    return {
      success: false,
      error: "Error al conectar con el servidor",
    };
  }
}

/**
 * Elimina un grupo
 * @param {number} grupoId - ID del grupo a eliminar
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteGrupo(grupoId) {
  try {
    const { error } = await supabase.from("grupos").delete().eq("id", grupoId);

    if (error) {
      console.error("Error al eliminar grupo:", error);
      return {
        success: false,
        error: error.message || "Error al eliminar el grupo",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error al eliminar grupo:", error);
    return {
      success: false,
      error: "Error al conectar con el servidor",
    };
  }
}
