# 📊 Sistema de Gestión de Indicadores QA - Frontend

Dashboard moderno basado en React para visualizar y gestionar proyectos QA, métricas de pruebas e indicadores a través de múltiples tipos de pipelines.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.x-6E9F18.svg)](https://vitest.dev/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#️-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Inicio Rápido](#-inicio-rápido)
- [Desarrollo](#-desarrollo)
- [Pruebas](#-pruebas)
- [Calidad de Código](#-calidad-de-código)
- [Build y Despliegue](#-build-y-despliegue)
- [Variables de Entorno](#-variables-de-entorno)
- [Estructura del Proyecto](#️-estructura-del-proyecto)

## ✨ Características

- **📈 Dashboard Interactivo**: Visualización en tiempo real de métricas QA y estadísticas de proyectos
- **🎯 Gestión de Proyectos**: Crear, editar y eliminar proyectos QA con métricas detalladas
- **📊 Visualización Multi-Pipeline**: Gráficos para resultados de pruebas de regresión, rendimiento y seguridad
- **🔐 Autenticación de Usuarios**: Autenticación segura basada en JWT
- **👥 Acceso Basado en Roles**: Roles de administrador y visor con permisos apropiados
- **📱 Diseño Responsivo**: Interfaz móvil-amigable con Tailwind CSS
- **📉 Visualización de Datos**: Gráficos interactivos usando librería Recharts
- **⚡ Alto Rendimiento**: Build optimizado con Vite
- **🎨 UI Moderna**: Interfaz limpia e intuitiva con animaciones suaves
- **🔒 Seguridad de Tipos**: Soporte completo de TypeScript para mejor experiencia de desarrollo

## 🏗️ Arquitectura

### Estructura de la Aplicación

```
src/
├── pages/           # Vistas principales de la aplicación
├── components/      # Componentes UI reutilizables
├── hooks/          # Hooks personalizados de React
├── services/       # Capa de comunicación con API
├── context/        # Gestión de estado global
├── utils/          # Funciones auxiliares
├── constants/      # Constantes de la aplicación
└── types/          # Definiciones de TypeScript
```

### Tecnologías Clave

- **React 19** - Última versión de React con características concurrentes
- **TypeScript 5.x** - Desarrollo con seguridad de tipos
- **Vite 6.x** - Herramienta de build y servidor de desarrollo ultrarápido
- **React Router v7** - Enrutamiento del lado del cliente
- **Axios** - Cliente HTTP basado en promesas
- **Recharts** - Librería de gráficos componibles
- **Tailwind CSS 3.x** - Framework CSS utility-first
- **Vitest + React Testing Library** - Framework de testing

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** o **yarn**

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Entorno

Crea `.env.local` para desarrollo local:

```bash
# Crear archivo de entorno local
cat > .env.local << EOF
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=local
EOF
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev

# La aplicación estará disponible en:
# http://localhost:5173
```

### 4. Iniciar Sesión

Usa las credenciales de administrador por defecto:
- **Usuario**: `admin`
- **Contraseña**: `admin123`

⚠️ **Asegúrate de que el backend esté ejecutándose en `http://localhost:3000`**

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev             # Iniciar servidor dev con recarga en caliente

# Build
npm run build           # Compilar para producción
npm run preview         # Previsualizar build de producción localmente

# Pruebas
npm run test            # Ejecutar tests con Vitest
npm run test:ui         # Ejecutar tests con interfaz UI
npm run test:coverage   # Generar reporte de cobertura

# Calidad de Código
npm run lint            # Ejecutar ESLint
npm run lint:fix        # Corregir problemas de linting

# Verificación de Tipos
npx tsc --noEmit        # Verificar tipos de TypeScript
```

### Hot Module Replacement (HMR)

Vite proporciona reemplazo instantáneo de módulos durante el desarrollo. Los cambios en tu código se reflejarán inmediatamente sin recarga completa de página.

## 🧪 Pruebas

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test

# Watch mode (desarrollo)
npm run test:watch

# Con interfaz UI interactiva
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

### Ver Reporte de Cobertura

```bash
# Abrir reporte HTML de cobertura
open coverage/index.html

# El reporte se genera automáticamente al ejecutar npm run test:coverage
```

### Verificación de Tipos

```bash
# Verificar tipos de TypeScript sin emitir archivos
npx tsc --noEmit
```

## 🔍 Calidad de Código

### ESLint

```bash
# Ejecutar linter
npm run lint

# Corregir problemas auto-corregibles
npm run lint:fix
```

### Análisis con SonarQube (Opcional)

Si tienes SonarQube configurado, puedes ejecutar análisis de calidad:

```bash
# Instalar scanner de SonarQube
npm install -g sonarqube-scanner

# Ejecutar análisis
sonar-scanner \
  -Dsonar.projectKey=kata_frontend_project \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=TU_TOKEN_SONARQUBE
```

## 📦 Build y Despliegue

### Compilar para Producción

```bash
# Compilar aplicación
npm run build

# El output estará en la carpeta /dist
# Los archivos son completamente estáticos y pueden desplegarse en cualquier servidor web
```

### Opciones de Despliegue

La aplicación puede desplegarse en cualquier plataforma de hosting estático:

- **Netlify / Vercel**: Conecta tu repositorio y configura el build command como `npm run build`
- **AWS S3 + CloudFront**: Sube el contenido de `/dist` a un bucket S3 con hosting web habilitado
- **Nginx / Apache**: Copia los archivos de `/dist` al directorio web del servidor
- **GitHub Pages**: Usa GitHub Actions para desplegar automáticamente

### Configuración para Enrutamiento SPA

Si usas React Router, asegúrate de configurar tu servidor para redirigir todas las rutas a `index.html`:

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache** (`.htaccess`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 🔐 Variables de Entorno

### Variables Requeridas

Todas las variables de entorno deben tener el prefijo `VITE_` para ser expuestas al código del lado del cliente.

```bash
# .env.local (para desarrollo local)
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=local
```

### Archivos Específicos por Entorno

- `.env.local` - Desarrollo local (no en git, crear manualmente)
- `.env.example` - Plantilla (en git)

### Tiempo de Compilación vs Tiempo de Ejecución

⚠️ **Importante**: Vite inyecta las variables de entorno en **tiempo de compilación**, no en tiempo de ejecución.

```javascript
// Esto se reemplaza en tiempo de compilación con el valor real
const apiUrl = import.meta.env.VITE_API_URL;

// Las variables deben estar configuradas ANTES de ejecutar npm run build
```

## 🗂️ Estructura del Proyecto

```
kata_frontend_project/
├── src/
│   ├── assets/                 # Assets estáticos (SVG, imágenes)
│   ├── components/             # Componentes de React
│   │   ├── ui/                # Componentes UI reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── CreateProjectModal.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── StatsCard.tsx
│   ├── constants/              # Constantes de la app
│   │   ├── app.ts             # Constantes generales
│   │   ├── colors.ts          # Paleta de colores
│   │   └── theme.ts           # Configuración del tema
│   ├── context/                # React Context
│   │   └── AuthContext.tsx    # Estado de autenticación
│   ├── hooks/                  # Hooks personalizados
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useProjectsData.ts
│   ├── pages/                  # Componentes de página
│   │   ├── Dashboard.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── Login.tsx
│   │   └── UserManagement.tsx
│   ├── services/               # Servicios de API
│   │   └── api.ts             # Instancia de Axios y llamadas API
│   ├── types/                  # Tipos de TypeScript
│   │   └── index.ts
│   ├── utils/                  # Funciones utilitarias
│   ├── test/                   # Utilidades de testing
│   │   └── setup.ts           # Configuración de Vitest
│   ├── App.tsx                 # Componente principal de la App
│   ├── main.tsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── public/                     # Archivos estáticos públicos
│   └── vite.svg
├── coverage/                   # Reportes de cobertura (generado)
├── dist/                       # Build de producción (generado)
├── .env.example               # Plantilla de entorno
├── index.html                 # Plantilla HTML
├── vite.config.ts             # Configuración de Vite
├── vitest.config.ts           # Configuración de Vitest
├── tsconfig.json              # Configuración de TypeScript
├── tailwind.config.js         # Configuración de Tailwind
├── postcss.config.js          # Configuración de PostCSS
├── eslint.config.js           # Configuración de ESLint
└── package.json               # Dependencias
```

## 🎨 Componentes UI

### Librería de Componentes

Ubicados en `src/components/ui/`:
- **Button** - Botón personalizable con variantes (primary, secondary, danger)
- **Input** - Campo de entrada estilizado con etiquetas y validación
- **Modal** - Componente de diálogo modal reutilizable

### Ejemplo de Uso

```tsx
import { Button, Input, Modal } from '@/components/ui';

function MiComponente() {
  return (
    <>
      <Input label="Usuario" placeholder="Ingresa usuario" />
      <Button variant="primary" onClick={handleClick}>
        Enviar
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <h2>Contenido del Modal</h2>
      </Modal>
    </>
  );
}
```

## 🤝 Contribuir

1. Crea tu rama de funcionalidad (`git checkout -b feature/CaracteristicaIncreible`)
2. Haz commit de tus cambios (`git commit -m 'feat: agregar alguna CaracteristicaIncreible'`)
3. Haz push a la rama (`git push origin feature/CaracteristicaIncreible`)
4. Abre un Pull Request

### Guías de Desarrollo

- Sigue la estructura y estilo de código existente
- Usa TypeScript para seguridad de tipos
- Crea componentes reutilizables cuando sea posible
- Mantén los componentes pequeños y enfocados
- Escribe tests para nuevas funcionalidades
- Escribe mensajes de commit significativos (Conventional Commits)

## 🔗 Recursos Relacionados

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vite.dev/)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Recharts](https://recharts.org/)
- [Documentación de Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🚀 Tips de Rendimiento

- Usa React.lazy() para división de código
- Optimiza imágenes (usa formato WebP)
- Minimiza el tamaño del bundle (verifica con `npm run build`)
- Usa React DevTools Profiler para identificar cuellos de botella
- Implementa paginación para conjuntos de datos grandes

---

**Construido con ⚡ usando React + Vite + TypeScript**
