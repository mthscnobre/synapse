"use client";

import { useState } from "react";
import {
  Expense,
  Category,
  Card,
  deleteExpense,
  deleteInstallmentExpense, // 1. Importe a nova função
} from "@/lib/firebase/firestore";
import ExpenseCard from "./ExpenseCard";
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
  onView: (expense: Expense) => void;
  categories: Category[];
  cards: Card[];
}

export default function ExpensesList({
  expenses,
  onEdit,
  onView,
  categories,
  cards,
}: ExpensesListProps) {
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // 2. A função de deletar agora é inteligente
  const handleDelete = async () => {
    if (!expenseToDelete) return;

    let success = false;
    // Se for uma parcela e tiver o ID do grupo, chama a exclusão em lote
    if (expenseToDelete.isInstallment && expenseToDelete.installmentId) {
      success = await deleteInstallmentExpense(
        expenseToDelete.installmentId,
        expenseToDelete.userId
      );
    } else {
      // Caso contrário, chama a exclusão simples
      success = await deleteExpense(expenseToDelete.id);
    }

    if (success) {
      toast.success(
        expenseToDelete.isInstallment
          ? "Todas as parcelas foram excluídas!"
          : "Gasto excluído com sucesso!"
      );
    } else {
      toast.error("Erro ao excluir o gasto.");
    }
    setExpenseToDelete(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-16 border-2 border-dashed border-border rounded-lg p-12">
        <h3 className="mt-4 text-lg font-semibold">
          Nenhum gasto registrado neste mês
        </h3>
        <p className="mt-2 text-sm">
          Use o botão + para adicionar sua primeira despesa.
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
            onView={onView}
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
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            {/* 3. O alerta agora avisa sobre a exclusão em lote */}
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente
              o gasto:{" "}
              <span className="font-medium text-foreground">
                {expenseToDelete?.description || "Gasto sem descrição"}
              </span>
              .
              {expenseToDelete?.isInstallment && (
                <strong className="mt-2 block text-destructive">
                  Atenção: Todas as outras parcelas desta compra também serão
                  excluídas.
                </strong>
              )}
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
