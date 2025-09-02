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
  writeBatch, // 1. Importe o 'writeBatch' para operações em lote
} from "firebase/firestore";
import { startOfMonth, endOfMonth, addMonths } from "date-fns"; // 2. Importe o 'addMonths'
import { getFirebaseDb } from "./config";
import { getStorage, ref, deleteObject } from "firebase/storage";

// --- INTERFACES ---
export interface Expense {
  id: string;
  amount: number; // Para parcelas, este será o valor da parcela
  description: string;
  category: string;
  location: string;
  paymentMethod: "Débito/Pix" | "Crédito";
  cardId?: string;
  userId: string;
  createdAt: Timestamp;

  // Campos de Parcelamento (opcionais)
  isInstallment?: boolean;
  totalAmount?: number;
  installmentId?: string; // ID único para agrupar todas as parcelas de uma compra
  installmentNumber?: number;
  totalInstallments?: number;
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

export interface Income {
  id: string;
  amount: number;
  source: string;
  payer?: string;
  createdAt: Timestamp;
  userId: string;
}

// --- FUNÇÕES DE DESPESAS (EXPENSES) ---

// Função para despesa única
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

// 3. NOVA FUNÇÃO para despesas parceladas
export async function addInstallmentExpense(
  data: Omit<
    Expense,
    | "id"
    | "amount"
    | "isInstallment"
    | "installmentId"
    | "installmentNumber"
    | "totalInstallments"
  >,
  totalAmount: number,
  installments: number
) {
  const db = getFirebaseDb();
  const batch = writeBatch(db); // Cria um "lote" de operações
  const installmentId = crypto.randomUUID(); // Gera um ID único para toda a compra
  const installmentValue = parseFloat((totalAmount / installments).toFixed(2));

  for (let i = 1; i <= installments; i++) {
    // A data de cada parcela é calculada para os meses futuros
    const expenseDate = addMonths(data.createdAt.toDate(), i - 1);

    const newExpenseDocRef = doc(collection(db, "expenses"));

    const installmentData: Omit<Expense, "id"> = {
      ...data,
      amount: installmentValue,
      totalAmount: totalAmount,
      createdAt: Timestamp.fromDate(expenseDate),
      isInstallment: true,
      installmentId: installmentId,
      installmentNumber: i,
      totalInstallments: installments,
    };
    batch.set(newExpenseDocRef, installmentData);
  }

  try {
    await batch.commit(); // Envia todas as parcelas para o Firebase de uma só vez
    return true;
  } catch (e) {
    console.error("Erro ao adicionar despesas parceladas: ", e);
    return false;
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

// --- FUNÇÕES DE ENTRADAS (INCOME) ---

export async function addIncome(data: Omit<Income, "id">) {
  const db = getFirebaseDb();
  try {
    const docRef = await addDoc(collection(db, "incomes"), data);
    return { id: docRef.id, ...data };
  } catch (e) {
    console.error("Erro ao adicionar entrada: ", e);
    return null;
  }
}

export async function updateIncome(
  incomeId: string,
  data: Partial<Omit<Income, "id" | "userId">>
) {
  const db = getFirebaseDb();
  try {
    const incomeRef = doc(db, "incomes", incomeId);
    await updateDoc(incomeRef, data);
    return true;
  } catch (e) {
    console.error("Erro ao atualizar entrada: ", e);
    return false;
  }
}

export async function deleteIncome(incomeId: string) {
  const db = getFirebaseDb();
  try {
    const incomeRef = doc(db, "incomes", incomeId);
    await deleteDoc(incomeRef);
    return true;
  } catch (e) {
    console.error("Erro ao deletar entrada: ", e);
    return false;
  }
}

export function listenToIncomes(
  userId: string,
  month: Date,
  callback: (incomes: Income[]) => void
) {
  const db = getFirebaseDb();
  const incomesCollection = collection(db, "incomes");

  const start = startOfMonth(month);
  const end = endOfMonth(month);

  const q = query(
    incomesCollection,
    where("userId", "==", userId),
    where("createdAt", ">=", start),
    where("createdAt", "<=", end),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const incomes: Income[] = [];
    querySnapshot.forEach((doc) => {
      incomes.push({ id: doc.id, ...doc.data() } as Income);
    });
    callback(incomes);
  });
  return unsubscribe;
}
