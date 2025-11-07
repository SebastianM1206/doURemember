import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard({ tipo }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      await logout();
      navigate("/login");
    }
  };

  // Contenido específico según el tipo de usuario
  const getContentByType = () => {
    const tipoUsuario = tipo || user?.tipo_usuario;

    switch (tipoUsuario) {
      case "paciente":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Dashboard de Paciente
            </h2>
            <p className="text-gray-600">
              Bienvenido {user?.nombre}. Aquí podrás ver tus actividades,
              recordatorios y progreso.
            </p>
            {/* Aquí puedes agregar componentes específicos para pacientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Mis Actividades
                </h3>
                <p className="text-sm text-purple-700">
                  Ver actividades programadas
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Recordatorios
                </h3>
                <p className="text-sm text-purple-700">
                  Ver recordatorios pendientes
                </p>
              </div>
            </div>
          </div>
        );

      case "cuidador":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Dashboard de Cuidador
            </h2>
            <p className="text-gray-600">
              Bienvenido {user?.nombre}. Aquí podrás gestionar a tus pacientes y
              sus actividades.
            </p>
            {/* Aquí puedes agregar componentes específicos para cuidadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Mis Pacientes
                </h3>
                <p className="text-sm text-green-700">
                  Ver lista de pacientes asignados
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Tareas del Día
                </h3>
                <p className="text-sm text-green-700">Ver tareas pendientes</p>
              </div>
            </div>
          </div>
        );

      case "familiar":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Dashboard de Familiar
            </h2>
            <p className="text-gray-600">
              Bienvenido {user?.nombre}. Aquí podrás ver el progreso de tu
              familiar.
            </p>
            {/* Aquí puedes agregar componentes específicos para familiares */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Progreso del Paciente
                </h3>
                <p className="text-sm text-blue-700">
                  Ver estadísticas y progreso
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Notificaciones
                </h3>
                <p className="text-sm text-blue-700">
                  Ver alertas y actualizaciones
                </p>
              </div>
            </div>
          </div>
        );

      case "administrador":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Dashboard de Administrador
            </h2>
            <p className="text-gray-600">
              Bienvenido {user?.nombre}. Aquí podrás administrar el sistema.
            </p>
            {/* Aquí puedes agregar componentes específicos para administradores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">Usuarios</h3>
                <p className="text-sm text-red-700">
                  Gestionar usuarios del sistema
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">Reportes</h3>
                <p className="text-sm text-red-700">Ver reportes del sistema</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">
                  Configuración
                </h3>
                <p className="text-sm text-red-700">Configurar el sistema</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Bienvenido al Dashboard
            </h2>
            <p className="text-gray-600">Contenido del dashboard</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">DoURemember</h1>
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
        <div className="bg-white rounded-lg shadow p-6">
          {/* User Info Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Información del Usuario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-medium text-gray-900">Nombre:</span>{" "}
                <span className="text-gray-700">{user?.nombre || "N/A"}</span>
              </p>
              <p>
                <span className="font-medium text-gray-900">Correo:</span>{" "}
                <span className="text-gray-700">
                  {user?.email || user?.correo || "N/A"}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-900">
                  Tipo de Usuario:
                </span>{" "}
                <span className="text-gray-700 capitalize">
                  {user?.tipo_usuario || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* Contenido específico por tipo de usuario */}
          {getContentByType()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
