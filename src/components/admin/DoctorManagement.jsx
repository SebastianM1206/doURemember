import { useState, useEffect } from "react";
import {
  getDoctors,
  deleteUser,
  reactivateUser,
} from "../../services/userService";
import UserModal from "./UserModal";

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    const { data, error } = await getDoctors();
    if (!error && data) {
      setDoctors(data);
    } else {
      console.error("Error cargando médicos:", error);
    }
    setLoading(false);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDoctor = () => {
    setSelectedDoctor(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm("¿Estás seguro de desactivar este médico?")) {
      const { error } = await deleteUser(doctorId);
      if (!error) {
        loadDoctors();
      } else {
        alert("Error al desactivar médico");
      }
    }
  };

  const handleReactivateDoctor = async (doctorId) => {
    if (window.confirm("¿Estás seguro de reactivar este médico?")) {
      const { error } = await reactivateUser(doctorId);
      if (!error) {
        loadDoctors();
      } else {
        alert("Error al reactivar médico");
      }
    }
  };

  const handleModalClose = (shouldReload) => {
    setShowModal(false);
    setSelectedDoctor(null);
    if (shouldReload) {
      loadDoctors();
    }
  };

  const getStatusColor = (estado) => {
    return estado === "activo"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y botón crear */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar médico por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleCreateDoctor}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
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
          Crear Médico
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-600 font-medium">Total Médicos</p>
          <p className="text-2xl font-bold text-orange-900">{doctors.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Médicos Activos</p>
          <p className="text-2xl font-bold text-green-900">
            {doctors.filter((d) => d.estado === "activo").length}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600 font-medium">Médicos Inactivos</p>
          <p className="text-2xl font-bold text-red-900">
            {doctors.filter((d) => d.estado === "inactivo").length}
          </p>
        </div>
      </div>

      {/* Tabla de médicos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No se encontraron médicos
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doctor.nombre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {doctor.correo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {doctor.telefono || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          doctor.estado
                        )}`}
                      >
                        {doctor.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDoctor(doctor)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <svg
                          className="w-5 h-5 inline"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEditDoctor(doctor)}
                        className="text-green-600 hover:text-green-900"
                        title="Editar"
                      >
                        <svg
                          className="w-5 h-5 inline"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      {doctor.estado === "activo" ? (
                        <button
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Desactivar"
                        >
                          <svg
                            className="w-5 h-5 inline"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivateDoctor(doctor.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Reactivar"
                        >
                          <svg
                            className="w-5 h-5 inline"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <UserModal
          mode={modalMode}
          user={selectedDoctor}
          onClose={handleModalClose}
          defaultType="medico"
        />
      )}
    </div>
  );
}

export default DoctorManagement;
