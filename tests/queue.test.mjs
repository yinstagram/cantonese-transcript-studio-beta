import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { testQueue } from '../queue.js';

test('queue keeps the Pomato smoke result honest', () => {
  const smoke = testQueue.evidence.find(item => item.id === 'pomato-smoke');
  assert.ok(smoke);
  assert.equal(smoke.status, 'completed');
  assert.match(smoke.title, /小薯茄／Pomato 31:58 真片/);
  assert.match(smoke.result, /412 cues/);
  assert.match(smoke.baseline, /ASR comparison baseline/);
  assert.match(smoke.baseline, /77\.4842%/);
  assert.match(smoke.boundary, /唔係人工 gold reference/);
  assert.match(smoke.boundary, /唔當準確度 PASS/);
});

test('queue has the remaining real-product acceptance tasks in priority order', () => {
  assert.equal(testQueue.updated, '2026-10-02');
  assert.deepEqual(testQueue.items.map(item => item.priority), ['P1', 'P2', 'P3']);
  assert.deepEqual(testQueue.items.map(item => item.id), [
    'timing-natural-segmentation',
    'triple-review-pure-audio',
    'multi-speaker-baseline'
  ]);
  for (const item of testQueue.items) {
    assert.ok(item.title.trim().length > 0);
    assert.ok(item.task.trim().length > 0);
    assert.ok(item.output.trim().length > 0);
  }
});

test('completed installed upgrade and edit loop move from queue to evidence', () => {
  const upgrade = testQueue.evidence.find(item => item.id === 'installed-upgrade');
  const editLoop = testQueue.evidence.find(item => item.id === 'real-edit-loop');
  assert.ok(upgrade);
  assert.ok(editLoop);
  assert.equal(upgrade.status, 'verified');
  assert.equal(editLoop.status, 'verified');
  assert.match(upgrade.result, /v0\.8\.24 Build 55/);
  assert.match(upgrade.result, /0 missing／0 changed/);
  assert.match(upgrade.boundary, /單機升級驗收/);
  assert.match(editLoop.result, /真實 60 秒錄音/);
  assert.match(editLoop.result, /SRT 逐 cue/);
  assert.match(editLoop.boundary, /原生 file-picker／drag-drop onboarding/);
  assert.ok(!testQueue.items.some(item => ['installed-upgrade', 'real-edit-loop'].includes(item.id)));
});

test('queue section is navigable, rendered from one authority, and styled', async () => {
  const html = await readFile('index.html', 'utf8');
  const app = await readFile('app.js', 'utf8');
  const styles = await readFile('styles.css', 'utf8');
  assert.ok(html.includes('href="#queue"'));
  assert.ok(html.includes('id="queue"'));
  assert.ok(html.includes('id="queue-evidence-list"'));
  assert.ok(html.includes('id="queue-list"'));
  assert.ok(app.includes("from './queue.js'"));
  assert.ok(app.includes('testQueue.evidence.forEach'));
  assert.ok(app.includes('testQueue.items.forEach'));
  assert.ok(styles.includes('.queue-section'));
  assert.ok(!html.includes('小雪'));
  assert.ok(!app.includes('小雪'));
});
