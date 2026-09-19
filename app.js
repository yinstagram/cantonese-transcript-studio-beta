import { content, releaseDownload } from './content.js';
import { icons } from './assets/vendor/icons.js';
import { DURATION, stateAt, formatExample } from './demo-state.js';

const $ = id => document.getElementById(id);
const text = (id, value) => { if ($(id).textContent !== value) $(id).textContent = value; };
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const ui = content.ui;
let time = 0, playing = false, frame = 0, previousTime = 0, scenario = null, scenarioTimer;
let format = 'srt', lastAnnouncement = '';

function icon(name, className = '') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [key, value] of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',class:`icon ${className}`})) svg.setAttribute(key, value);
  for (const [tag, attrs] of icons[name] || icons.Circle) {
    const child = document.createElementNS(svg.namespaceURI, tag);
    for (const [key, value] of Object.entries(attrs)) child.setAttribute(key, value);
    svg.append(child);
  }
  return svg;
}
document.querySelectorAll('[data-icon]').forEach(el => el.replaceWith(icon(el.dataset.icon, el.className)));
document.querySelectorAll('[data-content]').forEach(el => el.textContent = content[el.dataset.content]);
text('simulation-label', ui.simulated); text('demo-app-name', ui.app); text('time-note', ui.compressed);
text('example-label', content.examples.label);
text('beta-title', content.beta.title); text('beta-status', content.beta.status); text('beta-body', content.beta.body);
const download = content.beta.download;
const downloadState = releaseDownload(download);
document.querySelectorAll('[data-download-cta]').forEach(button => {
  button.querySelector('[data-download-label]').textContent = downloadState.label;
  button.disabled = !downloadState.ready;
  button.dataset.ready = String(downloadState.ready);
  button.title = downloadState.ready ? download.readyLabel : download.preparingLabel;
  button.addEventListener('click', () => {
    const state = releaseDownload();
    if (state.ready && state.href) window.location.assign(state.href);
  });
});
text('download-note', download.note); text('download-meta', download.requirements);
text('install-warning', download.warning); text('damaged-warning', download.damagedWarning);
$('apple-support').href = download.supportUrl;
download.steps.forEach(([title, body]) => {
  const item = document.createElement('li');
  const heading = document.createElement('h3'); heading.textContent = title;
  const paragraph = document.createElement('p'); paragraph.textContent = body;
  item.append(heading, paragraph); $('install-steps').append(item);
});
content.beta.details.forEach(([title, body], index) => {
  const detail = document.createElement('details');
  const summary = document.createElement('summary'); summary.textContent = title;
  const paragraph = document.createElement('p'); paragraph.textContent = body;
  detail.append(summary, paragraph); detail.open = index === 0; $('beta-details').append(detail);
});
content.speakers.forEach((speaker, index) => {
  const label = document.createElement('span'); label.className = 'guest-label'; label.textContent = speaker.name;
  label.style.left = speaker.position; label.style.setProperty('--speaker-color', speaker.color); $('guest-labels').append(label);
  const tile = document.createElement('div'); tile.className = 'speaker-tile'; tile.style.setProperty('--speaker-color', speaker.color);
  const avatar = document.createElement('span'); avatar.className = 'speaker-avatar'; avatar.textContent = speaker.short;
  const name = document.createElement('strong'); name.textContent = speaker.name;
  const state = document.createElement('span'); state.className = 'speaker-state'; state.append(icon('Circle'), document.createElement('span'));
  tile.append(avatar, name, state); tile.dataset.speaker = String(index); $('roster').append(tile);
});
content.scenes.forEach((scene, index) => {
  const button = document.createElement('button'); button.textContent = `${index + 1}. ${scene.label}`;
  button.addEventListener('click', () => seek(scene.start)); button.dataset.scene = String(index); $('scene-nav').append(button);
});

function positionGuestLabels() {
  const image = $('guests-image');
  if (!image.naturalWidth) return;
  const width = image.clientWidth, height = image.clientHeight;
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawnWidth = image.naturalWidth * scale, drawnHeight = image.naturalHeight * scale;
  document.querySelectorAll('.guest-label').forEach((label, index) => {
    label.style.left = `${(width - drawnWidth) / 2 + drawnWidth * parseFloat(content.speakers[index].position) / 100}px`;
    label.style.top = `${(height - drawnHeight) / 2 + drawnHeight * .91}px`;
  });
}
$('guests-image').addEventListener('load', positionGuestLabels);
new ResizeObserver(positionGuestLabels).observe($('interview-scene'));
positionGuestLabels();

