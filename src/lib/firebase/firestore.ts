import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";
import { getStorage, ref, deleteObject } from "firebase/storage";

// --- INTERFACES ---
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  location: string;
  paymentMethod: "Débito/Pix" | "Crédito";
  cardId?: string;
  userId: string;
  createdAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface Card {
  id: string;
  name: string;
  lastFourDigits: string;
  closingDay: number;
  dueDay: number;
  userId: string;
  logoUrl?: string; // Campo opcional para a URL da imagem
  storagePath?: string; // Campo opcional para o caminho no Storage
}

// --- FUNÇÕES DE DESPESAS (EXPENSES) ---

export async function addExpense(data: Omit<Expense, "id">) {
  const db = getFirebaseDb();
  try {
    const docRef = await addDoc(collection(db, "expenses"), data);
    console.log("Documento escrito com ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Erro ao adicionar documento: ", e);
    return null;
  }
}

export async function updateExpense(
  expenseId: string,
  data: Partial<Omit<Expense, "id" | "userId">>
) {
  const db = getFirebaseDb();
  try {
    const expenseRef = doc(db, "expenses", expenseId);
    await updateDoc(expenseRef, data);
    console.log("Documento atualizado com ID: ", expenseId);
    return true;
  } catch (e) {
    console.error("Erro ao atualizar documento: ", e);
    return false;
  }
}

export async function deleteExpense(expenseId: string) {
  const db = getFirebaseDb();
  try {
    const expenseRef = doc(db, "expenses", expenseId);
    await deleteDoc(expenseRef);
    console.log("Documento deletado com ID: ", expenseId);
    return true;
  } catch (e) {
    console.error("Erro ao deletar documento: ", e);
    return false;
  }
}

export function listenToExpenses(
  userId: string,
  callback: (expenses: Expense[]) => void
) {
  const db = getFirebaseDb();
  const expensesCollection = collection(db, "expenses");
  const q = query(
    expensesCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const expenses: Expense[] = [];
    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() } as Expense);
    });
    callback(expenses);
  });
  return unsubscribe;
}

// --- FUNÇÕES DE CATEGORIAS (CATEGORIES) ---

export async function addCategory(data: Omit<Category, "id">) {
  const db = getFirebaseDb();
  try {
    const docRef = await addDoc(collection(db, "categories"), data);
    console.log("Categoria adicionada com ID: ", docRef.id);
    return { id: docRef.id, ...data };
  } catch (e) {
    console.error("Erro ao adicionar categoria: ", e);
    return null;
  }
}

export function listenToCategories(
  userId: string,
  callback: (categories: Category[]) => void
) {
  const db = getFirebaseDb();
  const categoriesCollection = collection(db, "categories");
  const q = query(
    categoriesCollection,
    where("userId", "==", userId),
    orderBy("name")
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as Category);
    });
    callback(categories);
  });
  return unsubscribe;
}

// --- FUNÇÕES DE CARTÕES (CARDS) ---

export async function addCard(data: Omit<Card, "id">) {
  const db = getFirebaseDb();
  try {
    const docRef = await addDoc(collection(db, "cards"), data);
    console.log("Cartão adicionado com ID: ", docRef.id);
    return { id: docRef.id, ...data };
  } catch (e) {
    console.error("Erro ao adicionar cartão: ", e);
    return null;
  }
}

export async function updateCard(
  cardId: string,
  data: Partial<Omit<Card, "id" | "userId">>
) {
  const db = getFirebaseDb();
  try {
    const cardRef = doc(db, "cards", cardId);
    await updateDoc(cardRef, data);
    console.log("Cartão atualizado com ID: ", cardId);
    return true;
  } catch (e) {
    console.error("Erro ao atualizar cartão: ", e);
    return false;
  }
}

export async function deleteCard(cardId: string, storagePath?: string) {
  const db = getFirebaseDb();

  // Se houver um caminho de imagem, delete-a primeiro
  if (storagePath) {
    const storage = getStorage();
    const imageRef = ref(storage, storagePath);
    try {
      await deleteObject(imageRef);
      console.log("Imagem do cartão deletada do Storage.");
    } catch (error) {
      console.error("Erro ao deletar imagem do Storage: ", error);
      // Decide se quer parar a exclusão ou apenas logar o erro.
      // Por enquanto, vamos apenas logar e continuar.
    }
  }

  // Agora delete o documento do Firestore
  try {
    const cardRef = doc(db, "cards", cardId);
    await deleteDoc(cardRef);
    console.log("Cartão deletado com ID: ", cardId);
    return true;
  } catch (e) {
    console.error("Erro ao deletar cartão do Firestore: ", e);
    return false;
  }
}

export function listenToCards(
  userId: string,
  callback: (cards: Card[]) => void
) {
  const db = getFirebaseDb();
  const cardsCollection = collection(db, "cards");
  const q = query(
    cardsCollection,
    where("userId", "==", userId),
    orderBy("name")
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const cards: Card[] = [];
    querySnapshot.forEach((doc) => {
      cards.push({ id: doc.id, ...doc.data() } as Card);
    });
    callback(cards);
  });
  return unsubscribe;
}
