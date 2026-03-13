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

    const title = $('title').text().trim() || '';
    const desc = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').map((_, el) => $(el).text().trim()).get();
    const h2 = $('h2').map((_, el) => $(el).text().trim()).get();
    const images = $('img').get();
    const missingAlt = images.filter((img) => !$(img).attr('alt')).length;
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    const robots = $('meta[name="robots"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDesc = $('meta[property="og:description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    const viewport = $('meta[name="viewport"]').attr('content') || '';
    const charset = $('meta[charset]').attr('charset') || '';
    const links = $('a').get();
    const internalLinks = links.filter((a) => {
      const href = $(a).attr('href') || '';
      return href.startsWith('/') || href.includes(new URL(targetUrl).hostname);
    }).length;
    const externalLinks = links.length - internalLinks;
    const wordCount = $('body').text().split(/\s+/).filter(Boolean).length;
    const hasSchema = html.includes('application/ld+json');
    const hasSitemap = canonical.includes('sitemap') || false;
    const isHttps = targetUrl.startsWith('https');

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
      },
    ];

    const totalScore = checks.reduce((acc, curr) => acc + curr.score, 0);
    const maxScore = checks.reduce((acc, curr) => acc + curr.maxScore, 0);

    return NextResponse.json({
      url: targetUrl,
      totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      loadTime,
      checks,
      details: {
        title,
        desc,
        h1,
        h2,
        imagesCount: images.length,
        missingAlt,
        canonical,
        robots,
        ogTitle,
        ogDesc,
        ogImage,
        viewport,
        charset,
        internalLinks,
        externalLinks,
        wordCount,
        hasSchema,
        isHttps,
      },
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal memproses URL. Pastikan URL valid dan dapat diakses.' }, { status: 500 });
  }
}