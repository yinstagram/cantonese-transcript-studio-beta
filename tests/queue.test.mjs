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

test('queue has five real-product acceptance tasks in priority order', () => {
  assert.deepEqual(testQueue.items.map(item => item.priority), ['P1', 'P2', 'P3', 'P4', 'P5']);
  assert.deepEqual(testQueue.items.map(item => item.id), [
    'installed-upgrade',
    'real-edit-loop',
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
