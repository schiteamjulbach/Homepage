import assert from 'node:assert/strict';
import { mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { renderToStaticMarkup } from 'react-dom/server';
import { PGlite } from '@electric-sql/pglite';

await mkdir('.sites-runtime', { recursive: true });
const outfile = path.resolve('.sites-runtime/seo-test.mjs');
await build({
  stdin: {
    contents: `export {default as home} from './app/page';
      export {default as layout} from './app/layout';
      export {default as detail, generateMetadata} from './app/veranstaltungen/[id]/page';
      export {default as sitemap} from './app/sitemap';
      export {default as robots} from './app/robots';
      export {database} from './lib/server-db';
      export {serializeJsonLd} from './lib/seo';`,
    resolveDir: process.cwd(), sourcefile: 'seo-entry.ts', loader: 'ts',
  },
  bundle: true, format: 'esm', platform: 'node', outfile,
  banner: { js: 'import {createRequire as seoCreateRequire} from "node:module"; const require=seoCreateRequire(import.meta.url);' },
  external: ['react', 'react/*', 'react-dom', 'react-dom/*'],
  loader: { '.css': 'empty' },
  alias: {
    '@vercel/blob': path.resolve('tests/blob-double.mjs'),
    '@neondatabase/serverless': path.resolve('tests/neon-double.mjs'),
  },
  plugins: [{ name: 'not-found-test', setup(builder) {
    builder.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: 'navigation', namespace: 'test' }));
    builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export function notFound(){throw new Error("NOT_FOUND")}' }));
  } }],
  logLevel: 'silent',
});
const db = new PGlite(await mkdtemp(path.join(tmpdir(), 'julbach-seo-')));
globalThis.__postgresTestDb = db;
process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
try {
  const seo = await import(pathToFileURL(outfile).href);
  const home = renderToStaticMarkup(seo.layout({ children: await seo.home() }));
  assert.match(home, /Kinderskikurs/);
  assert.match(home, /href="\/veranstaltungen\/1"/);
  const scripts = [...home.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.equal(scripts[0]['@type'], 'Organization');
  assert.equal(scripts[0].url, 'https://www.schiteam-julbach.at/');
  assert.equal(seo.robots().sitemap, 'https://www.schiteam-julbach.at/sitemap.xml');
  assert.deepEqual((await seo.sitemap()).map(entry => entry.url), [
    'https://www.schiteam-julbach.at/', 'https://www.schiteam-julbach.at/veranstaltungen/1',
  ]);
  const props = { params: Promise.resolve({ id: '1' }) };
  const metadata = await seo.generateMetadata(props);
  assert.match(metadata.title, /Kinderskikurs/);
  assert.equal(metadata.alternates.canonical, 'https://www.schiteam-julbach.at/veranstaltungen/1');
  const detail = renderToStaticMarkup(await seo.detail(props));
  const event = JSON.parse(detail.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
  assert.equal(event['@type'], 'Event');
  assert.equal(event.startDate, '2026-12-27');
  assert.equal(event.endDate, '2026-12-29');
  assert.equal(event.location.name, 'Hochficht');
  assert.match(detail, /Jetzt anmelden/);
  assert.match(detail, /Wichtige Informationen/);
  assert.equal(JSON.parse(seo.serializeJsonLd({ name: '</script><script>' })).name, '</script><script>');
  assert.ok(!seo.serializeJsonLd({ name: '</script>' }).includes('<'));
  await seo.database().prepare('UPDATE events SET visible=0 WHERE id=1').run();
  assert.equal((await seo.sitemap()).length, 1);
  await assert.rejects(() => seo.detail(props), /NOT_FOUND/);
  await assert.rejects(() => seo.detail({ params: Promise.resolve({ id: '01' }) }), /NOT_FOUND/);
  console.log('SEO checks passed: server-rendered content, crawlable links, canonical metadata, Organization/Event JSON-LD, dates, visibility, sitemap and escaping.');
} finally {
  await db.close();
  delete globalThis.__postgresTestDb;
}
