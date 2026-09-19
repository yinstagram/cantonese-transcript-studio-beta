import test from 'node:test';
import assert from 'node:assert/strict';
import { stateAt, formatExample } from '../demo-state.js';
import { content } from '../content.js';

test('four speakers enroll in order and the next action is manual', () => {
  for (let i = 0; i < 4; i++) {
    const recording = stateAt(9 + i * 3 + 1);
    assert.equal(recording.active, i); assert.equal(recording.enrolled, i);
    assert.equal(recording.status, 'recording');
    const saved = stateAt(9 + i * 3 + 2.5);
    assert.equal(saved.enrolled, i + 1); assert.equal(saved.status, 'enrolled');
    assert.equal(saved.action, i === 3 ? 'start' : 'next');
    if (i < 3) assert.equal(stateAt(9 + i * 3 + 2.8).clicking, true);
  }
  assert.equal(stateAt(21).enrolled, 4); assert.equal(stateAt(21).status, 'ready');
});
test('speaker switch has a review state before confirmation', () => {
  assert.equal(stateAt(26).active, 0); assert.equal(stateAt(26).status, 'listening');
  assert.equal(stateAt(29).status, 'review'); assert.equal(stateAt(31).status, 'confirmed');
  assert.equal(stateAt(31).active, 1);
});
test('all scene boundaries, seeks, and ends are deterministic', () => {
  for (const [i, scene] of content.scenes.entries()) assert.equal(stateAt(scene.start).scene, i);
  assert.equal(stateAt(-1).time, 0); assert.equal(stateAt(100).time, 35);
  assert.equal(stateAt(NaN).time, 0); assert.equal(stateAt(35).scene, 4);
});
test('export formats preserve the same authoritative text and correct time syntax', () => {
  const srt = formatExample('srt'), vtt = formatExample('vtt'), txt = formatExample('txt');
  assert.match(srt, /^1\n00:00:01,000 --> 00:00:04,000\n/);
  assert.match(vtt, /^WEBVTT\n\n00:00:01\.000 --> 00:00:04\.000\n/);
  for (const line of content.examples.lines) for (const file of [srt, vtt, txt]) assert.ok(file.includes(line));
  assert.equal(txt.split('\n').filter(Boolean).length, 2);
});
