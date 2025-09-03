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
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { startOfMonth, endOfMonth, addMonths } from "date-fns";
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
  notes?: string;
  isInstallment?: boolean;
  installmentNumber?: number;
  totalInstallments?: number;
  totalAmount?: number;
  installmentId?: string;
  purchaseDate?: Timestamp;
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
  payer: string;
  createdAt: Timestamp;
  userId: string;
}

export interface Bill {
  id: string;
  description: string;
  amount: number;
  dueDay: number; // Dia do mês (1-31)
  category: string;
  isActive: boolean;
  userId: string;
}

// --- FUNÇÕES DE DESPESAS (EXPENSES) ---
// ... (código existente de despesas) ...
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

export async function addInstallmentExpense(
  data: Omit<
    Expense,
    | "id"
    | "amount"
    | "isInstallment"
    | "installmentNumber"
    | "installmentId"
    | "purchaseDate"
  > & {
    totalAmount: number;
    totalInstallments: number;
  }
) {
  const db = getFirebaseDb();
  const batch = writeBatch(db);
  const installmentId = doc(collection(db, "expenses")).id;
  const purchaseDate = data.createdAt;

  const installmentValue = data.totalAmount / data.totalInstallments;

  for (let i = 1; i <= data.totalInstallments; i++) {
    const expenseDate = addMonths(purchaseDate.toDate(), i - 1);
    const newExpenseRef = doc(collection(db, "expenses"));

    const installmentData: Omit<Expense, "id"> = {
      ...data,
      amount: installmentValue,
      createdAt: Timestamp.fromDate(expenseDate),
      isInstallment: true,
      installmentNumber: i,
      totalInstallments: data.totalInstallments,
      totalAmount: data.totalAmount,
      installmentId: installmentId,
      purchaseDate: purchaseDate,
    };

    batch.set(newExpenseRef, installmentData);
  }

  try {
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Erro ao adicionar despesa parcelada: ", error);
    return false;
  }
}

export async function deleteInstallmentExpense(
  installmentId: string,
  userId: string
) {
  const db = getFirebaseDb();
  const expensesCollection = collection(db, "expenses");

  const q = query(
    expensesCollection,
    where("userId", "==", userId),
    where("installmentId", "==", installmentId)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return true;
    }

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Erro ao deletar grupo de parcelas: ", error);
    return false;
  }
}

// --- FUNÇÕES DE CATEGORIAS (CATEGORIES) ---
// ... (código existente de categorias) ...
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
    await deleteDoc(doc(db, "categories", categoryId));
    return true;
  } catch (e) {
    console.error("Erro ao deletar categoria: ", e);
    return false;
  }
}

// --- FUNÇÕES DE CARTÕES (CARDS) ---
// ... (código existente de cartões) ...
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
// ... (código existente de entradas) ...
export function listenToIncomes(
  userId: string,
  month: Date,
  callback: (incomes: Income[]) => void
) {
  const db = getFirebaseDb();
  const start = startOfMonth(month);
  const end = endOfMonth(month);

  const q = query(
    collection(db, "incomes"),
    where("userId", "==", userId),
    where("createdAt", ">=", start),
    where("createdAt", "<=", end),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (querySnapshot) => {
    const incomesData: Income[] = [];
    querySnapshot.forEach((doc) => {
      incomesData.push({ id: doc.id, ...doc.data() } as Income);
    });
    callback(incomesData);
  });
}

export async function addIncome(data: Omit<Income, "id">) {
  const db = getFirebaseDb();
  try {
    const docRef = await addDoc(collection(db, "incomes"), data);
    return docRef.id;
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
    await deleteDoc(doc(db, "incomes", incomeId));
    return true;
  } catch (e) {
    console.error("Erro ao deletar entrada: ", e);
    return false;
  }
}

// --- FUNÇÕES DE CONTAS A PAGAR (BILLS) ---

export async function addBill(data: Omit<Bill, "id">) {
  const db = getFirebaseDb();
  try {
    const docRef = await addDoc(collection(db, "bills"), data);
    return { id: docRef.id, ...data };
  } catch (e) {
    console.error("Erro ao adicionar conta a pagar: ", e);
    return null;
  }
}

export async function updateBill(
  billId: string,
  data: Partial<Omit<Bill, "id" | "userId">>
) {
  const db = getFirebaseDb();
  try {
    const billRef = doc(db, "bills", billId);
    await updateDoc(billRef, data);
    return true;
  } catch (e) {
    console.error("Erro ao atualizar conta a pagar: ", e);
    return false;
  }
}

export async function deleteBill(billId: string) {
  const db = getFirebaseDb();
  try {
    await deleteDoc(doc(db, "bills", billId));
    return true;
  } catch (e) {
    console.error("Erro ao deletar conta a pagar: ", e);
    return false;
  }
}

export function listenToBills(
  userId: string,
  callback: (bills: Bill[]) => void
) {
  const db = getFirebaseDb();
  const billsCollection = collection(db, "bills");
  const q = query(
    billsCollection,
    where("userId", "==", userId),
    orderBy("dueDay")
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const bills: Bill[] = [];
    querySnapshot.forEach((doc) => {
      bills.push({ id: doc.id, ...doc.data() } as Bill);
    });
    callback(bills);
  });
  return unsubscribe;
}
