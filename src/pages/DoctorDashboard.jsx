import { useState } from "react";
import DoctorLayout from "../components/doctor/DoctorLayout";
import DoctorOverview from "../components/doctor/DoctorOverview";
import PatientsManagement from "../components/doctor/PatientsManagement";
import NotificationsCenter from "../components/doctor/NotificationsCenter";

function DoctorDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DoctorOverview onNavigate={setCurrentPage} />;
      case "patients":
        return <PatientsManagement />;
      case "notifications":
        return <NotificationsCenter />;
      default:
        return <DoctorOverview onNavigate={setCurrentPage} />;
    }
  };

  return (
    <DoctorLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </DoctorLayout>
  );
}

export default DoctorDashboard;
