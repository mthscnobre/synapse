"use client";

import { useState } from "react";
import { Expense, deleteExpense } from "@/lib/firebase/firestore";
import {
  Card,
  CardTitle, // Importamos apenas o que realmente usamos
  CardDescription, // Importamos apenas o que realmente usamos
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Timestamp } from "firebase/firestore";
import { MapPin, MoreHorizontal, Trash2, Edit } from "lucide-react";

interface ExpensesListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
}

export default function ExpensesList({ expenses, onEdit }: ExpensesListProps) {
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const handleDelete = async () => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        <p>Nenhum gasto registrado ainda.</p>
        <p>Clique no botão + para adicionar seu primeiro gasto!</p>
      </div>
    );
  }

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "Data indisponível";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <>
      <div className="space-y-4 mt-8">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <div className="flex items-start p-4">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold">
                  {expense.description || "Gasto"}
                </CardTitle>
                {expense.location && (
                  <CardDescription className="flex items-center gap-1.5 pt-1 text-xs">
                    <MapPin size={12} />
                    {expense.location}
                  </CardDescription>
                )}
              </div>

              <div className="text-right">
                <div className="text-lg font-bold">
                  {formatCurrency(expense.amount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(expense.createdAt)}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-2 p-1.5 rounded-full hover:bg-muted">
                    <MoreHorizontal size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onEdit(expense)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setExpenseToDelete(expense)}
                    // Cores atualizadas para melhor legibilidade no tema escuro
                    className="text-red-400 cursor-pointer focus:text-red-400 hover:bg-red-200 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!expenseToDelete}
        onOpenChange={(open) => !open && setExpenseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente
              o seu gasto de
              <span className="font-medium text-foreground">
                {" "}
                {expenseToDelete?.description || "Gasto"} (
                {formatCurrency(expenseToDelete?.amount || 0)})
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
