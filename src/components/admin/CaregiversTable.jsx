import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/adminService";
import UserTableView from "./UserTableView";

function CaregiversTable() {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaregivers();
  }, []);

  const loadCaregivers = async () => {
    setLoading(true);
    const { data, error } = await getAllUsers();
    if (!error && data) {
      // Filtrar localmente solo los cuidadores
      const caregiversData = data.filter(
        (user) => user.tipo_usuario === "Cuidador"
      );
      setCaregivers(caregiversData);
    } else {
      console.error("Error al cargar cuidadores:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cuidadores</h1>
        <p className="text-gray-600 mt-2">
          Gestiona todos los cuidadores del sistema
        </p>
      </div>
      <UserTableView
        users={caregivers}
        loading={loading}
        onReload={loadCaregivers}
        userType="Cuidador"
        title="Cuidadores"
      />
    </div>
  );
}

export default CaregiversTable;
