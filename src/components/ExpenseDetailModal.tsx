import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Expense, Category, Card } from "@/lib/firebase/firestore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  StickyNote,
  Building,
  Tag,
  Repeat,
  Wallet,
} from "lucide-react";
import React from "react";

// Sub-componente para o layout de lista de detalhes
const DetailItem = ({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  // Não renderiza a linha se não houver valor ou conteúdo filho
  if (!value && !children) return null;

  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 text-muted-foreground mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="font-semibold text-foreground">{value || children}</div>
      </div>
    </div>
  );
};

interface ExpenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  categories: Category[];
  cards: Card[];
}

export default function ExpenseDetailModal({
  isOpen,
  onClose,
  expense,
  categories,
  cards,
}: ExpenseDetailModalProps) {
  if (!expense) return null;

  const expenseCategory = categories.find(
    (cat) => cat.name === expense.category
  );
  const expenseCard = cards.find((card) => card.id === expense.cardId);

  const formattedAmount = expense.amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const formattedDueDate = format(expense.createdAt.toDate(), "PPP", {
    locale: ptBR,
  });
  const formattedPurchaseDate = expense.purchaseDate
    ? format(expense.purchaseDate.toDate(), "PPP", { locale: ptBR })
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-center space-y-2">
          <DialogTitle>Detalhes da Despesa</DialogTitle>
          <DialogDescription>
            Aqui estão todas as informações sobre este gasto.
          </DialogDescription>
        </DialogHeader>

        {/* Seção de Destaque */}
        <div className="text-center my-6">
          <p className="text-sm text-muted-foreground">
            {expense.isInstallment ? "Valor da Parcela" : "Valor"}
          </p>
          <p className="text-4xl font-bold text-destructive">
            {formattedAmount}
          </p>
          <p className="text-lg font-semibold mt-1">{expense.description}</p>
        </div>

        <Separator />

        {/* Lista de Detalhes */}
        <div className="space-y-4 pt-4">
          <DetailItem
            icon={<Tag size={20} />}
            label="Categoria"
            value={
              <Badge
                style={{ backgroundColor: expenseCategory?.color }}
                className={expenseCategory?.color ? "text-black" : ""}
              >
                {expense.category}
              </Badge>
            }
          />

          <DetailItem
            icon={<Calendar size={20} />}
            label={
              expense.isInstallment ? "Data de Vencimento da Parcela" : "Data"
            }
            value={formattedDueDate}
          />

          {/* Campo Condicional: Data da Compra Original */}
          {expense.isInstallment && formattedPurchaseDate && (
            <DetailItem
              icon={<Calendar size={20} />}
              label="Data da Compra"
              value={formattedPurchaseDate}
            />
          )}

          <DetailItem
            icon={<Wallet size={20} />}
            label="Forma de Pagamento"
            value={
              expense.paymentMethod === "Crédito" && expenseCard
                ? `Crédito • ${expenseCard.name}`
                : expense.paymentMethod
            }
          />

          {/* Campo Condicional: Detalhes do Parcelamento */}
          {expense.isInstallment && (
            <DetailItem
              icon={<Repeat size={20} />}
              label="Parcelamento"
              value={`Parcela ${expense.installmentNumber} de ${expense.totalInstallments}`}
            />
          )}

          <DetailItem
            icon={<Building size={20} />}
            label="Local"
            value={expense.location}
          />

          <DetailItem icon={<StickyNote size={20} />} label="Notas">
            <p className="whitespace-pre-wrap text-sm font-normal pt-1">
              {expense.notes || "Nenhuma nota."}
            </p>
          </DetailItem>
        </div>
      </DialogContent>
    </Dialog>
  );
}
