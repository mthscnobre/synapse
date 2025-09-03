"use client";

import { useState } from "react";
import { Bill, deleteBill, Category } from "@/lib/firebase/firestore";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Trash2, Edit, FileText } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface BillsListProps {
  bills: Bill[];
  onEdit: (bill: Bill) => void;
  categories: Category[];
}

export default function BillsList({
  bills,
  onEdit,
  categories,
}: BillsListProps) {
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null);

  const handleDelete = async () => {
    if (billToDelete) {
      const success = await deleteBill(billToDelete.id);
      if (success) {
        toast.success("Conta excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a conta.");
      }
      setBillToDelete(null);
    }
  };

  if (bills.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-16 border-2 border-dashed border-border rounded-lg p-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhuma conta cadastrada</h3>
        <p className="mt-2 text-sm">
          Clique em &quot;Adicionar Conta&quot; para cadastrar sua primeira
          despesa recorrente.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <>
      <div className="space-y-3">
        {bills.map((bill) => {
          const billCategory = categories.find((c) => c.name === bill.category);
          return (
            <Card key={bill.id} className="flex items-center p-4">
              <div className="flex-1 flex items-center gap-4">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: billCategory?.color || "#A1A1AA" }}
                >
                  {/* Futuramente podemos adicionar um ícone da categoria aqui */}
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    {bill.description}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Vence todo dia {bill.dueDay}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant={bill.isActive ? "default" : "outline"}>
                  {bill.isActive ? "Ativa" : "Inativa"}
                </Badge>
                <div className="text-lg font-bold w-32 text-right">
                  {formatCurrency(bill.amount)}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(bill)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setBillToDelete(bill)}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          );
        })}
      </div>

      <AlertDialog
        open={!!billToDelete}
        onOpenChange={(open) => !open && setBillToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente
              a conta{" "}
              <span className="font-medium text-foreground">
                {billToDelete?.description}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
