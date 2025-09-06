"use client";

import { Bar, BarChart, XAxis, YAxis, Cell, LabelList } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
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
  cardName: string;
  total: number;
  fill: string;
}

interface CardChartProps {
  data: ChartData[];
}

export default function CardChart({ data }: CardChartProps) {
  const dynamicChartConfig = data.reduce((acc, item) => {
    acc[item.cardName] = {
      label: item.cardName,
      color: item.fill,
    };
    return acc;
  }, {} as ChartConfig);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Cartão</CardTitle>
          <CardDescription>Mês Atual</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">
            Não há despesas com cartão de crédito para exibir neste mês.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Cartão</CardTitle>
        <CardDescription>Mês Atual</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={dynamicChartConfig}
          className="h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            // CORREÇÃO AQUI: Adicionando margem à direita para o label
            margin={{
              left: 10,
              right: 80, // Damos espaço extra para o texto do valor
            }}
          >
            <YAxis
              dataKey="cardName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 15)}
              stroke="hsl(var(--muted-foreground))"
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
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
            <Bar dataKey="total" layout="vertical" radius={5} barSize={30}>
              {data.map((entry) => (
                <Cell key={`cell-${entry.cardName}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="total"
                position="right"
                offset={8}
                className="fill-foreground text-sm"
                formatter={(value: number) =>
                  value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
