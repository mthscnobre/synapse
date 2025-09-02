import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface DashboardSummaryProps {
  monthlyTotal: number;
  numberOfTransactions: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

export default function DashboardSummary({
  monthlyTotal,
  numberOfTransactions,
}: DashboardSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Gasto (Mês)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(monthlyTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            em {numberOfTransactions} transações
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
