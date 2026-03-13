"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/useUser";

const AVATAR_SEEDS = [
  "cosmic", "nova", "pixel", "wave", "zen", "spark", "atlas", "luna",
  "orion", "mars", "echo", "storm", "frost", "dusk", "bloom", "drift",
];

const PLAN_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  free: { label: "Free", color: "#64748b", bg: "#f1f5f9" },
  pro: { label: "Pro", color: "#4f74f9", bg: "#e0e9ff" },
  enterprise: { label: "Enterprise", color: "#7c3aed", bg: "#ede9fe" },
};

interface Props {
  onClose: () => void;
}

type Tab = "profile" | "settings" | "billing";

export default function ProfileModal({ onClose }: Props) {
  const { user, updateUser } = useUser();
  const [tab, setTab] = useState<Tab>("profile");

  // ✅ Initialize directly — no setState inside useEffect
  const [form, setForm] = useState({ name: user.name, email: user.email, bio: user.bio });
  const [selectedSeed, setSelectedSeed] = useState(user.avatarSeed || "default");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("seopro_theme") || "light" : "light"
  );
  const [notifs, setNotifs] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("seopro_notifs") !== "false" : true
  );
  const [reports, setReports] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("seopro_reports") !== "false" : true
  );
  const backdropRef = useRef<HTMLDivElement>(null);

  // ✅ Only side-effect: lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateUser({ name: form.name, email: form.email, bio: form.bio, avatarSeed: selectedSeed });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("seopro_theme", theme);
    localStorage.setItem("seopro_notifs", String(notifs));
    localStorage.setItem("seopro_reports", String(reports));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSeed}`;
  const plan = PLAN_LABELS[user.plan] || PLAN_LABELS.free;
  const joinDate = new Date(user.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long" });

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: "profile", icon: "👤", label: "Profil" },
    { id: "settings", icon: "⚙️", label: "Settings" },
    { id: "billing", icon: "💎", label: "Billing" },
  ];

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop animate-fade-in"
      onClick={handleBackdrop}
    >
      <div
        className="card w-full max-w-lg animate-fade-up overflow-hidden"
        style={{ maxHeight: "90dvh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div
          className="p-6 flex items-start justify-between"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={user.name}
                className="w-14 h-14 rounded-2xl"
                style={{ border: "3px solid var(--color-brand-100)", background: "var(--color-brand-50)" }}
              />
              <span
                className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 rounded-md font-bold"
                style={{ background: plan.bg, color: plan.color, fontSize: "9px" }}
              >
                {plan.label.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                {user.name}
              </h2>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{user.email}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-subtle)" }}>
                Bergabung {joinDate} · {user.analyses || 0} analisis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-colors"
            style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)" }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-3" style={{ background: "var(--color-surface-3)" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-semibold transition-all"
              style={
                tab === t.id
                  ? { background: "var(--color-surface)", color: "var(--color-brand-600)", boxShadow: "0 1px 4px rgb(0 0 0 / 0.08)" }
                  : { color: "var(--color-text-muted)" }
              }
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* ── PROFILE TAB ── */}
          {tab === "profile" && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: "var(--color-text-muted)" }}>
                  Pilih Avatar
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {AVATAR_SEEDS.map((seed) => (
                    <button
                      key={seed}
                      onClick={() => setSelectedSeed(seed)}
                      className="relative w-full aspect-square rounded-xl overflow-hidden transition-all"
                      style={{
                        border: selectedSeed === seed ? "2px solid var(--color-brand-500)" : "2px solid var(--color-border)",
                        background: "var(--color-brand-50)",
                        boxShadow: selectedSeed === seed ? "0 0 0 3px var(--color-brand-100)" : "none",
                        transform: selectedSeed === seed ? "scale(1.08)" : "scale(1)",
                      }}
                      title={seed}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                        alt={seed}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: "Nama Lengkap", key: "name", type: "text", placeholder: "Nama kamu..." },
                { label: "Email", key: "email", type: "email", placeholder: "email@domain.com" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: "var(--color-text-muted)" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium input-focus"
                    style={{
                      background: "var(--color-surface-3)",
                      border: "1.5px solid var(--color-border)",
                      color: "var(--color-text)",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: "var(--color-text-muted)" }}>
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Ceritakan sedikit tentang kamu..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium input-focus resize-none"
                  style={{
                    background: "var(--color-surface-3)",
                    border: "1.5px solid var(--color-border)",
                    color: "var(--color-text)",
                    fontFamily: "var(--font-body)",
                  }}
                />
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <div className="space-y-4 animate-fade-in">
              <div
                className="p-4 rounded-2xl"
                style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}
              >
                <p className="text-sm font-bold mb-3" style={{ color: "var(--color-text)" }}>Tema Tampilan</p>
                <div className="grid grid-cols-3 gap-2">
                  {["light", "system", "dark"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
                      style={
                        theme === t
                          ? { background: "var(--color-brand-600)", color: "white" }
                          : { background: "var(--color-surface)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }
                      }
                    >
                      {t === "light" ? "☀️ " : t === "dark" ? "🌙 " : "💻 "}{t}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: "Notifikasi Email", sub: "Terima update & tips SEO via email", key: "notifs", val: notifs, set: setNotifs },
                { label: "Laporan Otomatis", sub: "Kirim laporan audit mingguan", key: "reports", val: reports, set: setReports },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{item.label}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.sub}</p>
                  </div>
                  <button
                    onClick={() => item.set(!item.val)}
                    className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
                    style={{ background: item.val ? "var(--color-brand-500)" : "var(--color-border)" }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                      style={{ left: item.val ? "calc(100% - 22px)" : "2px" }}
                    />
                  </button>
                </div>
              ))}

              <div
                className="p-4 rounded-2xl"
                style={{ background: "#fff5f5", border: "1px solid #fecaca" }}
              >
                <p className="text-sm font-bold mb-1" style={{ color: "#dc2626" }}>Hapus Data</p>
                <p className="text-xs mb-3" style={{ color: "#ef4444" }}>Reset semua data analisis dan pengaturan.</p>
                <button
                  onClick={() => {
                    if (confirm("Yakin ingin mereset semua data?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" }}
                >
                  Reset Semua Data
                </button>
              </div>
            </div>
          )}

          {/* ── BILLING TAB ── */}
          {tab === "billing" && (
            <div className="space-y-4 animate-fade-in">
              <div
                className="p-5 rounded-2xl relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, var(--color-brand-600), var(--color-brand-800))", color: "white" }}
              >
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Paket Aktif</p>
                  <p className="text-2xl font-black">{plan.label}</p>
                  <p className="text-sm opacity-70 mt-1">{user.analyses || 0} analisis dilakukan</p>
                </div>
              </div>

              {[
                { name: "Free", price: "Rp 0", features: ["5 analisis/bulan", "4 cek dasar", "Laporan text"], id: "free", highlight: false },
                { name: "Pro", price: "Rp 99.000", features: ["Unlimited analisis", "10+ faktor SEO", "PDF export", "Priority support"], id: "pro", highlight: true },
                { name: "Enterprise", price: "Custom", features: ["Team collaboration", "API access", "White-label", "Dedicated support"], id: "enterprise", highlight: false },
              ].map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl transition-all"
                  style={{
                    border: p.highlight ? "2px solid var(--color-brand-500)" : "1.5px solid var(--color-border)",
                    background: p.highlight ? "var(--color-brand-50)" : "var(--color-surface)",
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold" style={{ color: "var(--color-text)" }}>{p.name}</p>
                      <p className="text-lg font-black mt-0.5" style={{ color: p.highlight ? "var(--color-brand-600)" : "var(--color-text)" }}>
                        {p.price}
                        {p.id !== "enterprise" && <span className="text-xs font-normal opacity-60">/bulan</span>}
                      </p>
                    </div>
                    {user.plan === p.id && (
                      <span
                        className="text-xs px-2 py-1 rounded-lg font-bold"
                        style={{ background: "var(--color-brand-100)", color: "var(--color-brand-600)" }}
                      >
                        Aktif
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1 mb-4">
                    {p.features.map((f) => (
                      <li key={f} className="text-xs flex items-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                        <span style={{ color: "var(--color-success)" }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  {user.plan !== p.id && (
                    <button
                      onClick={() => updateUser({ plan: p.id as typeof user["plan"] })}
                      className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
                      style={
                        p.highlight
                          ? { background: "var(--color-brand-600)", color: "white" }
                          : { background: "var(--color-surface-3)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }
                      }
                    >
                      {p.id === "enterprise" ? "Hubungi Sales" : "Upgrade"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer action */}
        {(tab === "profile" || tab === "settings") && (
          <div
            className="p-4 flex gap-3"
            style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}
          >
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
            >
              Batal
            </button>
            <button
              onClick={tab === "profile" ? handleSaveProfile : handleSaveSettings}
              disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-bold btn-brand"
            >
              {saving ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}