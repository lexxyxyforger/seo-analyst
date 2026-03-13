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
  recommendations: string[];
  howToFix: string | null;
  docsUrl?: string;
}

const STATUS_CONFIG = {
  good:    { icon: "✓", color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", label: "Optimal",          pill: "#dcfce7" },
  warning: { icon: "!", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", label: "Perlu Perhatian",   pill: "#fef9c3" },
  bad:     { icon: "✕", color: "#ef4444", bg: "#fff5f5", border: "#fecaca", label: "Perlu Diperbaiki",  pill: "#fee2e2" },
};

const CATEGORY_ICONS: Record<string, string> = {
  "On-Page":   "📄",
  "Technical": "⚙️",
  "Media":     "🖼",
  "Social":    "📣",
  "Content":   "✍️",
};

export default function CheckRow({ check, index }: { check: Check; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[check.status];
  const pct = Math.round((check.score / check.maxScore) * 100);
  const pointsToGain = check.maxScore - check.score;

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all animate-fade-up stagger-${Math.min(index + 1, 10)}`}
      style={{
        border: `1.5px solid ${expanded ? cfg.border : "var(--color-border)"}`,
        background: expanded ? cfg.bg : "var(--color-surface)",
        opacity: 0,
      }}
    >
      {/* ── Header row (always visible) ── */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Status icon */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
          style={{ background: cfg.pill, color: cfg.color, border: `1.5px solid ${cfg.border}` }}
        >
          {cfg.icon}
        </div>

        {/* Name + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
              {check.name}
            </span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "var(--color-surface-3)", color: "var(--color-text-subtle)" }}
            >
              {CATEGORY_ICONS[check.category]} {check.category}
            </span>
            {/* Points to gain badge — only show if not perfect */}
            {check.status !== "good" && (
              <span
                className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
                style={{ background: cfg.pill, color: cfg.color }}
              >
                +{pointsToGain} poin
              </span>
            )}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-surface-3)" }}>
            <div
              className="h-full rounded-full progress-bar"
              style={{ width: `${pct}%`, background: cfg.color }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg hidden sm:block"
            style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
          >
            {check.info}
          </span>
          <span className="text-xs font-black w-9 text-right" style={{ color: cfg.color }}>
            {check.score}/{check.maxScore}
          </span>
          <svg
            className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
            style={{ color: "var(--color-text-subtle)", transform: expanded ? "rotate(180deg)" : "rotate(0)" }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div
          className="animate-fade-in"
          style={{ borderTop: `1px solid ${cfg.border}` }}
        >
          {/* Current value */}
          <div className="px-5 pt-4 pb-2">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--color-text-subtle)" }}>
              Nilai saat ini
            </p>
            <p
              className="text-xs leading-relaxed break-all"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", background: "rgb(0 0 0 / 0.03)", padding: "8px 12px", borderRadius: "10px" }}
            >
              {check.detail}
            </p>
          </div>

          {/* Recommendations */}
          {check.recommendations.length > 0 && (
            <div className="px-5 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2.5" style={{ color: "var(--color-text-subtle)" }}>
                {check.status === "good" ? "✅ Tips lanjutan" : "💡 Saran perbaikan"}
              </p>
              <ul className="space-y-2">
                {check.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0"
                      style={{ background: cfg.pill, color: cfg.color }}
                    >
                      {check.status === "good" ? "★" : i + 1}
                    </span>
                    <span
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* How to fix — code snippet */}
          {check.howToFix && (
            <div className="px-5 pb-4">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--color-text-subtle)" }}>
                🔧 Cara implementasi
              </p>
              <div
                className="relative rounded-xl overflow-hidden"
                style={{ background: "#0f172a", border: "1px solid #1e293b" }}
              >
                <div
                  className="flex items-center justify-between px-4 py-2"
                  style={{ background: "#1e293b", borderBottom: "1px solid #334155" }}
                >
                  <div className="flex gap-1.5">
                    {["#ef4444","#f59e0b","#22c55e"].map(c => (
                      <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: "#64748b" }}>HTML</span>
                </div>
                <pre
                  className="px-4 py-3 text-[11px] leading-relaxed overflow-x-auto"
                  style={{ color: "#7dd3fc", fontFamily: "var(--font-mono)", margin: 0 }}
                >
                  <code>{check.howToFix}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Footer: status badge + doc link */}
          <div
            className="px-5 py-3 flex items-center justify-between gap-3"
            style={{ borderTop: `1px solid ${cfg.border}`, background: "rgb(0 0 0 / 0.02)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] px-2.5 py-1 rounded-lg font-black"
                style={{ background: cfg.pill, color: cfg.color, border: `1px solid ${cfg.border}` }}
              >
                {cfg.label}
              </span>
              <span className="text-[10px]" style={{ color: "var(--color-text-subtle)" }}>
                Skor: {check.score}/{check.maxScore} poin
                {check.status !== "good" && ` · +${pointsToGain} poin jika diperbaiki`}
              </span>
            </div>
            {check.docsUrl && (
              <a
                href={check.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-bold transition-opacity hover:opacity-70"
                style={{ color: "var(--color-brand-600)" }}
                onClick={e => e.stopPropagation()}
              >
                Dokumentasi Google
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}