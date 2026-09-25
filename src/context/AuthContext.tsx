/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isFullyVerified: boolean;
  refreshUser: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFullyVerified, setIsFullyVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult();
        setIsAdmin(tokenResult.claims.admin === true);
        setIsFullyVerified(firebaseUser.emailVerified && Boolean(firebaseUser.phoneNumber));
      } else {
        setIsAdmin(false);
        setIsFullyVerified(false);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    const refreshedUser = auth.currentUser;
    setUser(refreshedUser);
    setIsFullyVerified(Boolean(refreshedUser?.emailVerified && refreshedUser.phoneNumber));
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error("You must be signed in.");
    await sendEmailVerification(auth.currentUser);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, isFullyVerified, refreshUser, sendVerificationEmail, login, signup, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
