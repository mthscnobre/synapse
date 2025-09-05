"use client";

import { useNotificationPermission } from "@/lib/hooks/useNotificationPermission";
import { Button } from "@/components/ui/button";
import { Bell, BellRing, BellOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NotificationToggle() {
  // A chamada ao hook agora está correta para este contexto (sem argumentos)
  const { permission, requestPermission } = useNotificationPermission();

  const getIconAndTooltip = () => {
    switch (permission) {
      case "granted":
        return {
          icon: <Bell className="h-5 w-5 text-green-500" />,
          tooltip: "Notificações ativadas",
        };
      case "denied":
        return {
          icon: <BellOff className="h-5 w-5 text-destructive" />,
          tooltip: "Notificações bloqueadas",
        };
      default: // 'default'
        return {
          icon: <BellRing className="h-5 w-5" />, // Removida a cor para usar a padrão do Header
          tooltip: "Clique para ativar as notificações",
        };
    }
  };

  const { icon, tooltip } = getIconAndTooltip();

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={requestPermission}
            aria-label={tooltip}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
