import { supabase } from "../supabase/supabaseClient";

/**
 * Crear un nuevo reporte
 * @param {Object} reportData Datos del reporte a crear
 * @param {number} reportData.topical_consistency Detalles de la precision comparando las dos descipciones
 * @param {number} reportData.logica_flow Evalúa si la secuencia de ideas o eventos tiene una progresión lógica
 * @param {number} reportData.linguistic_complexity Mide el nivel de complejidad lingüística usada por el paciente
 * @param {number} reportData.presence_entities Evalúa cuántas entidades están presentes en la descripción del paciente y si son relevantes
 * @param {number} reportData.accuracy_details Se refiere a la precisión de los detalles en relación con la descripción original
 * @param {number} reportData.omission_rate Mide cuántos elementos relevantes se omiten en la descripción proporcionada por el paciente
 * @param {number} reportData.comission_rate Evalúa cuántos elementos irrelevantes o incorrectos se agregan en la descripción proporcionada por el paciente
 * @param {string} reportData.tipo_reporte Tipo del reporte (Inicial o General)
 * @param {string} reportData.id_usuario Identificador del usuario al que pertenece el reporte
**/
export async function createReport(reportData){
    try{
        const {data, error} = await supabase.from("reportes").insert([reportData]);
        if(error){
            console.error("Error al crear reporte: ", error);
            return { data: null, error: data.error || "Error al crear reporte" };
        }
        return {data, error: null};
    }catch(error){
        console.error("Error al ingresar reporte: ", error)
    }
};

/**
 * Obtener un reporte a partir del ID del paciente
 * @param {string} patientId Identificador del paciente cuyos reportes se desean obtener
**/
export async function getReportsByPatientId(patientId){
    try{
        const {data, error} = await supabase.from("reportes").select("*").eq("id_usuario", patientId);
        if(error){
            console.error("Error al obtener los reportes: ", error);
            return { data: null, error: data.error || "Error al obtener los reportes" };
        }
        return {data, error: null};
    }catch(error){
        console.error("Error al tomar los reportes: ", error);
    }
};

/**
 * Eliminar un reporte a partir de su ID
 * @param {string} reportId Identificador del reporte a eliminar
**/
export async function deleteReport(reportId){
    try{
        const {data, error} = await supabase.from("reportes").delete().eq("reporte_id", reportId)
        if(error){
            console.error("Error eliminar reportes: ", error);
            return { data: null, error: data.error || "Error al eliminar reportes" };
        }
        return {data, error: null};
    }catch(error){
        console.error("Error al eliminar reporte: ", error);
    }
}