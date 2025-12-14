import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { User, UserRole } from '../types';
import CreateUserModal from '../components/CreateUserModal';
import { Button, Modal } from '../components/ui';

export default function UserManagement() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; username: string } | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    await usersApi.create(userData);
    setSuccessMessage('Usuario creado exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
    await fetchUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      alert('No puedes eliminar tu propia cuenta');
      return;
    }

    try {
      setDeletingUserId(userId);
      await usersApi.delete(userId);
      setSuccessMessage('Usuario eliminado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchUsers();
      setDeleteConfirm(null);
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Error al eliminar usuario';
      alert(errorMessage);
    } finally {
      setDeletingUserId(null);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const getRoleLabel = (role: UserRole) => {
    return role === 'admin' ? 'Admin' : 'Viewer';
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
          </div>
          <Button id="btn-back-to-dashboard" variant="secondary" onClick={() => navigate('/')}>
            Volver al Dashboard
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Create User Button */}
        <div className="mb-6">
          <Button id="btn-create-user" variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            + Crear Usuario
          </Button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando usuarios...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No hay usuarios registrados</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{u.username}</div>
                            {u.id === user?.id && (
                              <span className="text-xs text-gray-500">(Tú)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(u.role)}`}
                        >
                          {getRoleLabel(u.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {u.id === user?.id ? (
                          <span className="text-gray-400">No disponible</span>
                        ) : (
                          <Button
                            id={`btn-delete-user-${u.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm({ id: u.id, username: u.username })}
                            disabled={deletingUserId === u.id}
                            className="text-red-600 hover:text-red-900 hover:bg-red-50"
                          >
                            {deletingUserId === u.id ? 'Eliminando...' : 'Eliminar'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Count */}
        <div className="mt-4 text-sm text-gray-600">Total de usuarios: {users.length}</div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Confirmar Eliminación"
          variant="danger"
          maxWidth="md"
          footer={
            <>
              <Button
                id="btn-cancel-delete-user"
                variant="secondary"
                onClick={() => setDeleteConfirm(null)}
                disabled={deletingUserId === deleteConfirm.id}
              >
                Cancelar
              </Button>
              <Button
                id="btn-confirm-delete-user"
                variant="danger"
                onClick={() => handleDeleteUser(deleteConfirm.id)}
                disabled={deletingUserId === deleteConfirm.id}
                isLoading={deletingUserId === deleteConfirm.id}
              >
                Eliminar
              </Button>
            </>
          }
        >
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar al usuario{' '}
            <strong>{deleteConfirm.username}</strong>? Esta acción no se puede deshacer.
          </p>
        </Modal>
      )}
    </div>
  );
}
