import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { content } from '../content.js';
import { DURATION } from '../demo-state.js';

test('website renders the approved 15-second film with accessible custom controls', async () => {
  const html = await readFile('index.html', 'utf8');
  const app = await readFile('app.js', 'utf8');
  const film = await stat('assets/lazycamman-tutorial-short.mp4');
  const poster = await stat('assets/lazycamman-tutorial-short-poster.jpg');

  assert.equal(DURATION, 15);
  assert.match(html, /<video[^>]+id="tutorial-video"[^>]+src="assets\/lazycamman-tutorial-short\.mp4"/);
  assert.match(html, /poster="assets\/lazycamman-tutorial-short-poster\.jpg"/);
  assert.match(html, /preload="metadata"/);
  assert.match(html, /playsinline/);
  assert.match(html, /aria-label="Lazy Camman 15 秒 B 風格教學動畫/);
  assert.ok(!html.includes('id="guests-image"'));
  assert.ok(!html.includes('autoplay'));
  assert.ok(film.isFile() && film.size > 1_000_000);
  assert.ok(poster.isFile() && poster.size > 20_000);

  assert.match(app, /const video = \$\('tutorial-video'\)/);
  assert.match(app, /const time = video\.currentTime/);
  assert.match(app, /video\.currentTime = Math\.max\(0, Math\.min\(DURATION, Number\(value\) \|\| 0\)\)/);
  assert.match(app, /video\.currentTime = DURATION/);
  assert.match(app, /'loadedmetadata', 'timeupdate', 'seeked', 'play', 'pause', 'ended'/);
  assert.ok(!app.includes('requestAnimationFrame'));
  assert.ok(!app.includes('performance.now'));
});

test('published scenes match the one 15-second public-cut authority', async () => {
  const storyboard = JSON.parse(await readFile('.qa/b-style-pilot/full-film-storyboard.json', 'utf8'));
  const publicCut = storyboard.publicCut;
  assert.equal(publicCut.durationSeconds, 15);
  assert.equal(content.scenes.length, 5);
  assert.deepEqual(content.scenes.map(scene => [scene.start, scene.end]), [
    [0, 2], [2, 4], [4, 10.4], [10.4, 12.4], [12.4, 15]
  ]);
  assert.deepEqual(publicCut.scenes.map(scene => [scene.sourceId, scene.start, scene.end]), [
    ['scene-01-interview', 0, 2],
    ['scene-02-setup', 2, 4],
    ['scene-03-register', 4, 10.4],
    ['scene-04-ready', 10.4, 12.4],
    ['scene-05-pilot', 12.4, 13.5],
    ['scene-06-switch', 13.5, 15]
  ]);
});
