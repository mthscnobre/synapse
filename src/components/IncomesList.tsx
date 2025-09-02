"use client";

import { useState } from "react";
import { Income, deleteIncome } from "@/lib/firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, Trash2, Edit, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface IncomesListProps {
  incomes: Income[];
  onEdit: (income: Income) => void;
}

export default function IncomesList({ incomes, onEdit }: IncomesListProps) {
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);

  const handleDelete = async () => {
    if (incomeToDelete) {
      const success = await deleteIncome(incomeToDelete.id);
      if (success) {
        toast.success("Entrada excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a entrada.");
      }
      setIncomeToDelete(null);
    }
  };

  if (incomes.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-16 border-2 border-dashed border-border rounded-lg p-12">
        <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">
          Nenhuma entrada registrada neste mês
        </h3>
        <p className="mt-2 text-sm">
          Clique em &quot;Adicionar Entrada&quot; para registrar seus ganhos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {incomes.map((income) => (
          <Card key={income.id} className="p-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg flex-shrink-0 bg-muted flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground leading-tight">
                    {income.source}
                  </span>
                  {income.payer && (
                    <span className="text-sm text-muted-foreground leading-tight">
                      {income.payer}
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground pt-1">
                    {format(income.createdAt.toDate(), "dd 'de' MMMM, yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-green-500 text-lg">
                  {income.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(income)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIncomeToDelete(income)}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!incomeToDelete}
        onOpenChange={(open) => !open && setIncomeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente
              a entrada de{" "}
              <span className="font-medium text-foreground">
                {incomeToDelete?.source}
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
