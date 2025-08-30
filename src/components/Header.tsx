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

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOutUser();
    router.push("/login");
  };

  return (
    <header className="w-full bg-cabecalho-fundo py-4 px-8 border-b">
      <div className="mx-auto max-w-7xl flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
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
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>
                  <p className="text-sm text-muted-foreground">Logado como</p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.email}
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
              className="px-3 py-1.5 text-sm font-semibold rounded-md text-foreground hover:bg-muted"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
