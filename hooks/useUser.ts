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
  if (typeof window === "undefined") return DEFAULT_USER;
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
  const [user, setUser] = useState<UserProfile>(readUserFromStorage);

  // ✅ Only sync from OTHER tabs via storage event — same-tab is handled
  // directly by setUser, so no custom event needed (avoids cross-component
  // setState-during-render).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setUser(readUserFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    // ✅ Pure state update first — NO side effects inside the updater
    setUser((prev) => {
      const next = { ...prev, ...updates };
      if (updates.avatarSeed && !updates.avatar) {
        next.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${updates.avatarSeed}`;
      }
      return next;
    });
    // ✅ Persist to localStorage AFTER the state update, outside the updater
    // Use queueMicrotask so it runs after React has committed the state
    queueMicrotask(() => {
      const current = readUserFromStorage();
      const next = { ...current, ...updates };
      if (updates.avatarSeed && !updates.avatar) {
        next.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${updates.avatarSeed}`;
      }
      writeUserToStorage(next);
    });
  }, []);

  const incrementAnalyses = useCallback(() => {
    setUser((prev) => {
      const next = { ...prev, analyses: (prev.analyses || 0) + 1 };
      // ✅ Same pattern: persist outside updater
      queueMicrotask(() => writeUserToStorage(next));
      return next;
    });
  }, []);

  return { user, updateUser, incrementAnalyses };
}