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
