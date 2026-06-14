'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone?: string;
  createdAt: string;
  members: { role: string; user: { id: string; name: string; email: string } }[];
  _count: { excursions: number; members: number };
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState({ name: '', phone: '' });
  const [form, setForm] = useState({
    name: '', cnpj: '', email: '', phone: '', ownerUserId: '',
  });

  async function load() {
    const { data } = await api.get('/companies');
    setCompanies(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    try {
      await api.post('/companies', { ...form, cnpj: form.cnpj.replace(/\D/g, '') });
      setIsCreating(false);
      setForm({ name: '', cnpj: '', email: '', phone: '', ownerUserId: '' });
      load();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erro ao criar empresa');
    }
  }

  async function handleUpdate(id: string) {
    await api.patch(`/companies/${id}`, editingData);
    setEditingId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja remover esta empresa? Isso removerá todos os dados relacionados.')) return;
    await api.delete(`/companies/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Empresas</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
        >
          + Nova Empresa
        </button>
      </div>

      {/* Modal de criação */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800">Nova Empresa</h2>

            {[
              { label: 'Nome da Empresa', key: 'name' },
              { label: 'CNPJ', key: 'cnpj' },
              { label: 'E-mail', key: 'email' },
              { label: 'Telefone', key: 'phone' },
              { label: 'ID do Usuário Responsável', key: 'ownerUserId' },
            ].map((field) => (
              <div key={field.key} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">{field.label}</label>
                <input
                  type="text"
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            ))}

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
              <th className="px-6 py-3 text-left">Empresa</th>
              <th className="px-6 py-3 text-left">CNPJ</th>
              <th className="px-6 py-3 text-left">Responsável</th>
              <th className="px-6 py-3 text-left">Excursões</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {companies.map((company) => {
              const owner = company.members.find((m) => m.role === 'owner')?.user;
              return (
                <tr key={company.id}>
                  <td className="px-6 py-4">
                    {editingId === company.id ? (
                      <input
                        value={editingData.name}
                        onChange={(e) => setEditingData((prev) => ({ ...prev, name: e.target.value }))}
                        className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">{company.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{company.cnpj}</td>
                  <td className="px-6 py-4">
                    {owner ? (
                      <div>
                        <p className="font-medium text-gray-700">{owner.name}</p>
                        <p className="text-xs text-gray-400">{owner.email}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Sem responsável</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {company._count.excursions} excursões
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    {editingId === company.id ? (
                      <>
                        <button onClick={() => handleUpdate(company.id)} className="text-green-600 hover:underline text-xs font-medium">Salvar</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:underline text-xs">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingId(company.id); setEditingData({ name: company.name, phone: company.phone || '' }); }}
                          className="text-indigo-600 hover:underline text-xs font-medium"
                        >
                          Editar
                        </button>
                        <button onClick={() => handleDelete(company.id)} className="text-red-500 hover:underline text-xs font-medium">
                          Remover
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}