"use client";

import { useState, useEffect, useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  Expense,
  listenToExpenses,
  Category,
  listenToCategories,
  Card,
  listenToCards,
} from "@/lib/firebase/firestore";
import { startOfMonth } from "date-fns";
import CategoryChart from "@/components/CategoryChart";
import CardChart from "@/components/CardChart";

export default function StatsPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentMonth] = useState(startOfMonth(new Date()));

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

  const categoryChartData = useMemo(() => {
    if (expenses.length === 0 || categories.length === 0) {
      return [];
    }
    const categoryColorMap = new Map(
      categories.map((cat) => [cat.name, cat.color || "#A1A1AA"])
    );
    const totalsByCategory = expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    }, {} as { [key: string]: number });
    return Object.entries(totalsByCategory)
      .map(([category, total]) => ({
        category,
        total,
        color: categoryColorMap.get(category) || "#A1A1AA",
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenses, categories]);

  const cardChartData = useMemo(() => {
    if (expenses.length === 0 || cards.length === 0) {
      return [];
    }

    // CORREÇÃO: Usando as referências das variáveis CSS, como na documentação.
    const cardColorPalette = [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ];

    const cardMap = new Map(cards.map((card) => [card.id, card.name]));
    const totalsByCard = expenses.reduce((acc, expense) => {
      if (expense.cardId) {
        if (!acc[expense.cardId]) acc[expense.cardId] = 0;
        acc[expense.cardId] += expense.amount;
      }
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(totalsByCard)
      .map(([cardId, total], index) => ({
        cardName: cardMap.get(cardId) || "Desconhecido",
        total,
        fill: cardColorPalette[index % cardColorPalette.length],
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenses, cards]);

  return (
    <AuthGuard>
      <section className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="text-left mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Análises e Insights
          </h2>
          <p className="mt-1 md:mt-2 text-muted-foreground">
            Entenda seus hábitos financeiros de forma visual.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <CategoryChart data={categoryChartData} />
          <CardChart data={cardChartData} />
        </div>
      </section>
    </AuthGuard>
  );
}
