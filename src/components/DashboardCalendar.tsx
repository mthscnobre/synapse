"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { type CalendarEvent } from "@/app/page";
import { CreditCard, Landmark } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardCalendarProps {
  events: CalendarEvent[];
}

export default function DashboardCalendar({ events }: DashboardCalendarProps) {
  const modifiers = useMemo(() => {
    return {
      card: events
        .filter((event) => event.type === "card")
        .map((event) => event.date),
      bill: events
        .filter((event) => event.type === "bill")
        .map((event) => event.date),
    };
  }, [events]);

  const sortedEvents = useMemo(
    () => events.sort((a, b) => a.date.getTime() - b.date.getTime()),
    [events]
  );

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Vencimentos do Mês</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Calendário para Desktop */}
        <div className="hidden md:flex justify-center">
          <Calendar
            mode="single"
            className="rounded-md"
            lang="pt-BR"
            modifiers={modifiers}
            modifiersClassNames={{
              card: "event-card",
              bill: "event-bill",
            }}
            // REMOVEMOS a prop classNames daqui
          />
        </div>

        {/* Agenda para Mobile (sem alterações) */}
        <div className="block md:hidden">
          {sortedEvents.length > 0 ? (
            <div className="space-y-4">
              {sortedEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md w-16">
                    <span className="text-xs font-bold uppercase text-muted-foreground">
                      {format(event.date, "MMM", { locale: ptBR })}
                    </span>
                    <span className="text-xl font-bold text-foreground">
                      {format(event.date, "dd")}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    {event.type === "card" ? (
                      <CreditCard className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Landmark className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="font-medium text-foreground truncate">
                      {event.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              Nenhum vencimento para este mês.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
