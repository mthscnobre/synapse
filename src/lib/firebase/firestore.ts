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
import { db } from "./config";

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

// --- FUNÇÕES DE DESPESAS (EXPENSES) ---

export async function addExpense(data: Omit<Expense, "id">) {
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