function announce(value) {
  if (lastAnnouncement !== value) { text('announcer', value); lastAnnouncement = value; }
}
function render() {
  const s = stateAt(time);
  if (scenario) { s.scene = 4; s.enrolled = 4; s.active = scenario === 'unknown' ? -1 : scenario === 'review' || scenario === 'confirmed' ? 1 : 0; s.status = scenario; }
  const scene = content.scenes[s.scene];
  $('story').dataset.scene = String(s.scene);
  $('story').dataset.mode = scenario || time >= DURATION ? 'interactive' : 'tutorial';
  $('story').dataset.playing = String(playing);
  const active = content.speakers[s.active];
  $('story').style.setProperty('--speaker-active', active?.color || '#896012');
  // Camera motion highlights the first guest, then pulls back into setup.
  $('interview-scene').style.transform = s.scene === 0 && time >= 2 && !motion.matches ? 'translate(20%, 8%) scale(1.45)' : '';
  text('scene-counter', `${String(s.scene + 1).padStart(2, '0')} / 05`); text('scene-label', scene.label);
  text('scene-title', scenario ? '睇吓呢個情況。' : scene.title);
  text('scene-description', scenario ? ui.simulated : scene.detail);
  text('demo-section-label', s.scene < 3 ? ui.setup : ui.listening);
  text('roster-count', `${s.enrolled} / 4 ${ui.enrolled}`);
  document.querySelectorAll('.speaker-tile').forEach((tile, index) => {
    const enrolled = index < s.enrolled;
    tile.classList.toggle('active', index === s.active && s.scene !== 1);
    tile.classList.toggle('enrolled', enrolled);
    const status = tile.querySelector('.speaker-state');
    const label = enrolled ? ui.enrolled : ui.notEnrolled;
    if (status.lastElementChild.textContent !== label) { status.replaceChildren(icon(enrolled ? 'Check' : 'Circle'), document.createElement('span')); status.lastElementChild.textContent = label; }
  });
  document.querySelectorAll('.guest-label').forEach((el, index) => el.classList.toggle('active', index === s.active));
  let title = ui.setup, detail = '2–15 位講者 · 呢度示範 4 位', action = ui.start;
  if (s.status === 'recording') { title = `${active.name} · ${ui.enroll}`; detail = ui.record; }
  if (s.status === 'enrolled') { title = `${active.name} · ${ui.enrolled}`; detail = s.active === 3 ? ui.allEnrolled : ui.next; }
  if (s.status === 'ready') { title = ui.ready; detail = ui.allEnrolled; }
  if (s.status === 'listening') { title = `${ui.now}：${active.name}`; detail = ui.liveDetail; }
  if (s.status === 'review') { title = ui.review; detail = ui.reviewDetail; }
  if (s.status === 'confirmed') { title = `${ui.now}：${active.name}`; detail = ui.confirmed; }
  if (s.status === 'same') { title = `${ui.now}：${active.name}`; detail = ui.same; }
  if (s.status === 'unknown') { title = ui.uncertain; detail = ui.unknownDetail; }
  if (s.scene === 2) action = s.action === 'next' ? ui.next : ui.start;
  if (s.scene === 4) action = ui.simulated;
  text('demo-status-title', title); text('demo-status-detail', detail); text('demo-action-text', action);
  $('demo-status').dataset.status = s.status;
  $('demo-action').classList.toggle('clicking', s.clicking);
  $('demo-action').dataset.enabled = String(s.status === 'enrolled' || s.status === 'ready' || s.scene === 4);
  $('enroll-fill').style.width = `${s.progress * 100}%`;
  $('story-seek').value = String(time);
  $('story-seek').setAttribute('aria-valuetext', `${Math.floor(time)} 秒，${scene.label}`);
  text('story-time', `0:${String(Math.floor(time)).padStart(2, '0')} / 0:35`);
  $('previous-scene').disabled = s.scene === 0 && !scenario;
  $('next-scene').disabled = s.scene === 4;
  document.querySelectorAll('#scene-nav button').forEach((el, i) => {
    if (i === s.scene) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
  });
  announce(`${scene.label}。${title}。${detail}`);
}
function playButton() {
  $('play').replaceChildren(icon(playing ? 'Pause' : 'Play'));
  const label = motion.matches ? (stateAt(time).scene === content.scenes.length - 1 ? ui.replay : ui.nextScene) : playing ? ui.pause : time >= DURATION ? ui.replay : ui.play;
  $('play').setAttribute('aria-label', label); $('play').title = label;
}
function pause() { playing = false; cancelAnimationFrame(frame); $('story').dataset.playing = 'false'; playButton(); }
function clearScenario() {
  clearTimeout(scenarioTimer); scenario = null;
  document.querySelectorAll('[data-scenario]').forEach(b => b.setAttribute('aria-pressed', 'false'));
}
function seek(value) { pause(); clearScenario(); time = Math.max(0, Math.min(DURATION, Number(value))); render(); playButton(); }
function tick(now) {
  if (!playing) return;
  time = Math.min(DURATION, time + (now - previousTime) / 1000); previousTime = now; render();
  if (time >= DURATION) pause(); else frame = requestAnimationFrame(tick);
}
function play() {
  if (motion.matches) { const s = stateAt(time); seek(content.scenes[(s.scene + 1) % 5].start); return; }
  if (playing) { pause(); return; }
  clearScenario(); if (time >= DURATION) time = 0;
  playing = true; previousTime = performance.now(); playButton(); frame = requestAnimationFrame(tick);
  if ($('story').getBoundingClientRect().top < 0) $('story').scrollIntoView({behavior:'smooth',block:'start'});
}
$('play').addEventListener('click', play);
$('replay').addEventListener('click', () => { seek(0); if (!motion.matches) play(); });
$('story-seek').addEventListener('input', e => seek(e.target.value));
$('previous-scene').addEventListener('click', () => seek(content.scenes[Math.max(0, stateAt(time).scene - 1)].start));
$('next-scene').addEventListener('click', () => seek(content.scenes[Math.min(4, stateAt(time).scene + 1)].start));
$('hero-demo').addEventListener('click', () => { seek(0); });
document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => {
  pause(); clearScenario(); time = DURATION;
  button.setAttribute('aria-pressed', 'true');
  scenario = button.dataset.scenario === 'switch' ? 'review' : button.dataset.scenario;
  if (scenario === 'review') scenarioTimer = setTimeout(() => { scenario = 'confirmed'; render(); }, motion.matches ? 0 : 1400);
  render(); playButton();
  if ($('app-demo').getBoundingClientRect().top < 0) $('story').scrollIntoView({behavior:motion.matches ? 'instant' : 'smooth',block:'start'});
}));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { pause(); clearTimeout(scenarioTimer); }
  else if (scenario === 'review') scenarioTimer = setTimeout(() => { scenario = 'confirmed'; render(); }, motion.matches ? 0 : 1400);
});
motion.addEventListener('change', () => { pause(); render(); });

