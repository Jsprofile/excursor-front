'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

const menuItems = [
  { href: '/admin', label: '📊 Dashboard', exact: true },
  { href: '/admin/users', label: '👥 Usuários' },
  { href: '/admin/companies', label: '🏢 Empresas' },
  { href: '/admin/categories', label: '🏷️ Categorias' },
  { href: '/admin/excursions', label: '🧭 Excursões' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Verificando acesso...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="px-6 py-5 border-b">
          <Logo width={32} height={32} className="inline-flex" />
          <p className="text-xs text-gray-400 mt-1">Painel Administrativo</p>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 py-4 border-t">
          <p className="text-xs text-gray-400">Logado como</p>
          <p className="text-sm font-semibold text-gray-700">{user.name}</p>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}