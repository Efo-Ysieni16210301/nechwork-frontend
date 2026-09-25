/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
import api from "../api/client";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isFullyVerified: boolean;
  refreshUser: () => Promise<void>;
  savePhoneNumber: (phoneNumber: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithTelegram: (data: Record<string, unknown>) => Promise<void>;
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
        const tokenResult = await firebaseUser.getIdTokenResult(true);
        setIsAdmin(tokenResult.claims.admin === true);
        try {
          const profile = await api.get<{ phoneVerified?: boolean; telegramVerified?: boolean } | null>("/profile");
          setIsFullyVerified(firebaseUser.emailVerified || profile.data?.phoneVerified === true || profile.data?.telegramVerified === true);
        } catch {
          setIsFullyVerified(false);
        }
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
    if (refreshedUser) {
      try {
        const profile = await api.get<{ phoneVerified?: boolean; telegramVerified?: boolean } | null>("/profile");
        setIsFullyVerified(Boolean(refreshedUser.emailVerified || profile.data?.phoneVerified === true || profile.data?.telegramVerified === true));
      } catch {
        setIsFullyVerified(false);
      }
    } else {
      setIsFullyVerified(false);
    }
  };

  const savePhoneNumber = async (phoneNumber: string) => {
    const currentProfile = await api.get<{ firstName: string; lastName: string }>("/profile");
    await api.put("/profile", {
      firstName: currentProfile.data.firstName,
      lastName: currentProfile.data.lastName,
      phoneNumber,
    });
    await refreshUser();
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
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithTelegram = useCallback(async (data: Record<string, unknown>) => {
    const response = await api.post<{ customToken: string }>("/auth/telegram", data);
    const { signInWithCustomToken } = await import("firebase/auth");
    await signInWithCustomToken(auth, response.data.customToken);
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, isFullyVerified, refreshUser, savePhoneNumber, sendVerificationEmail, login, signup, loginWithGoogle, loginWithTelegram, logout }}
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
