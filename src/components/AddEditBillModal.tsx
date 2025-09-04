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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bill,
  addBill,
  updateBill,
  Category,
  Card,
} from "@/lib/firebase/firestore";
import { toast } from "sonner";

interface AddEditBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  billToEdit?: Bill | null;
  categories: Category[];
  cards: Card[];
}

export default function AddEditBillModal({
  isOpen,
  onClose,
  billToEdit,
  categories,
  cards,
}: AddEditBillModalProps) {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isAutomatic, setIsAutomatic] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "Débito/Pix" | "Crédito"
  >();
  const [cardId, setCardId] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen) {
      if (billToEdit) {
        setDescription(billToEdit.description);
        setAmount(String(billToEdit.amount));
        setDueDay(String(billToEdit.dueDay));
        setCategory(billToEdit.category);
        setIsActive(billToEdit.isActive);
        setIsAutomatic(billToEdit.isAutomatic || false);
        setPaymentMethod(billToEdit.paymentMethod);
        setCardId(billToEdit.cardId);
      } else {
        setDescription("");
        setAmount("");
        setDueDay("");
        setCategory("");
        setIsActive(true);
        setIsAutomatic(false);
        setPaymentMethod(undefined);
        setCardId(undefined);
      }
    }
  }, [isOpen, billToEdit]);

  const handleSave = async () => {
    if (!description || !amount || !dueDay || !category || !user) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }
    if (isAutomatic && !paymentMethod) {
      toast.error(
        "Para contas automáticas, a forma de pagamento é obrigatória."
      );
      return;
    }
    if (isAutomatic && paymentMethod === "Crédito" && !cardId) {
      toast.error(
        "Por favor, selecione um cartão de crédito para a conta automática."
      );
      return;
    }

    setIsSaving(true);
    let success = false;

    const baseBillData: Omit<Bill, "id" | "userId"> = {
      description,
      amount: parseFloat(amount),
      dueDay: parseInt(dueDay, 10),
      category,
      isActive,
      isAutomatic,
    };

    // Adiciona os campos de pagamento apenas se for automático
    if (isAutomatic) {
      baseBillData.paymentMethod = paymentMethod;
      baseBillData.cardId = paymentMethod === "Crédito" ? cardId : "";
    }

    if (billToEdit) {
      success = await updateBill(billToEdit.id, baseBillData);
    } else {
      const result = await addBill({ ...baseBillData, userId: user.uid });
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
            Preencha os detalhes da sua conta recorrente.
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
              placeholder="Ex: 39,90"
              className="col-span-3"
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
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoria
            </Label>
            <Select onValueChange={setCategory} value={category}>
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
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="status"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          <div className="my-4 border-t border-border"></div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isAutomatic" className="text-right">
              Gerar Despesa Automática?
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="isAutomatic"
                checked={isAutomatic}
                onCheckedChange={setIsAutomatic}
              />
            </div>
          </div>

          {isAutomatic && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Pagamento</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value: "Débito/Pix" | "Crédito") =>
                    setPaymentMethod(value)
                  }
                  className="col-span-3 flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Débito/Pix" id="bill-debit" />
                    <Label htmlFor="bill-debit">Débito/Pix</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Crédito" id="bill-credit" />
                    <Label htmlFor="bill-credit">Crédito</Label>
                  </div>
                </RadioGroup>
              </div>
              {paymentMethod === "Crédito" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bill-card" className="text-right">
                    Cartão
                  </Label>
                  <Select onValueChange={setCardId} value={cardId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione um cartão" />
                    </SelectTrigger>
                    <SelectContent>
                      {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}
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
