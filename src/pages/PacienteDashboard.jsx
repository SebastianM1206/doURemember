import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function PacienteDashboard() {
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
            <p className="text-sm text-gray-600">Mi Portal de Paciente</p>
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
            Hola, {user?.nombre}
          </h2>
          <p className="text-gray-600">
            Aquí podrás ver tus actividades, recordatorios y progreso diario.
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Mis Actividades */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Mis Actividades
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ver actividades programadas para hoy
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
              Ver Actividades
            </button>
          </div>

          {/* Card: Recordatorios */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recordatorios
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Recordatorios pendientes y próximos
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
              Ver Recordatorios
            </button>
          </div>

          {/* Card: Mi Progreso */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Mi Progreso
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ver estadísticas y avances
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
              Ver Progreso
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PacienteDashboard;
