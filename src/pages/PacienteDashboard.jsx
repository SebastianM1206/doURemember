import { useState } from "react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {TaskModal} from "../components/TaskModal"
import { arrayTaskModal } from "../utils/mockedData"

function PacienteDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [taskModal, setTaskModal] = useState(false);
  const [index, setIndex] = useState(0);

  const handleLogout = async () => {
    if (window.confirm("Estas seguro de que quieres cerrar sesion?")) {
      await logout();
      navigate("/login");
    }
  };

  const finishTask = (index === arrayTaskModal.length - 1);

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
            Cerrar Sesion
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
            ¿Estas listo para realizar tu actividad diaria?
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
              onClick={() => setTaskModal(true)}
            >
              Iniciar Actividad
            </button>
          </div>
        </div>

      </main>
      {taskModal && (
        <TaskModal
        url={arrayTaskModal[index].url_img}
        onClick={finishTask ? () => setTaskModal(false) : () => setIndex(index + 1)}
        buttonText={finishTask ? "Finalizar" : "Siguiente"}
        />
      )}
    </div>
  );
}

export default PacienteDashboard;

