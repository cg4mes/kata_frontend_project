# QA Indicators Management System - Frontend

Modern React-based dashboard for visualizing and managing QA projects, test metrics, and indicators across multiple pipeline types.

## 🚀 Features

- **Interactive Dashboard**: Real-time visualization of QA metrics and project statistics
- **Project Management**: Create, edit, and delete QA projects with detailed metrics
- **Multi-Pipeline Visualization**: Graphs for regression, performance, and security test results
- **User Authentication**: Secure JWT-based authentication
- **Role-Based Access**: Admin and viewer roles with appropriate permissions
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Data Visualization**: Interactive charts using Recharts
- **Type Safety**: Full TypeScript support for better DX

## 🏗️ Architecture

### Structure
- **Pages**: Main application views (Dashboard, Project Detail, Login, User Management)
- **Components**: Reusable UI components (modals, cards, charts)
- **Hooks**: Custom React hooks for data management and utilities
- **Services**: API communication layer
- **Context**: Global state management (Authentication)
- **Utils**: Helper functions and utilities
- **Constants**: Application-wide constants and configuration

### Key Technologies
- **React 19**: Latest React version with modern features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **Tailwind CSS**: Utility-first styling

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (for containerization)
- AWS CLI (for cloud deployment)

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Configuration

Create `.env.local` for local development:

```env
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=local
```

See `.env.qa`, `.env.staging`, and `.env.production` for environment-specific configurations.

### Using Docker

```bash
# Build Docker image for QA
./ci-cd/local-build.sh qa true

# Run container
docker run -p 8080:80 kata-frontend:qa

# Access application
open http://localhost:8080
```

## 📦 Deployment

This project is configured for deployment to AWS ECS/Fargate with support for multiple environments (QA, Staging, Production).

### Deployment Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide with AWS setup
- **[AWS_SETUP.md](./AWS_SETUP.md)** - Quick reference for AWS configuration

### Quick Deploy

```bash
# Local build and test
./ci-cd/local-build.sh qa true

# Deploy to environment (creates git tag and triggers pipeline)
./ci-cd/deploy.sh
```

### Manual Deployment Steps

1. **Configure AWS Resources** (first time only)
   - See [AWS_SETUP.md](./AWS_SETUP.md) for detailed instructions
   - Set up VPC, ECS, ECR, IAM roles, ALB
   - Configure CloudWatch logs

2. **Update Configuration**
   ```bash
   # Replace AWS Account ID and API URLs
   export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
   find . -type f \( -name "*.yml" -o -name "*.json" \) -exec sed -i '' "s/YOUR_AWS_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" {} +
   ```

3. **Build and Push Docker Image**
   ```bash
   docker build --build-arg VITE_API_URL=https://api-qa.yourapp.com -t kata-frontend:qa .
   docker tag kata-frontend:qa YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/kata-frontend:qa-latest
   docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/kata-frontend:qa-latest
   ```

4. **Deploy to ECS**
   - Pipeline automatically deploys on git tag push
   - Or manually update ECS service via AWS Console

### Environment-Specific Buildspecs

- `buildspec.yml` - Production deployment
- `pipeline/buildspecs/buildspec.qa.yml` - QA deployment
- `pipeline/buildspecs/buildspec.staging.yml` - Staging deployment

### Important Notes

⚠️ **Environment Variables**: Vite environment variables (`VITE_*`) are injected at **build time**, not runtime. Each environment requires a separate build with the appropriate `VITE_API_URL`.

## 🏗️ Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable React components
│   └── ui/         # UI components library
├── constants/       # App constants and configuration
├── context/         # React Context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components (routes)
├── services/       # API service layer
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
