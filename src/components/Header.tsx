'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Logo } from './Logo';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <Logo className="inline-flex" width={75} height={75} />

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Olá, <span className="font-semibold">{user.name.split(' ')[0]}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-indigo-600 font-medium hover:underline"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}