import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "../hooks/useConfirm";
import ConfirmDialog from "../components/common/ConfirmDialog";

function CuidadorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const logoutConfirm = useConfirm();

  const handleLogoutClick = () => {
    logoutConfirm.openConfirm();
  };

  const confirmLogout = async () => {
    await logout();
    navigate("/login");
    logoutConfirm.closeConfirm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DoURemember</h1>
            <p className="text-sm text-gray-600">Portal de Cuidador</p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Bienvenido, {user?.nombre}
          </h2>
          <p className="text-gray-600">
            Gestiona a tus pacientes y sus actividades desde este panel.
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Tareas del Día */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Imagenes</h3>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 15l4-4 4 4 4-5 4 5"
                  />
                  <circle cx={8.5} cy={8.5} r={1.5} fill="currentColor" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ver imágenes que saldrán en los test
            </p>
            <button
              onClick={() => navigate("/dashboard/cuidador/imagenes")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Ver Imagenes
            </button>
          </div>

          {/* Card: Reportes */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reportes</h3>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ver reportes de progreso del paciente
            </p>
            <button
              onClick={() => navigate("/dashboard/cuidador/reportes")}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Ver Reportes
            </button>
          </div>
        </div>
      </main>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={logoutConfirm.isOpen}
        onClose={logoutConfirm.closeConfirm}
        onConfirm={confirmLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  );
}

export default CuidadorDashboard;
