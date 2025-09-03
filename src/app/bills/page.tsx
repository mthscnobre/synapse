"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import AddEditBillModal from "@/components/AddEditBillModal";
import BillsList from "@/components/BillsList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bill,
  listenToBills,
  Category,
  listenToCategories,
} from "@/lib/firebase/firestore";
import { PlusCircle } from "lucide-react";

export default function BillsPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billToEdit, setBillToEdit] = useState<Bill | null>(null);

  useEffect(() => {
    if (user) {
      const unsubscribeBills = listenToBills(user.uid, setBills);
      const unsubscribeCategories = listenToCategories(user.uid, setCategories);
      return () => {
        unsubscribeBills();
        unsubscribeCategories();
      };
    }
  }, [user]);

  const handleAddNewBill = () => {
    setBillToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditBill = (bill: Bill) => {
    setBillToEdit(bill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBillToEdit(null);
  };

  return (
    <AuthGuard>
      <section className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h2 className="font-heading text-4xl font-bold text-foreground">
              Contas a Pagar
            </h2>
            <p className="mt-2 text-muted-foreground">
              Gerencie suas despesas recorrentes e nunca perca um vencimento.
            </p>
          </div>
          <Button onClick={handleAddNewBill}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Conta
          </Button>
        </div>

        <BillsList
          bills={bills}
          onEdit={handleEditBill}
          categories={categories}
        />
      </section>

      <AddEditBillModal
        isOpen={isModalOpen}
        onClose={closeModal}
        billToEdit={billToEdit}
        categories={categories}
      />
    </AuthGuard>
  );
}
