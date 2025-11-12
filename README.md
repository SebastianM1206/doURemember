# DoURemember 🧠

<div align="center">

![DoURemember](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.75.1-3ECF8E?logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**Sistema de evaluación cognitiva para pacientes con deterioro cognitivo mediante pruebas visuales**

[Demo en Video](https://youtu.be/ICixeUobUCs) • [Reportar Bug](https://github.com/SebastianM1206/doURemember/issues) • [Solicitar Feature](https://github.com/SebastianM1206/doURemember/issues)

</div>

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roles de Usuario](#-roles-de-usuario)
- [Funcionalidades por Rol](#-funcionalidades-por-rol)
- [API y Servicios](#-api-y-servicios)
- [Contribuir](#-contribuir)
- [Autores](#-autores)
- [Licencia](#-licencia)

---

## 🎯 Acerca del Proyecto

**DoURemember** es una aplicación web innovadora diseñada para ayudar en la evaluación y seguimiento del deterioro cognitivo en pacientes mediante pruebas visuales interactivas. El sistema permite a los pacientes realizar test diarios basados en el reconocimiento y descripción de imágenes, mientras que los profesionales de la salud pueden monitorear su progreso a través de reportes generados automáticamente con inteligencia artificial.

### Problema que Resuelve

El deterioro cognitivo requiere un seguimiento constante y objetivo. DoURemember automatiza este proceso mediante:

- **Evaluaciones diarias**: Tests consistentes basados en imágenes
- **Análisis con IA**: Evaluación objetiva mediante OpenAI GPT-4
- **Seguimiento longitudinal**: Reportes históricos del progreso del paciente
- **Colaboración**: Coordinación entre doctores, cuidadores y pacientes

### Demo del Proyecto

📺 **[Ver video demostrativo en YouTube](https://youtu.be/ICixeUobUCs)**

---

## ✨ Características Principales

### Para Pacientes

- ✅ **Tests diarios interactivos** con imágenes personalizadas
- ✅ **Interfaz intuitiva** y fácil de usar
- ✅ **Evaluación inmediata** del desempeño
- ✅ **Limitación de una sesión por día** para evitar sobrecarga

### Para Cuidadores

- ✅ **Gestión de imágenes** del banco de pruebas
- ✅ **Visualización de reportes** del progreso del paciente
- ✅ **Subida y descripción** de nuevas imágenes

### Para Doctores

- ✅ **Creación y gestión** de pacientes
- ✅ **Invitación de cuidadores** mediante enlaces seguros
- ✅ **Visualización de métricas** cognitivas detalladas
- ✅ **Centro de notificaciones** para seguimiento

### Para Administradores

- ✅ **Gestión completa** de usuarios (doctores, pacientes, cuidadores)
- ✅ **Panel de administración** con estadísticas generales
- ✅ **Configuración del sistema**
- ✅ **Reportes administrativos**

---

## 🛠️ Stack Tecnológico

### Frontend

- **[React 19.1.1](https://react.dev/)** - Biblioteca de interfaz de usuario
- **[Vite 7.1.7](https://vitejs.dev/)** - Build tool y dev server ultra-rápido
- **[React Router DOM 7.9.5](https://reactrouter.com/)** - Enrutamiento declarativo
- **[Tailwind CSS 4.1.14](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[React Toastify 11.0.5](https://fkhadra.github.io/react-toastify/)** - Notificaciones elegantes

### Backend & Servicios

- **[Supabase 2.75.1](https://supabase.com/)** - Backend as a Service (BaaS)
  - Base de datos PostgreSQL
  - Autenticación y autorización
  - Storage para imágenes
  - Real-time subscriptions
- **[OpenAI API 6.8.1](https://openai.com/)** - Evaluación cognitiva con GPT-4o-mini
  - Análisis semántico de descripciones
  - Puntuación automatizada de criterios cognitivos

### Herramientas de Desarrollo

- **[ESLint 9.36.0](https://eslint.org/)** - Linter de código
- **TypeScript Types** - Tipado para React
- **Git** - Control de versiones

---

## 🏗️ Arquitectura

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│   Supabase   │  │  OpenAI API  │
│   Backend    │  │   (GPT-4o)   │
└──────────────┘  └──────────────┘
         │
         ├─ Auth
         ├─ PostgreSQL
         └─ Storage
```

### Flujo de Datos

1. **Autenticación**: Supabase maneja login/logout con sesiones persistentes
2. **Gestión de Estado**: Context API de React para estado global (AuthContext)
3. **Routing**: React Router con rutas protegidas por rol
4. **Evaluación**: OpenAI analiza descripciones de pacientes vs. descripciones originales
5. **Persistencia**: Supabase almacena usuarios, reportes, imágenes y grupos

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.0 o superior)
- **npm** (versión 9.0 o superior) o **yarn**
- **Git**
- Una cuenta en **[Supabase](https://supabase.com/)** (gratuita)
- Una cuenta en **[OpenAI](https://openai.com/)** con créditos de API

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/SebastianM1206/doURemember.git
cd doURemember
```

### 2. Instalar Dependencias

```bash
npm install
```

O si prefieres Yarn:

```bash
yarn install
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Supabase Configuration
VITE_PUBLIC_SUPABASE_URL=tu_supabase_project_url
VITE_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=tu_openai_api_key
```

### 2. Configuración de Supabase

#### a) Crear Proyecto en Supabase

1. Ve a [https://supabase.com/](https://supabase.com/)
2. Crea una nueva organización y proyecto
3. Copia la URL del proyecto y la clave anónima (anon key)

#### b) Configurar Base de Datos

Ejecuta el siguiente SQL en el editor SQL de Supabase:

```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
  usuario_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,
  tipo_usuario VARCHAR(50) CHECK (tipo_usuario IN ('paciente', 'cuidador', 'doctor', 'administrador')),
  fecha_registro TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(20) DEFAULT 'activo'
);

-- Tabla de grupos (relación paciente-cuidador-doctor)
CREATE TABLE grupos (
  grupo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
  cuidador_id UUID REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
  doctor_id UUID REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Tabla de imágenes
CREATE TABLE imagenes (
  imagen_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  descripcion TEXT,
  grupo_id UUID REFERENCES grupos(grupo_id) ON DELETE CASCADE,
  fecha_subida TIMESTAMP DEFAULT NOW()
);

-- Tabla de reportes
CREATE TABLE reportes (
  reporte_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario UUID REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
  fecha TIMESTAMP DEFAULT NOW(),
  tipo_reporte VARCHAR(50),
  topical_consistency INTEGER CHECK (topical_consistency BETWEEN 1 AND 5),
  logica_flow INTEGER CHECK (logica_flow BETWEEN 1 AND 5),
  linguistic_complexity INTEGER CHECK (linguistic_complexity BETWEEN 1 AND 5),
  presence_entities INTEGER CHECK (presence_entities BETWEEN 1 AND 5),
  accuracy_details INTEGER CHECK (accuracy_details BETWEEN 1 AND 5),
  omission_rate INTEGER CHECK (omission_rate BETWEEN 1 AND 5),
  comission_rate INTEGER CHECK (comission_rate BETWEEN 1 AND 5)
);

-- Tabla de invitaciones
CREATE TABLE invitaciones (
  invitacion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo_id UUID REFERENCES grupos(grupo_id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  tipo_invitacion VARCHAR(50) CHECK (tipo_invitacion IN ('cuidador')),
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_expiracion TIMESTAMP,
  usado_por UUID REFERENCES usuarios(usuario_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_grupos_paciente ON grupos(paciente_id);
CREATE INDEX idx_reportes_usuario ON reportes(id_usuario);
CREATE INDEX idx_imagenes_grupo ON imagenes(grupo_id);
```

#### c) Configurar Storage

1. En Supabase, ve a **Storage**
2. Crea un bucket llamado `imagenes`
3. Configura las políticas de acceso según necesites

### 3. Configuración de OpenAI

1. Crea una cuenta en [OpenAI](https://platform.openai.com/)
2. Ve a [API Keys](https://platform.openai.com/api-keys)
3. Crea una nueva clave de API
4. Agrega créditos a tu cuenta
5. Copia la clave al archivo `.env`

---

## 💻 Uso

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Modo Producción

#### Build

```bash
npm run build
```

#### Preview

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📁 Estructura del Proyecto

```
doURemember/
├── public/                     # Archivos estáticos
├── src/
│   ├── assets/                # Recursos (imágenes, iconos, etc.)
│   ├── components/            # Componentes de React
│   │   ├── admin/            # Componentes del panel de administrador
│   │   ├── common/           # Componentes reutilizables
│   │   ├── Cuidador/         # Componentes del cuidador
│   │   ├── doctor/           # Componentes del doctor
│   │   ├── Login.jsx         # Página de login
│   │   ├── LoginForm.jsx     # Formulario de login
│   │   ├── LoginHero.jsx     # Hero del login
│   │   ├── ProtectedRoute.jsx # HOC para rutas protegidas
│   │   └── TaskModal.jsx     # Modal de tareas del paciente
│   ├── context/              # Contextos de React
│   │   └── AuthContext.jsx   # Contexto de autenticación
│   ├── hooks/                # Custom hooks
│   │   └── useConfirm.js     # Hook para confirmaciones
│   ├── pages/                # Páginas principales
│   │   ├── AdminDashboard.jsx
│   │   ├── CuidadorDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DoctorDashboard.jsx
│   │   ├── PacienteDashboard.jsx
│   │   └── RedeemInvitation.jsx
│   ├── routes/               # Configuración de rutas
│   │   └── AppRoutes.jsx     # Rutas de la aplicación
│   ├── services/             # Servicios y API calls
│   │   ├── adminService.js   # Servicios de admin
│   │   ├── authService.js    # Servicios de autenticación
│   │   ├── doctorService.js  # Servicios de doctor
│   │   ├── groupsService.js  # Servicios de grupos
│   │   ├── imageService.js   # Servicios de imágenes
│   │   ├── openaiService.js  # Integración con OpenAI
│   │   ├── reportService.js  # Servicios de reportes
│   │   └── reportsService.js # Servicios adicionales de reportes
│   ├── supabase/             # Configuración de Supabase
│   │   └── supabaseClient.js # Cliente de Supabase
│   ├── utils/                # Utilidades
│   │   ├── fileUtils.js      # Utilidades de archivos
│   │   ├── mockedData.js     # Datos de prueba
│   │   └── passwordUtils.js  # Utilidades de contraseñas
│   ├── App.css               # Estilos de App
│   ├── App.jsx               # Componente principal
│   ├── index.css             # Estilos globales
│   └── main.jsx              # Punto de entrada
├── .env                       # Variables de entorno (NO subir a Git)
├── .gitignore                # Archivos ignorados por Git
├── eslint.config.js          # Configuración de ESLint
├── index.html                # HTML principal
├── package.json              # Dependencias y scripts
├── README.md                 # Este archivo
└── vite.config.js            # Configuración de Vite
```

---

## 👥 Roles de Usuario

El sistema maneja **4 tipos de usuarios**:

### 1. 🏥 Administrador

- **Descripción**: Gestión completa del sistema
- **Acceso**: `/dashboard/admin`
- **Permisos**: Todos

### 2. 👨‍⚕️ Doctor

- **Descripción**: Profesional de la salud que crea y gestiona pacientes
- **Acceso**: `/dashboard/doctor`
- **Permisos**: Crear pacientes, invitar cuidadores, ver reportes

### 3. 👤 Cuidador

- **Descripción**: Persona encargada de asistir al paciente
- **Acceso**: `/dashboard/cuidador`
- **Permisos**: Gestionar imágenes, ver reportes del paciente

### 4. 🧑‍🦳 Paciente

- **Descripción**: Usuario que realiza los tests cognitivos
- **Acceso**: `/dashboard/paciente`
- **Permisos**: Realizar tests diarios

---

## 🎨 Funcionalidades por Rol

### Panel de Administrador

- Ver estadísticas generales del sistema
- Gestionar todos los usuarios (CRUD)
- Ver todos los reportes
- Configuración del sistema

### Panel de Doctor

- Dashboard con resumen de pacientes
- Crear nuevos pacientes
- Generar invitaciones para cuidadores
- Ver reportes detallados de pacientes
- Centro de notificaciones

### Panel de Cuidador

- Ver y gestionar imágenes del banco de pruebas
- Subir nuevas imágenes con descripciones
- Ver reportes del paciente asignado
- Eliminar imágenes obsoletas

### Panel de Paciente

- Realizar test diario (máximo 1 por día)
- Describir imágenes mostradas aleatoriamente
- Ver resultado inmediato del test
- Interfaz simplificada y accesible

---

## 🔌 API y Servicios

### Servicios Principales

#### AuthService (`authService.js`)

```javascript
// Login de usuario
login(email, password);

// Logout
logout();

// Obtener usuario actual
getCurrentUser();

// Verificar sesión
checkSession();
```

#### ImageService (`imageService.js`)

```javascript
// Obtener todas las imágenes
getImages();

// Crear nueva imagen
createImage({ descripcion, file, grupo_id });

// Eliminar imagen
deleteImage(imageId);

// Obtener imágenes aleatorias para test
getRandomPicturesByPatientId(patientId);
```

#### ReportService (`reportService.js`)

```javascript
// Crear reporte
createReport(reportData);

// Obtener reportes por paciente
getReportsByPatientId(patientId);

// Obtener fecha del último reporte
getLatestReportDateByPatientId(patientId);

// Eliminar reporte
deleteReport(reportId);
```

#### OpenAI Service (`openaiService.js`)

```javascript
// Evaluar descripciones con IA
getCompletion(descArray);
```

### Criterios de Evaluación Cognitiva

El sistema evalúa **7 criterios** con puntuación de 1 a 5:

1. **topical_consistency**: Coherencia temática con la descripción original
2. **logica_flow**: Fluidez lógica en la secuencia de ideas
3. **linguistic_complexity**: Complejidad del vocabulario y gramática
4. **presence_entities**: Presencia de entidades relevantes (personas, objetos)
5. **accuracy_details**: Precisión de los detalles mencionados
6. **omission_rate**: Cantidad de elementos relevantes omitidos
7. **comission_rate**: Cantidad de elementos incorrectos agregados

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si deseas contribuir al proyecto:

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Convenciones de Código

- Usa **ESLint** para mantener consistencia
- Sigue las convenciones de **React Hooks**
- Comenta código complejo
- Escribe commits descriptivos en español

---

## 👨‍💻 Autores

Este proyecto fue desarrollado por:

- **Sebastian Medina Garcia** - [GitHub](https://github.com/SebastianM1206)
- **Samuel Sepulveda Castaño**
- **Juan David Trujillo Erazo**

### Contacto

Para preguntas o sugerencias sobre el proyecto, puedes contactarnos a través de:

- GitHub Issues: [Crear un issue](https://github.com/SebastianM1206/doURemember/issues)
- Email: [Contacto del proyecto]

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🙏 Agradecimientos

- **Universidad** por el apoyo en el desarrollo del proyecto
- **Supabase** por su excelente plataforma BaaS
- **OpenAI** por la API de GPT-4
- **Comunidad de React** por las herramientas y recursos
- **Tailwind CSS** por facilitar el diseño responsive

---

## 📚 Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de OpenAI](https://platform.openai.com/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎥 Demo

No olvides ver el **[video demostrativo completo](https://youtu.be/ICixeUobUCs)** para entender mejor cómo funciona DoURemember.

---

<div align="center">

**Desarrollado con ❤️ para ayudar en la evaluación cognitiva**

⭐ Si este proyecto te resultó útil, considera darle una estrella en GitHub

</div>
