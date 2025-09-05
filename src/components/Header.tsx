"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import ThemeSwitcher from "./ThemeSwitcher";
import NotificationToggle from "./NotificationToggle";
import Image from "next/image";
import Logo from "./Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // IMPORTAÇÃO ADICIONADA
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  LogOut,
  CreditCard,
  LayoutGrid,
  FileText,
  CalendarClock,
} from "lucide-react";

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
    <header className="w-full bg-cabecalho-fundo py-3 px-4 md:px-8 border-b sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          {user && (
            <>
              <NotificationToggle />
              <ThemeSwitcher />
            </>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
                {user.photoURL ? (
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={user.photoURL}
                      alt={"Avatar do usuário"}
                      fill
                      sizes="32px"
                    />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">
                    {user.displayName || "Usuário"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/cards">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Meus Cartões</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/categories">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>Minhas Categorias</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/incomes">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Minhas Entradas</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/bills">
                    <CalendarClock className="mr-2 h-4 w-4" />
                    <span>Contas a Pagar</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <ThemeSwitcher />
              <Button asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
