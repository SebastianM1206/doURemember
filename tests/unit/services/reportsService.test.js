var mockSupabase;

jest.mock("../../../src/supabase/supabaseClient.js", () => {
  mockSupabase = {
    from: jest.fn(),
  };
  return { supabase: mockSupabase };
});

const {
  getReportsByUserId,
  getReportsForCaregiver,
} = require("../../../src/services/reportsService.js");

const buildReportQuery = ({ data, error = null }) => ({
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockResolvedValue({ data, error }),
});

const buildGroupQuery = ({ data, error = null }) => ({
  select: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue({ data, error }),
});

const buildProfileQuery = ({ data, error = null }) => ({
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue({ data, error }),
});

describe("reportsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getReportsByUserId", () => {
    it("throws when userId missing", async () => {
      await expect(getReportsByUserId()).rejects.toThrow(
        "El identificador del usuario es obligatorio"
      );
    });

    it("normalizes report metrics and metadata", async () => {
      const reportData = [
        {
          reporte_id: "r1",
          topical_consistency: 10,
          logica_flow: 0,
          linguistic_complexity: 3.456,
          presence_entities: 2,
          accuracy_details: 4,
          omission_rate: 1,
          comission_rate: 5,
          fecha: "2024-01-02",
          tipo_reporte: "General",
          id_usuario: "user-1",
          perfil: { nombre: "Paciente Uno" },
        },
      ];
      mockSupabase.from.mockImplementation((table) => {
        if (table === "reportes") {
          return buildReportQuery({ data: reportData });
        }
        throw new Error(`Unexpected table ${table}`);
      });

      const result = await getReportsByUserId("user-1");

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "r1",
        tipo: "General",
        userId: "user-1",
        paciente: "Paciente Uno",
        metrics: expect.objectContaining({
          topicalConsistency: 5,
          logicalFlow: 1,
          linguisticComplexity: 3.46,
        }),
      });
      expect(result[0].globalScore).toBeCloseTo(3.07, 2);
    });

    it("throws when Supabase returns an error", async () => {
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockSupabase.from.mockImplementation((table) => {
        if (table === "reportes") {
          return buildReportQuery({
            data: null,
            error: { message: "fail" },
          });
        }
        throw new Error(`Unexpected table ${table}`);
      });

      await expect(getReportsByUserId("user-1")).rejects.toThrow(
        "No se pudieron cargar los reportes del paciente"
      );
      expect(errorSpy).toHaveBeenCalledWith(
        "Error obteniendo reportes:",
        "fail"
      );
      errorSpy.mockRestore();
    });
  });

  describe("getReportsForCaregiver", () => {
    it("fetches patient context and reports when caregiver has assigned patient", async () => {
      const groupQuery = buildGroupQuery({
        data: [{ id: 1, paciente_id: "pac-1" }],
      });
      const profileQuery = buildProfileQuery({
        data: [{ id: "pac-1", nombre: "Paciente Uno", tipo_usuario: "Paciente" }],
      });
      const reportQuery = buildReportQuery({
        data: [
          {
            reporte_id: "r1",
            topical_consistency: 4,
            logica_flow: 3,
            linguistic_complexity: 5,
            presence_entities: 4,
            accuracy_details: 4,
            omission_rate: 2,
            comission_rate: 2,
            fecha: "2024-03-01",
            tipo_reporte: "General",
            id_usuario: "pac-1",
            perfil: { nombre: "Paciente Uno" },
          },
        ],
      });

      mockSupabase.from.mockImplementation((table) => {
        if (table === "grupos") return groupQuery;
        if (table === "profiles") return profileQuery;
        if (table === "reportes") return reportQuery;
        throw new Error(`Unexpected table ${table}`);
      });

      const result = await getReportsForCaregiver("care-1");

      expect(result.patient).toEqual({
        id: "pac-1",
        nombre: "Paciente Uno",
        tipoUsuario: "Paciente",
      });
      expect(result.targetUserId).toBe("pac-1");
      expect(result.reports).toHaveLength(1);
      expect(result.reports[0].id).toBe("r1");
    });

    it("uses caregiver id when no patient context is available", async () => {
      const emptyGroupQuery = buildGroupQuery({ data: [] });
      const reportQuery = buildReportQuery({
        data: [
          {
            reporte_id: "r9",
            topical_consistency: 3,
            logica_flow: 3,
            linguistic_complexity: 3,
            presence_entities: 3,
            accuracy_details: 3,
            omission_rate: 3,
            comission_rate: 3,
            fecha: "2024-04-01",
            tipo_reporte: "General",
            id_usuario: "care-1",
            perfil: null,
          },
        ],
      });

      mockSupabase.from.mockImplementation((table) => {
        if (table === "grupos") return emptyGroupQuery;
        if (table === "reportes") return reportQuery;
        throw new Error(`Unexpected table ${table}`);
      });

      const result = await getReportsForCaregiver("care-1");

      expect(result.patient).toBeNull();
      expect(result.targetUserId).toBe("care-1");
      expect(result.reports[0].paciente).toBe("Paciente asignado");
    });

    it("throws when caregiverId is missing", async () => {
      await expect(getReportsForCaregiver()).rejects.toThrow(
        "No se pudo determinar el usuario autenticado"
      );
    });
  });
});
