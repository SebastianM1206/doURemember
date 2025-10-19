import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            doURemember
          </h1>
          <p className="text-gray-600 text-lg">
            Tailwind CSS está funcionando perfectamente!
          </p>
        </div>

        {/* Counter Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contador Interactivo
          </h2>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setCount(count - 1)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              -
            </button>
            <div className="bg-white px-8 py-4 rounded-2xl shadow-inner">
              <span className="text-4xl font-bold text-purple-600">
                {count}
              </span>
            </div>
            <button
              onClick={() => setCount(count + 1)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 rounded-xl p-4 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl mb-2"></div>
            <h3 className="font-semibold text-blue-900">Rápido</h3>
            <p className="text-sm text-blue-700">Vite + React</p>
          </div>
          <div className="bg-purple-100 rounded-xl p-4 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl mb-2"></div>
            <h3 className="font-semibold text-purple-900">Estilizado</h3>
            <p className="text-sm text-purple-700">Tailwind CSS</p>
          </div>
          <div className="bg-pink-100 rounded-xl p-4 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl mb-2"></div>
            <h3 className="font-semibold text-pink-900">Moderno</h3>
            <p className="text-sm text-pink-700">UI Hermosa</p>
          </div>
        </div>

        {/* Info Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Tailwind CSS v4 Activo
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
