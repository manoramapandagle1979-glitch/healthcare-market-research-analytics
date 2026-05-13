// Read the raw extract (lib/wp-data/reports.json) and project each row into a
// clean shape the Next.js app can consume. Emits:
//   lib/wp-data/reports.catalog.json   slim list rows (no large HTML blobs)
//   lib/wp-data/reports.full.json      full rows with description/toc/methodology/faqs
//   lib/wp-data/industries.json        product_cat taxonomy summary

import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('lib/wp-data/reports.json');
const OUT_DIR = path.dirname(SRC);

const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'));

// Postmeta can repeat the same meta_key with identical (or near-identical)
// values; the extractor preserves these as arrays. For most fields we just want
// the first non-empty distinct value.
const pick = (v) => {
  if (Array.isArray(v)) {
    const seen = [...new Set(v.filter((x) => x != null && x !== ''))];
    return seen[0] ?? '';
  }
  return v ?? '';
};
const num = (v) => {
  const x = pick(v);
  if (x === '' || x == null) return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
};
const ENTITIES = { '&amp;': '&', '&#038;': '&', '&quot;': '"', '&#39;': "'", '&#039;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ' };
const decode = (s) => s.replace(/&(?:amp|#0?38|quot|#0?39|lt|gt|nbsp);/g, (m) => ENTITIES[m] || m);
const str = (v) => {
  const x = pick(v);
  return decode(typeof x === 'string' ? x : x == null ? '' : String(x));
};

// WP plugin shortcodes that won't render usefully in our app (chart embeds,
// social-proof schema, SEO snippets). Whitelisted by exact name to avoid
// stripping legitimate body text like "[Growth Factors]".
const SHORTCODES = [
  'cagr-ij',
  'ij_bar_charts', 'ij_bar_single_charts', 'ij_pie_charts',
  'ij_dough_charts', 'ij_doughnut_charts',
  'embedsocial_schema', 'embedsocial_reviews',
  'rank_math_rich_snippet',
  'visualizer', 'wpforms', 'caldera_form', 'gravityform', 'ninja_form',
]
// Use \b after the name so "[ij_bar_charts<span>...</span>reportid=...]" still
// matches — the source HTML sometimes has stray tags glued inside the brackets.
const SHORTCODE_RE = new RegExp(
  `\\[/?(?:${SHORTCODES.map(s => s.replace(/-/g, '\\-')).join('|')})\\b[^\\]]*\\]`,
  'gi',
)

// WordPress's `the_content` filter normally runs `wpautop` to convert blank-
// line-separated bare text into <p> blocks. The dump stores the raw post_content,
// so we replicate it here. Also promotes lone `<strong>…</strong>` lines into
// <h3> so the report's "Cannabis Testing Market: Overview"-style section labels
// render as actual headings instead of bold text run inline with the next paragraph.
function wpautop(s) {
  if (!s) return s
  let out = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Force a blank line around block elements so the next split picks them up
  // as separate chunks even when the source ran `</h4>\nbare text` with no
  // blank line in between.
  const BLOCK_TAG = '(?:h[1-6]|table|thead|tbody|tr|td|th|ul|ol|li|blockquote|pre|figure|div|hr)'
  out = out.replace(new RegExp(`(<\\/${BLOCK_TAG}>)`, 'gi'), '$1\n\n')
  out = out.replace(new RegExp(`(<${BLOCK_TAG}\\b[^>]*>)`, 'gi'), '\n\n$1')

  const chunks = out.split(/\n{2,}/).map(c => c.trim()).filter(Boolean)
  // Match opening or closing block tag — closing-only chunks like `</tr>` should
  // pass through verbatim, not get wrapped in <p>.
  const BLOCK_OPEN = /^<\/?(?:p|h[1-6]|ul|ol|li|table|thead|tbody|tr|td|th|blockquote|pre|figure|hr|div)\b/i
  // One or two consecutive <strong>...</strong> spans, possibly wrapped in
  // an <h\d> already — that's the WP "section header" pattern.
  const LONE_STRONG = /^(?:<strong>[\s\S]*?<\/strong>\s*){1,3}$/i

  return chunks.map(chunk => {
    if (BLOCK_OPEN.test(chunk)) {
      // If it's already an <h\d> wrapping a <strong>, unwrap to plain heading text.
      const hMatch = chunk.match(/^<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>$/i)
      if (hMatch) {
        const inner = hMatch[2].replace(/<\/?strong>/gi, '').trim()
        return `<${hMatch[1]}>${inner}</${hMatch[1]}>`
      }
      return chunk
    }
    if (LONE_STRONG.test(chunk)) {
      const text = chunk.replace(/<\/?strong>/gi, '').trim()
      return `<h3>${text}</h3>`
    }
    // Replace single newlines inside a chunk with a space (paragraph reflow).
    return `<p>${chunk.replace(/\n+/g, ' ')}</p>`
  }).join('\n')
}

// Sanitize HTML/text fields exported from WordPress: strip Thrive Architect
// placeholder divs, raw <img> tags, and known plugin shortcodes that render as
// raw text in our app. Idempotent.
function sanitizeHtml(s) {
  if (!s) return s
  let out = s
  // Thrive Architect placeholder markers — empty <div class="_tc_offscreen…"></div>
  out = out.replace(/<div\b[^>]*class\s*=\s*"[^"]*_tc_offscreen[^"]*"[^>]*>\s*<\/div>/gi, '')
  // For non-empty wrappers, just drop the offscreen class (so its CSS, if ever
  // loaded, can't hide real content). Single- or double-quoted attribute.
  out = out.replace(/\s*class\s*=\s*("|')_tc_offscreen[a-z]*\1/gi, '')
  // Strip <img> tags entirely; we don't host the images and they'd 404
  out = out.replace(/<img\b[^>]*\/?>/gi, '')
  // Drop now-empty figure wrappers left behind by image removal
  out = out.replace(/<figure\b[^>]*>\s*<\/figure>/gi, '')
  // Strip plugin shortcodes
  out = out.replace(SHORTCODE_RE, '')
  // Strip HTML4-era presentational attributes on tables/cells so our CSS can
  // own the look (border="1", cellspacing="1", cellpadding="1", align="…",
  // bgcolor="…", width="…" / height="…" on <td>/<th>/<tr>/<table>).
  out = out.replace(/\s(?:border|cellspacing|cellpadding|align|valign|bgcolor|width|height)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  // Strip ALL inline `style="..."` attributes. The WP source mixes pixel widths
  // (`<table style="width: 548px">`), legacy alignment, and font-weight overrides
  // that all fight our CSS. Easier to drop them globally.
  out = out.replace(/\s+style\s*=\s*("[^"]*"|'[^']*')/gi, '')
  // Apply WP-autop: wrap blank-line-separated bare text in <p>, and promote
  // lone <strong>...</strong> "lines" into <h3> section headings.
  out = wpautop(out)
  // Collapse 3+ blank lines (cosmetic; HTML doesn't care but keeps JSON tidier)
  out = out.replace(/(\n\s*){3,}/g, '\n\n')
  return out.trim()
}

// String + sanitize: for fields that are HTML-bearing.
const html = (v) => sanitizeHtml(str(v))

// Extract the "Market is segmented as follows" section from description HTML.
// Stops before the "Regional Coverage" block so only the dimension breakdown
// (By Offering, By Type, etc.) is included.
function extractSegmentation(descHtml) {
  if (!descHtml) return '';
  const markerIdx = descHtml.search(/is segmented as follows:/i);
  if (markerIdx === -1) return '';
  // Walk back to the opening <p> tag that wraps this sentence
  const pStart = descHtml.lastIndexOf('<p>', markerIdx);
  const segStart = pStart !== -1 ? pStart : markerIdx;
  // Find the "Regional Coverage" section and stop before it
  const regionalIdx = descHtml.search(/Regional Coverage/i);
  let segEnd = descHtml.length;
  if (regionalIdx !== -1 && regionalIdx > segStart) {
    const pBeforeRegional = descHtml.lastIndexOf('<p>', regionalIdx);
    segEnd = pBeforeRegional !== -1 ? pBeforeRegional : regionalIdx;
  }
  return descHtml.slice(segStart, segEnd).trim();
}

// Pick a reasonable "industry" from product_cat (top-most, dropping generic Healthcare).
function pickIndustry(productCat = []) {
  const names = productCat.map((t) => t.name);
  const specific = names.find((n) => n.toLowerCase() !== 'healthcare');
  return specific || names[0] || 'Healthcare';
}

// Reconstruct ACF repeater rows like faqs_0_faq-title, faqs_0_faq_description.
function gatherFaqs(meta) {
  const out = [];
  let i = 0;
  while (true) {
    const titleK = `faqs_${i}_faq-title`;
    const titleK2 = `faqs_${i}_faq_title`;
    const descK = `faqs_${i}_faq_description`;
    const t = meta[titleK] || meta[titleK2];
    const d = meta[descK];
    if (!t && !d) break;
    out.push({ q: str(t), a: str(d) });
    i++;
  }
  return out;
}

const slimRows = [];
const industryCounts = new Map();
const reportsDir = path.join(OUT_DIR, 'reports');
fs.rmSync(reportsDir, { recursive: true, force: true });
fs.mkdirSync(reportsDir, { recursive: true });

for (const r of raw) {
  const m = r.meta || {};
  const cats = r.taxonomies?.product_cat || [];
  const tags = r.taxonomies?.product_tag || [];
  const countries = r.taxonomies?.country || [];

  const industry = decode(pickIndustry(cats));
  industryCounts.set(industry, (industryCounts.get(industry) || 0) + 1);

  // Parse "YYYYMMDD" → "YYYY-MM-DD"; fall back to post_date.
  const rawDate = str(m.report_published_date);
  const publishedDate =
    /^\d{8}$/.test(rawDate)
      ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
      : rawDate || r.date.slice(0, 10);
  // study_period is like "2025-2034".
  const study = str(m.study_period);
  const studyMatch = study.match(/(\d{4})\s*[-–]\s*(\d{4})/);
  const yearStart = studyMatch ? Number(studyMatch[1]) : null;
  const yearEnd = studyMatch ? Number(studyMatch[2]) : null;

  const slim = {
    id: r.id,
    slug: r.slug,
    title: str(r.title),
    excerpt: sanitizeHtml(str(r.excerpt || '')),
    industry,
    categories: cats.map((c) => decode(c.name)),
    tags: tags.map((t) => decode(t.name)).slice(0, 8),
    regions: countries.map((c) => decode(c.name)),
    publishedDate,
    pages: str(m.report_pages) || null,
    cagr: num(m.cagr),
    baseYear: num(m.research_base_year),
    yearStart,
    yearEnd,
    studyPeriod: study || null,
    code: str(m.report_code) || null,
    prices: {
      single: num(m._price),
      team: num(m.team_price),
      enterprise: num(m.enterprise_price),
      dataPack: num(m.data_pack),
    },
    modified: r.modified,
  };

  const descriptionHtml = html(m.reports_description);
  const full = {
    ...slim,
    description: descriptionHtml,
    segmentation: extractSegmentation(descriptionHtml),
    tableOfContents: html(m.table_of_contents),
    methodology: html(m.methodology),
    keyPlayers: html(m.key_players),
    faqs: gatherFaqs(m).map(f => ({ q: sanitizeHtml(f.q), a: sanitizeHtml(f.a) })),
    seo: {
      title: str(m.rank_math_title) || str(m.wpcc_seo_meta_title) || '',
      description: str(m.rank_math_description) || str(m.wpcc_seo_meta_description) || '',
    },
  };

  slimRows.push(slim);
  // One file per report under lib/wp-data/reports/<slug>.json — keeps
  // detail-page payloads small and avoids loading a 190 MB monolith.
  if (slim.slug) fs.writeFileSync(path.join(reportsDir, `${slim.slug}.json`), JSON.stringify(full));
}

const catalogPath = path.join(OUT_DIR, 'reports.catalog.json');
const industriesPath = path.join(OUT_DIR, 'industries.json');

fs.writeFileSync(catalogPath, JSON.stringify(slimRows));

// subIndustries per industry: derive a clean topic from each report title and
// keep the most-recent N unique topics. Strip leading "Global", trailing
// year ranges, and the literal "Market" suffix to leave the segment name.
function topicFromTitle(t) {
  return t
    .replace(/^Global\s+/i, '')
    .replace(/\s+\d{4}\s*[-–]\s*\d{4}\s*$/, '')
    .replace(/\s+Market\s*$/i, '')
    .trim();
}
const titlesByIndustry = new Map();
for (const r of slimRows) {
  let arr = titlesByIndustry.get(r.industry);
  if (!arr) { arr = []; titlesByIndustry.set(r.industry, arr); }
  arr.push(topicFromTitle(r.title));
}
const industries = [...industryCounts.entries()]
  .map(([name, count]) => {
    const list = titlesByIndustry.get(name) || [];
    const subIndustries = [...new Set(list)].slice(0, 12);
    return {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      count,
      subIndustries,
    };
  })
  .sort((a, b) => b.count - a.count);
fs.writeFileSync(industriesPath, JSON.stringify(industries, null, 2));

const sz = (p) => (fs.statSync(p).size / 1024 / 1024).toFixed(1) + ' MB';
const dirSize = (d) => fs.readdirSync(d).reduce((a, f) => a + fs.statSync(path.join(d, f)).size, 0);
console.log(`catalog:    ${slimRows.length} rows   ${sz(catalogPath)}   ${catalogPath}`);
console.log(`reports/:   ${fs.readdirSync(reportsDir).length} files   ${(dirSize(reportsDir) / 1024 / 1024).toFixed(1)} MB total   ${reportsDir}`);
console.log(`industries: ${industries.length} buckets   ${sz(industriesPath)}   ${industriesPath}`);
console.log('top industries:');
for (const i of industries.slice(0, 15)) console.log(`  ${String(i.name).padEnd(35)} ${i.count}`);
