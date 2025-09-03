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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Bill, addBill, updateBill, Category } from "@/lib/firebase/firestore";
import { toast } from "sonner";

interface AddEditBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  billToEdit?: Bill | null;
  categories: Category[];
}

export default function AddEditBillModal({
  isOpen,
  onClose,
  billToEdit,
  categories,
}: AddEditBillModalProps) {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (billToEdit) {
        setDescription(billToEdit.description);
        setAmount(String(billToEdit.amount));
        setDueDay(String(billToEdit.dueDay));
        setCategory(billToEdit.category);
        setIsActive(billToEdit.isActive);
      } else {
        setDescription("");
        setAmount("");
        setDueDay("");
        setCategory("");
        setIsActive(true);
      }
    }
  }, [isOpen, billToEdit]);

  const handleSave = async () => {
    if (!description || !amount || !dueDay || !category || !user) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }

    setIsSaving(true);
    let success = false;

    const billData = {
      description,
      amount: parseFloat(amount),
      dueDay: parseInt(dueDay, 10),
      category,
      isActive,
    };

    if (billToEdit) {
      success = await updateBill(billToEdit.id, billData);
    } else {
      const newBillData = { ...billData, userId: user.uid };
      const result = await addBill(newBillData);
      success = !!result;
    }

    setIsSaving(false);

    if (success) {
      toast.success(
        `Conta "${description}" ${
          billToEdit ? "atualizada" : "salva"
        } com sucesso!`
      );
      onClose();
    } else {
      toast.error("Ocorreu um erro ao salvar a conta.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isSaving ? onClose : undefined}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {billToEdit ? "Editar Conta" : "Adicionar Nova Conta"}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes da sua despesa recorrente.
          </DialogDescription>
        </DialogHeader>
        <form
          id="bill-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Netflix, Aluguel"
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Valor (R$)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 59,90"
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDay" className="text-right">
              Dia do Vencimento
            </Label>
            <Input
              id="dueDay"
              type="number"
              min="1"
              max="31"
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              placeholder="Ex: 10"
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoria
            </Label>
            <Select
              onValueChange={setCategory}
              value={category}
              disabled={isSaving}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">
              Ativa
            </Label>
            <div className="col-span-3">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={isSaving}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="bill-form" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
