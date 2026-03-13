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
}

interface AnalysisResult {
  url: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  loadTime: number;
  checks: Check[];
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
  "On-Page": "var(--color-brand-500)",
  "Technical": "#8b5cf6",
  "Media": "#06b6d4",
  "Social": "#ec4899",
  "Content": "#10b981",
};

const RECENT_URLS_KEY = "seopro_v2_recent";

function getRecentUrls(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_URLS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentUrl(url: string) {
  try {
    const list = getRecentUrls().filter((u) => u !== url);
    list.unshift(url);
    localStorage.setItem(RECENT_URLS_KEY, JSON.stringify(list.slice(0, 5)));
  } catch {}
}

export default function MainContent() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview");
  const { incrementAnalyses } = useUser();

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url.trim())}`);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAnalyze();
  };

  // Group checks by category
  const grouped = data?.checks.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {} as Record<string, Check[]>);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Hero */}
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

      {/* Search card */}
      <div className="card p-6 animate-fade-up stagger-2" style={{ opacity: 0 }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-base"
              style={{ color: "var(--color-text-subtle)" }}
            >
              🌐
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Masukkan URL website (contoh: tokopedia.com)"
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm font-medium input-focus"
              style={{
                background: "var(--color-surface-3)",
                border: "1.5px solid var(--color-border)",
                color: "var(--color-text)",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="btn-brand px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 justify-center"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                Menganalisis...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Analisis Sekarang
              </>
            )}
          </button>
        </div>

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <span className="text-xs" style={{ color: "var(--color-text-subtle)" }}>Coba:</span>
          {["tokopedia.com", "kompas.com", "detik.com"].map((s) => (
            <button
              key={s}
              onClick={() => setUrl(s)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand-300)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-brand-600)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="p-4 rounded-2xl flex items-center gap-3 animate-fade-up"
          style={{ background: "#fff5f5", border: "1.5px solid #fecaca" }}
        >
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-medium" style={{ color: "#dc2626" }}>{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="skeleton h-40 rounded-2xl" />
            <div className="md:col-span-2 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
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
            <span style={{ color: "var(--color-text-muted)" }}>
              ⚡ Load: <span style={{ fontFamily: "var(--font-mono)" }}>{data.loadTime}ms</span>
            </span>
            <span style={{ color: "var(--color-border)" }}>|</span>
            <span style={{ color: "var(--color-text-muted)" }}>
              📊 {data.checks.filter((c) => c.status === "good").length} lulus ·{" "}
              {data.checks.filter((c) => c.status === "warning").length} perhatian ·{" "}
              {data.checks.filter((c) => c.status === "bad").length} gagal
            </span>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score */}
            <div
              className="card p-6 flex flex-col items-center justify-center gap-4"
              style={{ background: "var(--color-surface)" }}
            >
              <ScoreCircle
                score={data.totalScore}
                maxScore={data.maxScore}
                percentage={data.percentage}
              />

              {/* Category scores */}
              <div className="w-full space-y-2 mt-2">
                {Object.entries(grouped || {}).map(([cat, checks]) => {
                  const catScore = checks.reduce((a, c) => a + c.score, 0);
                  const catMax = checks.reduce((a, c) => a + c.maxScore, 0);
                  const catPct = Math.round((catScore / catMax) * 100);
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <span className="text-xs w-20 flex-shrink-0" style={{ color: "var(--color-text-subtle)" }}>
                        {cat}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--color-surface-3)" }}>
                        <div
                          className="h-full rounded-full progress-bar"
                          style={{ width: `${catPct}%`, background: CATEGORY_COLORS[cat] || "var(--color-brand-500)" }}
                        />
                      </div>
                      <span className="text-xs font-bold w-8 text-right" style={{ color: "var(--color-text-muted)" }}>
                        {catPct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checks */}
            <div className="md:col-span-2 space-y-3">
              {/* Tabs */}
              <div
                className="flex gap-1 p-1 rounded-xl w-fit"
                style={{ background: "var(--color-surface-3)" }}
              >
                {(["overview", "details"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className="px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all"
                    style={
                      activeTab === t
                        ? { background: "var(--color-surface)", color: "var(--color-brand-600)", boxShadow: "0 1px 3px rgb(0 0 0 / 0.08)" }
                        : { color: "var(--color-text-muted)" }
                    }
                  >
                    {t === "overview" ? "🔍 Checklist" : "📋 Detail"}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div className="space-y-2.5">
                  {data.checks.map((c, i) => (
                    <CheckRow key={c.id} check={c} index={i} />
                  ))}
                </div>
              )}

              {activeTab === "details" && (
                <div className="card p-5 space-y-4 animate-fade-in">
                  {[
                    { label: "Title Tag", value: data.details.title, mono: false },
                    { label: "Meta Description", value: data.details.desc, mono: false },
                    { label: "H1 Headings", value: data.details.h1.join(" | ") || "None", mono: false },
                    { label: "Canonical URL", value: data.details.canonical || "Tidak ditemukan", mono: true },
                    { label: "OG Title", value: data.details.ogTitle || "Tidak ditemukan", mono: false },
                    { label: "Robot Directive", value: data.details.robots || "Not specified", mono: true },
                    { label: "Internal Links", value: String(data.details.internalLinks), mono: true },
                    { label: "External Links", value: String(data.details.externalLinks), mono: true },
                    { label: "Word Count", value: `~${data.details.wordCount} words`, mono: true },
                    { label: "Schema Markup", value: data.details.hasSchema ? "✓ JSON-LD ditemukan" : "✕ Tidak ada", mono: false },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex gap-4 items-start">
                      <span
                        className="text-xs font-bold w-36 flex-shrink-0 pt-0.5"
                        style={{ color: "var(--color-text-subtle)" }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-xs leading-relaxed break-all"
                        style={{
                          color: "var(--color-text-muted)",
                          fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
                        }}
                      >
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

      {/* Feature cards when no result */}
      {!data && !loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up stagger-3" style={{ opacity: 0 }}>
          {[
            { icon: "⚡", title: "Analisis Cepat", desc: "Hasil audit lengkap dalam hitungan detik" },
            { icon: "📊", title: "10+ Faktor SEO", desc: "On-page, technical, social, dan content" },
            { icon: "📋", title: "Detail Lengkap", desc: "Rekomendasi spesifik untuk tiap masalah" },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="card card-hover p-5 text-center"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
                style={{ background: "var(--color-brand-50)" }}
              >
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