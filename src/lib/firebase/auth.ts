// src/lib/firebase/auth.ts - CÓDIGO COMPLETO E ATUALIZADO

import {
  createUserWithEmailAndPassword as firebaseSignUp,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut,
  updateProfile, // 1. Importe a função updateProfile
  type AuthError,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";

type AuthResponse = {
  user: User | null;
  error: AuthError | null;
};

// 2. A função agora aceita 'name'
export async function signUpWithEmailAndPassword(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const auth = getFirebaseAuth();
  try {
    const userCredential = await firebaseSignUp(auth, email, password);

    // 3. Após criar o usuário, atualiza o perfil dele com o nome
    await updateProfile(userCredential.user, { displayName: name });

    return { user: userCredential.user, error: null };
  } catch (e) {
    const error = e as AuthError;
    return { user: null, error: error };
  }
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<AuthResponse> {
  const auth = getFirebaseAuth();
  try {
    const userCredential = await firebaseSignIn(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (e) {
    const error = e as AuthError;
    return { user: null, error: error };
  }
}

export async function signOutUser() {
  const auth = getFirebaseAuth();
  try {
    await signOut(auth);
    console.log("Usuário deslogado com sucesso.");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}
