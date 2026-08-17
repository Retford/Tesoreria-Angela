import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, firebaseConfigured } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth!, email, password);
  }

  async function register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth!, email, password);
  }

  async function logout() {
    return signOut(auth!);
  }

  return { user, loading, login, register, logout };
}
