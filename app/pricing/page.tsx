"use client";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

const PLANS = [
  {
    id: "free",
    name: "Free",
    desc: "Untuk pemula yang baru mulai belajar SEO.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    badge: null,
    features: [
      { text: "5 analisis per bulan",      ok: true  },
      { text: "4 faktor SEO dasar",         ok: true  },
      { text: "Laporan teks",               ok: true  },
      { text: "Skor & grade",               ok: true  },
      { text: "10+ faktor SEO lanjutan",    ok: false },
      { text: "Action plan & rekomendasi",  ok: false },
      { text: "Export PDF",                 ok: false },
      { text: "Riwayat analisis",           ok: false },
      { text: "API access",                 ok: false },
    ],
    cta: "Mulai Gratis",
    ctaHref: "/analyzer",
  },
  {
    id: "pro",
    name: "Pro",
    desc: "Untuk marketer & developer yang serius soal ranking.",
    monthlyPrice: 99000,
    yearlyPrice: 79000,
    color: "#3a5cf6",
    bg: "#f0f4ff",
    border: "#c7d7fd",
    badge: "Paling Populer",
    features: [
      { text: "Analisis tak terbatas",     ok: true  },
      { text: "10+ faktor SEO lengkap",    ok: true  },
      { text: "Action plan prioritas",     ok: true  },
      { text: "Code snippet rekomendasi",  ok: true  },
      { text: "Export PDF laporan",        ok: true  },
      { text: "Riwayat 90 hari",           ok: true  },
      { text: "Priority support",          ok: true  },
      { text: "API access",                ok: false },
      { text: "White-label",               ok: false },
    ],
    cta: "Mulai Pro",
    ctaHref: "/analyzer",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    desc: "Untuk agensi & tim dengan kebutuhan skala besar.",
    monthlyPrice: null,
    yearlyPrice: null,
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
    badge: "Custom",
    features: [
      { text: "Semua fitur Pro",            ok: true  },
      { text: "Unlimited team members",     ok: true  },
      { text: "API access penuh",           ok: true  },
      { text: "White-label dashboard",      ok: true  },
      { text: "Custom domain",              ok: true  },
      { text: "SLA & uptime guarantee",     ok: true  },
      { text: "Dedicated account manager",  ok: true  },
      { text: "Onboarding & training",      ok: true  },
    ],
    cta: "Hubungi Sales",
    ctaHref: "mailto:sales@seopro.id",
  },
];

const FAQS = [
  {
    q: "Apakah ada masa trial untuk paket Pro?",
    a: "Ya! Semua paket Pro memiliki masa trial 7 hari gratis tanpa perlu kartu kredit. Kamu bisa upgrade, downgrade, atau batalkan kapan saja.",
  },
  {
    q: "Bagaimana sistem pembayaran bekerja?",
    a: "Kami menerima pembayaran via transfer bank, GoPay, OVO, dan kartu kredit/debit. Tagihan bulanan atau tahunan akan dikirim ke email yang terdaftar.",
  },
  {
    q: "Apa bedanya faktor SEO Free vs Pro?",
    a: "Paket Free menganalisis 4 faktor dasar (title, meta description, H1, alt image). Pro menganalisis 10+ faktor termasuk schema markup, canonical, OG tags, HTTPS, mobile viewport, dan lainnya.",
  },
  {
    q: "Apakah data analisis saya aman?",
    a: "Data analisis disimpan terenkripsi dan tidak pernah dibagikan ke pihak ketiga. Kamu bisa menghapus semua data kapan saja dari halaman Settings.",
  },
  {
    q: "Bisa ganti paket kapan saja?",
    a: "Tentu! Upgrade langsung aktif. Downgrade berlaku di akhir periode billing. Tidak ada penalti atau biaya tersembunyi.",
  },
];

