import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      logout();
      // Si usas React Router, redirige al login:
      // navigate('/login')
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Bienvenido al Dashboard
          </h2>

          {/* User Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Información del Usuario
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-blue-900">Nombre:</span>{" "}
                <span className="text-blue-700">{user?.nombre || "N/A"}</span>
              </p>
              <p>
                <span className="font-medium text-blue-900">Correo:</span>{" "}
                <span className="text-blue-700">{user?.correo || "N/A"}</span>
              </p>
              <p>
                <span className="font-medium text-blue-900">
                  Tipo de Usuario:
                </span>{" "}
                <span className="text-blue-700 capitalize">
                  {user?.tipo_usuario || "N/A"}
                </span>
              </p>
              <p>
                <span className="font-medium text-blue-900">ID:</span>{" "}
                <span className="text-blue-700">
                  {user?.usuario_id || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* Content Placeholder */}
          <div className="mt-6">
            <p className="text-gray-600">
              Aquí puedes agregar el contenido principal de tu aplicación.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;


