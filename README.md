# 📊 Sistema de Gestión de Indicadores QA - Frontend

Dashboard moderno basado en React para visualizar y gestionar proyectos QA, métricas de pruebas e indicadores a través de múltiples tipos de pipelines.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#️-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Inicio Rápido](#-inicio-rápido)
- [Desarrollo](#-desarrollo)
- [Pruebas](#-pruebas)
- [Calidad de Código](#-calidad-de-código)
- [Despliegue](#-despliegue)
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
- **Vite 6.x** - Herramienta de build y servidor de desarrollo ultrarrrápido
- **React Router v7** - Enrutamiento del lado del cliente
- **Axios** - Cliente HTTP basado en promesas
- **Recharts** - Librería de gráficos componibles
- **Tailwind CSS 3.x** - Framework CSS utility-first
- **AWS S3 + CloudFront** - Hosting y CDN global

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** o **yarn**
- **AWS CLI** v2 (para despliegue en la nube)

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

# Calidad de Código
npm run lint            # Ejecutar ESLint
npm run lint:fix        # Corregir problemas de linting
npm run format          # Formatear código con Prettier (si está configurado)

# Verificación de Tipos
npx tsc --noEmit        # Verificar tipos de TypeScript
```

### Build Local de Producción

```bash
# Compilar para producción con entorno específico
npm run build

# Previsualizar localmente
npm run preview

# O usar script de compilación automatizado
./ci-cd/local-build.sh qa
```

### Hot Module Replacement (HMR)

Vite proporciona reemplazo instantáneo de módulos durante el desarrollo. Los cambios en tu código se reflejarán inmediatamente sin recarga completa de página.

## 🧪 Pruebas

### Pruebas Manuales

```bash
# Iniciar servidor dev y probar manualmente
npm run dev

# Compilar y previsualizar build de producción
npm run build && npm run preview
```

### Verificación de Tipos

```bash
# Verificar tipos de TypeScript sin emitir archivos
npx tsc --noEmit
```

### Configuración Futura de Pruebas

Considera agregar:
- **Vitest** - Framework de pruebas unitarias
- **React Testing Library** - Pruebas de componentes
- **Playwright/Cypress** - Pruebas E2E

## 🔍 Calidad de Código

### Análisis con SonarQube

Ejecuta análisis de calidad de código con SonarQube:

```bash
# Instalar scanner de SonarQube (si no está instalado)
npm install -g sonarqube-scanner

# Ejecutar análisis (reemplaza con tu token)
sonar-scanner -Dsonar.login=TU_TOKEN_SONARQUBE

# O con configuración específica
sonar-scanner \
  -Dsonar.projectKey=kata_frontend_project \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=TU_TOKEN_SONARQUBE
```

**Configuración**: Crea `sonar-project.properties`:

```properties
sonar.projectKey=kata_frontend_project
sonar.projectName=Kata Frontend Project
sonar.projectVersion=1.0
sonar.sources=src
sonar.sourceEncoding=UTF-8
sonar.exclusions=**/node_modules/**,**/dist/**,**/*.test.ts,**/*.spec.ts
```

### ESLint

```bash
# Ejecutar linter
npm run lint

# Corregir problemas auto-corregibles
npm run lint:fix
```

## 📦 Despliegue

Este proyecto está configurado para despliegue en **AWS S3 + CloudFront** como aplicación web estática.

### 🏗️ Arquitectura de Despliegue

```
┌─────────────┐      ┌──────────────┐      ┌─────────┐
│   GitHub    │─────▶│  CodeBuild   │─────▶│   S3    │
│  (Source)   │      │  (Build npm) │      │ Bucket  │
└─────────────┘      └──────────────┘      └────┬────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │ CloudFront  │
                                           │    (CDN)    │
                                           └─────────────┘
                                                  │
                                                  ▼
                                              Usuarios
```

### 🚀 Configuración Inicial (Solo Una Vez)

#### 1. Crear Buckets S3

```bash
# QA
aws s3 mb s3://kata-frontend-qa --region us-east-1
aws s3 website s3://kata-frontend-qa --index-document index.html --error-document index.html

# Staging
aws s3 mb s3://kata-frontend-staging --region us-east-1
aws s3 website s3://kata-frontend-staging --index-document index.html --error-document index.html

# Production
aws s3 mb s3://kata-frontend-production --region us-east-1
aws s3 website s3://kata-frontend-production --index-document index.html --error-document index.html
```

#### 2. Configurar Políticas de Bucket

```bash
# Aplicar política pública de lectura (ejemplo para QA)
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::kata-frontend-qa/*"
  }]
}
EOF

aws s3api put-bucket-policy --bucket kata-frontend-qa --policy file://bucket-policy.json
```

#### 3. Crear Distribuciones CloudFront

```bash
# Usar AWS Console o CLI para crear distribuciones CloudFront
# Apuntar origen a: kata-frontend-qa.s3-website-us-east-1.amazonaws.com

# O usar el script automatizado
./setup-s3-cloudfront.sh
```

#### 4. Actualizar Configuración

Actualiza los **CloudFront Distribution IDs** en:
- `buildspec.yml` → Variable `CLOUDFRONT_DISTRIBUTION_ID`
- `pipeline/buildspecs/buildspec.qa.yml` → Variable `CLOUDFRONT_DISTRIBUTION_ID`
- `pipeline/buildspecs/buildspec.staging.yml` → Variable `CLOUDFRONT_DISTRIBUTION_ID`
- `.github/workflows/deploy-*.yml` → Variable de entorno correspondiente

```bash
# Obtener Distribution IDs
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,Comment]' --output table
```

### 🌍 Entornos

| Ambiente   | S3 Bucket                    | CloudFront | Branch    |
|------------|------------------------------|------------|-----------|
| QA         | `kata-frontend-qa`           | Distribution QA | `develop` |
| Staging    | `kata-frontend-staging`      | Distribution Staging | `staging` |
| Production | `kata-frontend-production`   | Distribution Prod | `main`    |

### 📋 Scripts de Despliegue

```bash
# 1. Verificar configuración
./ci-cd/verify-deployment-config.sh

# 2. Compilación y prueba local
./ci-cd/local-build.sh qa

# 3. Desplegar (crea tag de git y activa CI/CD)
./ci-cd/deploy.sh
```

### 🔄 Proceso de Despliegue Automático

#### Via CodeBuild (AWS CodePipeline)

1. Push a branch específico activa el pipeline
2. CodeBuild ejecuta el buildspec correspondiente:
   - `buildspec.yml` (producción)
   - `pipeline/buildspecs/buildspec.qa.yml`
   - `pipeline/buildspecs/buildspec.staging.yml`
3. CodeBuild compila la aplicación con `npm run build`
4. Los archivos se sincronizan a S3 con `aws s3 sync`
5. Cache de CloudFront se invalida automáticamente

#### Via GitHub Actions

Workflows configurados:
- `.github/workflows/deploy-production.yml` → main branch
- `.github/workflows/deploy-qa.yml` → develop branch
- `.github/workflows/deploy-staging.yml` → staging branch

### ⚠️ Notas Importantes

**Variables de Entorno**: Las variables de entorno de Vite (`VITE_*`) se inyectan en **tiempo de compilación**. Configúralas en:
- BuildSpec: Variables de entorno en cada buildspec
- GitHub Actions: Secrets del repositorio

**Estrategia de Caché**:
- Assets (JS, CSS, imágenes): `max-age=31536000, immutable` (1 año)
- `index.html`: `max-age=0, must-revalidate` (sin caché)

**Invalidación de CloudFront**: Se ejecuta automáticamente después de cada despliegue para asegurar que los usuarios obtengan la última versión.

### 💰 Estimación de Costos (Mensual)

| Servicio      | Costo Estimado |
|---------------|----------------|
| S3 Storage    | ~$0.50        |
| S3 Requests   | ~$0.10        |
| CloudFront    | ~$5-10        |
| CodeBuild     | ~$2-5         |
| **Total**     | **~$8-16/mes** |

*Basado en tráfico moderado. CloudFront Tier Gratuito: 1TB salida/mes el primer año.*

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
- `.env.qa` - Placeholders de QA (excluido de git)
- `.env.staging` - Placeholders de Staging (excluido de git)
- `.env.production` - Placeholders de Producción (excluido de git)

### Tiempo de Compilación vs Tiempo de Ejecución

⚠️ **Importante**: Vite inyecta las variables de entorno en **tiempo de compilación**, no en tiempo de ejecución.

```javascript
// Esto se reemplaza en tiempo de compilación con el valor real
const apiUrl = import.meta.env.VITE_API_URL;

// ✅ Correcto: Variables configuradas en buildspec antes de compilar
# buildspec.yml
env:
  variables:
    VITE_API_URL: "https://api.appKata.com"
phases:
  build:
    commands:
      - npm run build  # Las variables ya están inyectadas
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
│   │   └── formatters.ts
│   ├── App.tsx                 # Componente principal de la App
│   ├── main.tsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── public/                     # Archivos estáticos públicos
│   └── vite.svg
├── pipeline/                   # Configuraciones de despliegue AWS
│   └── buildspecs/            # BuildSpecs para CodeBuild
│       ├── buildspec.qa.yml
│       └── buildspec.staging.yml
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       ├── deploy-production.yml
│       ├── deploy-qa.yml
│       └── deploy-staging.yml
├── ci-cd/                      # Scripts CI/CD
│   ├── deploy.sh
│   ├── local-build.sh
│   ├── install-dependencies.sh
│   └── verify-deployment-config.sh
├── .env.example               # Plantilla de entorno
├── buildspec.yml              # BuildSpec de producción
├── setup-s3-cloudfront.sh     # Script de configuración AWS
├── index.html                 # Plantilla HTML
├── vite.config.ts             # Configuración de Vite
├── tsconfig.json              # Configuración de TypeScript
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

1. Haz fork del repositorio
2. Crea tu rama de funcionalidad (`git checkout -b feature/CaracteristicaIncreible`)
3. Haz commit de tus cambios (`git commit -m 'Agregar alguna CaracteristicaIncreible'`)
4. Haz push a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abre un Pull Request

### Guías de Desarrollo

- Sigue la estructura y estilo de código existente
- Usa TypeScript para seguridad de tipos
- Crea componentes reutilizables cuando sea posible
- Mantén los componentes pequeños y enfocados
- Escribe mensajes de commit significativos

## 📝 Licencia

Este proyecto es privado y propietario.

## 📞 Soporte

Para problemas o preguntas:
- Crea un issue en el repositorio
- Contacta al equipo de desarrollo

## 🔗 Recursos Relacionados

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vite.dev/)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Recharts](https://recharts.org/)
- [Documentación de AWS ECS](https://docs.aws.amazon.com/ecs/)

## 🚀 Tips de Rendimiento

- Usa React.lazy() para división de código
- Optimiza imágenes (usa formato WebP)
- Minimiza el tamaño del bundle (verifica con `npm run build`)
- Usa React DevTools Profiler para identificar cuellos de botella
- Implementa paginación para conjuntos de datos grandes

---

**Construido con ⚡ usando React + Vite + TypeScript**
