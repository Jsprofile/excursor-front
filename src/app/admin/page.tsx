'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    companies: 0,
    excursions: 0,
    categories: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const [users, companies, excursions, categories] = await Promise.all([
        api.get('/users'),
        api.get('/companies'),
        api.get('/excursions'),
        api.get('/categories'),
      ]);
      setStats({
        users: users.data.length,
        companies: companies.data.length,
        excursions: excursions.data.length,
        categories: categories.data.length,
      });
    }
    loadStats();
  }, []);

  const cards = [
    { label: 'Usuários', value: stats.users, icon: '👥', color: 'bg-blue-50 text-blue-600' },
    { label: 'Empresas', value: stats.companies, icon: '🏢', color: 'bg-purple-50 text-purple-600' },
    { label: 'Excursões', value: stats.excursions, icon: '🧭', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Categorias', value: stats.categories, icon: '🏷️', color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-xl ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}