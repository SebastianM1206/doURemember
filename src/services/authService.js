import { supabase } from "../supabase/supabaseClient";

/**
 * Inicia sesión con correo y contraseña usando Supabase Auth
 * La sesión se guarda automáticamente por 7 días
 * @param {string} email - El correo del usuario
 * @param {string} password - La contraseña del usuario
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function login(email, password) {
  try {
    // Iniciar sesión con Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.error("Error al iniciar sesión:", authError.message);
      return {
        success: false,
        error: "Correo o contraseña incorrectos",
      };
    }

    const user = authData.user;

    // Obtener los datos de perfil asociados
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("nombre, tipo_usuario")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error al obtener el perfil:", profileError);
      return {
        success: false,
        error: "No se pudo obtener el perfil del usuario",
      };
    }

    // Guardar información adicional del usuario con timestamp para expiración de 7 días
    const userData = {
      id: user.id,
      email: user.email,
      nombre: profile.nombre,
      tipo_usuario: profile.tipo_usuario,
      timestamp: Date.now(),
    };

    localStorage.setItem("user", JSON.stringify(userData));

    // Todo correcto: retornar datos del usuario
    return {
      success: true,
      data: {
        usuario_id: user.id,
        nombre: profile.nombre,
        correo: user.email,
        tipo_usuario: profile.tipo_usuario,
      },
      message: `Bienvenido, ${profile.nombre}`,
    };
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
    return {
      success: false,
      error: "Error al conectar con el servidor",
    };
  }
}

/**
 * Cierra la sesión del usuario
 */
export const logout = async () => {
  try {
    // Cerrar sesión en Supabase Auth
    await supabase.auth.signOut();

    // Limpiar el almacenamiento local
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

/**
 * Obtiene el usuario actual del almacenamiento local
 * Verifica que la sesión no haya expirado (7 días)
 * @returns {object|null}
 */
export const getCurrentUser = () => {
  const userStr =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (userStr) {
    try {
      const userData = JSON.parse(userStr);

      // Verificar si han pasado 7 días (604800000 ms)
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (userData.timestamp && now - userData.timestamp > sevenDaysInMs) {
        // Sesión expirada, limpiar
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        return null;
      }

      return userData;
    } catch {
      return null;
    }
  }

  return null;
};

/**
 * Verifica la sesión actual con Supabase y retorna el usuario
 * @returns {Promise<object|null>}
 */
export const checkSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    return null;
  }
};
