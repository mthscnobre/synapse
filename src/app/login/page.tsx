// src/app/login/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase/auth";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      // Se o login for bem-sucedido, redireciona para a página inicial
      router.push("/");
    }
    // Se falhar, podemos adicionar uma mensagem de erro no futuro.
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm rounded-lg p-8 text-center shadow-md bg-gray-100 dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-gray-200">
          Bem-vindo ao SYNAPSE
        </h1>
        <p className="mt-2 mb-6 text-gray-500 dark:text-gray-400">
          Faça login para conectar suas finanças.
        </p>
        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:ring-0 dark:hover:bg-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Entrar com Google
        </button>
      </div>
    </div>
  );
}
