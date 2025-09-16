/**
 * AuthContext - Contexto de A    updateUserPhoto: (uri: string | null) => Promise<void>; // Atualizar foto de perfil
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);enticação do FlowPay
 * 
 * Gerencia todo o estado de autenticação da aplicação:
 * - Login/Logout de usuários
 * - Persistência de dados no AsyncStorage e SecureStore
 * - Gerenciamento da foto de perfil do usuário
 * - Estado de loading durante operações assíncronas
 * 
 * Tecnologias utilizadas:
 * - AsyncStorage: dados do usuário (email, nome, foto)
 * - SecureStore: token de autenticação (criptografado)
 * - React Context: compartilhamento de estado global
 */

import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Tipagem do usuário
type User = {
  id: string;
  name: string;
  email: string;
  photo?: string | null; // URL da foto de perfil
};

// Interface do contexto de autenticação
type AuthContextType = {
    user : User | null;
    SignIn: (email: string, password: string) => Promise<void>;
    SignUp: (name: string, email: string, password: string) => Promise<void>;
    SignOut: () => Promise<void>;
    loading: boolean;
    updateUserPhoto: (uri: string | null) => Promise<void>; // Atualizar foto de perfil
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('@FlowPay:user');
                const token = await SecureStore.getItemAsync('token');

                if (userData && token) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error("Falha ao carregar dados do usuário", error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const SignIn = async (email: string, password: string) => {
        // Simulação de chamada de API (em produção seria uma requisição HTTP)
        // Credenciais de teste para desenvolvimento
        if(email === "teste@gmail.com" && password === "123" ) {
            const loggedUser = { id: "1", name: "Lucas", email };

            // Salvar dados do usuário no AsyncStorage (dados não sensíveis)
            await AsyncStorage.setItem("@FlowPay:user", JSON.stringify(loggedUser));
            
            // Salvar token de autenticação no SecureStore (criptografado)
            await SecureStore.setItemAsync("token", "meu-token-seguro");

            setUser(loggedUser);
        } else {
            alert("Credenciais inválidas");
        }
    };

    const updateUserPhoto = async (uri: string | null) => {
        try {
            // Atualiza o objeto user com a nova foto
            const newUser = user ? { ...user, photo: uri } : null;
            
            if (newUser) {
                // Persiste os dados atualizados no AsyncStorage
                await AsyncStorage.setItem('@FlowPay:user', JSON.stringify(newUser));
            }
            
            // Atualiza o estado local para refletir a mudança imediatamente
            setUser(newUser);
        } catch (error) {
            console.error('Erro ao atualizar foto do usuário', error);
        }
    };

    const SignUp = async (name: string, email: string, password: string) => {
        // Simulação de registro local (projeto pessoal sem backend)
        try {
            // criar usuário simples com id e token
            const id = Date.now().toString();
            const newUser = { id, name, email };
            const token = `${id}-${Math.random().toString(36).slice(2, 9)}`;

            // salvar user e token
            await AsyncStorage.setItem("@FlowPay:user", JSON.stringify(newUser));
            await SecureStore.setItemAsync("token", token);

            setUser(newUser);
        } catch (error) {
            console.error('Erro ao criar usuário', error);
            throw error;
        }
    };

    const SignOut = async () => {
    await AsyncStorage.removeItem("@FlowPay:user");
        await SecureStore.deleteItemAsync("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, SignIn, SignUp, SignOut, loading, updateUserPhoto }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);