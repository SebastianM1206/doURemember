import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/userService";
import UserTableView from "./UserTableView";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await getAllUsers();
    if (!error && data) {
      setUsers(data);
    } else {
      console.error("Error cargando usuarios:", error);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      loadUsers();
      return;
    }

    const tipo = filterType === "all" ? null : filterType;
    const { data, error } = await searchUsers(term, tipo);
    if (!error && data) {
      setUsers(data);
    }
  };

  const handleFilterChange = async (type) => {
    setFilterType(type);
    if (type === "all") {
      loadUsers();
    } else {
      const { data, error } = await getAllUsers();
      if (!error && data) {
        const filtered = data.filter((user) => user.tipo_usuario === type);
        setUsers(filtered);
      }
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Estás seguro de desactivar este usuario?")) {
      const { error } = await deleteUser(userId);
      if (!error) {
        loadUsers();
      } else {
        alert("Error al desactivar usuario");
      }
    }
  };

  const handleReactivateUser = async (userId) => {
    if (window.confirm("¿Estás seguro de reactivar este usuario?")) {
      const { error } = await reactivateUser(userId);
      if (!error) {
        loadUsers();
      } else {
        alert("Error al reactivar usuario");
      }
    }
  };

  const handleModalClose = (shouldReload) => {
    setShowModal(false);
    setSelectedUser(null);
    if (shouldReload) {
      loadUsers();
    }
  };

  const getUserTypeColor = (tipo) => {
    switch (tipo) {
      case "paciente":
        return "bg-purple-100 text-purple-800";
      case "cuidador":
        return "bg-green-100 text-green-800";
      case "familiar":
        return "bg-blue-100 text-blue-800";
      case "medico":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleCreateUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
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
          Crear Usuario
        </button>
      </div>

      {/* Filtros por tipo de usuario */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            filterType === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => handleFilterChange("paciente")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            filterType === "paciente"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pacientes
        </button>
        <button
          onClick={() => handleFilterChange("cuidador")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            filterType === "cuidador"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Cuidadores
        </button>
        <button
          onClick={() => handleFilterChange("familiar")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            filterType === "familiar"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Familiares
        </button>
      </div>

      {/* Tabla de usuarios */}
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
                  Tipo
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
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.correo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getUserTypeColor(
                          user.tipo_usuario
                        )}`}
                      >
                        {user.tipo_usuario}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          user.estado
                        )}`}
                      >
                        {user.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
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
                        onClick={() => handleEditUser(user)}
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
                      {user.estado === "activo" ? (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
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
                          onClick={() => handleReactivateUser(user.id)}
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
          user={selectedUser}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default UserManagement;
