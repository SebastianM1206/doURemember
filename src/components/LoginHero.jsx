function LoginHero() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Background decorative cards */}
      <div className="absolute top-20 right-20 w-64 h-40 bg-white/10 backdrop-blur-sm rounded-2xl transform rotate-12"></div>
      <div className="absolute top-32 right-32 w-64 h-40 bg-white/10 backdrop-blur-sm rounded-2xl transform rotate-6"></div>
      <div className="absolute top-44 right-44 w-64 h-40 bg-white/10 backdrop-blur-sm rounded-2xl"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
        {/* Logo and Welcome Message */}
        <div className="space-y-6">
          {/* Asterisk Logo */}
          <div className="flex items-center justify-start">
            <div className="text-6xl font-bold">*</div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight">
              Bienvenido a
              <br />
              DoURemember! 👋
            </h1>
            <p className="text-lg text-blue-100 max-w-md leading-relaxed">
              Sistema de apoyo cognitivo para el monitoreo y seguimiento de
              pacientes. Ayudamos a cuidadores, pacientes y médicos a trabajar
              juntos.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-blue-200 text-sm">
          © 2025 DoURemember. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}

export default LoginHero;
