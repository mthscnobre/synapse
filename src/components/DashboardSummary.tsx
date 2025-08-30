// src/components/DashboardSummary.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardSummaryProps {
  monthlyTotal: number;
  numberOfTransactions: number;
}

// Função para formatar a moeda (podemos extrair para um arquivo de utils no futuro)
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
            Total Gasto (Mês Atual)
          </CardTitle>
          {/* Ícone de Exemplo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(monthlyTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            em {numberOfTransactions} transações este mês
          </p>
        </CardContent>
      </Card>
      {/* Futuramente, podemos adicionar outros cards aqui, como "Média por Gasto", "Receita do Mês", etc. */}
    </div>
  );
}
