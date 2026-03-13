"use client";
import { useState } from "react";
import Link from "next/link";

const SIDEBAR = [
  {
    section: "Memulai",
    items: [
      { id: "intro",        label: "Apa itu SEO.PRO?"     },
      { id: "quickstart",   label: "Panduan Cepat"         },
      { id: "how-it-works", label: "Cara Kerja Analyzer"   },
    ],
  },
  {
    section: "Faktor SEO",
    items: [
      { id: "title-tag",      label: "Title Tag"           },
      { id: "meta-desc",      label: "Meta Description"    },
      { id: "h1-heading",     label: "H1 Heading"          },
      { id: "image-alt",      label: "Image Alt Tags"      },
      { id: "https",          label: "HTTPS Security"      },
      { id: "viewport",       label: "Viewport / Mobile"   },
      { id: "open-graph",     label: "Open Graph Tags"     },
      { id: "canonical",      label: "Canonical URL"       },
      { id: "schema",         label: "Schema Markup"       },
      { id: "content-length", label: "Panjang Konten"      },
    ],
  },
  {
    section: "Memahami Hasil",
    items: [
      { id: "score-grade",  label: "Skor & Grade"          },
      { id: "action-plan",  label: "Action Plan"           },
      { id: "status-color", label: "Warna Status"          },
    ],
  },
  {
    section: "Akun & Settings",
    items: [
      { id: "profile",   label: "Profil Pengguna"          },
      { id: "billing",   label: "Paket & Billing"          },
      { id: "data",      label: "Data & Privasi"           },
    ],
  },
];

