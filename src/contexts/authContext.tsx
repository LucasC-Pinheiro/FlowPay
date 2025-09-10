import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
    user : User | null;
    SignIn: (email: string, password: string) => Promise<void>;
    SignUp: (name: string, email: string, password: string) => Promise<void>;
    SignOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

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
        // Simulação de chamada de API
        if(email === "teste@gmail.com" && password === "123" ) {
            const loggedUser = { id: "1", name: "Lucas", email };

            // Salvar dados do usuário no AsyncStorage (chave unificada)
            await AsyncStorage.setItem("@FlowPay:user", JSON.stringify(loggedUser));
            // Salvar senha/token de forma segura
            await SecureStore.setItemAsync("token", "meu-token-seguro");

            setUser(loggedUser);
        } else {
            alert("Credenciais inválidas");
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
        <AuthContext.Provider value={{ user, SignIn, SignUp, SignOut, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);