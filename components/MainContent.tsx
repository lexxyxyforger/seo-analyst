"use client";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import ScoreCircle from "./ScoreCircle";
import CheckRow from "./CheckRow";

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

interface ActionItem {
  id: number;
  name: string;
  priority: "high" | "medium";
  pointsToGain: number;
  quickFix: string | null;
}

interface AnalysisResult {
  url: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  loadTime: number;
  checks: Check[];
  actionPlan: ActionItem[];
  details: {
    title: string;
    desc: string;
    h1: string[];
    h2: string[];
    imagesCount: number;
    missingAlt: number;
    canonical: string;
    robots: string;
    ogTitle: string;
    ogImage: string;
    internalLinks: number;
    externalLinks: number;
    wordCount: number;
    hasSchema: boolean;
    isHttps: boolean;
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "On-Page":   "var(--color-brand-500)",
  "Technical": "#8b5cf6",
  "Media":     "#06b6d4",
  "Social":    "#ec4899",
  "Content":   "#10b981",
};

const RECENT_URLS_KEY = "seopro_v2_recent";

function saveRecentUrl(url: string) {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(RECENT_URLS_KEY) || "[]");
    const updated = [url, ...list.filter((u) => u !== url)].slice(0, 5);
    localStorage.setItem(RECENT_URLS_KEY, JSON.stringify(updated));
  } catch {}
}

type Tab = "overview" | "action" | "details";

