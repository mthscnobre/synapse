"use client";

import { useState, useEffect, useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import AddEditIncomeModal from "@/components/AddEditIncomeModal";
import IncomesList from "@/components/IncomesList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Income, listenToIncomes } from "@/lib/firebase/firestore";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, subMonths, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function IncomesPage() {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeToEdit, setIncomeToEdit] = useState<Income | null>(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  useEffect(() => {
    if (user) {
      const unsubscribe = listenToIncomes(user.uid, currentMonth, setIncomes);
      return () => unsubscribe();
    }
  }, [user, currentMonth]);

  const handleAddNewIncome = () => {
    setIncomeToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditIncome = (income: Income) => {
    setIncomeToEdit(income);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIncomeToEdit(null);
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
    () => incomes.reduce((sum, income) => sum + income.amount, 0),
    [incomes]
  );

  return (
    <AuthGuard>
      <section className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Minhas Entradas
            </h2>
            <p className="mt-1 md:mt-2 text-muted-foreground">
              Gerencie suas fontes de receita e ganhos.
            </p>
          </div>
          <Button onClick={handleAddNewIncome}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Entrada
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 mb-6 bg-card border rounded-lg">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold capitalize text-foreground text-center">
            {formattedMonth}
          </h3>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-8 p-6 bg-card rounded-lg border">
          <p className="text-muted-foreground">Total de entradas no mês</p>
          <p className="text-4xl font-bold text-green-500">
            {monthlyTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        <IncomesList incomes={incomes} onEdit={handleEditIncome} />
      </section>

      <AddEditIncomeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        incomeToEdit={incomeToEdit}
      />
    </AuthGuard>
  );
}
