import { supabase } from "../supabase/supabaseClient";

/**
 * Intenta iniciar sesión con correo y contraseña
 * @param {string} correo - El correo del usuario
 * @param {string} contrasena - La contraseña del usuario
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const login = async (correo, contrasena) => {
  try {
    // Consultar la tabla usuarios
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", correo)
      .eq("contrasena", contrasena)
      .single();

    if (error) {
      // Si no se encuentra el usuario o hay un error
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "Correo o contraseña incorrectos",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Correo o contraseña incorrectos",
      };
    }

    // Login exitoso
    return {
      success: true,
      data: {
        usuario_id: data.usuario_id,
        nombre: data.nombre,
        correo: data.correo,
        tipo_usuario: data.tipo_usuario,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Error al conectar con el servidor",
    };
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logout = () => {
  // Limpiar el almacenamiento local
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
};

/**
 * Obtiene el usuario actual del almacenamiento local
 * @returns {object|null}
 */
export const getCurrentUser = () => {
  const userStr =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Guarda el usuario en el almacenamiento local
 * @param {object} user - Los datos del usuario
 * @param {boolean} remember - Si debe recordar la sesión
 */
export const saveUser = (user, remember = false) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("user", JSON.stringify(user));
};
