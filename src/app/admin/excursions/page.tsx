'use client';

import { Fragment, useEffect, useState } from 'react';
import { api } from '@/lib/api';


interface Excursion {
  id: string;
  title: string;
  location: string;
  departureAt: string;
  totalSlots: number;
  status: 'draft' | 'published' | 'cancelled' | 'archived';
  company: { id: string; name: string };
  category: { id: string; name: string };
  ticketTypes: { id: string; name: string; price: number }[];
}

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  published: 'Publicada',
  cancelled: 'Cancelada',
  archived: 'Arquivada',
};

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  archived: 'bg-gray-100 text-gray-500',
};

export default function AdminExcursionsPage() {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    const { data } = await api.get('/excursions/admin/all');
    setExcursions(data);
  }

  useEffect(() => { load(); }, []);

  async function handleStatusChange(id: string, status: string) {
    await api.patch(`/excursions/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Excursões</h1>
        <span className="text-sm text-gray-400">{excursions.length} excursões cadastradas</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Título</th>
              <th className="px-6 py-3 text-left">Empresa</th>
              <th className="px-6 py-3 text-left">Categoria</th>
              <th className="px-6 py-3 text-left">Partida</th>
              <th className="px-6 py-3 text-left">Vagas</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {excursions.map((excursion) => (
              <Fragment key={excursion.id}>
                <tr key={excursion.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setExpandedId(expandedId === excursion.id ? null : excursion.id)}
                      className="font-medium text-gray-800 hover:text-indigo-600 text-left"
                    >
                      {excursion.title}
                    </button>
                    <p className="text-xs text-gray-400 mt-0.5">{excursion.location}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{excursion.company.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">
                      {excursion.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(excursion.departureAt).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{excursion.totalSlots}</td>
                  <td className="px-6 py-4">
                    <select
                      value={excursion.status}
                      onChange={(e) => handleStatusChange(excursion.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${statusColors[excursion.status]}`}
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicada</option>
                      <option value="cancelled">Cancelada</option>
                      <option value="archived">Arquivada</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setExpandedId(expandedId === excursion.id ? null : excursion.id)}
                      className="text-indigo-600 hover:underline text-xs font-medium"
                    >
                      {expandedId === excursion.id ? 'Fechar' : 'Detalhes'}
                    </button>
                  </td>
                </tr>

                {/* Linha expandida com ticket types */}
                {expandedId === excursion.id && (
                  <tr key={`${excursion.id}-expanded`} className="bg-indigo-50">
                    <td colSpan={7} className="px-6 py-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tipos de Ingresso</p>
                      {excursion.ticketTypes.length === 0 ? (
                        <p className="text-xs text-gray-400">Nenhum tipo de ingresso cadastrado.</p>
                      ) : (
                        <div className="flex gap-3 flex-wrap">
                          {excursion.ticketTypes.map((ticket) => (
                            <div key={ticket.id} className="bg-white rounded-xl px-4 py-2 shadow-sm text-sm">
                              <span className="font-medium text-gray-700">{ticket.name}</span>
                              <span className="text-indigo-600 font-bold ml-2">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticket.price / 100)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}