function selectFormat(value) {
  format = value; text('export-panel', formatExample(format));
  $('export-panel').setAttribute('aria-labelledby', `tab-${format}`);
  document.querySelectorAll('[data-format]').forEach(b => { const selected = b.dataset.format === format; b.setAttribute('aria-selected', String(selected)); b.tabIndex = selected ? 0 : -1; });
  $('download-example').title = `下載 ${format.toUpperCase()} 格式示例`;
  $('download-example').setAttribute('aria-label', $('download-example').title);
}
const tabs = [...document.querySelectorAll('[data-format]')];
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectFormat(tab.dataset.format));
  tab.addEventListener('keydown', e => {
    let index;
    if (e.key === 'ArrowRight') index = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
    if (e.key === 'Home') index = 0;
    if (e.key === 'End') index = tabs.length - 1;
    if (index === undefined) return;
    e.preventDefault(); tabs[index].focus(); selectFormat(tabs[index].dataset.format);
  });
});
$('download-example').addEventListener('click', () => {
  const blob = new Blob([formatExample(format)], {type:format === 'vtt' ? 'text/vtt;charset=utf-8' : 'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `CTS-format-example.${format}`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
const dialog = $('screenshot-dialog');
$('open-screenshot').addEventListener('click', () => dialog.showModal());
$('close-screenshot').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
selectFormat('srt'); render(); playButton();
