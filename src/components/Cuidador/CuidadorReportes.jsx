import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getReportsForCaregiver } from "../../services/reportsService";

const metricConfig = [
  { key: "topicalConsistency", label: "Consistencia temática", tone: "blue", inverse: false },
  { key: "logicalFlow", label: "Flujo lógico", tone: "indigo", inverse: false },
  { key: "linguisticComplexity", label: "Complejidad lingüística", tone: "violet", inverse: false },
  { key: "presenceEntities", label: "Mención de entidades", tone: "sky", inverse: false },
  { key: "accuracyDetails", label: "Precisión en detalles", tone: "emerald", inverse: false },
  { key: "omissionRate", label: "Tasa de omisión", tone: "rose", inverse: true },
  { key: "comissionRate", label: "Tasa de comisión", tone: "amber", inverse: true },
];

const SCALE_MIN = 1;
const SCALE_MAX = 5;
const SCALE_RANGE = SCALE_MAX - SCALE_MIN;
const CHART_DIMENSIONS = {
  width: 820,
  height: 260,
  paddingX: 40,
  paddingY: 32,
};
const MAX_X_AXIS_TICKS = 6;
const TYPE_COLOR_PALETTE = [
  {
    chipBg: "bg-sky-50",
    chipText: "text-sky-700",
    chipBorder: "border-sky-200",
    buttonBg: "bg-sky-600",
    buttonText: "text-white",
    buttonBorder: "border-sky-600",
    buttonHover: "hover:bg-sky-700",
  },
  {
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
    chipBorder: "border-emerald-200",
    buttonBg: "bg-emerald-600",
    buttonText: "text-white",
    buttonBorder: "border-emerald-600",
    buttonHover: "hover:bg-emerald-700",
  },
  {
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
    chipBorder: "border-amber-200",
    buttonBg: "bg-amber-600",
    buttonText: "text-white",
    buttonBorder: "border-amber-600",
    buttonHover: "hover:bg-amber-700",
  },
  {
    chipBg: "bg-violet-50",
    chipText: "text-violet-700",
    chipBorder: "border-violet-200",
    buttonBg: "bg-violet-600",
    buttonText: "text-white",
    buttonBorder: "border-violet-600",
    buttonHover: "hover:bg-violet-700",
  },
  {
    chipBg: "bg-rose-50",
    chipText: "text-rose-700",
    chipBorder: "border-rose-200",
    buttonBg: "bg-rose-600",
    buttonText: "text-white",
    buttonBorder: "border-rose-600",
    buttonHover: "hover:bg-rose-700",
  },
];

const DEFAULT_TYPE_COLOR = {
  chipBg: "bg-gray-100",
  chipText: "text-gray-700",
  chipBorder: "border-gray-200",
  buttonBg: "bg-gray-600",
  buttonText: "text-white",
  buttonBorder: "border-gray-600",
  buttonHover: "hover:bg-gray-700",
};

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  try {
    return new Date(value).toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
};

const formatReportType = (value) => {
  if (!value) return "Sin tipo";
  return value
    .toString()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
};

const formatShortDate = (value) => {
  if (!value) return "Sin fecha";
  try {
    return new Date(value).toLocaleDateString("es-CO", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
};

const normalizeScore = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return SCALE_MIN;
  }
  return Math.min(Math.max(numeric, SCALE_MIN), SCALE_MAX);
};

const formatScore = (value) => normalizeScore(value).toFixed(1);

const scoreToPercent = (value) => {
  if (SCALE_RANGE <= 0) return 0;
  return Math.round(
    ((normalizeScore(value) - SCALE_MIN) / SCALE_RANGE) * 100
  );
};

const getXFromIndex = (index, total) => {
  const { width, paddingX } = CHART_DIMENSIONS;
  if (total <= 1) {
    return width / 2;
  }
  const innerWidth = width - paddingX * 2;
  return paddingX + (innerWidth / (total - 1)) * index;
};

const getYFromValue = (value) => {
  const { height, paddingY } = CHART_DIMENSIONS;
  const innerHeight = height - paddingY * 2;
  const ratio =
    (normalizeScore(value) - SCALE_MIN) / (SCALE_RANGE || 1);
  return height - paddingY - ratio * innerHeight;
};

