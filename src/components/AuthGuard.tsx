// src/components/AuthGuard.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Este é um componente de ordem superior que envolve páginas protegidas
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não estiver carregando e não houver usuário, redireciona para o login
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Se estiver carregando a autenticação, mostra uma tela de carregamento simples
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  // Se houver um usuário, permite a renderização da página filha
  if (user) {
    return <>{children}</>;
  }

  // Se nenhuma das condições acima for atendida (caso de borda), não renderiza nada
  return null;
}
