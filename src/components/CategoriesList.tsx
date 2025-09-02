"use client";

import { useState } from "react";
import { Category, deleteCategory } from "@/lib/firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, Trash2, Edit, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

interface CategoriesListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export default function CategoriesList({
  categories,
  onEdit,
}: CategoriesListProps) {
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const handleDelete = async () => {
    if (categoryToDelete) {
      const success = await deleteCategory(categoryToDelete.id);
      if (success) {
        toast.success("Categoria excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a categoria.");
      }
      setCategoryToDelete(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-16 border-2 border-dashed border-border rounded-lg p-12">
        <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">
          Nenhuma categoria cadastrada
        </h3>
        <p className="mt-2 text-sm">
          Clique em &quot;Adicionar Categoria&quot; para criar a sua primeira.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {categories.map((category) => (
          <Card key={category.id} className="p-3">
            <div className="flex items-center justify-between w-full">
              {/* Grupo da Esquerda: Ícone e Nome */}
              <div className="flex items-center gap-3">
                <div
                  className="h-5 w-5 rounded-full border flex-shrink-0"
                  style={{ backgroundColor: category.color || "#A1A1AA" }}
                />
                <span className="font-medium text-foreground">
                  {category.name}
                </span>
              </div>

              {/* Botão de Menu à Direita */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onEdit(category)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCategoryToDelete(category)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente
              a categoria{" "}
              <span className="font-medium text-foreground">
                {categoryToDelete?.name}
              </span>
              . As despesas existentes com esta categoria não serão alteradas.
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
