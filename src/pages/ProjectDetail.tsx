import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { projectsApi, indicatorsApi } from '../services/api';
import type { Project, Indicator } from '../types';
import ConfirmModal from '../components/ConfirmModal';
import { Button } from '../components/ui';
import Tabs from '../components/Tabs';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280'];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    indicatorId: string;
    runDate: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Leer el parámetro tab de la URL
  const tabParam = searchParams.get('tab') as 'regression' | 'performance' | 'security' | null;
  const [activeTab, setActiveTab] = useState<'regression' | 'performance' | 'security'>(
    tabParam || 'regression'
  );

  const loadData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [projectData, indicatorsData] = await Promise.all([
        projectsApi.getById(id),
        indicatorsApi.getByProject(id),
      ]);

      setProject(projectData);
      setIndicators(
        indicatorsData.sort((a, b) => new Date(a.runDate).getTime() - new Date(b.runDate).getTime())
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleDeleteIndicator = (indicatorId: string, runDate: string) => {
    setDeleteModal({ isOpen: true, indicatorId, runDate });
  };

  const confirmDeleteIndicator = async () => {
    if (!deleteModal) return;

    setIsDeleting(true);
    try {
      await indicatorsApi.delete(deleteModal.indicatorId);
      await loadData();
      setDeleteModal(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el test run');
      console.error('Error deleting indicator:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = () => {
    if (indicators.length === 0) return;
    setDeleteAllModal(true);
  };

  const confirmDeleteAll = async () => {
    if (!id) return;

    setIsDeletingAll(true);
    try {
      const result = await indicatorsApi.deleteAllByProject(id);
      await loadData();
      setDeleteAllModal(false);
      console.log(`Deleted ${result.count} test runs`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar los test runs');
      console.error('Error deleting all indicators:', err);
    } finally {
      setIsDeletingAll(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actualizar la pestaña activa cuando cambia el parámetro de URL
  useEffect(() => {
    const tab = searchParams.get('tab') as 'regression' | 'performance' | 'security' | null;
    if (tab && ['regression', 'performance', 'security'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del proyecto...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Error</h2>
          <p className="text-red-600">{error || 'Proyecto no encontrado'}</p>
          <Button
            id="btn-back-on-error"
            variant="danger"
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Filtrar indicadores por el tab activo
  const filteredIndicators = indicators.filter(i => i.pipelineType === activeTab);

  // Preparar datos para los gráficos
  const successRateData = filteredIndicators.map(indicator => ({
    date: new Date(indicator.runDate).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    }),
    'Tasa de Éxito': indicator.executionSuccessRate,
    Cobertura: indicator.automationCoverage,
  }));

  const testResultsData = filteredIndicators.slice(-5).map(indicator => ({
    date: new Date(indicator.runDate).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    }),
    Pasados: indicator.passed,
    Fallidos: indicator.failed,
    Omitidos: indicator.skipped,
  }));

  // Datos agregados para el pie chart (último run del pipeline activo)
  const latestIndicator = filteredIndicators[filteredIndicators.length - 1];
  const pieData = latestIndicator
    ? [
        { name: 'Pasados', value: latestIndicator.passed },
        { name: 'Fallidos', value: latestIndicator.failed },
        { name: 'Omitidos', value: latestIndicator.skipped },
      ].filter(item => item.value !== undefined && item.value > 0)
    : [];

  // Estadísticas del proyecto
  const regressionIndicators = indicators.filter(i => i.pipelineType === 'regression');
  const avgSuccessRate =
    regressionIndicators.length > 0
      ? regressionIndicators.reduce((sum, i) => sum + (i.executionSuccessRate ?? 0), 0) /
        regressionIndicators.length
      : 0;

  // Cobertura actual: última cobertura registrada
  const currentCoverage =
    regressionIndicators.length > 0
      ? (regressionIndicators[regressionIndicators.length - 1].automationCoverage ?? 0)
      : 0;

  const totalTestsRun = regressionIndicators.reduce((sum, i) => sum + (i.totalTests ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Button
                id="btn-back-to-dashboard-detail"
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 mb-2"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                }
              >
                Volver al Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">{project.product}</h1>
              <p className="mt-1 text-sm text-gray-600">
                Prefijo: <span className="font-semibold">{project.prefix}</span> • Tests definidos:{' '}
                <span className="font-semibold">{project.totalDefinedTests}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
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
                <p className="text-2xl font-semibold text-gray-900">{avgSuccessRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
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
                <p className="text-sm font-medium text-gray-600">Cobertura Actual</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {currentCoverage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
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
                <p className="text-sm font-medium text-gray-600">Total Tests Ejecutados</p>
                <p className="text-2xl font-semibold text-gray-900">{totalTestsRun}</p>
              </div>
            </div>
          </div>
        </div>

        {indicators.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No hay indicadores disponibles para este proyecto</p>
          </div>
        ) : (
          <>
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Success Rate & Coverage Trend */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Métricas</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={successRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Tasa de Éxito"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="Cobertura" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Latest Test Results Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Distribución Último Run
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value, 'Tests']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Test Results Over Time */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resultados de Tests por Ejecución
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={testResultsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Pasados" fill="#10b981" />
                  <Bar dataKey="Fallidos" fill="#ef4444" />
                  <Bar dataKey="Omitidos" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Indicators Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Historial de Ejecuciones</h3>
                  {isAdmin && indicators.length > 0 && (
                    <button
                      id="btn-delete-all-indicators"
                      onClick={handleDeleteAll}
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-600 bg-white border-2 border-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Eliminar Todos
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6">
                <Tabs
                  tabs={[
                    {
                      id: 'regression',
                      label: 'Regression',
                      count: indicators.filter(i => i.pipelineType === 'regression').length,
                    },
                    {
                      id: 'performance',
                      label: 'Performance',
                      count: indicators.filter(i => i.pipelineType === 'performance').length,
                    },
                    {
                      id: 'security',
                      label: 'Security',
                      count: indicators.filter(i => i.pipelineType === 'security').length,
                    },
                  ]}
                  activeTab={activeTab}
                  onChange={tabId =>
                    setActiveTab(tabId as 'regression' | 'performance' | 'security')
                  }
                />
              </div>

              <div className="overflow-x-auto">
                {/* Tabla de Regression */}
                {activeTab === 'regression' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Tests
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pasados
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fallidos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Omitidos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tasa de Éxito
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cobertura
                        </th>
                        {isAdmin && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {indicators
                        .filter(i => i.pipelineType === 'regression')
                        .slice()
                        .reverse()
                        .map(indicator => (
                          <tr key={indicator.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(indicator.runDate).toLocaleString('es-ES')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.totalTests}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                              {indicator.passed}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                              {indicator.failed}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.skipped}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.executionSuccessRate?.toFixed(1)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.automationCoverage?.toFixed(1)}%
                            </td>
                            {isAdmin && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  id={`btn-delete-indicator-${indicator.id}`}
                                  onClick={() =>
                                    handleDeleteIndicator(indicator.id, indicator.runDate)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Eliminar
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}

                {/* Tabla de Performance */}
                {activeTab === 'performance' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Peticiones
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          OK
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          KO
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiempo Promedio (ms)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiempo Máx (ms)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiempo Mín (ms)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tasa de Error
                        </th>
                        {isAdmin && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {indicators
                        .filter(i => i.pipelineType === 'performance')
                        .slice()
                        .reverse()
                        .map(indicator => (
                          <tr key={indicator.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(indicator.runDate).toLocaleString('es-ES')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.totalRequest}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                              {indicator.okRequest}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                              {indicator.koRequest}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.timeMean?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.timeMax?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.timeMin?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.errorRate?.toFixed(1)}%
                            </td>
                            {isAdmin && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  id={`btn-delete-indicator-perf-${indicator.id}`}
                                  onClick={() =>
                                    handleDeleteIndicator(indicator.id, indicator.runDate)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Eliminar
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}

                {/* Tabla de Security */}
                {activeTab === 'security' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Media
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Baja
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Informativa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Security Score
                        </th>
                        {isAdmin && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {indicators
                        .filter(i => i.pipelineType === 'security')
                        .slice()
                        .reverse()
                        .map(indicator => (
                          <tr key={indicator.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(indicator.runDate).toLocaleString('es-ES')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                              {indicator.high}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-semibold">
                              {indicator.medium}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">
                              {indicator.low}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.informational}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.securityScore?.toFixed(1)}
                            </td>
                            {isAdmin && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  id={`btn-delete-indicator-sec-${indicator.id}`}
                                  onClick={() =>
                                    handleDeleteIndicator(indicator.id, indicator.runDate)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Eliminar
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}

                {/* Mensaje cuando no hay datos */}
                {indicators.filter(i => i.pipelineType === activeTab).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No hay registros de {activeTab} disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <ConfirmModal
        isOpen={deleteModal?.isOpen || false}
        onClose={() => setDeleteModal(null)}
        onConfirm={confirmDeleteIndicator}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de eliminar el test run del ${deleteModal ? new Date(deleteModal.runDate).toLocaleString('es-ES') : ''}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />

      <ConfirmModal
        isOpen={deleteAllModal}
        onClose={() => setDeleteAllModal(false)}
        onConfirm={confirmDeleteAll}
        title="Confirmar Eliminación Masiva"
        message={`¿Estás seguro de eliminar TODOS los ${indicators.length} test run${indicators.length > 1 ? 's' : ''} del proyecto "${project?.product}"?\n\nEsta acción no se puede deshacer.`}
        confirmText="Eliminar Todos"
        cancelText="Cancelar"
        isLoading={isDeletingAll}
      />
    </div>
  );
}
