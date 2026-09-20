import { content } from './content.js';

export const DURATION = 15;
export function stateAt(seconds) {
  const time = Math.max(0, Math.min(DURATION, Number(seconds) || 0));
  const scene = content.scenes.findIndex((item, index) => (time >= item.start && time < item.end) || index === content.scenes.length - 1);
  const state = { time, scene, active: 0, enrolled: 0, progress: 0, status: 'setup', action: 'start', clicking: false };
  if (scene === 2) {
    const elapsed = time - 4;
    state.active = Math.min(3, Math.floor(elapsed / 1.6));
    const part = elapsed % 1.6;
    state.progress = Math.min(1, part / 1.25);
    state.enrolled = state.active + (part >= 1.25 ? 1 : 0);
    state.status = part >= 1.25 ? 'enrolled' : 'recording';
    state.action = state.active === 3 ? 'start' : 'next';
    state.clicking = part >= 1.4 && state.active < 3;
  } else if (scene >= 3) {
    state.enrolled = 4;
    state.progress = 1;
    state.status = scene === 3 ? 'ready' : time < 13.5 ? 'listening' : time < 13.9 ? 'review' : 'confirmed';
    state.active = time < 13.9 ? 1 : 0;
    state.clicking = scene === 3 && time >= 11.9;
  }
  return state;
}

export function formatExample(format) {
  const { lines, times } = content.examples;
  if (format === 'txt') return lines.join('\n') + '\n';
  const cues = lines.map((line, index) => {
    const interval = times[index].map(t => format === 'vtt' ? t.replace(',', '.') : t).join(' --> ');
    return (format === 'srt' ? `${index + 1}\n` : '') + interval + '\n' + line;
  }).join('\n\n');
  return (format === 'vtt' ? 'WEBVTT\n\n' : '') + cues + '\n';
}
