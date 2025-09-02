import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card as UICard } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CategoryPill } from "@/components/CategoryPill";
import { MoreHorizontal, Edit, Trash2, CreditCard } from "lucide-react";
import { Expense, Category, Card } from "@/lib/firebase/firestore";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  categories: Category[];
  cards: Card[];
}

export default function ExpenseCard({
  expense,
  onEdit,
  onDelete,
  categories,
  cards,
}: ExpenseCardProps) {
  const formattedAmount = expense.amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const formattedDate = format(expense.createdAt.toDate(), "dd MMM", {
    locale: ptBR,
  });

  const expenseCategory = categories.find(
    (cat) => cat.name === expense.category
  );
  const expenseCard = cards.find((card) => card.id === expense.cardId);

  let iconSrc: string | undefined = undefined;
  let iconAlt: string = "Ícone de Despesa";
  let paymentText: string = expense.paymentMethod;

  if (expense.paymentMethod === "Crédito") {
    iconSrc = expenseCard?.logoUrl;
    iconAlt = expenseCard?.name || "Cartão de Crédito";
    paymentText = expenseCard?.name || "Crédito";
  } else if (expense.paymentMethod === "Débito/Pix") {
    iconSrc = "/icons/pix-logo.svg";
    iconAlt = "Pix";
  }

  return (
    <UICard className="p-4 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-100 p-1">
          {iconSrc ? (
            <div className="relative h-full w-full">
              <Image
                src={iconSrc}
                alt={iconAlt}
                layout="fill"
                objectFit="contain"
              />
            </div>
          ) : (
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Linha Superior: Descrição e Valor */}
          <div className="flex items-center justify-between">
            <h3 className="truncate font-semibold text-foreground">
              {expense.description || expense.category}
            </h3>
            <span className="ml-4 flex-shrink-0 font-bold text-destructive">
              {formattedAmount}
            </span>
          </div>

          {/* Linha Inferior: Metadados Balanceados */}
          <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
            {/* Lado Esquerdo: Categoria e Data */}
            <div className="flex items-center gap-2 truncate">
              <CategoryPill
                category={expense.category}
                color={expenseCategory?.color}
              />
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
            {/* Lado Direito: Forma de Pagamento */}
            <div className="flex flex-shrink-0 items-center gap-1.5">
              <span className="text-xs font-medium">{paymentText}</span>
            </div>
          </div>
        </div>

        <div className="ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit(expense)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(expense)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </UICard>
  );
}