function fmt(price: number, yearly: boolean) {
  const n = yearly ? price : price;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export default function PricingPage() {
  const [yearly, setYearly]   = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { user }              = useUser();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">

      {/* ── Hero ── */}
      <div className="text-center space-y-4 animate-fade-up">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-2"
          style={{ background: "var(--color-brand-50)", color: "var(--color-brand-600)", border: "1px solid var(--color-brand-200)" }}
        >
          💎 Harga Transparan
        </div>
        <h1
          className="text-4xl sm:text-5xl font-black leading-tight"
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
        >
          Pilih Paket yang{" "}
          <span style={{ color: "var(--color-brand-600)", fontStyle: "italic" }}>Tepat Untukmu</span>
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
          Mulai gratis, upgrade kapan saja. Tidak ada biaya tersembunyi.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="text-sm font-semibold" style={{ color: yearly ? "var(--color-text-subtle)" : "var(--color-text)" }}>Bulanan</span>
          <button
            onClick={() => setYearly(!yearly)}
            className="w-14 h-7 rounded-full transition-all relative"
            style={{ background: yearly ? "var(--color-brand-500)" : "var(--color-surface-3)", border: "1.5px solid var(--color-border)" }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all"
              style={{ left: yearly ? "calc(100% - 22px)" : "2px" }}
            />
          </button>
          <span className="text-sm font-semibold" style={{ color: yearly ? "var(--color-text)" : "var(--color-text-subtle)" }}>
            Tahunan
          </span>
          {yearly && (
            <span
              className="text-xs font-black px-2.5 py-1 rounded-full animate-fade-in"
              style={{ background: "#dcfce7", color: "#15803d" }}
            >
              Hemat 20%
            </span>
          )}
        </div>
      </div>

      {/* ── Plans grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up stagger-2" style={{ opacity: 0 }}>
        {PLANS.map((plan, i) => {
          const isCurrentPlan = user.plan === plan.id;
          const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className="relative rounded-3xl p-7 flex flex-col transition-all"
              style={{
                background: plan.bg,
                border: `2px solid ${isCurrentPlan ? plan.color : plan.border}`,
                boxShadow: plan.id === "pro"
                  ? `0 8px 40px -8px ${plan.color}30, 0 1px 3px rgb(0 0 0 / 0.06)`
                  : "0 1px 3px rgb(0 0 0 / 0.06)",
                transform: plan.id === "pro" ? "translateY(-8px)" : "none",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap"
                  style={{ background: plan.color, color: "white", boxShadow: `0 4px 12px ${plan.color}40` }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
                  style={{ background: `${plan.color}18` }}
                >
                  {plan.id === "free" ? "🆓" : plan.id === "pro" ? "⚡" : "🏢"}
                </div>
                <p className="font-black text-xl" style={{ color: "var(--color-text)" }}>{plan.name}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{plan.desc}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {price === null ? (
                  <div>
                    <p className="text-3xl font-black" style={{ color: plan.color }}>Custom</p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-subtle)" }}>Sesuai kebutuhan tim</p>
                  </div>
                ) : price === 0 ? (
                  <div>
                    <p className="text-3xl font-black" style={{ color: "var(--color-text)" }}>Gratis</p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-subtle)" }}>Selamanya</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-end gap-1">
                      <p className="text-3xl font-black" style={{ color: plan.color, fontFamily: "var(--font-display)" }}>
                        {fmt(price, yearly)}
                      </p>
                      <span className="text-sm mb-1" style={{ color: "var(--color-text-subtle)" }}>/bln</span>
                    </div>
                    {yearly && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-subtle)" }}>
                        Ditagih {fmt(price * 12, true)}/tahun
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                      style={
                        f.ok
                          ? { background: `${plan.color}18`, color: plan.color }
                          : { background: "var(--color-surface-3)", color: "var(--color-text-subtle)" }
                      }
                    >
                      {f.ok ? "✓" : "×"}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: f.ok ? "var(--color-text)" : "var(--color-text-subtle)" }}
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrentPlan ? (
                <div
                  className="w-full py-3 rounded-2xl text-sm font-black text-center"
                  style={{ background: `${plan.color}14`, color: plan.color, border: `1.5px solid ${plan.color}30` }}
                >
                  ✓ Paket Aktif
                </div>
              ) : (
                <Link
                  href={plan.ctaHref}
                  className="w-full py-3 rounded-2xl text-sm font-black text-center block transition-all"
                  style={
                    plan.id === "pro"
                      ? { background: plan.color, color: "white", boxShadow: `0 8px 24px -4px ${plan.color}50` }
                      : { background: `${plan.color}14`, color: plan.color, border: `1.5px solid ${plan.color}30` }
                  }
                  onMouseEnter={e => {
                    if (plan.id === "pro") {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px -4px ${plan.color}60`;
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (plan.id === "pro") {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px -4px ${plan.color}50`;
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }
                  }}
                >
                  {plan.cta} →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Feature comparison table ── */}
      <div className="animate-fade-up stagger-3" style={{ opacity: 0 }}>
        <h2
          className="text-2xl font-black text-center mb-8"
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
        >
          Perbandingan Fitur Lengkap
        </h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--color-surface-3)", borderBottom: "2px solid var(--color-border)" }}>
                  <th className="text-left px-6 py-4 font-bold" style={{ color: "var(--color-text-muted)", width: "40%" }}>Fitur</th>
                  {PLANS.map(p => (
                    <th key={p.id} className="px-4 py-4 font-black text-center" style={{ color: p.color }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Analisis per bulan",         "5",         "Tak terbatas", "Tak terbatas"],
                  ["Faktor SEO yang dicek",       "4",         "10+",          "10+"],
                  ["Skor & grade",                "✓",         "✓",            "✓"],
                  ["Saran perbaikan",             "—",         "✓",            "✓"],
                  ["Code snippet implementasi",   "—",         "✓",            "✓"],
                  ["Action plan prioritas",       "—",         "✓",            "✓"],
                  ["Export PDF",                  "—",         "✓",            "✓"],
                  ["Riwayat analisis",            "—",         "90 hari",      "Tak terbatas"],
                  ["API access",                  "—",         "—",            "✓"],
                  ["White-label",                 "—",         "—",            "✓"],
                  ["Priority support",            "—",         "✓",            "Dedicated"],
                ].map(([feature, ...vals], ri) => (
                  <tr
                    key={ri}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      background: ri % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-2)",
                    }}
                  >
                    <td className="px-6 py-3.5 font-medium text-xs" style={{ color: "var(--color-text)" }}>{feature}</td>
                    {vals.map((v, vi) => (
                      <td key={vi} className="px-4 py-3.5 text-center text-xs font-bold" style={{
                        color: v === "—" ? "var(--color-text-subtle)"
                          : v === "✓" || v !== "—" ? PLANS[vi].color
                          : "var(--color-text)",
                      }}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Social proof ── */}
      <div className="animate-fade-up stagger-4" style={{ opacity: 0 }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { num: "12.000+", label: "Website dianalisis" },
            { num: "4.800+",  label: "Pengguna aktif" },
            { num: "98%",     label: "Kepuasan pengguna" },
            { num: "< 3 dtk", label: "Rata-rata waktu analisis" },
          ].map(({ num, label }) => (
            <div key={label} className="card p-5 text-center">
              <p
                className="text-2xl font-black"
                style={{ color: "var(--color-brand-600)", fontFamily: "var(--font-display)" }}
              >
                {num}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-2xl mx-auto animate-fade-up stagger-5" style={{ opacity: 0 }}>
        <h2
          className="text-2xl font-black text-center mb-8"
          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
        >
          Pertanyaan Umum
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="card overflow-hidden cursor-pointer transition-all"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ border: openFaq === i ? "1.5px solid var(--color-brand-300)" : "1px solid var(--color-border)" }}
            >
              <div className="flex items-center justify-between gap-4 p-5">
                <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{faq.q}</p>
                <svg
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                  style={{
                    color: "var(--color-text-subtle)",
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                  }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openFaq === i && (
                <div
                  className="px-5 pb-5 animate-fade-in"
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  <p className="text-sm leading-relaxed pt-3" style={{ color: "var(--color-text-muted)" }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div
        className="rounded-3xl p-10 text-center animate-fade-up"
        style={{
          background: "linear-gradient(135deg, var(--color-brand-600) 0%, var(--color-brand-800) 100%)",
          boxShadow: "0 20px 60px -12px var(--color-brand-600)",
        }}
      >
        <p className="text-white text-3xl font-black mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Siap tingkatkan ranking website?
        </p>
        <p className="text-white/70 text-sm mb-6">Coba gratis sekarang, tidak perlu kartu kredit.</p>
        <Link
          href="/analyzer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-black transition-all"
          style={{ background: "white", color: "var(--color-brand-700)" }}
        >
          Mulai Analisis Gratis
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}