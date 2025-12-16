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
- [Configuración de GitHub Actions](#-configuración-de-github-actions)
- [Variables de Entorno](#-variables-de-entorno)
- [Estructura del Proyecto](#️-estructura-del-proyecto)
- [Troubleshooting](#-troubleshooting)

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

Actualiza los **CloudFront Distribution IDs** en los workflows de GitHub Actions:
- `.github/workflows/qa.yml` → Campo `distribution-id`
- `.github/workflows/stg.yml` → Campo `distribution-id`
- `.github/workflows/prod.yml` → Campo `distribution-id`

```bash
# Obtener Distribution IDs
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,Comment]' --output table
```

#### 5. Configurar Secrets en GitHub

Ve a **Settings > Secrets and variables > Actions** y configura:
- `DIG_READER_GITHUB_ACCESS_TOKEN` - Token de acceso a repos de la organización
- `ARTIFACTORY_READER_USER` - Usuario de Artifactory (si aplica)
- `ARTIFACTORY_READER_API_KEY` - API Key de Artifactory (si aplica)
- `AWS_ACCOUNT_ID` - ID de la cuenta AWS
- `AWS_ROLE_DEPLOY_FRONTEND` - Nombre del rol IAM para deployment

### 🌍 Entornos

| Ambiente   | S3 Bucket                    | CloudFront | Branch    |
|------------|------------------------------|------------|-----------|
| QA         | `kata-frontend-qa`           | Distribution QA | `develop` |
| Staging    | `kata-frontend-staging`      | Distribution Staging | `staging` |
| Production | `kata-frontend-production`   | Distribution Prod | `main`    |

### � Proceso de Despliegue Automático

El proyecto usa **GitHub Actions** con pipelines reutilizables de la organización (`bancodebogota/bbog-can-pipeline`).

#### Estrategia de Branches

```
main (production)
  ↑
  └── staging
       ↑
       └── develop (qa)
            ↑
            └── feature/*
```

#### Workflows Configurados

| Workflow | Branch | Ambiente | Bucket S3 | Archivo |
|----------|--------|----------|-----------|---------|
| Deploy QA | `develop` | qa | kata-frontend-qa | [qa.yml](.github/workflows/qa.yml) |
| Deploy Staging | `staging` | st | kata-frontend-staging | [stg.yml](.github/workflows/stg.yml) |
| Deploy Production | `main` | pr | kata-frontend-production | [prod.yml](.github/workflows/prod.yml) |
| Requirements | PR a cualquier branch | - | - | [requirements.yml](.github/workflows/requirements.yml) |

#### Flujo de Deployment

1. **Push** a branch específico (`develop`, `staging`, o `main`)
2. GitHub Actions ejecuta el workflow correspondiente
3. Pipeline reutilizable realiza:
   - Checkout del código
   - Setup de Node.js v18
   - Instalación de dependencias (`npm ci`)
   - Build de la aplicación (`npm run build`)
   - Configuración de credenciales AWS (AssumeRole)
   - Sync de archivos a S3:
     - Assets con cache largo (1 año): `max-age=31536000, immutable`
     - `index.html` sin cache: `max-age=0, must-revalidate`
   - Invalidación del cache de CloudFront (`/*`)
4. Aplicación disponible en CloudFront

### ⚠️ Notas Importantes

**Variables de Entorno**: Las variables de entorno de Vite (`VITE_*`) se inyectan en **tiempo de compilación**. Configúralas en los archivos:
- `.env.qa` - Configuración para QA
- `.env.staging` - Configuración para Staging  
- `.env.production` - Configuración para Production

**Estrategia de Caché**:
- Assets (JS, CSS, imágenes): `max-age=31536000, immutable` (1 año)
- `index.html`: `max-age=0, must-revalidate` (sin caché)

**Invalidación de CloudFront**: Se ejecuta automáticamente después de cada despliegue para asegurar que los usuarios obtengan la última versión.

**Permisos AWS**: El rol IAM especificado en `AWS_ROLE_DEPLOY_FRONTEND` debe tener permisos para:
- S3: `PutObject`, `GetObject`, `DeleteObject`, `ListBucket`
- CloudFront: `CreateInvalidation`, `GetInvalidation`

## ⚙️ Configuración de GitHub Actions

### 🔑 Secrets Requeridos

Configura estos secrets en **Settings > Secrets and variables > Actions**:

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `DIG_READER_GITHUB_ACCESS_TOKEN` | Token para acceder a repos privados de la org | `ghp_...` |
| `ARTIFACTORY_READER_USER` | Usuario de Artifactory (opcional) | `usuario` |
| `ARTIFACTORY_READER_API_KEY` | API Key de Artifactory (opcional) | `api-key` |
| `AWS_ACCOUNT_ID` | ID de la cuenta AWS | `123456789012` |
| `AWS_ROLE_DEPLOY_FRONTEND` | Nombre del rol IAM para deployment | `GitHubActions-DeployFrontend` |

### 📝 Checklist de Configuración

#### 1. Obtener CloudFront Distribution IDs

```bash
# Listar todas las distribuciones
aws cloudfront list-distributions \
  --query 'DistributionList.Items[*].[Id,Comment]' \
  --output table

# Buscar por bucket específico
aws cloudfront list-distributions \
  --query "DistributionList.Items[?Origins.Items[0].DomainName=='kata-frontend-qa.s3.amazonaws.com'].Id" \
  --output text
```

#### 2. Actualizar Distribution IDs en Workflows

Edita cada archivo y reemplaza el campo `distribution-id`:

**QA** - [.github/workflows/qa.yml](.github/workflows/qa.yml):
```yaml
distribution-id: "E1234567890ABC"  # ← Tu Distribution ID de QA
```

**Staging** - [.github/workflows/stg.yml](.github/workflows/stg.yml):
```yaml
distribution-id: "E0987654321XYZ"  # ← Tu Distribution ID de Staging
```

**Production** - [.github/workflows/prod.yml](.github/workflows/prod.yml):
```yaml
distribution-id: "E5555555555AAA"  # ← Tu Distribution ID de Production
```

#### 3. Verificar Rol IAM

El rol `AWS_ROLE_DEPLOY_FRONTEND` debe tener:

**Trust Policy (GitHub OIDC):**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:<org>/<repo>:*"
      }
    }
  }]
}
```

**Permisos S3:**
```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:GetObject",
    "s3:DeleteObject",
    "s3:ListBucket"
  ],
  "Resource": [
    "arn:aws:s3:::kata-frontend-qa",
    "arn:aws:s3:::kata-frontend-qa/*",
    "arn:aws:s3:::kata-frontend-staging",
    "arn:aws:s3:::kata-frontend-staging/*",
    "arn:aws:s3:::kata-frontend-production",
    "arn:aws:s3:::kata-frontend-production/*"
  ]
}
```

**Permisos CloudFront:**
```json
{
  "Effect": "Allow",
  "Action": [
    "cloudfront:CreateInvalidation",
    "cloudfront:GetInvalidation"
  ],
  "Resource": "arn:aws:cloudfront::<AWS_ACCOUNT_ID>:distribution/*"
}
```

#### 4. Verificar Buckets S3

```bash
# Listar buckets
aws s3 ls | grep kata-frontend

