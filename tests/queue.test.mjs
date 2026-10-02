import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
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
    'o8-human-playback-review',
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

test('O8 automatic gate is separated from human playback acceptance', async () => {
  const gate = testQueue.evidence.find(item => item.id === 'o8-production-timing-gate');
  const review = testQueue.items.find(item => item.id === 'o8-human-playback-review');
  assert.ok(gate);
  assert.ok(review);
  assert.equal(gate.status, 'completed');
  assert.match(gate.result, /1,443 cues／10,420 字/);
  assert.match(gate.result, /1,096 個邊界/);
  assert.match(gate.result, /與模型字級時間一致/);
  assert.match(gate.result, /相對模型字級時間，結尾偏差不超過 500ms/);
  assert.match(gate.result, /Speaker 前綴 0/);
  assert.match(gate.boundary, /17 個指定播放位/);
  assert.match(gate.boundary, /release verdict 仍未宣告/);
  assert.match(review.task, /17 個播放位|0:00、0:21/);
  assert.match(review.task, /文字啱唔啱/);
  assert.match(review.task, /斷句自然唔自然/);
  assert.match(review.output, /17 個樣本嘅人手 verdict/);
  assert.equal(review.reviewPoints.length, 17);
  assert.equal(review.candidateSrt.path, 'assets/o8-candidate-20261002.srt');
  const candidateSrt = await readFile(review.candidateSrt.path);
  assert.equal(createHash('sha256').update(candidateSrt).digest('hex'), review.candidateSrt.sha256);
  assert.equal(candidateSrt.toString('utf8').match(/^\d+$/gm).length, 1443);
  assert.deepEqual(review.reviewPoints.map(point => point.label), [
    '0:00', '0:21', '0:25', '0:44', '1:38', '4:40', '8:00', '10:48',
    '13:56', '17:21', '20:09', '23:02', '23:28', '26:56', '28:33',
    '30:13', '31:48'
  ]);
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
  assert.ok(app.includes('queue-candidate-download'));
  assert.ok(app.includes('queue-review-points'));
  assert.ok(styles.includes('.queue-section'));
  assert.ok(!html.includes('小雪'));
  assert.ok(!app.includes('小雪'));
});
