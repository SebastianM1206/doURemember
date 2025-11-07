import { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  logout as logoutService,
  checkSession,
} from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado al cargar la aplicación
    const initializeAuth = async () => {
      try {
        // Primero intentar obtener del localStorage (incluye verificación de expiración)
        const currentUser = getCurrentUser();

        if (currentUser) {
          // Verificar también con Supabase que la sesión siga activa
          const session = await checkSession();

          if (session) {
            setUser(currentUser);
          } else {
            // Si no hay sesión en Supabase, limpiar localStorage
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error al inicializar autenticación:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
