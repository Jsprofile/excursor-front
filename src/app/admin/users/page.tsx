'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', cpf: '', phone: '', birthDate: '', gender: '',
  });

  async function load() {
    const { data } = await api.get('/users');
    setUsers(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    try {
      await api.post('/users', { ...form, cpf: form.cpf.replace(/\D/g, '') });
      setIsCreating(false);
      setForm({ name: '', email: '', password: '', cpf: '', phone: '', birthDate: '', gender: '' });
      load();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erro ao criar usuário');
    }
  }

  async function handleUpdateRole(id: string, role: string) {
    await api.patch(`/users/${id}/role`, { role });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja remover este usuário?')) return;
    await api.delete(`/users/${id}`);
    load();
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-600',
    supplier: 'bg-purple-100 text-purple-600',
    customer: 'bg-green-100 text-green-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
        >
          + Novo Usuário
        </button>
      </div>

      {/* Modal de criação */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800">Novo Usuário</h2>

            {[
              { label: 'Nome', key: 'name', type: 'text' },
              { label: 'E-mail', key: 'email', type: 'email' },
              { label: 'Senha', key: 'password', type: 'password' },
              { label: 'CPF', key: 'cpf', type: 'text' },
              { label: 'Telefone', key: 'phone', type: 'text' },
              { label: 'Data de Nascimento', key: 'birthDate', type: 'date' },
            ].map((field) => (
              <div key={field.key} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            ))}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Gênero</label>
              <select
                value={form.gender}
                onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div className="flex gap-3 mt-2">
              <button onClick={handleCreate} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
                Criar
              </button>
              <button onClick={() => setIsCreating(false)} className="flex-1 border border-gray-200 text-gray-500 text-sm py-2 rounded-xl hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">E-mail</th>
              <th className="px-6 py-3 text-left">CPF</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                <td className="px-6 py-4 text-gray-500">{user.cpf}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}
                  >
                    <option value="customer">customer</option>
                    <option value="supplier">supplier</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline text-xs font-medium">
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}