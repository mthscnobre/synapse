"use client";

import { Plus } from "lucide-react";

interface AddExpenseButtonProps {
  onOpen: () => void;
}

export default function AddExpenseButton({ onOpen }: AddExpenseButtonProps) {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-background"
      aria-label="Adicionar novo gasto"
    >
      <Plus size={28} />
    </button>
  );
}
