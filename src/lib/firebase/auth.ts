// src/lib/firebase/auth.ts - CÓDIGO COMPLETO E ATUALIZADO

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirebaseAuth } from "./config";

export async function signInWithGoogle() {
  const auth = getFirebaseAuth(); // Obtém a instância de Auth
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Usuário logado com sucesso:", user);
    return user;
  } catch (error) {
    console.error("Erro ao fazer login com o Google:", error);
    return null;
  }
}

export async function signOutUser() {
  const auth = getFirebaseAuth(); // Obtém a instância de Auth
  try {
    await signOut(auth);
    console.log("Usuário deslogado com sucesso.");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}
