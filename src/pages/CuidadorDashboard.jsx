import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function CuidadorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      await logout();
      navigate("/login");
    }
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
            onClick={handleLogout}
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
          {/* Card: Mis Pacientes */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Mis Pacientes
              </h3>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ver y gestionar pacientes asignados
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
              Ver Pacientes
            </button>
          </div>

          {/* Card: Tareas del Día */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Tareas del Día
              </h3>
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Tareas y actividades programadas
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
              Ver Tareas
            </button>
          </div>

          {/* Card: Crear Actividad */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Crear Actividad
              </h3>
              <div className="bg-purple-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Programar nuevas actividades para pacientes
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
              Nueva Actividad
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
              Ver reportes de progreso de pacientes
            </p>
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
              Ver Reportes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CuidadorDashboard;
