"use client";

import { useState, useEffect, useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import AddExpenseModal from "@/components/AddExpenseModal";
import ExpensesList from "@/components/ExpensesList";
import AddExpenseButton from "@/components/AddExpenseButton";
import ExpenseDetailModal from "@/components/ExpenseDetailModal";
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

export default function HistoryPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  // Estado para os modais
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [expenseToView, setExpenseToView] = useState<Expense | null>(null);

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

  // Funções de controle dos modais
  const handleOpenAddModal = () => {
    setExpenseToEdit(null);
    setIsAddEditModalOpen(true);
  };
  const handleOpenEditModal = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsAddEditModalOpen(true);
  };
  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setExpenseToEdit(null);
  };
  const handleOpenViewModal = (expense: Expense) => {
    setExpenseToView(expense);
    setIsViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setExpenseToView(null);
  };

  const formattedMonth = useMemo(
    () => format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR }),
    [currentMonth]
  );

  return (
    <AuthGuard>
      <section className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="text-left">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Histórico de Gastos
            </h2>
            <p className="mt-1 md:mt-2 text-muted-foreground">
              Explore e gerencie todas as suas transações.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold capitalize text-center w-32">
              {formattedMonth}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ExpensesList
          expenses={expenses}
          onEdit={handleOpenEditModal}
          onView={handleOpenViewModal}
          categories={categories}
          cards={cards}
        />
      </section>

      <AddExpenseButton onOpen={handleOpenAddModal} />

      <AddExpenseModal
        isOpen={isAddEditModalOpen}
        onClose={handleCloseAddEditModal}
        expenseToEdit={expenseToEdit}
      />

      <ExpenseDetailModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        expense={expenseToView}
        categories={categories}
        cards={cards}
      />
    </AuthGuard>
  );
}
