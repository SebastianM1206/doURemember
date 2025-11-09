import { useState } from "react";
import { toast } from "react-toastify";
import { validatePassword } from "../../utils/passwordUtils";
import {createUser} from "../../services/adminService";

function CreatePatientModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Datos del Paciente
    pacienteNombre: "",
    pacienteEmail: "",
    pacientePassword: "",

    // Datos del Cuidador
    cuidadorNombre: "",
    cuidadorEmail: "",
    cuidadorPassword: "",
  });

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

    try {
      //Se dividen los arreglos de los errores por rol
      const patientValidations = validatePassword(formData.pacientePassword);
      const caregiverValidations = validatePassword(formData.cuidadorPassword);
      
      //Si alguno de los roles tiene errores, se muestran
      if (!validatePassword(formData.cuidadorPassword).isValid || !validatePassword(formData.pacientePassword).isValid){
        setLoading(false);
        // Mostrar errores del paciente
        if (!patientValidations.isValid) {
          patientValidations.errors.forEach((err, index) => { {/* Para cada uno de los errores, toma el item y el indice */}
            setTimeout(() => (
              toast.error(`PACIENTE: ${err}`, {pauseOnHover: false})
            ), index * 5000) //El retraso de cada error depende de su indice para que nos e muetsren todos juentos
          })
        }
        
        // Mostrar errores del cuidador
        if (!caregiverValidations.isValid) {
          caregiverValidations.errors.forEach((err, index) => { {/* Para cada uno de los errores, toma el item y el indice */}
            setTimeout(() => (
              toast.error(`CUIDADOR: ${err}`, {pauseOnHover: false})
            ), index * 5000) //El retraso de cada error depende de su indice para que nos e muetsren todos juentos
          })
        }
        return;
      }

      //Datos del paciente
      const patientData = {
        nombre: formData.pacienteNombre,
        email: formData.pacienteEmail,
        password: formData.pacientePassword,
        tipo_usuario: "Paciente"
      }
      //Datos del cuidador
      const caregiverData = {
        nombre: formData.cuidadorNombre,
        email: formData.cuidadorEmail,
        password: formData.cuidadorPassword,
        tipo_usuario: "Cuidador"
      }

      //Manejo de error agrupado
      const { error: createPatientError } = await createUser(patientData);
      const { error: createCaregiverError } = await createUser(caregiverData);
      if (createPatientError || createCaregiverError) {
        toast.error("Error al crear usuarios");
        return;
      }
      
      console.log("Creando paciente y cuidador:", formData);
      // Simular petición
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Paciente y cuidador creados exitosamente");

      // Resetear formulario
      setFormData({
        pacienteNombre: "",
        pacienteEmail: "",
        pacientePassword: "",
        cuidadorNombre: "",
        cuidadorEmail: "",
        cuidadorPassword: "",
      });

      onClose();
    } catch (error) {
      console.error("Error al crear paciente y cuidador:", error);
      toast.error("Error al crear paciente y cuidador");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      pacienteNombre: "",
      pacienteEmail: "",
      pacientePassword: "",
      cuidadorNombre: "",
      cuidadorEmail: "",
      cuidadorPassword: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Agregar Nuevo Paciente
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Registra un paciente y su cuidador asignado
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
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
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Sección Paciente */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    Datos del Paciente
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="pacienteNombre"
                      value={formData.pacienteNombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="pacienteEmail"
                      value={formData.pacienteEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="paciente@ejemplo.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="password"
                      name="pacientePassword"
                      value={formData.pacientePassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mínimo 8 caracteres"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      La contraseña debe tener al menos 8 caracteres
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">
                    Cuidador Asignado
                  </span>
                </div>
              </div>

              {/* Sección Cuidador */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Datos del Cuidador
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="cuidadorNombre"
                      value={formData.cuidadorNombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: María González"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="cuidadorEmail"
                      value={formData.cuidadorEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="cuidador@ejemplo.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="password"
                      name="cuidadorPassword"
                      value={formData.cuidadorPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mínimo 8 caracteres"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      La contraseña debe tener al menos 8 caracteres
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Información importante
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Se crearán automáticamente las cuentas para el paciente y
                      su cuidador. Ambos recibirán un correo con sus
                      credenciales de acceso.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Crear Paciente y Cuidador</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePatientModal;
