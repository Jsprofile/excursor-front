'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit() {
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            router.push('/'); // redireciona para home após login
        } catch {
            setError('E-mail ou senha inválidos.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Logo className="inline-flex" width={75} height={75} />
                    <p className="text-gray-500 mt-2">Entre na sua conta</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <form onSubmit={
                        async (e) => {
                            e.preventDefault();
                            await handleSubmit();
                        }
                    } className="flex flex-col gap-5 text-gray-800">

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>

                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Não tem conta?{' '}
                        <Link href="/register" className="text-indigo-600 font-medium hover:underline">
                            Cadastre-se
                        </Link>
                    </p>
                </div>

            </div>
        </main>
    );
}