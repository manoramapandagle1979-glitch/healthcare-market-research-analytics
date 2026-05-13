// One-off ETL: stream the WordPress mysqldump and extract reports → JSON.
//
// Usage:
//   node scripts/extract-wp-reports.mjs <sqlFile> discover
//   node scripts/extract-wp-reports.mjs <sqlFile> extract <postTypeCsv>
//
// Assumes mysqldump default formatting: `INSERT INTO `tbl` VALUES` followed by
// one `(...)` tuple per line, terminated by `;`. Real newlines inside string
// fields are escaped as `\n`, so line-based reading is safe.

import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';

const [, , sqlFile, mode = 'discover', typesCsv = ''] = process.argv;
if (!sqlFile) {
  console.error('usage: extract-wp-reports.mjs <sql> <discover|extract> [postTypeCsv]');
  process.exit(1);
}

const TARGET_TYPES = new Set(typesCsv.split(',').map((s) => s.trim()).filter(Boolean));

// Tables we care about. We stream the whole file once; rows for non-listed
// tables are skipped cheaply.
// Postmeta keys we don't want — Elementor blobs, page-builder caches, SEO plugin
// internals, edit locks. These dominate memory and aren't useful as report data.
const META_SKIP = new Set([
  '_edit_lock', '_edit_last',
  '_elementor_data', '_elementor_edit_mode', '_elementor_template_type',
  '_elementor_version', '_elementor_pro_version', '_elementor_page_assets',
  '_elementor_controls_usage', '_elementor_page_settings', '_elementor_css',
  '_elementor_inline_font_icons', '_elementor_conditions',
  'porto_page_builder_html', '_oembed_time', 'classic-editor-remember',
  '_wp_old_slug', '_wp_old_date',
]);
const META_SKIP_PREFIX = [
  '_oembed_', '_yoast_', '_aioseo_', '_wpil_', '_rank_math_', '_seopress_',
  '_jetpack_', '_litespeed_', '_thumbnail_data', '_pmxi_', '_pmxe_',
  '_thrive_', '_genesis_',
];

const TABLES_OF_INTEREST = new Set([
  'wp_posts',
  'wp_postmeta',
  'wp_terms',
  'wp_term_taxonomy',
  'wp_term_relationships',
]);

// Parse one MySQL VALUES tuple. Fields are: number | 'quoted' | NULL.
// Handles backslash escapes inside single-quoted strings.
function parseTuple(line) {
  // Strip leading `(` and trailing `)` plus optional `,` or `;`
  let s = line.trim();
  if (s.endsWith(',') || s.endsWith(';')) s = s.slice(0, -1);
  if (!s.startsWith('(') || !s.endsWith(')')) return null;
  s = s.slice(1, -1);

  const fields = [];
  let i = 0;
  const n = s.length;
  while (i < n) {
    const c = s[i];
    if (c === "'") {
      // quoted string
      let out = '';
      i++; // skip opening '
      while (i < n) {
        const ch = s[i];
        if (ch === '\\') {
          const nx = s[i + 1];
          // mysql escapes: \n \r \t \0 \Z \\ \' \" \b \%
          const map = { n: '\n', r: '\r', t: '\t', 0: '\0', Z: '\x1a', '\\': '\\', "'": "'", '"': '"', b: '\b' };
          out += nx in map ? map[nx] : nx;
          i += 2;
        } else if (ch === "'") {
          // Could be doubled '' (mysqldump usually uses \' but be safe)
          if (s[i + 1] === "'") { out += "'"; i += 2; }
          else { i++; break; }
        } else {
          out += ch;
          i++;
        }
      }
      fields.push(out);
    } else if (s.substr(i, 4).toUpperCase() === 'NULL' && (i + 4 === n || s[i + 4] === ',')) {
      fields.push(null);
      i += 4;
    } else {
      // bare token (number, hex, etc.) until next comma at depth 0
      let j = i;
      while (j < n && s[j] !== ',') j++;
      const tok = s.slice(i, j).trim();
      const num = Number(tok);
      fields.push(Number.isFinite(num) && tok !== '' ? num : tok);
      i = j;
    }
    // skip comma + whitespace
    while (i < n && (s[i] === ',' || s[i] === ' ')) i++;
  }
  return fields;
}

const POST_COLS = [
  'ID', 'post_author', 'post_date', 'post_date_gmt', 'post_content', 'post_title',
  'post_excerpt', 'post_status', 'comment_status', 'ping_status', 'post_password',
  'post_name', 'to_ping', 'pinged', 'post_modified', 'post_modified_gmt',
  'post_content_filtered', 'post_parent', 'guid', 'menu_order', 'post_type',
  'post_mime_type', 'comment_count',
];
const POSTMETA_COLS = ['meta_id', 'post_id', 'meta_key', 'meta_value'];
const TERMS_COLS = ['term_id', 'name', 'slug', 'term_group'];
const TAX_COLS = ['term_taxonomy_id', 'term_id', 'taxonomy', 'description', 'parent', 'count'];
const REL_COLS = ['object_id', 'term_taxonomy_id', 'term_order'];

function rowToObject(cols, tuple) {
  const o = {};
  for (let i = 0; i < cols.length; i++) o[cols[i]] = tuple[i];
  return o;
}

