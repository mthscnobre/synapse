"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import AddEditCardModal from "@/components/AddEditCardModal";
import CardsList from "@/components/CardsList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card, listenToCards } from "@/lib/firebase/firestore";
import { PlusCircle } from "lucide-react";

export default function CardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = listenToCards(user.uid, (newCards) => {
        setCards(newCards);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddNewCard = () => {
    setCardToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setCardToEdit(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCardToEdit(null);
  };

  return (
    <AuthGuard>
      <section className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h2 className="font-heading text-4xl font-bold text-foreground">
              Meus Cartões
            </h2>
            <p className="mt-2 text-muted-foreground">
              Gerencie seus cartões de crédito em um só lugar.
            </p>
          </div>
          <Button onClick={handleAddNewCard}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Novo Cartão
          </Button>
        </div>

        <CardsList cards={cards} onEdit={handleEditCard} />
      </section>

      <AddEditCardModal
        isOpen={isModalOpen}
        onClose={closeModal}
        cardToEdit={cardToEdit}
      />
    </AuthGuard>
  );
}
