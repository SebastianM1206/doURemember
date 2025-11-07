import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import DashboardOverview from "../components/admin/DashboardOverview";
import DoctorsTable from "../components/admin/DoctorsTable";
import PatientsTable from "../components/admin/PatientsTable";
import CaregiversTable from "../components/admin/CaregiversTable";
import ReportsPage from "../components/admin/ReportsPage";
import SettingsPage from "../components/admin/SettingsPage";

function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview onNavigate={setCurrentPage} />;
      case "doctors":
        return <DoctorsTable />;
      case "patients":
        return <PatientsTable />;
      case "caregivers":
        return <CaregiversTable />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
}

export default AdminDashboard;