// State
let currentTable = null;
const postTypeCounts = new Map();
const keptPosts = []; // posts of target post_types
const keptPostIds = new Set();
const postmetaByPostId = new Map(); // post_id -> { meta_key: meta_value }
const termsById = new Map();
const taxonomyById = new Map(); // term_taxonomy_id -> { term_id, taxonomy }
const relsByObjectId = new Map(); // object_id -> [term_taxonomy_id]

function streamFile(onLine) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(sqlFile, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    let lineNo = 0;
    let sawProgressAt = Date.now();
    let table = null;
    rl.on('line', (raw) => {
      lineNo++;
      if (lineNo % 200000 === 0) {
        const now = Date.now();
        process.stderr.write(`  line ${lineNo.toLocaleString()}  table=${table || '-'}  +${((now - sawProgressAt) / 1000).toFixed(1)}s\n`);
        sawProgressAt = now;
      }
      const m = raw.match(/^INSERT INTO `([^`]+)` VALUES/);
      if (m) { table = TABLES_OF_INTEREST.has(m[1]) ? m[1] : null; return; }
      if (!table) return;
      if (!raw.startsWith('(')) { table = null; return; }
      const tuple = parseTuple(raw);
      if (!tuple) return;
      onLine(table, tuple);
    });
    rl.on('close', resolve);
    rl.on('error', reject);
  });
}

async function run() {
  // Pass A: scan wp_posts only (count types in discover mode; collect kept rows in extract mode)
  process.stderr.write('Pass A: scanning wp_posts...\n');
  await streamFile((table, tuple) => {
    if (table !== 'wp_posts') return;
    const r = rowToObject(POST_COLS, tuple);
    const t = r.post_type;
    postTypeCounts.set(t, (postTypeCounts.get(t) || 0) + 1);
    if (mode === 'extract' && TARGET_TYPES.has(t) && r.post_status === 'publish') {
      keptPosts.push(r);
      keptPostIds.add(r.ID);
    }
  });

  if (mode === 'discover') {
    const sorted = [...postTypeCounts.entries()].sort((a, b) => b[1] - a[1]);
    console.log('post_type counts (post_status = any):');
    for (const [t, c] of sorted) console.log(`  ${String(t).padEnd(40)} ${c}`);
    return;
  }

  process.stderr.write(`Pass A done: ${keptPosts.length} kept posts.\n`);
  process.stderr.write('Pass B: scanning postmeta + taxonomies...\n');

  // Pass B: now that kept IDs are known, collect joins
  await streamFile((table, tuple) => {
    if (table === 'wp_postmeta') {
      const r = rowToObject(POSTMETA_COLS, tuple);
      if (!keptPostIds.has(r.post_id)) return;
      if (META_SKIP.has(r.meta_key) || (typeof r.meta_key === 'string' && META_SKIP_PREFIX.some(p => r.meta_key.startsWith(p)))) return;
      let bag = postmetaByPostId.get(r.post_id);
      if (!bag) { bag = {}; postmetaByPostId.set(r.post_id, bag); }
      if (r.meta_key in bag) {
        const v = bag[r.meta_key];
        if (Array.isArray(v)) v.push(r.meta_value);
        else bag[r.meta_key] = [v, r.meta_value];
      } else bag[r.meta_key] = r.meta_value;
    } else if (table === 'wp_terms') {
      const r = rowToObject(TERMS_COLS, tuple);
      termsById.set(r.term_id, r);
    } else if (table === 'wp_term_taxonomy') {
      const r = rowToObject(TAX_COLS, tuple);
      taxonomyById.set(r.term_taxonomy_id, r);
    } else if (table === 'wp_term_relationships') {
      const r = rowToObject(REL_COLS, tuple);
      if (!keptPostIds.has(r.object_id)) return;
      let arr = relsByObjectId.get(r.object_id);
      if (!arr) { arr = []; relsByObjectId.set(r.object_id, arr); }
      arr.push(r.term_taxonomy_id);
    }
  });

  // Build joined report records
  const reports = keptPosts.map((p) => {
    const meta = postmetaByPostId.get(p.ID) || {};
    const ttIds = relsByObjectId.get(p.ID) || [];
    const taxonomies = {};
    for (const ttId of ttIds) {
      const tax = taxonomyById.get(ttId);
      if (!tax) continue;
      const term = termsById.get(tax.term_id);
      if (!term) continue;
      const bucket = taxonomies[tax.taxonomy] || (taxonomies[tax.taxonomy] = []);
      bucket.push({ name: term.name, slug: term.slug });
    }
    return {
      id: p.ID,
      slug: p.post_name,
      title: p.post_title,
      excerpt: p.post_excerpt,
      content: p.post_content,
      status: p.post_status,
      type: p.post_type,
      date: p.post_date,
      modified: p.post_modified,
      guid: p.guid,
      author: p.post_author,
      taxonomies,
      meta,
    };
  });

  const outDir = path.resolve('lib/wp-data');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'reports.json');
  fs.writeFileSync(outPath, JSON.stringify(reports, null, 2));
  console.error(`\nWrote ${reports.length} reports → ${outPath}`);
  console.error(`postmeta keys collected: ${[...new Set(reports.flatMap(r => Object.keys(r.meta)))].length}`);
  console.error(`taxonomies seen: ${[...new Set(reports.flatMap(r => Object.keys(r.taxonomies)))].join(', ')}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
