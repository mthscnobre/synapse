"use client";

import { useState } from "react";
import Image from "next/image";
import { Card as CardData, deleteCard } from "@/lib/firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Trash2, Edit, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface CardsListProps {
  cards: CardData[];
  onEdit: (card: CardData) => void;
}

export default function CardsList({ cards, onEdit }: CardsListProps) {
  const [cardToDelete, setCardToDelete] = useState<CardData | null>(null);

  const handleDelete = async () => {
    if (cardToDelete) {
      // Passamos o ID e o caminho do storage para a função de deletar
      const success = await deleteCard(
        cardToDelete.id,
        cardToDelete.storagePath
      );
      if (success) {
        toast.success("Cartão excluído com sucesso!");
      } else {
        toast.error("Erro ao excluir o cartão.");
      }
      setCardToDelete(null);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-16 border-2 border-dashed border-border rounded-lg p-12">
        <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum cartão cadastrado</h3>
        <p className="mt-2 text-sm">
          Clique em &quot;Adicionar Novo Cartão&quot; para começar.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                {/* Exibe o logo se existir */}
                {card.logoUrl ? (
                  <div className="relative w-16 h-10 mr-4">
                    <Image
                      src={card.logoUrl}
                      alt={`Logo ${card.name}`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-16 h-10 mr-4 rounded-md bg-muted">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {card.name}
                  </CardTitle>
                  <div className="text-sm font-mono text-muted-foreground mt-1">
                    •••• {card.lastFourDigits}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 -mt-2">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(card)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCardToDelete(card)}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-grow mt-auto pt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Fecha dia: <strong>{card.closingDay}</strong>
                </span>
                <span>
                  Vence dia: <strong>{card.dueDay}</strong>
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!cardToDelete}
        onOpenChange={(open) => !open && setCardToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente
              o cartão{" "}
              <span className="font-medium text-foreground">
                {cardToDelete?.name}
              </span>{" "}
              e sua imagem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