# Verificar configuración de website hosting
aws s3api get-bucket-website --bucket kata-frontend-qa

# Verificar archivos actuales
aws s3 ls s3://kata-frontend-qa/ --recursive
```

### 🚀 Primer Deployment

1. **Verifica configuración local:**
   ```bash
   npm ci
   npm run build  # Debe completarse sin errores
   ```

2. **Commit y push a develop:**
   ```bash
   git add .
   git commit -m "chore: configuración de GitHub Actions"
   git push origin develop
   ```

3. **Monitorea el workflow:**
   - Ve a tu repositorio en GitHub
   - Click en la pestaña **Actions**
   - Observa el workflow "Deploy QA" ejecutándose
   - Verifica que todos los pasos completen exitosamente ✅

4. **Verifica el deployment:**
   - Abre la URL de CloudFront de QA
   - Confirma que la aplicación carga correctamente
   - Verifica en DevTools que los assets se cargan desde CloudFront

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

## � Troubleshooting

### Problemas Comunes

#### Error: "distribution-id is empty"
**Causa:** El CloudFront Distribution ID no está configurado en el workflow.

**Solución:**
```bash
# Obtener el ID correcto
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,Comment]' --output table

# Actualizar en .github/workflows/deploy-<ambiente>.yml
distribution-id: "TU_DISTRIBUTION_ID_AQUI"
```

#### Error: "Access Denied" en S3
**Causa:** El rol IAM no tiene permisos suficientes.

**Solución:**
1. Verifica que `AWS_ACCOUNT_ID` sea correcto
2. Verifica que `AWS_ROLE_DEPLOY_FRONTEND` exista
3. Revisa los permisos del rol IAM (ver sección de configuración)
4. Confirma que el rol tiene trust policy para GitHub OIDC

#### Error: "Failed to assume role"
**Causa:** El rol IAM no confía en GitHub Actions.

**Solución:**
Actualiza la Trust Policy del rol IAM para incluir GitHub OIDC provider (ver sección de configuración).

#### Build funciona local pero falla en GitHub Actions
**Causa:** Variables de entorno no configuradas o dependencias faltantes.

**Solución:**
1. Verifica que los archivos `.env.*` existan en el repositorio
2. Confirma que `package-lock.json` esté committeado
3. Asegúrate de que Node.js v18 sea compatible con todas las dependencias

#### Error: "npm ci" falla
**Causa:** `package-lock.json` desactualizado o corrupto.

**Solución:**
```bash
# Regenerar package-lock.json
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerar package-lock.json"
```

#### CloudFront muestra versión antigua
**Causa:** Cache de CloudFront no invalidado correctamente.

**Solución:**
```bash
# Invalidar manualmente
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"

