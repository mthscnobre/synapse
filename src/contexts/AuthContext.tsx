"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/config"; // 1. Importe a nova FUNÇÃO

// Define o tipo de dados que o contexto irá fornecer
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Cria o contexto com um valor padrão
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Cria o Provedor do Contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth(); // 2. Chame a função para obter a instância de Auth

    // O onAuthStateChanged é um "ouvinte" do Firebase que nos diz
    // em tempo real se o usuário está logado ou não.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Limpa o "ouvinte" quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  // Enquanto o estado de autenticação está sendo verificado, não renderiza a aplicação
  if (loading) {
    return null; // Ou um componente de Spinner/Loading global
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Cria um "hook" customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
