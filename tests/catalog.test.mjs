import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { catalog, featuresByCategory } from '../features.js';

const requiredCategories = [
  'import', 'review', 'dictionary', 'editing', 'style',
  'outputs', 'insights', 'live', 'camman', 'settings'
];

const requiredFeatures = [
  'media-import', 'public-url', 'queue-retry-history',
  'search-time-confidence', 'model-consensus', 'speaker-labels',
  'dictionary-terms', 'dictionary-memory',
  'subtitle-text-time', 'subtitle-speakers', 'subtitle-autosave',
  'subtitle-style', 'brand-safe-zone', 'subtitle-translation',
  'txt-exports', 'srt-vtt-exports', 'json-csv-exports', 'ass-export', 'burned-mp4',
  'ai-insights', 'concept-explanation',
  'live-captions', 'live-light-qa', 'interview-coach',
  'camman-project-enroll', 'camman-switch-unknown',
  'local-api-shortcuts', 'models-hardware', 'local-network-boundary'
];

test('catalog covers every required category without duplicates', () => {
  assert.deepEqual(catalog.categories.map(category => category.id), requiredCategories);
  assert.equal(new Set(catalog.categories.map(category => category.id)).size, requiredCategories.length);
  for (const category of catalog.categories) {
    assert.ok(category.title.length > 0);
    assert.ok(category.summary.length > 0);
    assert.ok(featuresByCategory(category.id).length > 0);
  }
});

test('every feature uses the same four-field public format', () => {
  const ids = catalog.features.map(feature => feature.id);
  assert.deepEqual([...ids].sort(), [...requiredFeatures].sort());
  assert.equal(new Set(ids).size, requiredFeatures.length);
  for (const feature of catalog.features) {
    assert.ok(requiredCategories.includes(feature.category));
    for (const key of ['title', 'situation', 'input', 'output', 'conditions']) {
      assert.equal(typeof feature[key], 'string', `${feature.id}.${key}`);
      assert.ok(feature[key].trim().length > 0, `${feature.id}.${key}`);
    }
    assert.ok(['implemented', 'historical'].includes(feature.evidence), feature.id);
  }
  const historical = catalog.features.filter(feature => feature.evidence === 'historical').map(feature => feature.id);
  assert.deepEqual(historical, [
    'dictionary-memory', 'subtitle-translation', 'ass-export', 'burned-mp4'
  ]);
});

test('not-provided roadmap items stay outside shipped feature claims', () => {
  const items = catalog.notProvided.items;
  assert.deepEqual(items.map(item => item.id), ['gimbal-control', 'mobile-background', 'multicam-sync']);
  assert.equal(catalog.notProvided.status, '未提供');
  for (const item of items) {
    assert.ok(item.title.length > 0);
    assert.ok(item.note.length > 0);
    assert.ok(!catalog.features.some(feature => feature.title === item.title));
  }
  assert.match(catalog.boundary, /未逐項重新驗證/);
});

test('website markup renders the catalog from the single feature authority', async () => {
  const html = await readFile('index.html', 'utf8');
  const app = await readFile('app.js', 'utf8');
  const styles = await readFile('styles.css', 'utf8');
  assert.ok(html.includes('id="catalog"'));
  assert.ok(html.includes('id="catalog-list"'));
  assert.ok(html.includes('id="not-provided-items"'));
  assert.ok(app.includes("from './features.js'"));
  assert.ok(app.includes('featuresByCategory(category.id)'));
  assert.ok(app.includes("evidenceLabels[feature.evidence]"));
  assert.ok(styles.includes('.catalog-category'));
  assert.ok(styles.includes('.not-provided'));
});
