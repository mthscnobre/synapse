"use client";

import { useState, useEffect, useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import AddExpenseButton from "@/components/AddExpenseButton";
import { useAuth } from "@/contexts/AuthContext";
import { Expense, listenToExpenses } from "@/lib/firebase/firestore";
import ExpensesList from "@/components/ExpensesList";
import DashboardSummary from "@/components/DashboardSummary";
import AddExpenseModal from "@/components/AddExpenseModal";

export default function HomePage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Estado para controlar o modal de Adicionar/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = listenToExpenses(user.uid, (newExpenses) => {
        setExpenses(newExpenses);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Função para abrir o modal em modo de EDIÇÃO
  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  // Função para abrir o modal em modo de ADIÇÃO
  const handleAddExpense = () => {
    setExpenseToEdit(null); // Garante que não estamos em modo de edição
    setIsModalOpen(true);
  };

  // Função para fechar o modal e limpar o estado
  const closeModal = () => {
    setIsModalOpen(false);
    setExpenseToEdit(null);
  };

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = expense.createdAt.toDate();
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const total = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return {
      total: total,
      numberOfTransactions: currentMonthExpenses.length,
    };
  }, [expenses]);

  return (
    <AuthGuard>
      <section className="p-8 max-w-4xl mx-auto">
        <div className="text-left mb-8">
          <h2 className="font-heading text-4xl font-bold text-foreground">
            Dashboard
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sua vida financeira em um piscar de olhos.
          </p>
        </div>

        <DashboardSummary
          monthlyTotal={monthlySummary.total}
          numberOfTransactions={monthlySummary.numberOfTransactions}
        />

        <h3 className="font-heading text-2xl font-bold text-foreground mt-12 mb-4">
          Histórico de Gastos
        </h3>
        <ExpensesList expenses={expenses} onEdit={handleEditExpense} />

        <AddExpenseButton onOpen={handleAddExpense} />

        <AddExpenseModal
          isOpen={isModalOpen}
          onClose={closeModal}
          expenseToEdit={expenseToEdit}
        />
      </section>
    </AuthGuard>
  );
}
