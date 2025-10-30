import { useState } from "react";
import { login as loginService, saveUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginService(email, password);

      if (result.success) {
        // Guardar el usuario en el almacenamiento
        saveUser(result.data, remember);

        // Actualizar el contexto de autenticación
        login(result.data);

        // Aquí puedes redirigir al dashboard o página principal
        console.log("Login exitoso:", result.data);
        alert(`¡Bienvenido ${result.data.nombre}!`);

        // TODO: Implementar redirección con React Router
        // navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Error inesperado al iniciar sesión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">DoURemember</h2>
        </div>

        {/* Welcome Section */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido de vuelta!
          </h3>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 border-b-2 border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none transition-colors"
              required
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 border-b-2 border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none transition-colors"
              required
              disabled={loading}
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              disabled={loading}
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
              Recordar sesión
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              ¿Olvidaste tu contraseña?{" "}
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                Haz clic aquí
              </span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