function CuidadorReportes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [patient, setPatient] = useState(null);
  const [selectedType, setSelectedType] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function loadReports() {
    try {
      setLoading(true);
      setError("");
      const { reports: fetchedReports, patient: patientInfo } =
        await getReportsForCaregiver(user.id);
      setReports(fetchedReports);
      setPatient(patientInfo);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "No se pudieron cargar los reportes");
      setReports([]);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }

  const latestReport = reports[0] ?? null;
  const targetName = patient?.nombre ?? user?.nombre ?? "Paciente";
  const reportTypes = useMemo(() => {
    const unique = new Set();
    reports.forEach((report) => report.tipo && unique.add(report.tipo));
    return Array.from(unique);
  }, [reports]);

  const typeColorMap = useMemo(() => {
    const map = {};
    reportTypes.forEach((type, index) => {
      map[type] = TYPE_COLOR_PALETTE[index % TYPE_COLOR_PALETTE.length];
    });
    return map;
  }, [reportTypes]);

  const getTypeColor = (type) => typeColorMap[type] ?? DEFAULT_TYPE_COLOR;

  const filteredReports = useMemo(() => {
    if (selectedType === "todos") return reports;
    return reports.filter((report) => report.tipo === selectedType);
  }, [reports, selectedType]);

  const averages = useMemo(() => {
    if (!reports.length) return null;
    const totals = reports.reduce((acc, report) => {
      Object.entries(report.metrics).forEach(([key, value]) => {
        acc[key] = (acc[key] ?? 0) + value;
      });
      return acc;
    }, {});

    const result = {};
    Object.entries(totals).forEach(([key, value]) => {
      result[key] = Number(
        normalizeScore(value / reports.length).toFixed(1)
      );
    });
    return result;
  }, [reports]);

  const globalAverage =
    reports.length > 0
      ? Number(
          (
            reports.reduce((sum, report) => sum + report.globalScore, 0) /
            reports.length
          ).toFixed(1)
        )
      : 0;

  const trendData = useMemo(() => {
    if (!reports.length) return [];

    return [...reports]
      .map((report) => ({
        id: report.id,
        tipo: report.tipo,
        fecha: report.fecha,
        label: formatShortDate(report.fecha),
        fullLabel: formatDate(report.fecha),
        value: normalizeScore(report.globalScore),
      }))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }, [reports]);

  const benchmarkReport = useMemo(() => {
    const target = reports.find((report) => {
      const tipo = report.tipo?.toLowerCase();
      return tipo === "inical" || tipo === "inicial";
    });
    return target ?? null;
  }, [reports]);

  const benchmarkValue = benchmarkReport
    ? normalizeScore(benchmarkReport.globalScore)
    : null;
  const benchmarkPalette = benchmarkReport
    ? getTypeColor(benchmarkReport.tipo)
    : DEFAULT_TYPE_COLOR;

  const trendPoints = useMemo(() => {
    if (!trendData.length) return [];
    return trendData.map((point, index) => ({
      ...point,
      x: getXFromIndex(index, trendData.length),
      y: getYFromValue(point.value),
    }));
  }, [trendData]);

  const linePath = useMemo(() => {
    if (!trendPoints.length) return "";
    return `M ${trendPoints.map((point) => `${point.x} ${point.y}`).join(" L ")}`;
  }, [trendPoints]);

  const areaPath = useMemo(() => {
    if (!trendPoints.length) return "";
    const baseline = getYFromValue(SCALE_MIN);
    const start = trendPoints[0];
    const end = trendPoints[trendPoints.length - 1];
    return `${linePath} L ${end.x} ${baseline} L ${start.x} ${baseline} Z`;
  }, [linePath, trendPoints]);

  const benchmarkY = useMemo(() => {
    if (!benchmarkValue) return null;
    return getYFromValue(benchmarkValue);
  }, [benchmarkValue]);

  const yTicks = useMemo(() => {
    const ticks = [];
    for (let value = SCALE_MAX; value >= SCALE_MIN; value -= 1) {
      ticks.push({ value, y: getYFromValue(value) });
    }
    return ticks;
  }, []);

  const xTicks = useMemo(() => {
    if (!trendPoints.length) return [];

    if (trendPoints.length <= MAX_X_AXIS_TICKS) {
      return trendPoints.map((point, index) => ({
        x: point.x,
        label: point.label,
        key: `tick-${index}`,
      }));
    }

    const step = Math.ceil(
      (trendPoints.length - 1) / Math.max(MAX_X_AXIS_TICKS - 1, 1)
    );
    const indexes = [];
    for (let idx = 0; idx < trendPoints.length; idx += step) {
      indexes.push(Math.min(idx, trendPoints.length - 1));
    }
    if (indexes[indexes.length - 1] !== trendPoints.length - 1) {
      indexes.push(trendPoints.length - 1);
    }

    return indexes.map((idx) => ({
      x: trendPoints[idx].x,
      label: trendPoints[idx].label,
      key: `tick-${idx}`,
    }));
  }, [trendPoints]);

  const baselineY = getYFromValue(SCALE_MIN);
  const tooltipStyle =
    hoveredPoint && trendPoints.length
      ? {
          left: `${(hoveredPoint.x / CHART_DIMENSIONS.width) * 100}%`,
          top: `${(hoveredPoint.y / CHART_DIMENSIONS.height) * 100}%`,
        }
      : null;
  const hoveredPalette = hoveredPoint
    ? getTypeColor(hoveredPoint.tipo)
    : null;

  const sanitizeForFilename = (value) =>
    value
      ?.toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "paciente";

  const buildCsvContent = (data) => {
    const headers = [
      "Fecha",
      "Tipo de reporte",
      "Consistencia temática (1-5)",
      "Flujo lógico (1-5)",
      "Complejidad lingüística (1-5)",
      "Mención de entidades (1-5)",
      "Precisión en detalles (1-5)",
      "Tasa de omisión (1-5)",
      "Tasa de comisión (1-5)",
      "Puntaje global (1-5)",
    ];

    const rows = data.map((report) => [
      formatDate(report.fecha),
      formatReportType(report.tipo),
      formatScore(report.metrics.topicalConsistency),
      formatScore(report.metrics.logicalFlow),
      formatScore(report.metrics.linguisticComplexity),
      formatScore(report.metrics.presenceEntities),
      formatScore(report.metrics.accuracyDetails),
      formatScore(report.metrics.omissionRate),
      formatScore(report.metrics.comissionRate),
      formatScore(report.globalScore),
    ]);

    return [headers, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const safeValue = value ?? "";
            return `"${String(safeValue).replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\r\n");
  };

  const handleExportReports = () => {
    if (!filteredReports.length || exporting) {
      return;
    }

    try {
      setExporting(true);
      const csvContent = buildCsvContent(filteredReports);
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const safePatient = sanitizeForFilename(targetName);
      const safeFilter =
        selectedType === "todos"
          ? "todos"
          : sanitizeForFilename(formatReportType(selectedType));
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `reportes_${safePatient}_${safeFilter}_${timestamp}.csv`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (exportError) {
      console.error("Error exportando reportes:", exportError);
      alert("No se pudo exportar el reporte. Intenta nuevamente.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Portal del cuidador
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              Reportes del paciente
            </h1>
            <p className="text-sm text-gray-500">
              Visualiza el desempeño y las métricas generadas automáticamente
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/cuidador")}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver al panel
            </button>
            <button
              type="button"
              onClick={loadReports}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Actualizar
            </button>
            <button
              type="button"
              onClick={handleExportReports}
              disabled={!filteredReports.length || exporting}
              className={`px-4 py-2 rounded-lg transition-colors border ${
                !filteredReports.length || exporting
                  ? "bg-emerald-200 border-emerald-200 text-emerald-800 cursor-not-allowed opacity-70"
                  : "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {exporting ? "Exportando..." : "Exportar reporte"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
            Cargando reportes...
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 text-red-600">
            {error}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-gray-500">Paciente asignado</p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {targetName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Último reporte:{" "}
                  {latestReport ? formatDate(latestReport.fecha) : "Sin datos"}
                </p>
              </div>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-gray-500">Reportes generados</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {reports.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Promedio general</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {reports.length ? (
                      <>
                        {globalAverage.toFixed(1)}
                        <span className="text-base font-normal text-gray-500">
                          {" "}
                          / {SCALE_MAX}
                        </span>
                      </>
                    ) : (
                      "--"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Actualizado</p>
                  <p className="text-lg font-medium text-gray-900">
                    {lastUpdated ? formatDate(lastUpdated) : "Sin registros"}
                  </p>
                </div>
            </div>
          </div>

          {trendData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Tendencia del puntaje
                  </h2>
                  <p className="text-sm text-gray-500">
                    Evolución del puntaje global en escala 1-5
                  </p>
                </div>
                {benchmarkValue && benchmarkReport && (
                  <div
                    className={`px-4 py-2 rounded-xl text-sm font-medium border ${benchmarkPalette.chipBg} ${benchmarkPalette.chipText} ${benchmarkPalette.chipBorder}`}
                  >
                    Benchmark Inical: {benchmarkValue.toFixed(1)} / {SCALE_MAX}
                  </div>
                )}
              </div>

              <div
                className="relative w-full h-72"
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <svg
                  viewBox={`0 0 ${CHART_DIMENSIONS.width} ${CHART_DIMENSIONS.height}`}
                  className="w-full h-full"
                  role="img"
                  aria-label="Gráfico de tendencia del puntaje global"
                >
                  <defs>
                    <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="0"
                    y="0"
                    width={CHART_DIMENSIONS.width}
                    height={CHART_DIMENSIONS.height}
                    fill="transparent"
                  />

                  <g>
                    {yTicks.map((tick) => (
                      <g key={`tick-${tick.value}`}>
                        <line
                          x1={CHART_DIMENSIONS.paddingX}
                          x2={CHART_DIMENSIONS.width - CHART_DIMENSIONS.paddingX}
                          y1={tick.y}
                          y2={tick.y}
                          stroke="#e2e8f0"
                          strokeWidth="1"
                        />
                        <text
                          x={CHART_DIMENSIONS.paddingX - 12}
                          y={tick.y + 4}
                          textAnchor="end"
                          fontSize="12"
                          fill="#94a3b8"
                        >
                          {tick.value}
                        </text>
                      </g>
                    ))}
                    <line
                      x1={CHART_DIMENSIONS.paddingX}
                      x2={CHART_DIMENSIONS.paddingX}
                      y1={CHART_DIMENSIONS.paddingY}
                      y2={baselineY}
                      stroke="#cbd5f5"
                      strokeWidth="1.5"
                    />
                    <line
                      x1={CHART_DIMENSIONS.paddingX}
                      x2={CHART_DIMENSIONS.width - CHART_DIMENSIONS.paddingX}
                      y1={baselineY}
                      y2={baselineY}
                      stroke="#cbd5f5"
                      strokeWidth="1.5"
                    />
                  </g>

                  {benchmarkValue && benchmarkY !== null && (
                    <>
                      <line
                        x1={CHART_DIMENSIONS.paddingX}
                        x2={CHART_DIMENSIONS.width - CHART_DIMENSIONS.paddingX}
                        y1={benchmarkY}
                        y2={benchmarkY}
                        stroke="#94a3b8"
                        strokeDasharray="6 6"
                        strokeWidth="1.5"
                      />
                      <text
                        x={CHART_DIMENSIONS.width - CHART_DIMENSIONS.paddingX}
                        y={benchmarkY - 6}
                        textAnchor="end"
                        fontSize="12"
                        fill="#475569"
                      >
                        Benchmark Inical ({benchmarkValue.toFixed(1)})
                      </text>
                    </>
                  )}

                  {areaPath && (
                    <path
                      d={areaPath}
                      fill="url(#trendGradient)"
                      stroke="none"
                    />
                  )}

                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {trendPoints.map((point) => (
                    <g key={point.id}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={hoveredPoint?.id === point.id ? 7 : 5}
                        fill={hoveredPoint?.id === point.id ? "#1e40af" : "#1d4ed8"}
                        stroke="#fff"
                        strokeWidth="2"
                        onMouseEnter={() => setHoveredPoint(point)}
                        onFocus={() => setHoveredPoint(point)}
                        onBlur={() => setHoveredPoint(null)}
                        tabIndex={0}
                      />
                    </g>
                  ))}

                  {xTicks.length > 0 && (
                    <g>
                      {xTicks.map((tick) => (
                        <g key={tick.key}>
                          <line
                            x1={tick.x}
                            x2={tick.x}
                            y1={baselineY}
                            y2={baselineY + 6}
                            stroke="#cbd5f5"
                            strokeWidth="1.5"
                          />
                          <text
                            x={tick.x}
                            y={baselineY + 20}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#94a3b8"
                          >
                            {tick.label}
                          </text>
                        </g>
                      ))}
                    </g>
                  )}
                </svg>

                {hoveredPoint && (
                  <div
                    className="absolute pointer-events-none bg-white shadow-lg border border-gray-100 rounded-xl px-4 py-3 min-w-[160px]"
                    style={{
                      left: tooltipStyle.left,
                      top: tooltipStyle.top,
                      transform: "translate(-50%, -120%)",
                    }}
                  >
                    <p
                      className={`text-xs uppercase tracking-wide font-semibold ${
                        hoveredPalette?.chipText ?? "text-gray-500"
                      }`}
                    >
                      {formatReportType(hoveredPoint.tipo)}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {hoveredPoint.value.toFixed(1)} / {SCALE_MAX}
                    </p>
                    <p className="text-xs text-gray-500">
                      {hoveredPoint.fullLabel}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {reports.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {metricConfig.map((metric) => {
                  const averageValue = averages?.[metric.key] ?? SCALE_MIN;
                  const latestValue =
                    latestReport?.metrics?.[metric.key] ?? SCALE_MIN;
                  const displayAverage = formatScore(averageValue);
                  const displayLatest = formatScore(latestValue);
                  const progressPercent = scoreToPercent(latestValue);

                  const colorMap = {
                    blue: "bg-blue-500 text-blue-600",
                    indigo: "bg-indigo-500 text-indigo-600",
                    violet: "bg-violet-500 text-violet-600",
                    sky: "bg-sky-500 text-sky-600",
                    emerald: "bg-emerald-500 text-emerald-600",
                    rose: "bg-rose-500 text-rose-600",
                    amber: "bg-amber-500 text-amber-600",
                  };
                  const toneClass = colorMap[metric.tone] || "bg-gray-500 text-gray-600";
                  return (
                    <div
                      key={metric.key}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <p>{metric.label}</p>
                        <span>{metric.inverse ? "Menor es mejor" : "Mayor es mejor"}</span>
                      </div>
                      <div>
                        <p className={`text-3xl font-semibold ${toneClass.split(" ")[1]}`}>
                          {displayAverage}
                          <span className="ml-1 text-base font-normal text-gray-500">
                            / {SCALE_MAX}
                          </span>
                        </p>
                      </div>
                      {latestReport && (
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Último reporte</span>
                            <span>
                              {displayLatest} / {SCALE_MAX}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className={`${toneClass.split(" ")[0]} h-2 rounded-full transition-all`}
                              style={{
                                width: `${progressPercent}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {reportTypes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-medium text-gray-700">
                    Filtrar por tipo de reporte:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedType("todos")}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        selectedType === "todos"
                          ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Todos
                    </button>
                    {reportTypes.map((type) => {
                      const palette = getTypeColor(type);
                      const isActive = selectedType === type;
                      const activeClasses = `${palette.buttonBg} ${palette.buttonText} ${palette.buttonBorder} ${palette.buttonHover}`;
                      const inactiveClasses =
                        "border-gray-200 text-gray-700 hover:bg-gray-50";

                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                            isActive ? activeClasses : inactiveClasses
                          }`}
                        >
                          {formatReportType(type)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Historial de reportes
                  </h2>
                  <p className="text-sm text-gray-500">
                    {filteredReports.length} registros visibles
                  </p>
                </div>
              </div>
              {filteredReports.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {reports.length === 0
                    ? "Todavía no hay reportes disponibles para este paciente."
                    : "No se encontraron reportes para el filtro seleccionado."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="max-h-[28rem] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                      <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium bg-gray-50">
                            Fecha
                          </th>
                          <th className="px-4 py-3 text-left font-medium bg-gray-50">
                            Tipo
                          </th>
                          <th className="px-4 py-3 text-left font-medium bg-gray-50">
                            Consistencia
                          </th>
                          <th className="px-4 py-3 text-left font-medium bg-gray-50">
                            Flujo lógico
                          </th>
                          <th className="px-4 py-3 text-left font-medium bg-gray-50">
                            Complejidad ling.
                          </th>
                          <th className="px-4 py-3 text-left font-medium bg-gray-50">
                            Entidades
                          </th>
                          <th className="px-4 py-3 text-left font-medium bg-gray-50">
                            Precisión
                          </th>
                          <th className="px-4 py-3 text-left font-medium bg-gray-50">
                            Omisiones
                          </th>
                          <th className="px-4 py-3 text-left font-medium bg-gray-50">
                            Comisiones
                          </th>
                          <th className="px-4 py-3 text-left font-medium bg-gray-50">
                            Puntaje
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-900">
                      {filteredReports.map((report) => {
                        const palette = getTypeColor(report.tipo);
                        return (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              {formatDate(report.fecha)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${palette.chipBg} ${palette.chipText} ${palette.chipBorder}`}
                              >
                                {formatReportType(report.tipo)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {formatScore(report.metrics.topicalConsistency)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {formatScore(report.metrics.logicalFlow)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {formatScore(report.metrics.linguisticComplexity)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {formatScore(report.metrics.presenceEntities)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {formatScore(report.metrics.accuracyDetails)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {formatScore(report.metrics.omissionRate)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {formatScore(report.metrics.comissionRate)}
                            </td>
                            <td className="px-4 py-3 text-center font-semibold">
                              {formatScore(report.globalScore)}
                            </td>
                          </tr>
                        );
                      })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default CuidadorReportes;
