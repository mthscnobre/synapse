"use client";

import { useState, useEffect, useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import DashboardSummary from "@/components/DashboardSummary";
import DashboardCalendar from "@/components/DashboardCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationPermission } from "@/lib/hooks/useNotificationPermission";
import {
  Expense,
  listenToExpenses,
  Card,
  listenToCards,
  Bill,
  listenToBills,
  generateAutomaticExpensesForCurrentMonth,
} from "@/lib/firebase/firestore";
import { startOfMonth } from "date-fns";

export interface CalendarEvent {
  date: Date;
  title: string;
  type: "bill" | "card";
}

export default function HomePage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [currentMonth] = useState(startOfMonth(new Date()));

  useEffect(() => {
    if (user) {
      generateAutomaticExpensesForCurrentMonth(user.uid);

      const unsubscribeExpenses = listenToExpenses(
        user.uid,
        currentMonth,
        setExpenses
      );
      const unsubscribeCards = listenToCards(user.uid, setCards);
      const unsubscribeBills = listenToBills(user.uid, setBills);

      return () => {
        unsubscribeExpenses();
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

  useNotificationPermission(calendarEvents);

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
      </section>
    </AuthGuard>
  );
}