import * as React from "react";
const CONTENT: Record<string, { title: string; body: React.ReactElement }> = {
  intro: {
    title: "Apa itu SEO.PRO?",
    body: (
      <div className="space-y-4">
        <p>SEO.PRO adalah platform audit SEO berbasis web yang memungkinkan kamu menganalisis faktor-faktor penting SEO dari website mana pun secara instan — tanpa perlu install software atau punya keahlian teknis mendalam.</p>
        <p>Cukup masukkan URL, dan dalam hitungan detik kamu mendapat laporan lengkap berisi skor kesehatan SEO, daftar masalah yang ditemukan, dan rekomendasi spesifik cara memperbaikinya.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: "⚡", title: "Cepat",    desc: "Hasil analisis dalam < 3 detik" },
            { icon: "🎯", title: "Akurat",   desc: "10+ faktor SEO yang paling berpengaruh" },
            { icon: "📋", title: "Actionable", desc: "Saran konkret + code snippet langsung pakai" },
          ].map(c => (
            <div key={c.title} className="p-4 rounded-2xl text-center" style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
              <div className="text-2xl mb-2">{c.icon}</div>
              <p className="font-bold text-sm" style={{ color: "var(--color-text)" }}>{c.title}</p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  quickstart: {
    title: "Panduan Cepat",
    body: (
      <div className="space-y-5">
        <p>Ikuti langkah-langkah berikut untuk memulai analisis SEO pertamamu:</p>
        {[
          { step: "1", title: "Buka halaman Analyzer", desc: 'Pergi ke menu Analyzer atau klik tombol "Analisis Sekarang" di homepage.' },
          { step: "2", title: "Masukkan URL website", desc: 'Ketik URL website yang ingin dianalisis di kolom input. Contoh: tokopedia.com atau https://tokopedia.com' },
          { step: "3", title: "Klik Analisis Sekarang", desc: 'Tekan tombol atau Enter. Proses analisis memakan waktu 2-5 detik tergantung kecepatan website target.' },
          { step: "4", title: "Baca laporan hasil", desc: 'Lihat skor overall, breakdown per faktor, dan klik tiap baris untuk membaca saran perbaikan detail.' },
          { step: "5", title: "Cek Action Plan", desc: 'Buka tab "Action Plan" untuk melihat daftar prioritas perbaikan yang akan membawamu ke skor 100%.' },
        ].map(s => (
          <div key={s.step} className="flex gap-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5"
              style={{ background: "var(--color-brand-100)", color: "var(--color-brand-700)" }}
            >
              {s.step}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--color-text)" }}>{s.title}</p>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{s.desc}</p>
            </div>
          </div>
        ))}
        <div className="p-4 rounded-2xl mt-4" style={{ background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)" }}>
          <p className="text-sm font-bold" style={{ color: "var(--color-brand-700)" }}>💡 Tips</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-brand-600)" }}>
            Analisis website kompetitor kamu juga! Bandingkan skor mereka dengan websitemu untuk tahu area mana yang perlu dikejar.
          </p>
        </div>
      </div>
    ),
  },
  "how-it-works": {
    title: "Cara Kerja Analyzer",
    body: (
      <div className="space-y-4">
        <p>Saat kamu memasukkan URL, analyzer melakukan beberapa langkah secara otomatis:</p>
        <div className="space-y-3">
          {[
            { icon: "🌐", title: "Fetch halaman",     desc: "Server kami mengambil HTML halaman menggunakan bot crawler dengan User-Agent yang dikenali search engine." },
            { icon: "🔍", title: "Parse HTML",        desc: "Kami menggunakan Cheerio (library parsing HTML) untuk mengekstrak semua elemen relevan SEO dari kode sumber." },
            { icon: "📊", title: "Evaluasi faktor",   desc: "Setiap faktor dinilai berdasarkan best practice Google terkini — panjang optimal, keberadaan tag, konsistensi, dll." },
            { icon: "🎯", title: "Generate rekomendasi", desc: "Rekomendasi dibuat dinamis berdasarkan nilai aktual yang ditemukan, bukan template statis." },
            { icon: "⚡", title: "Return hasil",      desc: "Semua data dikembalikan dalam satu response JSON dan dirender langsung di browser kamu." },
          ].map(s => (
            <div key={s.title} className="flex gap-3 p-4 rounded-xl" style={{ background: "var(--color-surface-3)" }}>
              <span className="text-xl flex-shrink-0">{s.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{s.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl" style={{ background: "#fff5f5", border: "1px solid #fecaca" }}>
          <p className="text-sm font-bold" style={{ color: "#dc2626" }}>⚠️ Catatan</p>
          <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
            Analyzer hanya menganalisis HTML yang dikembalikan server. Konten yang di-render secara client-side (JavaScript) mungkin tidak terdeteksi sepenuhnya — ini sama dengan cara Google Googlebot bekerja.
          </p>
        </div>
      </div>
    ),
  },
  "title-tag": {
    title: "Title Tag",
    body: (
      <div className="space-y-4">
        <p>Title tag adalah salah satu faktor SEO on-page paling berpengaruh. Ini adalah teks yang muncul di tab browser dan sebagai judul biru di hasil pencarian Google (SERP).</p>
        <CodeBlock code={`<head>\n  <title>Jual Sepatu Nike Original - TokoSepatu.com</title>\n</head>`} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Kriteria Penilaian</h3>
        <ScoreTable rows={[
          ["10 / 10", "30–60 karakter", "Panjang optimal, muncul penuh di SERP"],
          ["5 / 10",  "< 30 karakter",  "Terlalu pendek, kurang deskriptif"],
          ["5 / 10",  "> 60 karakter",  "Akan terpotong di Google dengan '...'"],
          ["0 / 10",  "Tidak ada",      "Tidak ada title tag sama sekali"],
        ]} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Best Practice</h3>
        <ul className="space-y-2">
          {[
            "Letakkan keyword utama di awal judul",
            "Setiap halaman harus punya title yang unik",
            "Sertakan nama brand di akhir: 'Keyword - Brand'",
            "Hindari keyword stuffing (pengulangan kata kunci berlebihan)",
            "Gunakan angka atau kata power: 'Terbaik', 'Lengkap', 'Gratis'",
          ].map((t, i) => <BulletItem key={i} text={t} />)}
        </ul>
      </div>
    ),
  },
  "meta-desc": {
    title: "Meta Description",
    body: (
      <div className="space-y-4">
        <p>Meta description adalah ringkasan singkat konten halaman yang muncul di bawah judul di hasil pencarian. Meski tidak secara langsung mempengaruhi ranking, deskripsi yang menarik meningkatkan CTR (Click-Through Rate) secara signifikan.</p>
        <CodeBlock code={`<meta name="description" content="Beli sepatu Nike original terlengkap dengan harga terbaik. Gratis ongkir se-Indonesia. Garansi resmi." />`} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Kriteria Penilaian</h3>
        <ScoreTable rows={[
          ["10 / 10", "120–160 karakter", "Panjang optimal"],
          ["6 / 10",  "51–119 karakter",  "Cukup tapi bisa diperpanjang"],
          ["3 / 10",  "1–50 karakter",    "Terlalu pendek"],
          ["0 / 10",  "Tidak ada",        "Tidak ada meta description"],
        ]} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Best Practice</h3>
        <ul className="space-y-2">
          {[
            "Masukkan keyword utama secara natural",
            "Tulis seperti iklan singkat — persuasif dan jelas",
            "Sertakan call-to-action: 'Pelajari', 'Coba gratis', 'Lihat selengkapnya'",
            "Setiap halaman harus punya deskripsi unik",
            "Hindari deskripsi duplikat antar halaman",
          ].map((t, i) => <BulletItem key={i} text={t} />)}
        </ul>
      </div>
    ),
  },
  "h1-heading": {
    title: "H1 Heading",
    body: (
      <div className="space-y-4">
        <p>Tag H1 adalah heading utama halaman — biasanya judul konten yang terlihat di halaman. Google menggunakannya untuk memahami topik utama halaman.</p>
        <CodeBlock code={`<h1>Panduan Lengkap SEO untuk Pemula 2024</h1>`} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Kriteria Penilaian</h3>
        <ScoreTable rows={[
          ["10 / 10", "Tepat 1 H1",     "Struktur heading ideal"],
          ["5 / 10",  "Lebih dari 1 H1", "Membingungkan crawler"],
          ["0 / 10",  "Tidak ada H1",    "Halaman tanpa heading utama"],
        ]} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Best Practice</h3>
        <ul className="space-y-2">
          {[
            "Gunakan tepat satu H1 per halaman",
            "H1 harus mengandung keyword utama halaman",
            "H1 berbeda dari title tag tapi boleh serupa",
            "Gunakan H2 dan H3 untuk subheading — buat hierarki yang logis",
            "H1 harus berada di area konten utama, bukan di header/footer navigasi",
          ].map((t, i) => <BulletItem key={i} text={t} />)}
        </ul>
      </div>
    ),
  },
  "image-alt": {
    title: "Image Alt Tags",
    body: (
      <div className="space-y-4">
        <p>Alt text (alternative text) adalah deskripsi teks untuk gambar. Digunakan oleh screen reader untuk aksesibilitas dan oleh Google untuk memahami konten gambar.</p>
        <CodeBlock code={`<!-- ❌ Buruk -->\n<img src="sepatu.jpg" />\n<img src="sepatu.jpg" alt="" />\n\n<!-- ✅ Baik -->\n<img src="sepatu-nike-air-max-merah.jpg"\n     alt="Sepatu Nike Air Max warna merah tampak samping" />`} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Kriteria Penilaian</h3>
        <ScoreTable rows={[
          ["10 / 10", "Semua gambar punya alt", "Aksesibilitas & SEO sempurna"],
          ["5 / 10",  "1-2 gambar tanpa alt",   "Perlu perhatian"],
          ["0 / 10",  "3+ gambar tanpa alt",     "Masalah serius"],
          ["5 / 10",  "Tidak ada gambar",        "Tidak ada gambar untuk dinilai"],
        ]} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Best Practice</h3>
        <ul className="space-y-2">
          {[
            "Deskripsikan apa yang ada di gambar secara spesifik",
            "Sertakan keyword secara natural jika relevan dengan gambar",
            "Jangan diawali 'Gambar dari...' atau 'Foto...' — langsung deskripsi",
            "Untuk gambar dekoratif: gunakan alt=\"\" (kosong, bukan dihilangkan)",
            "Panjang ideal alt text: 50-125 karakter",
          ].map((t, i) => <BulletItem key={i} text={t} />)}
        </ul>
      </div>
    ),
  },
  https: {
    title: "HTTPS Security",
    body: (
      <div className="space-y-4">
        <p>HTTPS (HyperText Transfer Protocol Secure) memastikan koneksi antara browser pengguna dan server terenkripsi. Google menjadikan HTTPS sebagai faktor ranking sejak 2014.</p>
        <h3 className="font-black text-base mt-2" style={{ color: "var(--color-text)" }}>Kriteria Penilaian</h3>
        <ScoreTable rows={[
          ["10 / 10", "URL dimulai https://", "Koneksi aman & terenkripsi"],
          ["0 / 10",  "URL dimulai http://",  "Koneksi tidak aman"],
        ]} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Cara Mengaktifkan HTTPS</h3>
        <ul className="space-y-2">
          {[
            "Dapatkan sertifikat SSL — gratis dari Let's Encrypt (letsencrypt.org)",
            "Install sertifikat di server hosting kamu",
            "Atur redirect 301 dari HTTP ke HTTPS",
            "Update semua internal link dari http:// ke https://",
            "Cek mixed content: pastikan semua resource (gambar, CSS, JS) juga pakai HTTPS",
          ].map((t, i) => <BulletItem key={i} text={t} />)}
        </ul>
      </div>
    ),
  },
  viewport: {
    title: "Viewport / Mobile",
    body: (
      <div className="space-y-4">
        <p>Meta viewport mengontrol bagaimana halaman ditampilkan di perangkat mobile. Google menggunakan mobile-first indexing — versi mobile website yang menjadi referensi utama untuk ranking.</p>
        <CodeBlock code={`<meta name="viewport" content="width=device-width, initial-scale=1" />`} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Kriteria Penilaian</h3>
        <ScoreTable rows={[
          ["10 / 10", "Viewport tag ada",    "Mobile-friendly"],
          ["0 / 10",  "Viewport tag tidak ada", "Tidak responsif di mobile"],
        ]} />
        <div className="p-4 rounded-2xl" style={{ background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "var(--color-brand-700)" }}>📱 Ingat</p>
          <p className="text-xs" style={{ color: "var(--color-brand-600)" }}>
            Viewport tag adalah syarat minimum. Untuk mobile-friendly penuh, pastikan juga: font readable tanpa zoom, tombol cukup besar (min 48x48px), dan konten tidak lebih lebar dari layar.
          </p>
        </div>
      </div>
    ),
  },
  "open-graph": {
    title: "Open Graph Tags",
    body: (
      <div className="space-y-4">
        <p>Open Graph (OG) tags mengontrol tampilan konten saat dibagikan di media sosial seperti Facebook, Twitter/X, WhatsApp, dan LinkedIn. Tanpa OG tags, platform sosial akan menampilkan preview yang acak dan tidak menarik.</p>
        <CodeBlock code={`<meta property="og:title" content="Judul Halaman Menarik" />\n<meta property="og:description" content="Deskripsi singkat yang compelling..." />\n<meta property="og:image" content="https://example.com/og-image.jpg" />\n<meta property="og:url" content="https://example.com/halaman" />\n<meta property="og:type" content="website" />`} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Kriteria Penilaian</h3>
        <ScoreTable rows={[
          ["10 / 10", "og:title + og:desc + og:image ada", "Preview sosmed sempurna"],
          ["5 / 10",  "Hanya og:title atau og:desc",        "Preview tidak lengkap"],
          ["0 / 10",  "Tidak ada OG tags",                  "Preview sosmed acak"],
        ]} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Ukuran Gambar OG yang Ideal</h3>
        <ul className="space-y-2">
          {[
            "Ukuran: 1200 × 630 pixel (rasio 1.91:1)",
            "Format: JPG atau PNG",
            "Ukuran file: maksimal 8MB (ideal di bawah 1MB)",
            "Test preview di: developers.facebook.com/tools/debug",
          ].map((t, i) => <BulletItem key={i} text={t} />)}
        </ul>
      </div>
    ),
  },
  canonical: {
    title: "Canonical URL",
    body: (
      <div className="space-y-4">
        <p>Tag canonical memberitahu Google URL mana yang dianggap sebagai versi &quot;resmi&quot; dari sebuah halaman. Penting untuk mencegah masalah duplicate content yang bisa memecah link equity.</p>
        <CodeBlock code={`<link rel="canonical" href="https://example.com/halaman-ini" />`} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Kapan Perlu Canonical?</h3>
        <ul className="space-y-2">
          {[
            "Halaman bisa diakses via www dan non-www",
            "Halaman produk dengan parameter URL (?color=red, ?sort=price)",
            "Konten yang dipaginasi (?page=2, ?page=3)",
            "URL dengan UTM parameters (?utm_source=...)",
            "Halaman yang kontennya mirip atau identik",
          ].map((t, i) => <BulletItem key={i} text={t} />)}
        </ul>
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Kriteria Penilaian</h3>
        <ScoreTable rows={[
          ["10 / 10", "Canonical tag ada",    "Tidak ada risiko duplicate content"],
          ["0 / 10",  "Canonical tag tidak ada", "Risiko duplicate content"],
        ]} />
      </div>
    ),
  },
  schema: {
    title: "Schema Markup",
    body: (
      <div className="space-y-4">
        <p>Schema markup (structured data) adalah kode JSON-LD yang memberikan konteks tambahan kepada Google tentang konten halaman. Bisa menghasilkan rich snippets di SERP seperti bintang review, FAQ, harga produk, dan lainnya.</p>
        <CodeBlock code={`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "SEO.PRO",\n  "url": "https://seopro.id",\n  "logo": "https://seopro.id/logo.png",\n  "sameAs": [\n    "https://twitter.com/seopro"\n  ]\n}\n</script>`} />
        <h3 className="font-black text-base mt-6" style={{ color: "var(--color-text)" }}>Tipe Schema yang Populer</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Article",       "Blog post, berita"],
            ["Product",       "Halaman produk e-commerce"],
            ["FAQ",           "Halaman FAQ"],
            ["LocalBusiness", "Bisnis lokal"],
            ["Review",        "Ulasan & rating"],
            ["BreadcrumbList","Navigasi breadcrumb"],
          ].map(([type, use]) => (
            <div key={type} className="p-3 rounded-xl" style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs font-black" style={{ color: "var(--color-brand-600)", fontFamily: "var(--font-mono)" }}>{type}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{use}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
          Validasi schema kamu di: <span style={{ color: "var(--color-brand-600)", fontFamily: "var(--font-mono)" }}>search.google.com/test/rich-results</span>
        </p>
      </div>
    ),
  },
  "content-length": {
    title: "Panjang Konten",
    body: (
      <div className="space-y-4">
        <p>Panjang konten diukur dari jumlah kata yang ada di elemen <code style={{ fontFamily: "var(--font-mono)", background: "var(--color-surface-3)", padding: "1px 6px", borderRadius: 4 }}>&lt;body&gt;</code> halaman. Konten yang substantif cenderung mendapat ranking lebih tinggi karena menjawab pertanyaan pengguna lebih lengkap.</p>
        <h3 className="font-black text-base mt-2" style={{ color: "var(--color-text)" }}>Kriteria Penilaian</h3>
        <ScoreTable rows={[
          ["10 / 10", "≥ 300 kata",    "Konten substantif"],
          ["5 / 10",  "100–299 kata",  "Konten tipis"],
          ["0 / 10",  "< 100 kata",    "Thin content — risiko penalti"],
        ]} />
        <div className="p-4 rounded-2xl" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "#b45309" }}>⚠️ Konteks Penting</p>
          <p className="text-xs" style={{ color: "#92400e" }}>
            Jumlah kata bukan satu-satunya ukuran kualitas konten. 300 kata yang relevan dan menjawab search intent jauh lebih baik dari 2000 kata berisi padding yang tidak berguna. Fokus pada kualitas, bukan kuantitas semata.
          </p>
        </div>
      </div>
    ),
  },
  "score-grade": {
    title: "Skor & Grade",
    body: (
      <div className="space-y-4">
        <p>Skor SEO.PRO dihitung dari total poin yang dikumpulkan dari 10 faktor yang dinilai. Setiap faktor bernilai maksimal 10 poin, sehingga skor maksimum adalah 100 poin.</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { grade: "A+", range: "90–100%", color: "#22c55e", bg: "#f0fdf4", label: "Excellent" },
            { grade: "A",  range: "80–89%",  color: "#4ade80", bg: "#f0fdf4", label: "Great"     },
            { grade: "B",  range: "70–79%",  color: "#facc15", bg: "#fefce8", label: "Good"      },
            { grade: "C",  range: "60–69%",  color: "#fb923c", bg: "#fff7ed", label: "Needs Work"},
            { grade: "D",  range: "0–59%",   color: "#ef4444", bg: "#fff5f5", label: "Poor"      },
          ].map(g => (
            <div key={g.grade} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: g.bg, border: `1px solid ${g.color}30` }}>
              <span className="text-2xl font-black" style={{ color: g.color, fontFamily: "var(--font-display)" }}>{g.grade}</span>
              <div>
                <p className="text-xs font-bold" style={{ color: g.color }}>{g.label}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{g.range}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "action-plan": {
    title: "Action Plan",
    body: (
      <div className="space-y-4">
        <p>Action Plan adalah daftar item perbaikan yang diurutkan berdasarkan dampak terhadap peningkatan skor. Item dengan poin tertinggi yang bisa didapat ditampilkan paling atas.</p>
        <h3 className="font-black text-base" style={{ color: "var(--color-text)" }}>Prioritas Perbaikan</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: "#fff5f5", border: "1.5px solid #fecaca" }}>
            <span className="text-base">🔴</span>
            <div>
              <p className="text-sm font-bold" style={{ color: "#dc2626" }}>Prioritas Tinggi</p>
              <p className="text-xs mt-0.5" style={{ color: "#ef4444" }}>Faktor dengan status &quot;Buruk&quot; (skor 0). Perbaikan ini memberikan dampak terbesar pada ranking.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}>
            <span className="text-base">🟡</span>
            <div>
              <p className="text-sm font-bold" style={{ color: "#b45309" }}>Prioritas Sedang</p>
              <p className="text-xs mt-0.5" style={{ color: "#92400e" }}>Faktor dengan status &quot;Perlu Perhatian&quot;. Sudah ada tapi belum optimal.</p>
            </div>
          </div>
        </div>
        <p>Setiap item di Action Plan menampilkan estimasi kenaikan poin jika diperbaiki, dan tombol &quot;Lihat kode&quot; untuk melihat contoh implementasi HTML langsung.</p>
      </div>
    ),
  },
  "status-color": {
    title: "Warna Status",
    body: (
      <div className="space-y-4">
        <p>Setiap faktor SEO memiliki indikator warna untuk memudahkan pemahaman cepat:</p>
        <div className="space-y-3">
          {[
            { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", icon: "✓", label: "Hijau — Optimal",         desc: "Faktor sudah memenuhi standar terbaik. Pertahankan!" },
            { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: "!", label: "Kuning — Perlu Perhatian", desc: "Faktor ada tapi belum optimal. Ada ruang untuk improvement." },
            { color: "#ef4444", bg: "#fff5f5", border: "#fecaca", icon: "✕", label: "Merah — Perlu Diperbaiki", desc: "Faktor missing atau sangat buruk. Segera perbaiki untuk dampak terbesar." },
          ].map(s => (
            <div key={s.label} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: s.bg, border: `1.5px solid ${s.border}` }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: `${s.color}20`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: s.color }}>{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  profile: {
    title: "Profil Pengguna",
    body: (
      <div className="space-y-4">
        <p>Data profil kamu disimpan secara lokal di browser menggunakan localStorage. Artinya data tidak dikirim ke server kami dan hanya bisa diakses dari browser yang sama.</p>
        <h3 className="font-black text-base" style={{ color: "var(--color-text)" }}>Cara Update Profil</h3>
        <ul className="space-y-2">
          {[
            "Klik foto profil / nama di pojok kanan atas navbar",
            "Modal Settings akan terbuka",
            "Pilih tab Profil",
            "Ubah nama, email, bio, atau pilih avatar baru",
            "Klik Simpan Perubahan",
          ].map((t, i) => <BulletItem key={i} text={t} />)}
        </ul>
        <div className="p-4 rounded-2xl" style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "var(--color-text)" }}>📦 Data yang Disimpan</p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Nama, email, bio, pilihan avatar, paket aktif, dan jumlah analisis yang dilakukan. Semua tersimpan di localStorage browser kamu.
          </p>
        </div>
      </div>
    ),
  },
  billing: {
    title: "Paket & Billing",
    body: (
      <div className="space-y-4">
        <p>SEO.PRO menawarkan tiga paket: Free, Pro, dan Enterprise. Kamu bisa melihat detail dan membandingkan fitur di halaman Pricing.</p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: "var(--color-brand-600)", color: "white" }}
        >
          Lihat Halaman Pricing →
        </Link>
        <h3 className="font-black text-base mt-4" style={{ color: "var(--color-text)" }}>Cara Upgrade Paket</h3>
        <ul className="space-y-2">
          {[
            "Buka modal Settings (klik foto profil)",
            "Pilih tab Billing",
            "Pilih paket yang diinginkan",
            "Klik tombol Upgrade",
          ].map((t, i) => <BulletItem key={i} text={t} />)}
        </ul>
      </div>
    ),
  },
  data: {
    title: "Data & Privasi",
    body: (
      <div className="space-y-4">
        <p>Kami berkomitmen menjaga privasi data pengguna. Berikut kebijakan data kami:</p>
        <div className="space-y-3">
          {[
            { icon: "💾", title: "Penyimpanan Lokal", desc: "Data profil dan preferensi disimpan di localStorage browser. Tidak ada database server yang menyimpan data personal kamu." },
            { icon: "🔍", title: "Data Analisis", desc: "URL yang kamu analisis digunakan untuk melakukan audit SEO secara real-time dan tidak disimpan permanen di server." },
            { icon: "🚫", title: "Tidak Ada Iklan", desc: "Kami tidak menjual data kamu ke pihak ketiga atau menggunakannya untuk keperluan iklan." },
            { icon: "🗑️", title: "Hapus Data", desc: "Kamu bisa menghapus semua data lokal kapan saja melalui Settings → Hapus Data → Reset Semua Data." },
          ].map(s => (
            <div key={s.title} className="flex gap-3 p-4 rounded-xl" style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
              <span className="text-xl flex-shrink-0">{s.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{s.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

/* ── Helper sub-components ── */
function CodeBlock({ code }: { code: string }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
      <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: "#1e293b", borderBottom: "1px solid #334155" }}>
        {["#ef4444", "#f59e0b", "#22c55e"].map(c => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
        <span className="ml-2 text-[10px] font-bold" style={{ color: "#64748b" }}>HTML</span>
      </div>
      <pre className="px-4 py-3 text-[12px] leading-relaxed overflow-x-auto" style={{ color: "#7dd3fc", fontFamily: "var(--font-mono)", margin: 0 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ScoreTable({ rows }: { rows: string[][] }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: "var(--color-surface-3)", borderBottom: "1px solid var(--color-border)" }}>
            {["Skor", "Kondisi", "Keterangan"].map(h => (
              <th key={h} className="text-left px-4 py-2.5 font-black" style={{ color: "var(--color-text-muted)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([score, cond, note], i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none", background: i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-2)" }}>
              <td className="px-4 py-2.5 font-black" style={{ color: "var(--color-brand-600)", fontFamily: "var(--font-mono)" }}>{score}</td>
              <td className="px-4 py-2.5 font-medium" style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}>{cond}</td>
              <td className="px-4 py-2.5" style={{ color: "var(--color-text-muted)" }}>{note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5" style={{ background: "var(--color-brand-100)", color: "var(--color-brand-600)" }}>✓</span>
      <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{text}</span>
    </li>
  );
}

/* ── Main Docs Page ── */
export default function DocsPage() {
  const [activeId, setActiveId] = useState("intro");
  const [mobileOpen, setMobileOpen] = useState(false);

  const active = CONTENT[activeId];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex gap-8">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "var(--color-text-subtle)", letterSpacing: "0.12em" }}>
                Dokumentasi
              </p>
            </div>
            {SIDEBAR.map(group => (
              <div key={group.section}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--color-text-subtle)" }}>
                  {group.section}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveId(item.id)}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all"
                        style={{
                          color:      activeId === item.id ? "var(--color-brand-600)" : "var(--color-text-muted)",
                          background: activeId === item.id ? "var(--color-brand-50)"  : "transparent",
                          fontWeight: activeId === item.id ? 700 : 500,
                          borderLeft: activeId === item.id ? "2px solid var(--color-brand-500)" : "2px solid transparent",
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Mobile nav dropdown ── */}
        <div className="lg:hidden w-full mb-6 animate-fade-in">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold"
            style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-text)" }}>{active?.title}</span>
            <svg className="w-4 h-4 transition-transform" style={{ color: "var(--color-text-subtle)", transform: mobileOpen ? "rotate(180deg)" : "rotate(0)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileOpen && (
            <div className="card mt-2 p-4 space-y-4 animate-fade-in">
              {SIDEBAR.map(group => (
                <div key={group.section}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--color-text-subtle)" }}>{group.section}</p>
                  <ul className="space-y-0.5">
                    {group.items.map(item => (
                      <li key={item.id}>
                        <button
                          onClick={() => { setActiveId(item.id); setMobileOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all"
                          style={{
                            color: activeId === item.id ? "var(--color-brand-600)" : "var(--color-text-muted)",
                            background: activeId === item.id ? "var(--color-brand-50)" : "transparent",
                            fontWeight: activeId === item.id ? 700 : 500,
                          }}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <main className="flex-1 min-w-0">
          {active && (
            <div key={activeId} className="animate-fade-up" style={{ opacity: 0 }}>
              {/* Breadcrumb */}
              <p className="text-xs mb-2" style={{ color: "var(--color-text-subtle)" }}>
                Docs / {active.title}
              </p>

              {/* Title */}
              <h1
                className="text-3xl font-black mb-6"
                style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
              >
                {active.title}
              </h1>

              {/* Body */}
              <div
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {active.body}
              </div>

              {/* Prev / Next nav */}
              <div className="flex gap-3 mt-10 pt-6" style={{ borderTop: "1px solid var(--color-border)" }}>
                {(() => {
                  const allItems = SIDEBAR.flatMap(g => g.items);
                  const idx = allItems.findIndex(i => i.id === activeId);
                  const prev = allItems[idx - 1];
                  const next = allItems[idx + 1];
                  return (
                    <>
                      {prev ? (
                        <button
                          onClick={() => setActiveId(prev.id)}
                          className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left"
                          style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                          </svg>
                          <div>
                            <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--color-text-subtle)" }}>Sebelumnya</p>
                            <p>{prev.label}</p>
                          </div>
                        </button>
                      ) : <div className="flex-1" />}
                      {next && (
                        <button
                          onClick={() => setActiveId(next.id)}
                          className="flex-1 flex items-center justify-end gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-right"
                          style={{ background: "var(--color-brand-50)", color: "var(--color-brand-600)", border: "1px solid var(--color-brand-200)" }}
                        >
                          <div>
                            <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--color-brand-400)" }}>Berikutnya</p>
                            <p>{next.label}</p>
                          </div>
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}