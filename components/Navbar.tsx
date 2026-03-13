"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
  const { user, mounted } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.7)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 16px -4px rgb(0 0 0 / 0.08)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-brand-600)", boxShadow: "var(--shadow-brand)" }}
            >
              <span className="text-white text-lg font-bold select-none" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
                S
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight" style={{ color: "var(--color-text)" }}>
                SEO<span style={{ color: "var(--color-brand-600)" }}>.PRO</span>
              </span>
              <span className="text-[9px] font-semibold uppercase" style={{ color: "var(--color-text-subtle)", letterSpacing: "0.15em" }}>
                Audit Platform
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {["Analyzer", "Docs", "Pricing"].map((item) => (
              <button
                key={item}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={e => { const el = e.target as HTMLElement; el.style.color = "var(--color-text)"; el.style.background = "var(--color-surface-3)"; }}
                onMouseLeave={e => { const el = e.target as HTMLElement; el.style.color = "var(--color-text-muted)"; el.style.background = "transparent"; }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* User avatar button */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-2xl transition-all"
            style={{ background: "var(--color-surface-3)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-brand-50)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface-3)"; }}
          >
            <div className="relative">
              {/* ✅ Render identical placeholder on server + first client paint.
                  Swap to real avatar only after mount (localStorage read). */}
              {mounted && user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover"
                  style={{ border: "2px solid var(--color-surface)" }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "var(--color-brand-500)" }}
                >
                  {/* Empty on server, initial letter after mount */}
                  {mounted ? (user.name?.[0]?.toUpperCase() || "U") : ""}
                </div>
              )}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: "var(--color-success)", borderColor: "var(--color-surface)" }}
              />
            </div>
            <span className="text-sm font-semibold pr-1 hidden sm:block" style={{ color: "var(--color-text)" }}>
              {mounted ? user.name : ""}
            </span>
            <svg className="w-3.5 h-3.5 hidden sm:block" style={{ color: "var(--color-text-subtle)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </nav>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}