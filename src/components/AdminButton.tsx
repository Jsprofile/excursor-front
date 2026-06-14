'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function AdminButton() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') return null;

  return (
    <Link
      href="/admin"
      className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg transition-colors z-50"
    >
      ⚙️ Painel Admin
    </Link>
  );
}