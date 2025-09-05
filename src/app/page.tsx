"use client";

import { useState, useEffect, useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import AddExpenseModal from "@/components/AddExpenseModal";
import ExpensesList from "@/components/ExpensesList";
import AddExpenseButton from "@/components/AddExpenseButton";
import DashboardSummary from "@/components/DashboardSummary";
import ExpenseDetailModal from "@/components/ExpenseDetailModal";
import DashboardCalendar from "@/components/DashboardCalendar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationPermission } from "@/lib/hooks/useNotificationPermission";
import {
  Expense,
  listenToExpenses,
  listenToCategories,
  Category,
  listenToCards,
  Card,
  Bill,
  listenToBills,
  generateAutomaticExpensesForCurrentMonth,
} from "@/lib/firebase/firestore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, subMonths, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface CalendarEvent {
  date: Date;
  title: string;
  type: "bill" | "card";
}

export default function HomePage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [expenseToView, setExpenseToView] = useState<Expense | null>(null);

  useEffect(() => {
    if (user) {
      generateAutomaticExpensesForCurrentMonth(user.uid);

      const unsubscribeExpenses = listenToExpenses(
        user.uid,
        currentMonth,
        setExpenses
      );
      const unsubscribeCategories = listenToCategories(user.uid, setCategories);
      const unsubscribeCards = listenToCards(user.uid, setCards);
      const unsubscribeBills = listenToBills(user.uid, setBills);

      return () => {
        unsubscribeExpenses();
        unsubscribeCategories();
        unsubscribeCards();
        unsubscribeBills();
      };
    }
  }, [user, currentMonth]);

  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    cards.forEach((card) => {
      events.push({
        date: new Date(year, month, card.dueDay),
        title: `Fatura ${card.name}`,
        type: "card",
      });
    });

    bills.forEach((bill) => {
      if (bill.isActive && bill.paymentMethod !== "Crédito") {
        events.push({
          date: new Date(year, month, bill.dueDay),
          title: bill.description,
          type: "bill",
        });
      }
    });

    return events;
  }, [cards, bills, currentMonth]);

  // Instancia o hook e passa os eventos para ele ativar a lógica de notificação.
  useNotificationPermission(calendarEvents);

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
            Sua vida financeira em um piscar de olhos.
          </p>
        </div>

        <DashboardSummary
          monthlyTotal={monthlyTotal}
          numberOfTransactions={expenses.length}
        />

        <DashboardCalendar events={calendarEvents} />

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Histórico de Gastos
          </h3>
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
