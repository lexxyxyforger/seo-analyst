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

export function useUser() {
  // Lazy initializer runs once on mount — no setState inside effect needed
  const [user, setUser] = useState<UserProfile>(readUserFromStorage);
  const mounted = typeof window !== "undefined";

  const syncUser = useCallback(() => {
    setUser(readUserFromStorage());
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) syncUser();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("seopro:user-updated", syncUser);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("seopro:user-updated", syncUser);
    };
  }, [syncUser]);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      // Auto-update avatar if seed changed
      if (updates.avatarSeed && !updates.avatar) {
        next.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${updates.avatarSeed}`;
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("seopro:user-updated"));
      } catch {}
      return next;
    });
  }, []);

  const incrementAnalyses = useCallback(() => {
    setUser((prev) => {
      const next = { ...prev, analyses: (prev.analyses || 0) + 1 };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { user, updateUser, incrementAnalyses, mounted };
}