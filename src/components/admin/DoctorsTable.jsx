import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/adminService";
import UserTableView from "./UserTableView";

function DoctorsTable() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    const { data, error } = await getAllUsers();
    if (!error && data) {
      // Filtrar localmente solo los médicos
      const doctorsData = data.filter((user) => user.tipo_usuario === "Doctor");
      setDoctors(doctorsData);
    } else {
      console.error("Error al cargar médicos:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Médicos</h1>
        <p className="text-gray-600 mt-2">
          Gestiona todos los médicos del sistema
        </p>
      </div>
      <UserTableView
        users={doctors}
        loading={loading}
        onReload={loadDoctors}
        userType="Doctor"
        title="Médicos"
      />
    </div>
  );
}

export default DoctorsTable;
