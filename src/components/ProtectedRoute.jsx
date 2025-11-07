import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Componente para proteger rutas que requieren autenticación y roles específicos
 * @param {object} props - Las props del componente
 * @param {React.ReactNode} props.children - El componente hijo a renderizar si está autenticado
 * @param {Array<string>} props.allowedRoles - Array de roles permitidos para acceder a la ruta
 * @returns {React.ReactNode}
 */
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si se especificaron roles y si el usuario tiene el rol correcto
  if (allowedRoles.length > 0 && user) {
    // Normalizar tanto el tipo de usuario como los roles permitidos a minúsculas
    const userType = user.tipo_usuario?.toLowerCase();
    const normalizedRoles = allowedRoles.map((role) => role.toLowerCase());
    const hasAllowedRole = normalizedRoles.includes(userType);

    if (!hasAllowedRole) {
      // Redirigir al dashboard correcto según el tipo de usuario
      const redirectPath = (() => {
        switch (userType) {
          case "paciente":
            return "/dashboard/paciente";
          case "cuidador":
            return "/dashboard/cuidador";
          case "doctor":
            return "/dashboard/doctor";
          case "administrador":
          case "admin":
            return "/dashboard/admin";
          default:
            return "/dashboard";
        }
      })();

      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
