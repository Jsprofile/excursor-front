'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        cpf: '',
        birthDate: '',
        gender: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    // Máscara simples de CPF: 000.000.000-00
    function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .slice(0, 14);
        setForm((prev) => ({ ...prev, cpf: value }));
    }

    // Máscara simples de telefone: (00) 00000-0000
    function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
            .slice(0, 15);
        setForm((prev) => ({ ...prev, phone: value }));
    }

    async function handleSubmit() {
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (form.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setIsLoading(true);

        console.log('Dados do formulário:', form);

        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
                cpf: form.cpf.replace(/\D/g, ''),
                birthDate: form.birthDate,
                gender: form.gender as 'male' | 'female' | 'other',
            });
            router.push('/');
        } catch (err: any) {
            console.log(err)
            const message = err?.response?.data?.message;
            if (Array.isArray(message)) {
                setError(message[0]);
            } else {
                console.log('Erro desconhecido:', err);
                setError(message || 'Erro ao criar conta. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Logo className="inline-flex" width={100} height={100} />
                    <p className="text-gray-500 mt-2">Crie sua conta gratuitamente</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        await handleSubmit();
                    }
                    } className="flex flex-col gap-5 ">

                        {/* Nome */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Nome completo</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="João da Silva"
                                required
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                required
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        {/* CPF e Telefone lado a lado */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">CPF</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={form.cpf}
                                    onChange={handleCpfChange}
                                    placeholder="000.000.000-00"
                                    required
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Telefone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handlePhoneChange}
                                    placeholder="(11) 99999-9999"
                                    required
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        </div>

                        {/* Data de nascimento e Gênero lado a lado */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Data de nascimento</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={form.birthDate}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Gênero</label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                                >
                                    <option value="">Selecione</option>
                                    <option value="male">Masculino</option>
                                    <option value="female">Feminino</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>
                        </div>

                        {/* Senha */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Senha</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                required
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        {/* Confirmar senha */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repita a senha"
                                required
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        {/* Erro */}
                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">
                                {error}
                            </p>
                        )}

                        {/* Botão */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            {isLoading ? 'Criando conta...' : 'Criar conta'}
                        </button>

                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Já tem conta?{' '}
                        <Link href="/login" className="text-indigo-600 font-medium hover:underline">
                            Entrar
                        </Link>
                    </p>
                </div>

            </div>
        </main>
    );
}