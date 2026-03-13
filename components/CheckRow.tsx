"use client";
import { useState } from "react";

interface Check {
  id: number;
  category: string;
  name: string;
  score: number;
  maxScore: number;
  status: "good" | "warning" | "bad";
  info: string;
  detail: string;
}

const STATUS_CONFIG = {
  good: { icon: "✓", color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", label: "Baik" },
  warning: { icon: "!", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", label: "Perlu Perhatian" },
  bad: { icon: "✕", color: "#ef4444", bg: "#fff5f5", border: "#fecaca", label: "Buruk" },
};

const CATEGORY_ICONS: Record<string, string> = {
  "On-Page": "📄",
  "Technical": "⚙️",
  "Media": "🖼",
  "Social": "📣",
  "Content": "✍️",
};

export default function CheckRow({ check, index }: { check: Check; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[check.status];
  const pct = Math.round((check.score / check.maxScore) * 100);

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all cursor-pointer animate-fade-up stagger-${Math.min(index + 1, 10)}`}
      style={{
        border: `1.5px solid ${expanded ? cfg.border : "var(--color-border)"}`,
        background: expanded ? cfg.bg : "var(--color-surface)",
        opacity: 0,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Status icon */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
          style={{ background: cfg.bg, color: cfg.color, border: `1.5px solid ${cfg.border}` }}
        >
          {cfg.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
              {check.name}
            </span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "var(--color-surface-3)", color: "var(--color-text-subtle)" }}
            >
              {CATEGORY_ICONS[check.category]} {check.category}
            </span>
          </div>
          {/* Progress bar */}
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--color-surface-3)" }}
          >
            <div
              className="h-full rounded-full progress-bar"
              style={{ width: `${pct}%`, background: cfg.color }}
            />
          </div>
        </div>

        {/* Score & info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-lg font-mono"
            style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
          >
            {check.info}
          </span>
          <span className="text-xs font-black" style={{ color: cfg.color }}>
            {check.score}/{check.maxScore}
          </span>
          <svg
            className="w-4 h-4 transition-transform flex-shrink-0"
            style={{ color: "var(--color-text-subtle)", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-4 pb-4 animate-fade-in"
          style={{ borderTop: `1px solid ${cfg.border}` }}
        >
          <div className="pt-3 flex items-start gap-2">
            <span className="text-xs" style={{ color: cfg.color }}>ℹ</span>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
              {check.detail}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded-md font-bold"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              {cfg.label}
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
              Skor: {check.score} dari {check.maxScore} poin
            </span>
          </div>
        </div>
      )}
    </div>
  );
}