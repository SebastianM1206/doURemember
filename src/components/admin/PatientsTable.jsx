import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/adminService";
import UserTableView from "./UserTableView";

function PatientsTable() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    const { data, error } = await getAllUsers();
    if (!error && data) {
      // Filtrar localmente solo los pacientes
      const patientsData = data.filter(
        (user) => user.tipo_usuario === "Paciente"
      );
      setPatients(patientsData);
    } else {
      console.error("Error al cargar pacientes:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
        <p className="text-gray-600 mt-2">
          Gestiona todos los pacientes del sistema
        </p>
      </div>
      <UserTableView
        users={patients}
        loading={loading}
        onReload={loadPatients}
        userType="Paciente"
        title="Pacientes"
      />
    </div>
  );
}

export default PatientsTable;
