"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import ThemeSwitcher from "./ThemeSwitcher";
import Image from "next/image";
import Logo from "./Logo";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOutUser();
    toast.info("Você saiu da sua conta.", {
      description: "Até a próxima!",
    });
    router.push("/login");
  };

  return (
    <header className="w-full bg-cabecalho-fundo py-4 px-8">
      <div className="mx-auto max-w-7xl flex justify-between items-center">
        <Logo variant="inverse" />
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 dark:focus:ring-offset-zinc-950">
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
                  <div className="w-8 h-8 rounded-full bg-slate-700 dark:bg-zinc-700 flex items-center justify-center text-gray-200 font-bold">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>
                  <p className="text-sm">Logado como</p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.displayName || user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm font-semibold rounded-md text-gray-200 hover:bg-slate-700 dark:hover:bg-zinc-700"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
