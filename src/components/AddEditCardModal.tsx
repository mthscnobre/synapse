"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card, addCard, updateCard } from "@/lib/firebase/firestore";
import { getFirebaseStorage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { ImageIcon, X } from "lucide-react";

interface AddEditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardToEdit?: Card | null;
}

export default function AddEditCardModal({
  isOpen,
  onClose,
  cardToEdit,
}: AddEditCardModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [closingDay, setClosingDay] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (cardToEdit) {
        setName(cardToEdit.name);
        setLastFourDigits(cardToEdit.lastFourDigits);
        setClosingDay(String(cardToEdit.closingDay));
        setDueDay(String(cardToEdit.dueDay));
        setImagePreview(cardToEdit.logoUrl || null);
      } else {
        setName("");
        setLastFourDigits("");
        setClosingDay("");
        setDueDay("");
        setImageFile(null);
        setImagePreview(null);
      }
    } else {
      if (!isSaving) {
        setImageFile(null);
        setImagePreview(null);
      }
    }
  }, [isOpen, cardToEdit, isSaving]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!name || !lastFourDigits || !closingDay || !dueDay || !user) {
      toast.error("Todos os campos de texto são obrigatórios.");
      return;
    }

    setIsSaving(true);

    try {
      let logoUrl = cardToEdit?.logoUrl || "";
      let storagePath = cardToEdit?.storagePath || "";

      const cardDetails = {
        name,
        lastFourDigits,
        closingDay: parseInt(closingDay, 10),
        dueDay: parseInt(dueDay, 10),
      };

      let cardId = cardToEdit?.id;
      let newCardData;

      if (cardToEdit) {
        await updateCard(cardToEdit.id, cardDetails);
      } else {
        newCardData = await addCard({ ...cardDetails, userId: user.uid });
        cardId = newCardData?.id;
      }

      if (!cardId) throw new Error("Falha ao salvar os dados do cartão.");

      if (imageFile) {
        const storage = getFirebaseStorage();
        storagePath = `card-logos/${user.uid}/${cardId}/${imageFile.name}`;
        const imageRef = ref(storage, storagePath);

        await uploadBytes(imageRef, imageFile);
        logoUrl = await getDownloadURL(imageRef);
      }

      if (!imagePreview && cardToEdit?.logoUrl) {
        logoUrl = "";
        storagePath = "";
      }

      await updateCard(cardId, { logoUrl, storagePath });

      toast.success(`Cartão "${name}" salvo com sucesso!`);
      onClose();
    } catch (error) {
      console.error("Erro detalhado ao salvar:", error);
      toast.error("Ocorreu um erro ao salvar o cartão.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isSaving ? onClose : undefined}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {cardToEdit ? "Editar Cartão" : "Adicionar Novo Cartão"}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes e adicione um logo para seu cartão.
          </DialogDescription>
        </DialogHeader>
        <form
          id="card-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid gap-4 py-4"
        >
          <div className="space-y-2">
            <Label>Logo do Cartão (Opcional)</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-24 rounded-md flex items-center justify-center bg-muted border-2 border-dashed">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Pré-visualização do logo"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
                      onClick={removeImage}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
              >
                Escolher Imagem
              </Button>
              <Input
                id="logo"
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Apelido
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Nubank Roxinho"
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastFourDigits" className="text-right">
              4 Últimos Dígitos
            </Label>
            <Input
              id="lastFourDigits"
              type="number"
              value={lastFourDigits}
              onChange={(e) => {
                if (e.target.value.length <= 4) {
                  setLastFourDigits(e.target.value);
                }
              }}
              placeholder="1234"
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="closingDay" className="text-right">
              Dia do Fechamento
            </Label>
            <Input
              id="closingDay"
              type="number"
              min="1"
              max="31"
              value={closingDay}
              onChange={(e) => setClosingDay(e.target.value)}
              placeholder="Ex: 20"
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDay" className="text-right">
              Dia do Vencimento
            </Label>
            <Input
              id="dueDay"
              type="number"
              min="1"
              max="31"
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              placeholder="Ex: 28"
              className="col-span-3"
              disabled={isSaving}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="card-form" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