# Verificar estado de la invalidación
aws cloudfront get-invalidation \
  --distribution-id E1234567890ABC \
  --id INVALIDATION_ID
```

#### Aplicación carga pero no conecta con API
**Causa:** Variables de entorno de API incorrectas.

**Solución:**
1. Verifica `VITE_API_URL` en el archivo `.env.*` correspondiente
2. Confirma que el backend esté accesible desde el navegador
3. Revisa CORS en el backend
4. Inspecciona Network tab en DevTools del navegador

### Logs y Debugging

#### Ver logs de GitHub Actions
1. Ve a **Actions** tab en GitHub
2. Click en el workflow fallido
3. Click en el job para ver logs detallados
4. Expande cada step para ver el output completo

#### Ver logs de CloudFront
```bash
# Habilitar logging (si no está habilitado)
aws cloudfront update-distribution --id E1234567890ABC \
  --distribution-config file://distribution-config.json

# Ver logs (se almacenan en S3)
aws s3 ls s3://cloudfront-logs-bucket/
```

#### Debugging local
```bash
# Build con output verbose
npm run build -- --debug

# Previsualizar build
npm run preview

# Verificar variables de entorno
echo "API URL: $VITE_API_URL"
```

### Recursos Útiles

- [Pipeline Reutilizable](https://github.com/bancodebogota/bbog-can-pipeline) - Documentación del pipeline de la organización
- [GitHub Actions Docs](https://docs.github.com/en/actions) - Documentación oficial de GitHub Actions
- [Vite Docs](https://vitejs.dev/) - Documentación de Vite
- [AWS CloudFront Docs](https://docs.aws.amazon.com/cloudfront/) - Documentación de CloudFront

## 📞 Soporte

Para problemas o preguntas:
- Crea un issue en el repositorio
- Contacta al equipo de desarrollo
- Consulta el repositorio de pipelines: [bancodebogota/bbog-can-pipeline](https://github.com/bancodebogota/bbog-can-pipeline)

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
