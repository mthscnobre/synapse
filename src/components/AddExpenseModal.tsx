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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
// Correcção aqui: caminho completo para o ficheiro de configuração do firebase
import {
  Expense,
  addExpense,
  updateExpense,
  listenToCategories,
  addCategory,
  Category,
  Card,
  listenToCards,
} from "@/lib/firebase/firestore";
import { ChevronsUpDown, Check, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

// Paleta de cores para novas categorias
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

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: Expense | null;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  expenseToEdit,
}: AddExpenseModalProps) {
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [paymentMethod, setPaymentMethod] = useState<
    "Débito/Pix" | "Crédito"
  >();
  const [cardId, setCardId] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (user) {
      const unsubscribeCategories = listenToCategories(user.uid, setCategories);
      const unsubscribeCards = listenToCards(user.uid, setCards);

      return () => {
        unsubscribeCategories();
        unsubscribeCards();
      };
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        setAmount(String(expenseToEdit.amount));
        setDescription(expenseToEdit.description);
        setCategory(expenseToEdit.category);
        setLocation(expenseToEdit.location);
        setDate(expenseToEdit.createdAt.toDate());
        setPaymentMethod(expenseToEdit.paymentMethod);
        setCardId(expenseToEdit.cardId);
      } else {
        setAmount("");
        setDescription("");
        setCategory("");
        setLocation("");
        setDate(new Date());
        setPaymentMethod(undefined);
        setCardId(undefined);
        setSearchQuery("");
      }
    }
  }, [isOpen, expenseToEdit]);

  const handleSave = async () => {
    if (!amount || !category || !user || !date || !paymentMethod) {
      toast.error("Campos obrigatórios", {
        description:
          "Por favor, preencha o valor, a categoria, a data e a forma de pagamento.",
      });
      return;
    }
    if (paymentMethod === "Crédito" && !cardId) {
      toast.error("Campo obrigatório", {
        description: "Por favor, selecione um cartão de crédito.",
      });
      return;
    }

    setIsSaving(true);

    let success = false;
    const formattedAmount = parseFloat(amount);

    if (expenseToEdit) {
      const updatedData = {
        amount: formattedAmount,
        description: description,
        category: category,
        location: location,
        createdAt: Timestamp.fromDate(date),
        paymentMethod: paymentMethod,
        cardId: paymentMethod === "Crédito" ? cardId : "",
      };
      success = await updateExpense(expenseToEdit.id, updatedData);
    } else {
      const expenseData: Omit<Expense, "id"> = {
        amount: formattedAmount,
        description: description,
        category: category,
        location: location,
        paymentMethod: paymentMethod,
        cardId: paymentMethod === "Crédito" ? cardId : "",
        userId: user.uid,
        createdAt: Timestamp.fromDate(date),
      };
      const docId = await addExpense(expenseData);
      success = !!docId;
    }

    setIsSaving(false);

    if (success) {
      toast.success("Sucesso!", {
        description: `O seu gasto de ${formattedAmount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })} foi guardado.`,
      });
      onClose();
    } else {
      toast.error("Erro ao guardar", {
        description: "Não foi possível guardar a despesa. Tente novamente.",
      });
    }
  };

  const handleCreateCategory = async (categoryName: string) => {
    if (!user || !categoryName.trim()) return;
    const newCategoryData = {
      name: categoryName.trim(),
      userId: user.uid,
      color: getRandomColor(),
    };
    const newCategory = await addCategory(newCategoryData);
    if (newCategory) {
      setCategory(newCategory.name);
      setOpenCombobox(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {expenseToEdit ? "Editar Gasto" : "Adicionar Novo Gasto"}
          </DialogTitle>
          <DialogDescription>
            Insira os detalhes do seu gasto. Clique em guardar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <form
          id="expense-form"
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
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                required
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Café na padaria..."
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoria
            </Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="col-span-3 justify-between w-full"
                >
                  {category || "Selecione ou crie..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder="Procurar ou criar categoria..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandEmpty>
                    <button
                      type="button"
                      className="w-full text-left p-2 text-sm"
                      onClick={() => handleCreateCategory(searchQuery)}
                    >
                      {`Criar "${searchQuery}"`}
                    </button>
                  </CommandEmpty>
                  <CommandGroup>
                    {categories.map((cat) => (
                      <CommandItem
                        key={cat.id}
                        value={cat.name}
                        onSelect={(currentValue) => {
                          setCategory(
                            currentValue === category ? "" : currentValue
                          );
                          setOpenCombobox(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            category === cat.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {cat.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Local
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Starbucks, Posto Shell..."
              className="col-span-3"
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
                <RadioGroupItem value="Débito/Pix" id="debit" />
                <Label htmlFor="debit">Débito/Pix</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Crédito" id="credit" />
                <Label htmlFor="credit">Crédito</Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "Crédito" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card" className="text-right">
                Cartão
              </Label>
              <Select onValueChange={setCardId} value={cardId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um cartão" />
                </SelectTrigger>
                <SelectContent>
                  {cards.length > 0 ? (
                    cards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name} (•••• {card.lastFourDigits})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nenhum cartão registado.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="expense-form" disabled={isSaving}>
            {isSaving ? "A guardar..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
