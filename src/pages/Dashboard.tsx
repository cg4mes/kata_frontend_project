import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { projectsApi } from '../services/api';
import type { CreateProjectDto } from '../types';
import CreateProjectModal from '../components/CreateProjectModal';
import { Button, Modal } from '../components/ui';
import { useProjectsData, type ProjectWithMetrics } from '../hooks/useProjectsData';
import { useProjectSorting, type SortCriteria } from '../hooks/useProjectSorting';
import { CHART_COLORS } from '../constants/colors';
import { generateTrendData, type TimePeriod } from '../utils/chartDataTransformers';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const { projects, stats, loading, error, loadData } = useProjectsData();
  const { sortedData, sortCriteria, sortByCriteria, setSortedData } =
    useProjectSorting<ProjectWithMetrics>(projects);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('weeks');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGlobalEditModalOpen, setIsGlobalEditModalOpen] = useState(false);
  const [isGlobalDeleteModalOpen, setIsGlobalDeleteModalOpen] = useState(false);
  const [selectedProjectToDelete, setSelectedProjectToDelete] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar datos ordenados cuando cambian los proyectos
  useEffect(() => {
    setSortedData(projects);
  }, [projects, setSortedData]);

  const handleSortProjects = (criteria: SortCriteria) => {
    sortByCriteria(criteria, projects);
  };

  const handleCreateProject = async (project: CreateProjectDto) => {
    await projectsApi.create(project);
    await loadData(); // Recargar la lista de proyectos
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            id="btn-retry-load"
            onClick={loadData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* User Info - Left */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">
                  {isAdmin ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Administrador
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      Visualizador
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Title - Center */}
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Tablero de Testing</h1>
              <p className="mt-1 text-sm text-gray-600">
                Monitoreo de indicadores y métricas de calidad
              </p>
            </div>

            {/* Actions - Right */}
            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <Button
                    id="btn-new-project"
                    variant="primary"
                    size="md"
                    onClick={() => setIsCreateModalOpen(true)}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    }
                  >
                    Nuevo Proyecto
                  </Button>
                  <Button
                    id="btn-manage-users"
                    variant="secondary"
                    size="md"
                    onClick={() => navigate('/users')}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    }
                  >
                    Gestionar Usuarios
                  </Button>
                </>
              )}
              <Button
                id="btn-logout"
                variant="secondary"
                size="md"
                onClick={logout}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                }
              >
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Columna Principal */}
          <div className="flex-1 min-w-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <button
                id="stat-total-projects"
                onClick={() => handleSortProjects('none')}
                className={`bg-white rounded-lg shadow p-6 text-left transition-all hover:shadow-lg hover:scale-105 ${sortCriteria === 'none' ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Proyectos</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
                  </div>
                </div>
              </button>

              <button
                id="stat-success-rate"
                onClick={() => handleSortProjects('successRate')}
                className={`bg-white rounded-lg shadow p-6 text-left transition-all hover:shadow-lg hover:scale-105 ${sortCriteria === 'successRate' ? 'ring-2 ring-green-500' : ''}`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tasa de Éxito Promedio</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.averageSuccessRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </button>

              <button
                id="stat-test-runs"
                onClick={() => handleSortProjects('testRuns')}
                className={`bg-white rounded-lg shadow p-6 text-left transition-all hover:shadow-lg hover:scale-105 ${sortCriteria === 'testRuns' ? 'ring-2 ring-purple-500' : ''}`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Test Runs Totales</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalTestRuns}</p>
                  </div>
                </div>
              </button>

              <button
                id="stat-coverage"
                onClick={() => handleSortProjects('coverage')}
                className={`bg-white rounded-lg shadow p-6 text-left transition-all hover:shadow-lg hover:scale-105 ${sortCriteria === 'coverage' ? 'ring-2 ring-orange-500' : ''}`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Cobertura Promedio</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.averageCoverage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Global Action Buttons */}
            {isAdmin && projects.length > 0 && (
              <div className="mb-6 flex gap-3">
                <Button
                  id="btn-global-edit-tests"
                  variant="success"
                  size="lg"
                  onClick={() => setIsGlobalEditModalOpen(true)}
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  }
                >
                  Editar Tests Definidos
                </Button>
                <Button
                  id="btn-global-delete-project"
                  variant="danger"
                  size="lg"
                  onClick={() => setIsGlobalDeleteModalOpen(true)}
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  }
                >
                  Eliminar Proyecto
                </Button>
              </div>
            )}

            {/* Projects Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Indicadores de regresión</h2>
                  {sortCriteria !== 'none' && (
                    <span className="text-sm text-gray-600">
                      Ordenado por:{' '}
                      {sortCriteria === 'successRate'
                        ? 'Tasa de Éxito'
                        : sortCriteria === 'testRuns'
                          ? 'Test Runs'
                          : sortCriteria === 'coverage'
                            ? 'Cobertura'
                            : ''}
                    </span>
                  )}
                </div>
              </div>

              {sortedData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay proyectos disponibles</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prefijo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tests Definidos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tasa Éxito
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Runs
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cobertura
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedData.map((project: ProjectWithMetrics) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {project.product}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {project.prefix}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.totalDefinedTests}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.metrics.averageSuccessRate.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.metrics.testRunsCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.metrics.currentCoverage.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              id={`btn-view-details-${project.id}`}
                              onClick={() => navigate(`/project/${project.id}?tab=regression`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Ver Detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Performance Indicators Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Indicadores de Performance</h2>
              </div>

              {sortedData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay proyectos disponibles</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prefijo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Runs
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tasa de Error Promedio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedData.map((project: ProjectWithMetrics) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {project.product}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {project.prefix}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.metrics.testRunsCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {project.metrics.averageErrorRate !== undefined ? (
                              <span
                                className={
                                  project.metrics.averageErrorRate > 5
                                    ? 'text-red-600 font-semibold'
                                    : 'text-green-600'
                                }
                              >
                                {project.metrics.averageErrorRate.toFixed(2)}%
                              </span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => navigate(`/project/${project.id}?tab=performance`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Ver Detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Security Indicators Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Indicadores de Seguridad</h2>
              </div>

              {sortedData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay proyectos disponibles</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prefijo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Runs
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Security Score Promedio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedData.map((project: ProjectWithMetrics) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {project.product}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {project.prefix}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.metrics.testRunsCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {project.metrics.averageSecurityScore !== undefined ? (
                              <span
                                className={
                                  project.metrics.averageSecurityScore >= 80
                                    ? 'text-green-600 font-semibold'
                                    : project.metrics.averageSecurityScore >= 50
                                      ? 'text-yellow-600'
                                      : 'text-red-600 font-semibold'
                                }
                              >
                                {project.metrics.averageSecurityScore.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => navigate(`/project/${project.id}?tab=security`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Ver Detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Derecho - Gráficos */}
          <div className="w-96 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tendencia General</h3>
                <select
                  id="select-time-period"
                  value={timePeriod}
                  onChange={e => setTimePeriod(e.target.value as TimePeriod)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="days">Días</option>
                  <option value="weeks">Semanas</option>
                  <option value="months">Meses</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={generateTrendData(stats.averageSuccessRate, timePeriod)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="exito"
                    stroke={CHART_COLORS.success}
                    strokeWidth={3}
                    name="Tasa de Éxito %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Proyectos</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Activos', value: projects.length },
                      { name: 'Total Tests', value: stats.totalTestRuns },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill={CHART_COLORS.primary} />
                    <Cell fill={CHART_COLORS.success} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cobertura vs Éxito</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { metric: 'Cobertura', value: stats.averageCoverage },
                    { metric: 'Éxito', value: stats.averageSuccessRate },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill={CHART_COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Global Edit Modal */}
      <Modal
        isOpen={isGlobalEditModalOpen}
        onClose={() => setIsGlobalEditModalOpen(false)}
        title="Editar Tests Definidos"
        variant="success"
        maxWidth="md"
        footer={
          <>
            <Button
              id="btn-cancel-global-edit"
              variant="secondary"
              onClick={() => setIsGlobalEditModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              id="btn-submit-global-edit"
              variant="success"
              type="submit"
              form="global-edit-form"
            >
              Guardar Cambios
            </Button>
          </>
        }
      >
        <form
          id="global-edit-form"
          onSubmit={async e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const projectId = formData.get('projectId') as string;
            const newValue = parseInt(formData.get('testCases') as string);
            if (projectId && !isNaN(newValue)) {
              await projectsApi.update(projectId, { totalDefinedTests: newValue });
              await loadData();
              setIsGlobalEditModalOpen(false);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="global-edit-project"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Seleccionar Proyecto <span className="text-red-500">*</span>
            </label>
            <select
              id="global-edit-project"
              name="projectId"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Selecciona un proyecto --</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.product} ({project.prefix})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="global-edit-testcases"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nuevo Número de Test Cases <span className="text-red-500">*</span>
            </label>
            <input
              id="global-edit-testcases"
              name="testCases"
              type="number"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: 150"
            />
          </div>
        </form>
      </Modal>

      {/* Global Delete Modal */}
      {(() => {
        const selectedProject = sortedData.find(p => p.id === selectedProjectToDelete);
        const hasTestRuns = selectedProject ? selectedProject.metrics.testRunsCount > 0 : false;
        const projectName = projects.find(p => p.id === selectedProjectToDelete)?.product || '';

        return (
          <Modal
            isOpen={isGlobalDeleteModalOpen}
            onClose={() => {
              setIsGlobalDeleteModalOpen(false);
              setSelectedProjectToDelete('');
            }}
            title="Eliminar Proyecto"
            variant="danger"
            maxWidth="md"
            footer={
              <>
                <Button
                  id="btn-cancel-global-delete"
                  variant="secondary"
                  disabled={isDeleting}
                  onClick={() => {
                    setIsGlobalDeleteModalOpen(false);
                    setSelectedProjectToDelete('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  id="btn-submit-global-delete"
                  variant="danger"
                  type="submit"
                  form="global-delete-form"
                  disabled={!selectedProjectToDelete || hasTestRuns || isDeleting}
                  isLoading={isDeleting}
                >
                  Eliminar Proyecto
                </Button>
              </>
            }
          >
            <form
              id="global-delete-form"
              onSubmit={async e => {
                e.preventDefault();
                if (!selectedProjectToDelete || hasTestRuns) return;

                setIsDeleting(true);
                try {
                  await projectsApi.delete(selectedProjectToDelete);
                  await loadData();
                  setIsGlobalDeleteModalOpen(false);
                  setSelectedProjectToDelete('');
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'Error al eliminar el proyecto');
                  console.error('Error deleting project:', err);
                } finally {
                  setIsDeleting(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="global-delete-project"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Seleccionar Proyecto a Eliminar <span className="text-red-500">*</span>
                </label>
                <select
                  id="global-delete-project"
                  value={selectedProjectToDelete}
                  onChange={e => setSelectedProjectToDelete(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Selecciona un proyecto --</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.product} ({project.prefix})
                    </option>
                  ))}
                </select>
              </div>

              {/* Banner de advertencia si tiene test runs */}
              {selectedProjectToDelete && hasTestRuns && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 font-semibold">
                        No se puede eliminar este proyecto
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        El proyecto <strong>"{projectName}"</strong> tiene{' '}
                        <strong>
                          {selectedProject?.metrics.testRunsCount} test run
                          {selectedProject?.metrics.testRunsCount !== 1 ? 's' : ''}
                        </strong>{' '}
                        asociado{selectedProject?.metrics.testRunsCount !== 1 ? 's' : ''}.
                        <br />
                        Elimina primero todos los test runs del proyecto antes de poder eliminarlo.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Banner de confirmación si NO tiene test runs */}
              {selectedProjectToDelete && !hasTestRuns && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-semibold">¿Estás seguro?</p>
                      <p className="text-sm text-red-700 mt-1">
                        Vas a eliminar el proyecto <strong>"{projectName}"</strong>.
                        <br />
                        Esta acción no se puede deshacer y tendrás que crear el proyecto nuevamente
                        si deseas gestionarlo otra vez.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Modal>
        );
      })()}
    </div>
  );
}
