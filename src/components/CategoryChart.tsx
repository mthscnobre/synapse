"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  category: string;
  total: number;
  color: string;
}

interface CategoryChartProps {
  data: ChartData[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const chartConfig = data.reduce((acc, item) => {
    acc[item.category] = {
      label: item.category,
      color: item.color,
    };
    return acc;
  }, {} as ChartConfig);

  const totalAmount = data.reduce((acc, item) => acc + item.total, 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
          <CardDescription>Mês Atual</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">
            Não há dados de despesas para exibir neste mês.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Gastos por Categoria</CardTitle>
        <CardDescription>Mês Atual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  // CORREÇÃO AQUI: Customizando o label e o valor
                  labelFormatter={(label, payload) => {
                    return payload[0]?.payload.category;
                  }}
                  formatter={(value) =>
                    typeof value === "number"
                      ? value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : value
                  }
                />
              }
            />
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.category}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total gasto no mês:{" "}
          {totalAmount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Distribuição de despesas por categoria
        </div>
      </CardFooter>
    </Card>
  );
}
