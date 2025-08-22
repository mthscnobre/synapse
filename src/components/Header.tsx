// src/components/Header.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import ThemeSwitcher from "./ThemeSwitcher";
import { Menu } from "@headlessui/react";
import Image from "next/image";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOutUser();
    router.push("/login");
  };

  return (
    <header
      className="w-full bg-gray-100 py-4 px-8 border-b border-gray-200 
                 dark:bg-gray-900 dark:border-gray-700"
    >
      <div className="mx-auto max-w-7xl flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-slate-800 dark:text-gray-200"
        >
          SYN<span className="text-orange-500 dark:text-orange-200">A</span>PSE
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {user ? (
            <Menu as="div" className="relative">
              {/* ATUALIZAÇÃO DE DESIGN: Apenas o avatar é o botão, sem o nome */}
              <Menu.Button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                {user.photoURL ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={user.photoURL}
                      alt={"Avatar do usuário"}
                      fill
                      sizes="32px"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-slate-800 dark:text-gray-200 font-bold">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                <div className="px-4 py-3">
                  <p className="text-sm text-slate-800 dark:text-gray-200">
                    Logado como
                  </p>
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      // CORREÇÃO DO BUG: A className inteira agora está dentro de chaves {}
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-700" : ""
                      } block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200`}
                    >
                      Sair
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm font-semibold rounded-md text-slate-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
