function ReportsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-2">
          Visualiza estadísticas y reportes del sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 text-center py-24">
        <svg
          className="w-24 h-24 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Próximamente
        </h3>
        <p className="text-gray-500">
          Los reportes y estadísticas estarán disponibles pronto
        </p>
      </div>
    </div>
  );
}

export default ReportsPage;
