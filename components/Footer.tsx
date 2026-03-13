"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto"
      style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}
    >
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: "var(--color-brand-600)" }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>S</span>
              </div>
              <span className="font-bold text-base" style={{ color: "var(--color-text)" }}>
                SEO<span style={{ color: "var(--color-brand-600)" }}>.PRO</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Platform audit SEO profesional untuk developer dan marketer Indonesia.
            </p>
            <div className="flex gap-3 mt-4">
              {["𝕏", "in", "🐙"].map((icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all"
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
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Produk",
              links: ["Analyzer", "Batch Audit", "API Access", "Chrome Extension"],
            },
            {
              title: "Sumber Daya",
              links: ["Dokumentasi", "Blog SEO", "Panduan", "Changelog"],
            },
            {
              title: "Perusahaan",
              links: ["Tentang Kami", "Harga", "Kebijakan Privasi", "Syarat Layanan"],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <p
                className="text-xs font-black uppercase tracking-widest mb-3"
                style={{ color: "var(--color-text-subtle)", letterSpacing: "0.12em" }}
              >
                {title}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      className="text-xs transition-colors text-left"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-brand-600)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 mt-8"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
            © {year} SEO.PRO · Dibuat dengan 💙 di Indonesia
          </p>
          <div className="flex items-center gap-4">
            <span
              className="text-xs px-2.5 py-1 rounded-lg font-bold"
              style={{ background: "var(--color-brand-50)", color: "var(--color-brand-600)", border: "1px solid var(--color-brand-200)" }}
            >
              v2.0.0
            </span>
            <p className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
              Status:{" "}
              <span style={{ color: "var(--color-success)", fontWeight: 700 }}>● Operational</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}