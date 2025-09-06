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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { Income, addIncome, updateIncome } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AddEditIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  incomeToEdit?: Income | null;
}

export default function AddEditIncomeModal({
  isOpen,
  onClose,
  incomeToEdit,
}: AddEditIncomeModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [payer, setPayer] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (incomeToEdit) {
        setAmount(String(incomeToEdit.amount));
        setSource(incomeToEdit.source);
        setPayer(incomeToEdit.payer || "");
        setDate(incomeToEdit.createdAt.toDate());
      } else {
        setAmount("");
        setSource("");
        setPayer("");
        setDate(new Date());
      }
    }
  }, [isOpen, incomeToEdit]);

  const handleSave = async () => {
    if (!amount || !source || !date || !user) {
      toast.error("Os campos Valor, Origem e Data são obrigatórios.");
      return;
    }

    setIsSaving(true);
    let success = false;

    const incomeData = {
      amount: parseFloat(amount),
      source,
      payer,
      createdAt: Timestamp.fromDate(date),
    };

    if (incomeToEdit) {
      success = await updateIncome(incomeToEdit.id, incomeData);
    } else {
      const newIncomeData = { ...incomeData, userId: user.uid };
      const result = await addIncome(newIncomeData);
      success = !!result;
    }

    setIsSaving(false);

    if (success) {
      toast.success(
        `Entrada de "${source}" ${
          incomeToEdit ? "atualizada" : "salva"
        } com sucesso!`
      );
      onClose();
    } else {
      toast.error("Ocorreu um erro ao salvar a entrada.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isSaving ? onClose : undefined}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {incomeToEdit ? "Editar Entrada" : "Adicionar Nova Entrada"}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes da sua receita ou ganho.
          </DialogDescription>
        </DialogHeader>
        <form
          id="income-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Valor
            </Label>
            <div className="relative col-span-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                R$
              </span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="col-span-3 pl-9"
                disabled={isSaving}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="source" className="text-right">
              Origem
            </Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Ex: Salário, Freelance"
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payer" className="text-right">
              Pagador
            </Label>
            <Input
              id="payer"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              placeholder="Ex: Nome da Empresa (Opcional)"
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Data
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: ptBR })
                  ) : (
                    <span>Escolha uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </form>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="income-form" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
