import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../components/Login";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import PacienteDashboard from "../pages/PacienteDashboard";
import CuidadorDashboard from "../pages/CuidadorDashboard";
import CuidadorImagenes from "../components/Cuidador/CuidadorImagenes";
import CuidadorReportes from "../components/Cuidador/CuidadorReportes";
import ProtectedRoute from "../components/ProtectedRoute";

/**
 * Componente de rutas de la aplicación
 * Para usar este componente:
 * 1. Instala react-router-dom: npm install react-router-dom
 * 2. Reemplaza el contenido de App.jsx con <AppRoutes />
 */
function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  // Función para redirigir al dashboard correcto según el tipo de usuario
  const getDefaultDashboard = () => {
    if (!user) return "/login";

    // Normalizar el tipo de usuario a minúsculas para comparación
    const tipoUsuario = user.tipo_usuario?.toLowerCase();

    switch (tipoUsuario) {
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
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login - redirige al dashboard si ya está autenticado */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultDashboard()} replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Ruta protegida del dashboard genérico */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas por tipo de usuario */}
        <Route
          path="/dashboard/paciente"
          element={
            <ProtectedRoute allowedRoles={["paciente"]}>
              <PacienteDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/cuidador"
          element={
            <ProtectedRoute allowedRoles={["cuidador"]}>
              <CuidadorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cuidador/imagenes"
          element={
            <ProtectedRoute allowedRoles={["cuidador"]}>
              <CuidadorImagenes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cuidador/reportes"
          element={
            <ProtectedRoute allowedRoles={["cuidador"]}>
              <CuidadorReportes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/doctor"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["administrador", "admin", "Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto - redirige según el estado de autenticación */}
        <Route
          path="/"
          element={<Navigate to={getDefaultDashboard()} replace />}
        />

        {/* Ruta 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Página no encontrada
                </p>
                <a
                  href="/"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
