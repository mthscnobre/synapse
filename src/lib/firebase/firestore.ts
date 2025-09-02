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
import { startOfMonth, endOfMonth } from "date-fns";
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
  color?: string;
  icon?: string;
}

export interface Card {
  id: string;
  name: string;
  lastFourDigits: string;
  closingDay: number;
  dueDay: number;
  userId: string;
  logoUrl?: string;
  storagePath?: string;
}

// --- FUNÇÕES DE DESPESAS (EXPENSES) ---

export async function addExpense(data: Omit<Expense, "id">) {
  const db = getFirebaseDb();
  try {
    const docRef = await addDoc(collection(db, "expenses"), data);
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
    return true;
  } catch (e) {
    console.error("Erro ao deletar documento: ", e);
    return false;
  }
}

export function listenToExpenses(
  userId: string,
  month: Date,
  callback: (expenses: Expense[]) => void
) {
  const db = getFirebaseDb();
  const expensesCollection = collection(db, "expenses");

  const start = startOfMonth(month);
  const end = endOfMonth(month);

  const q = query(
    expensesCollection,
    where("userId", "==", userId),
    where("createdAt", ">=", start),
    where("createdAt", "<=", end),
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
    return { id: docRef.id, ...data };
  } catch (e) {
    console.error("Erro ao adicionar categoria: ", e);
    return null;
  }
}

// NOVA FUNÇÃO para atualizar uma categoria
export async function updateCategory(
  categoryId: string,
  data: Partial<Omit<Category, "id" | "userId">>
) {
  const db = getFirebaseDb();
  try {
    const categoryRef = doc(db, "categories", categoryId);
    await updateDoc(categoryRef, data);
    return true;
  } catch (e) {
    console.error("Erro ao atualizar categoria: ", e);
    return false;
  }
}

// NOVA FUNÇÃO para deletar uma categoria
export async function deleteCategory(categoryId: string) {
  const db = getFirebaseDb();
  try {
    const categoryRef = doc(db, "categories", categoryId);
    await deleteDoc(categoryRef);
    return true;
  } catch (e) {
    console.error("Erro ao deletar categoria: ", e);
    return false;
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
    return true;
  } catch (e) {
    console.error("Erro ao atualizar cartão: ", e);
    return false;
  }
}

export async function deleteCard(cardId: string, storagePath?: string) {
  const db = getFirebaseDb();

  if (storagePath) {
    const storage = getStorage();
    const imageRef = ref(storage, storagePath);
    try {
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Erro ao deletar imagem do Storage: ", error);
    }
  }

  try {
    const cardRef = doc(db, "cards", cardId);
    await deleteDoc(cardRef);
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
