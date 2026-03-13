import * as cheerio from 'cheerio';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const startTime = Date.now();

    const { data: html } = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Compatible; SEO-Bot/1.0)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });

    const loadTime = Date.now() - startTime;
    const $ = cheerio.load(html);

    const title    = $('title').text().trim() || '';
    const desc     = $('meta[name="description"]').attr('content') || '';
    const h1       = $('h1').map((_, el) => $(el).text().trim()).get();
    const h2       = $('h2').map((_, el) => $(el).text().trim()).get();
    const images   = $('img').get();
    const missingAlt = images.filter((img) => !$(img).attr('alt')).length;
    const canonical  = $('link[rel="canonical"]').attr('href') || '';
    const robots     = $('meta[name="robots"]').attr('content') || '';
    const ogTitle    = $('meta[property="og:title"]').attr('content') || '';
    const ogDesc     = $('meta[property="og:description"]').attr('content') || '';
    const ogImage    = $('meta[property="og:image"]').attr('content') || '';
    const viewport   = $('meta[name="viewport"]').attr('content') || '';
    const charset    = $('meta[charset]').attr('charset') || '';
    const links      = $('a').get();
    const internalLinks = links.filter((a) => {
      const href = $(a).attr('href') || '';
      return href.startsWith('/') || href.includes(new URL(targetUrl).hostname);
    }).length;
    const externalLinks = links.length - internalLinks;
    const wordCount  = $('body').text().split(/\s+/).filter(Boolean).length;
    const hasSchema  = html.includes('application/ld+json');
    const isHttps    = targetUrl.startsWith('https');

    // ── Helper: build recommendation list based on current value ──
    function titleRecs(len: number): string[] {
      if (len === 0) return [
        'Tambahkan tag <title> di dalam <head> halaman.',
        'Gunakan judul yang deskriptif dan mengandung keyword utama.',
        'Panjang ideal: 30–60 karakter agar tidak terpotong di SERP.',
      ];
      if (len < 30) return [
        `Title terlalu pendek (${len} char). Tambahkan kata kunci target.`,
        'Sertakan nama brand atau topik utama agar lebih deskriptif.',
        'Target panjang: minimal 30 karakter.',
      ];
      if (len > 60) return [
        `Title terlalu panjang (${len} char) — akan terpotong di Google.`,
        'Pangkas kata yang tidak perlu, pertahankan keyword utama di depan.',
        'Target panjang: maksimal 60 karakter.',
      ];
      return ['Title sudah optimal! Pastikan keyword utama ada di awal judul.'];
    }

    function descRecs(len: number, text: string): string[] {
      if (len === 0) return [
        'Tambahkan tag <meta name="description"> di dalam <head>.',
        'Tulis deskripsi yang menarik dan mengandung keyword utama.',
        'Panjang ideal: 120–160 karakter.',
        'Gunakan call-to-action seperti "Pelajari lebih lanjut" atau "Coba gratis".',
      ];
      if (len < 120) return [
        `Meta description terlalu pendek (${len} char).`,
        'Tambahkan lebih banyak detail tentang isi halaman.',
        'Sertakan keyword utama dan secondary keyword.',
        'Target panjang: 120–160 karakter.',
      ];
      if (len > 160) return [
        `Meta description terlalu panjang (${len} char) — akan terpotong.`,
        'Persingkat deskripsi, utamakan informasi paling penting di awal.',
        'Target panjang: maksimal 160 karakter.',
      ];
      return [
        'Meta description sudah optimal!',
        'Pastikan deskripsi unik untuk setiap halaman.',
        'Coba A/B test berbagai CTA untuk meningkatkan CTR.',
      ];
    }

    function h1Recs(count: number): string[] {
      if (count === 0) return [
        'Tambahkan tepat satu tag <h1> yang berisi keyword utama halaman.',
        'H1 harus mendeskripsikan topik utama halaman secara jelas.',
        'Contoh: <h1>Jual Sepatu Lari Nike Original</h1>',
      ];
      if (count > 1) return [
        `Ada ${count} tag H1 — Google lebih menyukai tepat satu H1 per halaman.`,
        'Pilih satu H1 utama, ubah yang lain menjadi H2 atau H3.',
        'H1 harus berada di area konten utama, bukan header/footer.',
      ];
      return [
        'H1 sudah tepat! Pastikan mengandung keyword utama target.',
        'Gunakan H2 dan H3 untuk struktur konten yang lebih rapi.',
      ];
    }

    function altRecs(total: number, missing: number): string[] {
      if (total === 0) return [
        'Tidak ada gambar ditemukan di halaman ini.',
        'Pertimbangkan menambahkan gambar relevan untuk meningkatkan engagement.',
        'Gambar dengan alt text membantu SEO dan aksesibilitas.',
      ];
      if (missing === 0) return [
        'Semua gambar sudah memiliki alt text — sempurna!',
        'Pastikan alt text deskriptif, bukan hanya nama file.',
      ];
      return [
        `${missing} dari ${total} gambar tidak memiliki alt text.`,
        'Tambahkan atribut alt yang deskriptif pada setiap tag <img>.',
        'Contoh: alt="Sepatu lari Nike Air Max warna merah"',
        'Hindari alt text seperti "image1.jpg" atau "gambar".',
        'Alt text yang baik meningkatkan aksesibilitas dan ranking di Google Image.',
      ];
    }

    function httpsRecs(secure: boolean): string[] {
      if (secure) return [
        'HTTPS aktif — koneksi pengguna terenkripsi.',
        'Pastikan semua resource (gambar, script, CSS) dimuat via HTTPS.',
        'Cek apakah ada mixed content warning di browser console.',
      ];
      return [
        'Segera aktifkan SSL/TLS untuk situs Anda.',
        'Dapatkan sertifikat gratis dari Let\'s Encrypt (letsencrypt.org).',
        'Atur redirect 301 dari HTTP ke HTTPS.',
        'HTTPS adalah ranking signal di Google sejak 2014.',
        'Tanpa HTTPS, browser modern menampilkan peringatan "Not Secure".',
      ];
    }

    function viewportRecs(vp: string): string[] {
      if (vp) return [
        'Viewport sudah dikonfigurasi dengan benar.',
        'Pastikan desain responsif di semua ukuran layar (mobile-first).',
        'Gunakan Chrome DevTools untuk test tampilan mobile.',
      ];
      return [
        'Tambahkan meta viewport di dalam <head>:',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        'Tanpa viewport, halaman tidak responsif di perangkat mobile.',
        'Google menggunakan mobile-first indexing sejak 2019.',
        'Halaman tidak mobile-friendly berpotensi turun di ranking.',
      ];
    }

    function ogRecs(hasTitle: boolean, hasDesc: boolean, hasImg: boolean): string[] {
      const missing: string[] = [];
      if (!hasTitle) missing.push('og:title — judul yang muncul saat dibagikan di sosmed');
      if (!hasDesc)  missing.push('og:description — deskripsi singkat konten');
      if (!hasImg)   missing.push('og:image — gambar thumbnail (minimal 1200x630px)');
      if (missing.length === 0) return [
        'Semua Open Graph tag utama sudah ada!',
        'Tambahkan og:type (article/website) dan og:url untuk kelengkapan.',
        'Test tampilan share card di: developers.facebook.com/tools/debug',
      ];
      return [
        'Tag Open Graph yang perlu ditambahkan:',
        ...missing.map(m => `• ${m}`),
        'OG tags menentukan tampilan konten saat dibagikan di Facebook, Twitter, WhatsApp.',
        'Gunakan Twitter Card tags juga: twitter:card, twitter:title, twitter:image.',
      ];
    }

    function canonicalRecs(url: string, canon: string): string[] {
      if (canon) return [
        'Canonical URL sudah terpasang.',
        'Pastikan canonical mengarah ke URL yang benar (bukan halaman lain).',
        'Cek apakah canonical konsisten di semua versi URL (www vs non-www).',
      ];
      return [
        'Tambahkan tag canonical di dalam <head>:',
        `<link rel="canonical" href="${url}">`,
        'Canonical mencegah duplicate content yang bisa merugikan ranking.',
        'Penting untuk halaman dengan parameter URL (?utm_source=, ?page=2, dll).',
        'Semua halaman sebaiknya memiliki canonical, termasuk homepage.',
      ];
    }

    function schemaRecs(has: boolean): string[] {
      if (has) return [
        'Schema markup (JSON-LD) ditemukan — bagus!',
        'Validasi schema di: search.google.com/test/rich-results',
        'Pertimbangkan menambah schema tambahan: FAQ, Breadcrumb, Review.',
      ];
      return [
        'Tambahkan structured data (JSON-LD) di dalam <head> atau <body>.',
        'Pilih schema yang sesuai: Organization, Article, Product, LocalBusiness, FAQ.',
        'Contoh minimal untuk website:',
        '{"@context":"https://schema.org","@type":"WebSite","name":"Nama Situs","url":"https://..."}',
        'Schema membantu Google menampilkan rich snippets di hasil pencarian.',
        'Generator gratis: technicalseo.com/tools/schema-markup-generator',
      ];
    }

    function wordCountRecs(count: number): string[] {
      if (count >= 300) return [
        `Konten cukup (${count} kata) — Google menyukai konten substantif.`,
        'Untuk artikel informatif, target 800–1500 kata untuk ranking lebih baik.',
        'Pastikan konten menjawab search intent pengguna secara lengkap.',
      ];
      if (count >= 100) return [
        `Konten agak tipis (${count} kata). Tambahkan lebih banyak informasi.`,
        'Konten minimal 300 kata untuk halaman penting.',
        'Tambahkan FAQ, penjelasan fitur, atau testimonial untuk menambah nilai.',
      ];
      return [
        `Konten sangat sedikit (${count} kata) — risiko dianggap thin content oleh Google.`,
        'Tulis minimal 300 kata konten berkualitas yang relevan dengan topik.',
        'Thin content adalah salah satu faktor penalti Google Panda.',
        'Tambahkan deskripsi produk/layanan, FAQ, atau konten edukasional.',
      ];
    }

    const checks = [
      {
        id: 1,
        category: 'On-Page',
        name: 'Title Tag',
        score: title.length >= 30 && title.length <= 60 ? 10 : title.length > 0 ? 5 : 0,
        maxScore: 10,
        status: title.length >= 30 && title.length <= 60 ? 'good' : title.length > 0 ? 'warning' : 'bad',
        info: title.length > 0 ? `${title.length} chars` : 'Missing',
        detail: title || 'No title found',
        recommendations: titleRecs(title.length),
        howToFix: title.length === 0
          ? '<title>Keyword Utama - Nama Brand</title>'
          : title.length > 60
          ? 'Persingkat judul agar ≤60 karakter'
          : title.length < 30
          ? 'Perluas judul hingga minimal 30 karakter'
          : null,
        docsUrl: 'https://developers.google.com/search/docs/appearance/title-link',
      },
      {
        id: 2,
        category: 'On-Page',
        name: 'Meta Description',
        score: desc.length >= 120 && desc.length <= 160 ? 10 : desc.length > 50 ? 6 : desc.length > 0 ? 3 : 0,
        maxScore: 10,
        status: desc.length >= 120 && desc.length <= 160 ? 'good' : desc.length > 50 ? 'warning' : 'bad',
        info: desc.length > 0 ? `${desc.length} chars` : 'Missing',
        detail: desc || 'No meta description found',
        recommendations: descRecs(desc.length, desc),
        howToFix: desc.length === 0
          ? '<meta name="description" content="Deskripsi halaman 120-160 karakter...">'
          : null,
        docsUrl: 'https://developers.google.com/search/docs/appearance/snippet',
      },
      {
        id: 3,
        category: 'On-Page',
        name: 'H1 Heading',
        score: h1.length === 1 ? 10 : h1.length > 1 ? 5 : 0,
        maxScore: 10,
        status: h1.length === 1 ? 'good' : h1.length > 1 ? 'warning' : 'bad',
        info: `${h1.length} found`,
        detail: h1.join(', ') || 'None found',
        recommendations: h1Recs(h1.length),
        howToFix: h1.length === 0 ? '<h1>Keyword Utama Halaman Ini</h1>' : null,
        docsUrl: 'https://developers.google.com/search/docs/appearance/visual-elements-gallery',
      },
      {
        id: 4,
        category: 'Media',
        name: 'Image Alt Tags',
        score: images.length === 0 ? 5 : missingAlt === 0 ? 10 : missingAlt <= 2 ? 5 : 0,
        maxScore: 10,
        status: images.length === 0 ? 'warning' : missingAlt === 0 ? 'good' : 'bad',
        info: `${missingAlt} missing alt`,
        detail: `${images.length} images total, ${missingAlt} missing alt text`,
        recommendations: altRecs(images.length, missingAlt),
        howToFix: missingAlt > 0 ? '<img src="foto.jpg" alt="Deskripsi gambar yang relevan">' : null,
        docsUrl: 'https://developers.google.com/search/docs/appearance/google-images',
      },
      {
        id: 5,
        category: 'Technical',
        name: 'HTTPS Security',
        score: isHttps ? 10 : 0,
        maxScore: 10,
        status: isHttps ? 'good' : 'bad',
        info: isHttps ? 'Secure' : 'Not secure',
        detail: isHttps ? 'Site uses HTTPS' : 'Site does not use HTTPS',
        recommendations: httpsRecs(isHttps),
        howToFix: !isHttps ? 'Install SSL certificate dan redirect HTTP → HTTPS (301)' : null,
        docsUrl: 'https://developers.google.com/search/docs/crawling-indexing/https',
      },
      {
        id: 6,
        category: 'Technical',
        name: 'Viewport / Mobile',
        score: viewport ? 10 : 0,
        maxScore: 10,
        status: viewport ? 'good' : 'bad',
        info: viewport ? 'Configured' : 'Missing',
        detail: viewport || 'No viewport meta tag found',
        recommendations: viewportRecs(viewport),
        howToFix: !viewport ? '<meta name="viewport" content="width=device-width, initial-scale=1">' : null,
        docsUrl: 'https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing',
      },
      {
        id: 7,
        category: 'Social',
        name: 'Open Graph Tags',
        score: ogTitle && ogDesc && ogImage ? 10 : ogTitle || ogDesc ? 5 : 0,
        maxScore: 10,
        status: ogTitle && ogDesc && ogImage ? 'good' : ogTitle || ogDesc ? 'warning' : 'bad',
        info: ogTitle ? 'Configured' : 'Missing',
        detail: `og:title: ${ogTitle || 'none'} | og:image: ${ogImage ? 'present' : 'missing'}`,
        recommendations: ogRecs(!!ogTitle, !!ogDesc, !!ogImage),
        howToFix: !ogTitle ? '<meta property="og:title" content="Judul">\n<meta property="og:description" content="Deskripsi">\n<meta property="og:image" content="https://...gambar.jpg">' : null,
        docsUrl: 'https://ogp.me/',
      },
      {
        id: 8,
        category: 'Technical',
        name: 'Canonical URL',
        score: canonical ? 10 : 0,
        maxScore: 10,
        status: canonical ? 'good' : 'warning',
        info: canonical ? 'Set' : 'Not set',
        detail: canonical || 'No canonical tag',
        recommendations: canonicalRecs(targetUrl, canonical),
        howToFix: !canonical ? `<link rel="canonical" href="${targetUrl}">` : null,
        docsUrl: 'https://developers.google.com/search/docs/crawling-indexing/canonicalization',
      },
      {
        id: 9,
        category: 'Technical',
        name: 'Schema Markup',
        score: hasSchema ? 10 : 0,
        maxScore: 10,
        status: hasSchema ? 'good' : 'warning',
        info: hasSchema ? 'Found' : 'Missing',
        detail: hasSchema ? 'JSON-LD schema detected' : 'No structured data found',
        recommendations: schemaRecs(hasSchema),
        howToFix: !hasSchema
          ? '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Nama","url":"https://..."}</script>'
          : null,
        docsUrl: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
      },
      {
        id: 10,
        category: 'Content',
        name: 'Content Length',
        score: wordCount >= 300 ? 10 : wordCount >= 100 ? 5 : 0,
        maxScore: 10,
        status: wordCount >= 300 ? 'good' : wordCount >= 100 ? 'warning' : 'bad',
        info: `${wordCount} words`,
        detail: `Page contains approximately ${wordCount} words`,
        recommendations: wordCountRecs(wordCount),
        howToFix: wordCount < 300 ? 'Tambahkan konten berkualitas: deskripsi, FAQ, manfaat produk/layanan' : null,
        docsUrl: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      },
    ];

    const totalScore = checks.reduce((acc, curr) => acc + curr.score, 0);
    const maxScore   = checks.reduce((acc, curr) => acc + curr.maxScore, 0);

    // Prioritized action plan for perfect score
    const actionPlan = checks
      .filter(c => c.status !== 'good')
      .sort((a, b) => (b.maxScore - b.score) - (a.maxScore - a.score))
      .map(c => ({
        id: c.id,
        name: c.name,
        priority: c.status === 'bad' ? 'high' : 'medium',
        pointsToGain: c.maxScore - c.score,
        quickFix: c.howToFix,
      }));

    return NextResponse.json({
      url: targetUrl,
      totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      loadTime,
      checks,
      actionPlan,
      details: {
        title, desc, h1, h2,
        imagesCount: images.length,
        missingAlt,
        canonical, robots,
        ogTitle, ogDesc, ogImage,
        viewport, charset,
        internalLinks, externalLinks,
        wordCount, hasSchema, isHttps,
      },
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal memproses URL. Pastikan URL valid dan dapat diakses.' }, { status: 500 });
  }
}