import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext";
import {TaskModal} from "../components/TaskModal"
import { useConfirm } from "../hooks/useConfirm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { getCompletion } from "../services/openaiService";
import { createReport, getLatestReportDateByPatientId } from "../services/reportService";
import { toast } from "react-toastify";
import { getRandomPicturesByPatientId } from "../services/imageService";

function PacienteDashboard() {
  const { user, logout } = useAuth();
  const { isOpen, data, openConfirm, closeConfirm } = useConfirm();
  const [taskModal, setTaskModal] = useState(false);
  const [description, setDescription] = useState("");
  const [infoDescriptions, setInfoDescriptions] = useState([]);
  const [picturesTask, setPicturesTask] = useState([]);
  const [index, setIndex] = useState(0);
  const [latestReportDate, setLatestReportDate] = useState({});
  const [todayTaskDone, setTodayTaskDone] = useState(false);
  
  //Carga la fecha del ultimo reporte del paciente para saber si ya hizo o el test de hoy
  useEffect(() => {
    const fetchLatestReportDate = async () => {
      const {data, error} = await getLatestReportDateByPatientId(user.id);
      // console.log(data)
      if(error){
        toast.error(error);
      }
      const reportDate = new Date(data.fecha);
      setLatestReportDate(reportDate);
      const currentDate = new Date();
      const reportDay = reportDate.getDate();
      const today = currentDate.getDate();
      if (reportDate && reportDay === today){
        setTodayTaskDone(true);
      return data;
    }
    if(!data){
      return;
    }
  }
  fetchLatestReportDate();
}, [todayTaskDone, taskModal]);

  //Empieza el test y trae las imagenes
  const startNewTest = async () => {
    if(todayTaskDone){
      toast.error("Ya realizaste tu sesion de hoy, vuelve mañana")
      return;
    }
    const {shuffled, error} = await getRandomPicturesByPatientId(user.id);
    // console.log(shuffled)
    setPicturesTask(shuffled);
    setTaskModal(true);
  }

  //Manejo del logout
  const handleLogoutClick = () => {
    openConfirm({
      title: "Cerrar Sesión",
      message: "¿Estás seguro que deseas cerrar sesión?",
      type: "warning",
    });
  };

  const handleConfirmLogout = () => {
    logout();
    closeConfirm();
  };

  //Manejo de la calcelacion del desarrollo del test
  const cancelTask = () => {
    setDescription("");
    setInfoDescriptions([]);
    setPicturesTask([]);
    setIndex(0);
    setTaskModal(false);
  }

  const finishTask = (index === picturesTask.length - 1);

  //Saca el promedio de los criterios de las imagenes para el reporte
  const getAvgToReport = (arrayReport) => {
    let totales = {
      topical_consistency: 0,
      logica_flow: 0,
      linguistic_complexity: 0,
      presence_entities: 0,
      accuracy_details: 0,
      omission_rate: 0,
      comission_rate: 0
    }
    arrayReport.forEach((criteria) => {
      totales.topical_consistency += criteria.topical_consistency;
      totales.logica_flow += criteria.logica_flow;
      totales.linguistic_complexity += criteria.linguistic_complexity;
      totales.presence_entities += criteria.topical_consistency;
      totales.accuracy_details += criteria.accuracy_details;
      totales.omission_rate += criteria.omission_rate;
      totales.comission_rate += criteria.comission_rate;
    });

    const avgReport =  {
      topical_consistency: Math.round(totales.topical_consistency / arrayReport.length),
      logica_flow: Math.round(totales.logica_flow / arrayReport.length),
      linguistic_complexity: Math.round(totales.linguistic_complexity / arrayReport.length),
      presence_entities: Math.round(totales.presence_entities / arrayReport.length),
      accuracy_details: Math.round(totales.accuracy_details / arrayReport.length),
      omission_rate: Math.round(totales.omission_rate / arrayReport.length),
      comission_rate: Math.round(totales.comission_rate / arrayReport.length),
      tipo_reporte: "General",
      id_usuario: user.id
    }
    return avgReport;
  }

  //Para crear el reporte de cada sesion
  const createDailyReport = async () => {
    toast.success("¡Haz completado tu sesión de hoy!")
    setTaskModal(false);
    const {completion} = await getCompletion(JSON.stringify(infoDescriptions));
    const limpio = completion.replace(/`/g, "").replace("json", "").trim();
    const evaluationArray = JSON.parse(limpio);
    // console.log(`Before avg: ${evaluationArray}`)
    // console.log(`Before STRINGIFY avg: ${JSON.stringify(evaluationArray)}`)
    const averageReport = getAvgToReport(evaluationArray);
    // console.log("Promedio: ", averageReport);
    const {data, error} = await createReport(averageReport);
    if(error){
      toast.error(error);
    }
    // console.log(`Data: ${data}\nError: ${error}`)
    setDescription("");
    setInfoDescriptions([]);
    setIndex(0);
  }

  //Logica para el cambio de imagenes en el test
  const nextImage = () => {
    if (description === "") return;
    infoDescriptions.push({
      original_desc: picturesTask[index].descripcion,
      patient_desc: description
    })
    setDescription("");
    finishTask ? createDailyReport() : setIndex(index + 1);
    console.log(JSON.stringify(infoDescriptions));
  }

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
            onClick={handleLogoutClick}
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
            ¿Estas listo para realizar tu test diario?
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
              onClick={() => startNewTest()}
            >
              Iniciar Test
            </button>
          </div>
        </div>

      </main>
      {taskModal && (
        <TaskModal
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        disabled={description === "" ? true : false}
        url={picturesTask[index].url}
        onClick={nextImage}
        onClose={cancelTask}
        buttonText={finishTask ? "Finalizar" : "Siguiente"}
        />
      )}
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isOpen}
        onClose={closeConfirm}
        onConfirm={handleConfirmLogout}
        title={data?.title}
        message={data?.message}
        type={data?.type}
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
      />
    </div>
    
  );
}

export default PacienteDashboard;

