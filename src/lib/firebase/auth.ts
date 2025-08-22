// src/lib/firebase/auth.ts

// Adicione 'signOut' à lista de importações abaixo
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
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
  try {
    await signOut(auth);
    console.log("Usuário deslogado com sucesso.");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}
