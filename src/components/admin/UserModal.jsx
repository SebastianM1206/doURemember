import { useState, useEffect } from "react";
import { createUser, updateUser } from "../../services/adminService";
import { toast } from "react-toastify";

function UserModal({ mode, user, onClose, defaultType = null }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    tipo_usuario: defaultType || "Paciente",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && (mode === "edit" || mode === "view")) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        password: "",
        tipo_usuario: user.tipo_usuario || "Paciente",
      });
    }
  }, [user, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "create") {
        // Validar campos requeridos
        if (!formData.nombre || !formData.email || !formData.password) {
          setError("Por favor completa todos los campos obligatorios");
          setLoading(false);
          return;
        }

        if (formData.password.length < 8) {
          setError("La contraseña debe tener al menos 8 caracteres");
          setLoading(false);
          return;
        }

        // Preparar datos para adminService
        const userData = {
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          tipo_usuario: formData.tipo_usuario,
        };

        const { data, error: createError } = await createUser(userData);
        if (createError) {
          throw new Error(createError);
        }
        toast.success("Usuario creado exitosamente");
        onClose(true);
      } else if (mode === "edit") {
        // Preparar solo los campos que pueden actualizarse
        const updateData = {
          nombre: formData.nombre,
        };

        const { data, error: updateError } = await updateUser(
          user.id,
          updateData
        );
        if (updateError) {
          throw new Error(updateError);
        }
        toast.success("Usuario actualizado exitosamente");
        onClose(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const isViewMode = mode === "view";
  const title =
    mode === "create"
      ? "Crear Usuario"
      : mode === "edit"
      ? "Editar Usuario"
      : "Detalles del Usuario";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isViewMode}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isViewMode || mode === "edit"}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="usuario@ejemplo.com"
            />
            {mode === "edit" && (
              <p className="text-xs text-gray-500 mt-1">
                El email no puede ser modificado
              </p>
            )}
          </div>

          {/* Password - solo en modo crear */}
          {mode === "create" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          )}

          {/* Tipo de usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de usuario <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
              disabled={isViewMode || defaultType !== null}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="Paciente">Paciente</option>
              <option value="Cuidador">Cuidador</option>
              <option value="Doctor">Médico</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {isViewMode ? "Cerrar" : "Cancelar"}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {loading
                  ? "Guardando..."
                  : mode === "create"
                  ? "Crear Usuario"
                  : "Guardar Cambios"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;