export default function MainContent() {
  const [url, setUrl]       = useState("");
  const [data, setData]     = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { incrementAnalyses } = useUser();

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    setActiveTab("overview");
    try {
      const res    = await fetch(`/api/analyze?url=${encodeURIComponent(url.trim())}`);
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
      saveRecentUrl(url.trim());
      incrementAnalyses();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Gagal menganalisis URL. Coba lagi.");
      } else {
        setError("Gagal menganalisis URL. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const grouped = data?.checks.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {} as Record<string, Check[]>);

  const highPriority = data?.actionPlan.filter(a => a.priority === "high") || [];
  const medPriority  = data?.actionPlan.filter(a => a.priority === "medium") || [];
  const totalGainable = data?.actionPlan.reduce((s, a) => s + a.pointsToGain, 0) || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      {/* ── Hero ── */}
      <div className="text-center space-y-3 animate-fade-up">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
          style={{ background: "var(--color-brand-50)", color: "var(--color-brand-600)", border: "1px solid var(--color-brand-200)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-ring" style={{ background: "var(--color-brand-500)" }} />
          Live SEO Analyzer
        </div>
        <h1
          className="text-4xl sm:text-5xl font-black leading-tight"
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
        >
          Audit SEO Website{" "}
          <span style={{ color: "var(--color-brand-600)", fontStyle: "italic" }}>Secara Mendalam</span>
        </h1>
        <p className="text-base max-w-lg mx-auto" style={{ color: "var(--color-text-muted)" }}>
          Analisis 10+ faktor SEO penting dari website kamu dalam hitungan detik.
        </p>
      </div>

      {/* ── Search card ── */}
      <div className="card p-6 animate-fade-up stagger-2" style={{ opacity: 0 }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base" style={{ color: "var(--color-text-subtle)" }}>
              🌐
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Masukkan URL website (contoh: tokopedia.com)"
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm font-medium input-focus"
              style={{ background: "var(--color-surface-3)", border: "1.5px solid var(--color-border)", color: "var(--color-text)", fontFamily: "var(--font-body)" }}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="btn-brand px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 justify-center"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />Menganalisis...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>Analisis Sekarang</>
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <span className="text-xs" style={{ color: "var(--color-text-subtle)" }}>Coba:</span>
          {["tokopedia.com", "kompas.com", "detik.com"].map((s) => (
            <button
              key={s} onClick={() => setUrl(s)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--color-brand-300)"; el.style.color = "var(--color-brand-600)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--color-border)"; el.style.color = "var(--color-text-muted)"; }}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="p-4 rounded-2xl flex items-center gap-3 animate-fade-up" style={{ background: "#fff5f5", border: "1.5px solid #fecaca" }}>
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-medium" style={{ color: "#dc2626" }}>{error}</p>
        </div>
      )}

      {/* ── Skeleton ── */}
      {loading && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="skeleton h-52 rounded-2xl" />
            <div className="md:col-span-2 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
            </div>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {data && !loading && (
        <div className="space-y-6 animate-fade-in">

          {/* Summary bar */}
          <div
            className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-2xl text-xs font-medium"
            style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-text-muted)" }}>
              🌐 <span className="font-semibold" style={{ color: "var(--color-brand-600)" }}>{data.url}</span>
            </span>
            <span style={{ color: "var(--color-border)" }}>|</span>
            <span style={{ color: "var(--color-text-muted)" }}>⚡ <span style={{ fontFamily: "var(--font-mono)" }}>{data.loadTime}ms</span></span>
            <span style={{ color: "var(--color-border)" }}>|</span>
            <span style={{ color: "#22c55e", fontWeight: 700 }}>{data.checks.filter(c => c.status === "good").length} lulus</span>
            <span style={{ color: "#f59e0b", fontWeight: 700 }}>{data.checks.filter(c => c.status === "warning").length} perhatian</span>
            <span style={{ color: "#ef4444", fontWeight: 700 }}>{data.checks.filter(c => c.status === "bad").length} gagal</span>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Score card */}
            <div className="card p-6 flex flex-col items-center justify-center gap-4">
              <ScoreCircle score={data.totalScore} maxScore={data.maxScore} percentage={data.percentage} />
              <div className="w-full space-y-2 mt-1">
                {Object.entries(grouped || {}).map(([cat, checks]) => {
                  const catScore = checks.reduce((a, c) => a + c.score, 0);
                  const catMax   = checks.reduce((a, c) => a + c.maxScore, 0);
                  const catPct   = Math.round((catScore / catMax) * 100);
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <span className="text-xs w-20 flex-shrink-0" style={{ color: "var(--color-text-subtle)" }}>{cat}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--color-surface-3)" }}>
                        <div className="h-full rounded-full progress-bar" style={{ width: `${catPct}%`, background: CATEGORY_COLORS[cat] || "var(--color-brand-500)" }} />
                      </div>
                      <span className="text-xs font-bold w-8 text-right" style={{ color: "var(--color-text-muted)" }}>{catPct}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Points gap callout */}
              {data.percentage < 100 && (
                <div
                  className="w-full mt-1 p-3 rounded-xl text-center"
                  style={{ background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)" }}
                >
                  <p className="text-xs font-black" style={{ color: "var(--color-brand-700)" }}>
                    🎯 +{totalGainable} poin menuju 100%
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--color-brand-600)" }}>
                    {data.actionPlan.length} item perlu diperbaiki
                  </p>
                </div>
              )}
              {data.percentage === 100 && (
                <div className="w-full mt-1 p-3 rounded-xl text-center" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <p className="text-xs font-black" style={{ color: "#15803d" }}>🏆 Skor sempurna! Website kamu sudah optimal.</p>
                </div>
              )}
            </div>

            {/* Tabs + content */}
            <div className="md:col-span-2 space-y-3">
              {/* Tab bar */}
              <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--color-surface-3)" }}>
                {([
                  { id: "overview", label: "🔍 Checklist" },
                  { id: "action",   label: `🚀 Action Plan${data.actionPlan.length > 0 ? ` (${data.actionPlan.length})` : ""}` },
                  { id: "details",  label: "📋 Detail" },
                ] as { id: Tab; label: string }[]).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    style={activeTab === t.id
                      ? { background: "var(--color-surface)", color: "var(--color-brand-600)", boxShadow: "0 1px 3px rgb(0 0 0 / 0.08)" }
                      : { color: "var(--color-text-muted)" }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ── TAB: Checklist ── */}
              {activeTab === "overview" && (
                <div className="space-y-2.5">
                  {data.checks.map((c, i) => <CheckRow key={c.id} check={c} index={i} />)}
                </div>
              )}

              {/* ── TAB: Action Plan ── */}
              {activeTab === "action" && (
                <div className="space-y-4 animate-fade-in">
                  {data.actionPlan.length === 0 ? (
                    <div className="card p-8 text-center">
                      <div className="text-4xl mb-3">🏆</div>
                      <p className="font-black text-lg" style={{ color: "var(--color-text)" }}>Skor Sempurna!</p>
                      <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>Semua faktor SEO sudah optimal. Pertahankan!</p>
                    </div>
                  ) : (
                    <>
                      {/* Header callout */}
                      <div
                        className="p-4 rounded-2xl flex items-center gap-4"
                        style={{ background: "linear-gradient(135deg, var(--color-brand-50), #ede9fe)", border: "1.5px solid var(--color-brand-200)" }}
                      >
                        <div className="text-3xl">🎯</div>
                        <div>
                          <p className="font-black text-sm" style={{ color: "var(--color-brand-800)" }}>
                            Perbaiki {data.actionPlan.length} item ini untuk mencapai skor 100%
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--color-brand-600)" }}>
                            Total potensi kenaikan: <strong>+{totalGainable} poin</strong> · Skor sekarang: {data.totalScore}/{data.maxScore}
                          </p>
                        </div>
                      </div>

                      {/* High priority */}
                      {highPriority.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
                            <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#ef4444" }}>Prioritas Tinggi</p>
                          </div>
                          {highPriority.map((item, i) => (
                            <ActionCard key={item.id} item={item} index={i} />
                          ))}
                        </div>
                      )}

                      {/* Medium priority */}
                      {medPriority.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
                            <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#f59e0b" }}>Prioritas Sedang</p>
                          </div>
                          {medPriority.map((item, i) => (
                            <ActionCard key={item.id} item={item} index={i + highPriority.length} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── TAB: Details ── */}
              {activeTab === "details" && (
                <div className="card p-5 space-y-4 animate-fade-in">
                  {[
                    { label: "Title Tag",        value: data.details.title,                                 mono: false },
                    { label: "Meta Description", value: data.details.desc,                                  mono: false },
                    { label: "H1 Headings",      value: data.details.h1.join(" | ") || "None",             mono: false },
                    { label: "Canonical URL",    value: data.details.canonical || "Tidak ditemukan",       mono: true  },
                    { label: "OG Title",         value: data.details.ogTitle || "Tidak ditemukan",         mono: false },
                    { label: "Robot Directive",  value: data.details.robots || "Not specified",            mono: true  },
                    { label: "Internal Links",   value: String(data.details.internalLinks),                mono: true  },
                    { label: "External Links",   value: String(data.details.externalLinks),                mono: true  },
                    { label: "Word Count",       value: `~${data.details.wordCount} kata`,                 mono: true  },
                    { label: "Schema Markup",    value: data.details.hasSchema ? "✓ JSON-LD ditemukan" : "✕ Tidak ada", mono: false },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex gap-4 items-start" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
                      <span className="text-xs font-bold w-36 flex-shrink-0 pt-0.5" style={{ color: "var(--color-text-subtle)" }}>{label}</span>
                      <span className="text-xs leading-relaxed break-all" style={{ color: "var(--color-text-muted)", fontFamily: mono ? "var(--font-mono)" : "var(--font-body)" }}>
                        {value || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state features ── */}
      {!data && !loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up stagger-3" style={{ opacity: 0 }}>
          {[
            { icon: "⚡", title: "Analisis Cepat", desc: "Hasil audit lengkap dalam hitungan detik" },
            { icon: "📊", title: "10+ Faktor SEO", desc: "On-page, technical, social, dan content" },
            { icon: "🎯", title: "Action Plan", desc: "Saran spesifik + code snippet cara implementasi" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card card-hover p-5 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3" style={{ background: "var(--color-brand-50)" }}>
                {icon}
              </div>
              <p className="font-bold text-sm mb-1" style={{ color: "var(--color-text)" }}>{title}</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Action Card sub-component ── */
function ActionCard({ item, index }: { item: ActionItem; index: number }) {
  const [showCode, setShowCode] = useState(false);
  const isHigh = item.priority === "high";

  return (
    <div
      className={`rounded-2xl overflow-hidden animate-fade-up stagger-${Math.min(index + 1, 10)}`}
      style={{
        border: `1.5px solid ${isHigh ? "#fecaca" : "#fde68a"}`,
        background: isHigh ? "#fff5f5" : "#fffbeb",
        opacity: 0,
      }}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Priority dot */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
          style={{
            background: isHigh ? "#fee2e2" : "#fef9c3",
            color: isHigh ? "#dc2626" : "#b45309",
            border: `1.5px solid ${isHigh ? "#fca5a5" : "#fde68a"}`,
          }}
        >
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{item.name}</p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Perbaikan ini memberikan <strong>+{item.pointsToGain} poin</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[10px] font-black px-2 py-1 rounded-lg"
            style={{
              background: isHigh ? "#fee2e2" : "#fef9c3",
              color: isHigh ? "#dc2626" : "#b45309",
            }}
          >
            {isHigh ? "🔴 Tinggi" : "🟡 Sedang"}
          </span>
          {item.quickFix && (
            <button
              onClick={() => setShowCode(!showCode)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
              style={{ background: "var(--color-brand-100)", color: "var(--color-brand-700)" }}
            >
              {showCode ? "Tutup" : "Lihat kode"}
            </button>
          )}
        </div>
      </div>

      {/* Code snippet */}
      {showCode && item.quickFix && (
        <div className="animate-fade-in" style={{ borderTop: `1px solid ${isHigh ? "#fca5a5" : "#fde68a"}` }}>
          <div className="rounded-xl overflow-hidden mx-4 mb-4 mt-1" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
            <div className="flex items-center justify-between px-4 py-2" style={{ background: "#1e293b", borderBottom: "1px solid #334155" }}>
              <div className="flex gap-1.5">
                {["#ef4444","#f59e0b","#22c55e"].map(c => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
              </div>
              <span className="text-[9px] font-bold" style={{ color: "#64748b" }}>Quick Fix</span>
            </div>
            <pre className="px-4 py-3 text-[11px] leading-relaxed overflow-x-auto" style={{ color: "#7dd3fc", fontFamily: "var(--font-mono)", margin: 0 }}>
              <code>{item.quickFix}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}