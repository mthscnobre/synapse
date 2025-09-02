"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Category,
  addCategory,
  updateCategory,
} from "@/lib/firebase/firestore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
}

const categoryColors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

const getRandomColor = () => {
  return categoryColors[Math.floor(Math.random() * categoryColors.length)];
};

export default function AddEditCategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
}: AddEditCategoryModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [color, setColor] = useState(getRandomColor());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        setName(categoryToEdit.name);
        setColor(categoryToEdit.color || getRandomColor());
      } else {
        setName("");
        setColor(getRandomColor());
      }
    }
  }, [isOpen, categoryToEdit]);

  const handleSave = async () => {
    if (!name || !user) {
      toast.error("O nome da categoria é obrigatório.");
      return;
    }

    setIsSaving(true);
    let success = false;

    const categoryData = { name, color };

    if (categoryToEdit) {
      success = await updateCategory(categoryToEdit.id, categoryData);
    } else {
      const newCategoryData = { ...categoryData, userId: user.uid };
      const result = await addCategory(newCategoryData);
      success = !!result;
    }

    setIsSaving(false);

    if (success) {
      toast.success(
        `Categoria "${name}" ${
          categoryToEdit ? "atualizada" : "salva"
        } com sucesso!`
      );
      onClose();
    } else {
      toast.error("Ocorreu um erro ao salvar a categoria.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isSaving ? onClose : undefined}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {categoryToEdit ? "Editar Categoria" : "Adicionar Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            Defina um nome e uma cor para identificar facilmente suas despesas.
          </DialogDescription>
        </DialogHeader>
        <form
          id="category-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid gap-6 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alimentação"
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Cor</Label>
            <div className="col-span-3 grid grid-cols-9 gap-2">
              {categoryColors.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
                    color === c
                      ? "border-primary ring-2 ring-ring ring-offset-2 ring-offset-background"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Selecionar cor ${c}`}
                />
              ))}
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="category-form" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
