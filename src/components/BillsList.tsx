"use client";

import { useState } from "react";
import {
  Bill,
  deleteBill,
  createExpenseFromBill,
} from "@/lib/firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Trash2,
  Edit,
  FileText,
  Bot,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface BillsListProps {
  bills: Bill[];
  onEdit: (bill: Bill) => void;
}

export default function BillsList({ bills, onEdit }: BillsListProps) {
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePayBill = async (bill: Bill) => {
    setIsLoading(bill.id);
    const success = await createExpenseFromBill(bill, bill.userId);
    setIsLoading(null);
    if (success) {
      toast.success(`Despesa "${bill.description}" registrada com sucesso!`);
    } else {
      toast.error("Erro ao registrar a despesa.");
    }
  };

  const handleDelete = async () => {
    if (billToDelete) {
      const success = await deleteBill(billToDelete.id);
      if (success) {
        toast.success("Conta excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a conta.");
      }
      setBillToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  if (!bills || bills.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-16 border-2 border-dashed border-border rounded-lg p-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhuma conta cadastrada</h3>
        <p className="mt-2 text-sm">
          Clique em &quot;Adicionar Nova Conta&quot; para começar.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {bills.map((bill) => (
          <Card key={bill.id} className="p-4 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              {/* Ícone */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>

              {/* Conteúdo Principal */}
              <div className="flex-1 min-w-0">
                {/* Linha Superior */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-foreground">
                      {bill.description}
                    </p>
                    {bill.isAutomatic && (
                      <Badge variant="secondary" className="gap-1.5 pl-1.5">
                        <Bot className="h-3 w-3" />
                        Automático
                      </Badge>
                    )}
                  </div>
                  <p className="ml-4 flex-shrink-0 font-bold text-lg text-foreground">
                    {formatCurrency(bill.amount)}
                  </p>
                </div>

                {/* Linha Inferior */}
                <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                  <p>Vence todo dia {bill.dueDay}</p>
                  <Badge variant={bill.isActive ? "default" : "outline"}>
                    {bill.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>

              {/* Bloco de Ações à Direita */}
              <div className="ml-auto flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handlePayBill(bill)}
                  disabled={!!isLoading}
                  className="h-10 w-10 flex-shrink-0"
                  aria-label={`Pagar conta ${bill.description}`}
                >
                  {isLoading === bill.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    <DollarSign className="h-4 w-4" />
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 flex-shrink-0"
                    >
                      <span className="sr-only">Abrir menu de opções</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(bill)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setBillToDelete(bill)}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!billToDelete}
        onOpenChange={(open) => !open && setBillToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente
              a conta{" "}
              <span className="font-medium text-foreground">
                {billToDelete?.description}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
