import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { content } from '../content.js';

test('website renders the approved 35-second film with accessible custom controls', async () => {
  const html = await readFile('index.html', 'utf8');
  const app = await readFile('app.js', 'utf8');
  const film = await stat('assets/lazycamman-tutorial.mp4');
  const poster = await stat('assets/lazycamman-tutorial-poster.jpg');

  assert.match(html, /<video[^>]+id="tutorial-video"[^>]+src="assets\/lazycamman-tutorial\.mp4"/);
  assert.match(html, /poster="assets\/lazycamman-tutorial-poster\.jpg"/);
  assert.match(html, /preload="metadata"/);
  assert.match(html, /playsinline/);
  assert.match(html, /aria-label="Lazy Camman 35 秒 B 風格教學動畫/);
  assert.ok(!html.includes('id="guests-image"'));
  assert.ok(!html.includes('autoplay'));
  assert.ok(film.isFile() && film.size > 4_000_000);
  assert.ok(poster.isFile() && poster.size > 20_000);

  assert.match(app, /const video = \$\('tutorial-video'\)/);
  assert.match(app, /const time = video\.currentTime/);
  assert.match(app, /video\.currentTime = Math\.max\(0, Math\.min\(DURATION, Number\(value\) \|\| 0\)\)/);
  assert.match(app, /video\.currentTime = DURATION/);
  assert.match(app, /'loadedmetadata', 'timeupdate', 'seeked', 'play', 'pause', 'ended'/);
  assert.ok(!app.includes('requestAnimationFrame'));
  assert.ok(!app.includes('performance.now'));
});

test('published scenes match the one 35-second storyboard timeline', async () => {
  const storyboard = JSON.parse(await readFile('.qa/b-style-pilot/full-film-storyboard.json', 'utf8'));
  const storyboardBoundaries = [
    0,
    ...storyboard.scenes.flatMap(scene => scene.publicSeconds),
    storyboard.authority.publicTimelineSeconds
  ];
  const contentBoundaries = [0, ...content.scenes.map(scene => scene.end)];
  for (const boundary of contentBoundaries) assert.ok(storyboardBoundaries.includes(boundary));
  assert.equal(Math.max(...contentBoundaries), 35);
  assert.equal(storyboard.authority.publicTimelineSeconds, 35);
});
