"use client";

import { useState, useEffect, useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import AddExpenseModal from "@/components/AddExpenseModal"; // Correcção aqui
import ExpensesList from "@/components/ExpensesList";
import DashboardSummary from "@/components/DashboardSummary";
import AddExpenseButton from "@/components/AddExpenseButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Expense,
  listenToExpenses,
  listenToCategories,
  Category,
  listenToCards,
  Card,
} from "@/lib/firebase/firestore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, subMonths, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function HomePage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  useEffect(() => {
    if (user) {
      const unsubscribeExpenses = listenToExpenses(
        user.uid,
        currentMonth,
        setExpenses
      );
      const unsubscribeCategories = listenToCategories(user.uid, setCategories);
      const unsubscribeCards = listenToCards(user.uid, setCards);

      return () => {
        unsubscribeExpenses();
        unsubscribeCategories();
        unsubscribeCards();
      };
    }
  }, [user, currentMonth]);

  const handleOpenModal = () => {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setExpenseToEdit(null);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const formattedMonth = useMemo(
    () => format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR }),
    [currentMonth]
  );

  const monthlyTotal = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  return (
    <AuthGuard>
      <section className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="text-left mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Dashboard
          </h2>
          <p className="mt-1 md:mt-2 text-muted-foreground">
            A sua vida financeira num piscar de olhos.
          </p>
        </div>

        <DashboardSummary
          monthlyTotal={monthlyTotal}
          numberOfTransactions={expenses.length}
        />

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Histórico de Gastos
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold capitalize text-center w-32">
              {formattedMonth}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ExpensesList
          expenses={expenses}
          onEdit={handleEditExpense}
          categories={categories}
          cards={cards}
        />
      </section>

      <AddExpenseButton onOpen={handleOpenModal} />

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        expenseToEdit={expenseToEdit}
      />
    </AuthGuard>
  );
}
