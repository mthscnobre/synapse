"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { type CalendarEvent } from "@/app/page";
import { isTomorrow, format } from "date-fns";
import { ptBR } from "date-fns/locale";

// CORREÇÃO 1: Adicionar um valor padrão para 'events'
export function useNotificationPermission(events: CalendarEvent[] = []) {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  const showNotification = useCallback((event: CalendarEvent) => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.ready.then((registration) => {
      const formattedDate = format(event.date, "dd/MM/yyyy", { locale: ptBR });
      registration.showNotification("Lembrete de Vencimento - SYNAPSE", {
        body: `Não se esqueça: "${event.title}" vence amanhã, dia ${formattedDate}.`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        // CORREÇÃO 2: Remover a propriedade 'vibrate'
      });
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // A verificação 'events && events.length > 0' agora é segura
    if (permission === "granted" && events.length > 0) {
      console.log("Verificando se há notificações para agendar...");
      const alreadyNotifiedKey = `notified-${
        new Date().toISOString().split("T")[0]
      }`;

      if (sessionStorage.getItem(alreadyNotifiedKey)) {
        return;
      }

      events.forEach((event) => {
        if (isTomorrow(event.date)) {
          showNotification(event);
        }
      });

      sessionStorage.setItem(alreadyNotifiedKey, "true");
    }
  }, [permission, events, showNotification]);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Este navegador não suporta notificações.");
      return;
    }

    if (Notification.permission === "granted") {
      toast.info("As notificações já estão ativadas.");
      return;
    }

    if (Notification.permission === "denied") {
      toast.error("Notificações bloqueadas.", {
        description:
          "Altere as permissões do site no seu navegador para ativá-las.",
      });
      return;
    }

    const permissionResult = await Notification.requestPermission();
    setPermission(permissionResult);

    if (permissionResult === "granted") {
      toast.success("Notificações ativadas com sucesso!");
    } else {
      toast.warning("Você não ativou as notificações.", {
        description: "Você pode ativá-las a qualquer momento clicando no sino.",
      });
    }
  }, []);

  return { permission, requestPermission };
}
