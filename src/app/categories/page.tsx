"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import AddEditCategoryModal from "@/components/AddEditCategoryModal";
import CategoriesList from "@/components/CategoriesList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Category, listenToCategories } from "@/lib/firebase/firestore";
import { PlusCircle } from "lucide-react";

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = listenToCategories(user.uid, (newCategories) => {
        setCategories(newCategories);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddNewCategory = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryToEdit(null);
  };

  return (
    <AuthGuard>
      <section className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Minhas Categorias
            </h2>
            <p className="mt-1 md:mt-2 text-muted-foreground">
              Organize suas finanças com categorias personalizadas.
            </p>
          </div>
          <Button onClick={handleAddNewCategory}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Categoria
          </Button>
        </div>

        <CategoriesList categories={categories} onEdit={handleEditCategory} />
      </section>

      <AddEditCategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        categoryToEdit={categoryToEdit}
      />
    </AuthGuard>
  );
}
