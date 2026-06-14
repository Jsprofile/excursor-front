'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'supplier' | 'admin';
}

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other';
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        const savedUser = Cookies.get('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        setIsLoading(false);
    }, []);

    async function login(email: string, password: string) {
        const { data } = await api.post('/auth/login', { email, password });
        const { access_token, user } = data;

        Cookies.set('token', access_token, { expires: 7 });
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setUser(user);
    }

   async function register(registerData: RegisterData) {
  try {
    const response = await api.post('/users', {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      phone: registerData.phone,
      cpf: registerData.cpf,
      birthDate: registerData.birthDate,
      gender: registerData.gender,
    });
    console.log('Usuário criado:', response.data);
    await login(registerData.email, registerData.password);
  } catch (err: any) {
    console.error('Erro no register (AuthContext):', err?.response?.data || err?.message || err);
    throw err; // repassa o erro para a página
  }
}

    function logout() {
        Cookies.remove('token');
        Cookies.remove('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}