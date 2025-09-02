"use client";

import { useState } from "react";
import {
  Expense,
  Category,
  Card,
  deleteExpense,
} from "@/lib/firebase/firestore";
import ExpenseCard from "@/components/ExpenseCard"; // Correcção aqui
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
import { toast } from "sonner";

interface ExpensesListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  categories: Category[];
  cards: Card[];
}

export default function ExpensesList({
  expenses,
  onEdit,
  categories,
  cards,
}: ExpensesListProps) {
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    const success = await deleteExpense(expenseToDelete.id);
    if (success) {
      toast.success("Gasto excluído com sucesso!");
    } else {
      toast.error("Erro ao excluir o gasto.");
    }
    setExpenseToDelete(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-16 border-2 border-dashed border-border rounded-lg p-12">
        <h3 className="mt-4 text-lg font-semibold">
          Nenhum gasto registado neste mês
        </h3>
        <p className="mt-2 text-sm">
          Use o botão + para adicionar a sua primeira despesa.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={() => setExpenseToDelete(expense)}
            categories={categories}
            cards={cards}
          />
        ))}
      </div>

      <AlertDialog
        open={!!expenseToDelete}
        onOpenChange={(open) => !open && setExpenseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acção não pode ser desfeita. Isto irá apagar permanentemente
              o gasto:{" "}
              <span className="font-medium text-foreground">
                {expenseToDelete?.description || "Gasto sem descrição"}
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
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
