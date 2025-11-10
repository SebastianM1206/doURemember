import { supabase } from "../supabase/supabaseClient";

const REPORTS_SELECT = `
  reporte_id,
  topical_consistency,
  logica_flow,
  linguistic_complexity,
  presence_entities,
  accuracy_details,
  omission_rate,
  comission_rate,
  fecha,
  tipo_reporte,
  id_usuario,
  perfil:profiles(nombre, tipo_usuario)
`;

const SCORE_MIN = 1;
const SCORE_MAX = 5;

const toScaleNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return SCORE_MIN;
  const clamped = Math.min(Math.max(parsed, SCORE_MIN), SCORE_MAX);
  return Number(clamped.toFixed(2));
};

const normalizeReport = (record) => {
  if (!record) return null;

  const metrics = {
    topicalConsistency: toScaleNumber(record.topical_consistency),
    logicalFlow: toScaleNumber(record.logica_flow),
    linguisticComplexity: toScaleNumber(record.linguistic_complexity),
    presenceEntities: toScaleNumber(record.presence_entities),
    accuracyDetails: toScaleNumber(record.accuracy_details),
    omissionRate: toScaleNumber(record.omission_rate),
    comissionRate: toScaleNumber(record.comission_rate),
  };

  const metricValues = Object.values(metrics);
  const globalScore =
    metricValues.length > 0
      ? Number(
          (
            metricValues.reduce((sum, value) => sum + value, 0) /
            metricValues.length
          ).toFixed(2)
        )
      : SCORE_MIN;

  return {
    id: record.reporte_id,
    tipo: record.tipo_reporte,
    fecha: record.fecha,
    userId: record.id_usuario,
    paciente: record.perfil?.nombre ?? "Paciente asignado",
    metrics,
    globalScore,
  };
};

export async function getReportsByUserId(userId) {
  if (!userId) {
    throw new Error("El identificador del usuario es obligatorio");
  }

  const { data, error } = await supabase
    .from("reportes")
    .select(REPORTS_SELECT)
    .eq("id_usuario", userId)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error obteniendo reportes:", error.message);
    throw new Error("No se pudieron cargar los reportes del paciente");
  }

  return (data || []).map(normalizeReport).filter(Boolean);
}

async function getPatientContextForCaregiver(caregiverId) {
  const { data: groupRows, error: groupError } = await supabase
    .from("grupos")
    .select("id, paciente_id")
    .or(
      `medico_id.eq.${caregiverId},ciudador_id.eq.${caregiverId},paciente_id.eq.${caregiverId}`
    )
    .limit(1);

  if (groupError) {
    console.error("Error obteniendo el grupo del cuidador:", groupError.message);
    throw new Error("No se pudo determinar el paciente asignado");
  }

  const group = Array.isArray(groupRows) ? groupRows[0] : null;
  if (!group?.paciente_id || group.paciente_id === caregiverId) {
    return null;
  }

  const { data: patientRows, error: patientError } = await supabase
    .from("profiles")
    .select("id, nombre, tipo_usuario")
    .eq("id", group.paciente_id)
    .limit(1);

  if (patientError) {
    console.warn("Error obteniendo el perfil del paciente:", patientError.message);
    return { id: group.paciente_id, nombre: "Paciente asignado" };
  }

  const patient = Array.isArray(patientRows) ? patientRows[0] : null;
  if (!patient) {
    return { id: group.paciente_id, nombre: "Paciente asignado" };
  }

  return {
    id: patient.id,
    nombre: patient.nombre,
    tipoUsuario: patient.tipo_usuario,
  };
}

export async function getReportsForCaregiver(caregiverId) {
  if (!caregiverId) {
    throw new Error("No se pudo determinar el usuario autenticado");
  }

  const patient = await getPatientContextForCaregiver(caregiverId);
  const targetUserId = patient?.id ?? caregiverId;
  const reports = await getReportsByUserId(targetUserId);

  return {
    reports,
    patient,
    targetUserId,
  };
}
