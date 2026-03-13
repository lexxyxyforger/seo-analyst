"use client";
import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatar: string | null;
  avatarSeed: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
  analyses: number;
}

const DEFAULT_USER: UserProfile = {
  name: "Pengguna",
  email: "hello@seopro.id",
  bio: "SEO enthusiast & digital marketer",
  avatar: null,
  avatarSeed: "default",
  plan: "free",
  createdAt: new Date().toISOString(),
  analyses: 0,
};

const STORAGE_KEY = "seopro_v2_user";

function readUserFromStorage(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_USER, ...JSON.parse(saved) };
    const initial: UserProfile = {
      ...DEFAULT_USER,
      avatarSeed: "Pengguna",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pengguna",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return DEFAULT_USER;
  }
}

function writeUserToStorage(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

export function useUser() {
  // ✅ Always start with DEFAULT_USER so server & first client render match.
  // localStorage is read only after mount (useEffect) to avoid hydration mismatch.
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Runs only on client after hydration — safe to read localStorage here
    queueMicrotask(() => {
      setUser(readUserFromStorage());
      setMounted(true);
    });

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setUser(readUserFromStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      if (updates.avatarSeed && !updates.avatar) {
        next.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${updates.avatarSeed}`;
      }
      // ✅ Persist outside the updater via queueMicrotask — keeps updater pure
      queueMicrotask(() => writeUserToStorage(next));
      return next;
    });
  }, []);

  const incrementAnalyses = useCallback(() => {
    setUser((prev) => {
      const next = { ...prev, analyses: (prev.analyses || 0) + 1 };
      queueMicrotask(() => writeUserToStorage(next));
      return next;
    });
  }, []);

  return { user, updateUser, incrementAnalyses, mounted };
}
