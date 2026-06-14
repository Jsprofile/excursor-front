'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Category {
  id: string;
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  async function load() {
    const { data } = await api.get('/categories');
    setCategories(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    await api.post('/categories', { name: newName });
    setNewName('');
    load();
  }

  async function handleUpdate(id: string) {
    await api.patch(`/categories/${id}`, { name: editingName });
    setEditingId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja remover esta categoria?')) return;
    await api.delete(`/categories/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Categorias</h1>

      {/* Criar nova */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nome da nova categoria"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
        >
          + Adicionar
        </button>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  ) : (
                    <span className="text-gray-700 font-medium">{cat.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  {editingId === cat.id ? (
                    <>
                      <button onClick={() => handleUpdate(cat.id)} className="text-green-600 hover:underline text-xs font-medium">Salvar</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-400 hover:underline text-xs">Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }} className="text-indigo-600 hover:underline text-xs font-medium">Editar</button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline text-xs font-medium">Remover</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}