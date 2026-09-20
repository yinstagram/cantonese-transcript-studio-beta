import { content, releaseDownload } from './content.js';
import { catalog, featuresByCategory } from './features.js';
import { icons } from './assets/vendor/icons.js';
import { DURATION, stateAt, formatExample } from './demo-state.js';

const $ = id => document.getElementById(id);
const text = (id, value) => { if ($(id).textContent !== value) $(id).textContent = value; };
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const ui = content.ui;
const video = $('tutorial-video');
let scenario = null, scenarioTimer;
let format = 'srt', lastAnnouncement = '';
const initialHash = window.location.hash;

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

function demoVisual(id) {
  if (id === 'import') {
    const demo = catalog.categories[0].demo;
    return `
      <p class="demo-note">網址匯入示意</p>
      <div class="url-shell">
        <span class="url-text">https://www.youtube.com/watch?v=…</span>
        <div class="platform-row">${demo.platforms.map(platform => `<span class="platform-chip">${platform}</span>`).join('')}</div>
        <div class="download-options" role="group" aria-label="匯入模式示意">${demo.modes.map((mode, index) => `<button type="button" data-import-mode="${mode}" aria-pressed="${index === 0}">${mode}</button>`).join('')}</div>
      </div>
      <div class="flow-path"><span class="flow-packet"></span></div>
      <div class="import-result"><b>示意輸出</b><span id="import-output">${demo.modeOutputs[demo.modes[0]]}</span></div>
      <button type="button" class="import-replay" id="import-replay"><i data-icon="RotateCcw"></i><span>${demo.replay}</span></button>`;
  }
  if (id === 'review') {
    return `<div class="scan-document"><span class="scan-row">00:01 今天我哋想講…</span><span class="scan-row low">00:04 呢個名詞唔太確定</span><span class="scan-row">00:09 先整理問題</span><span class="scan-lens"></span></div>`;
  }
  if (id === 'dictionary') return `<div class="dictionary-stage"><span class="wrong-term">阿 Yin？</span><span class="term-arrow"></span><span class="correct-term">Ng Cho Yin</span><span class="term-book">個人詞庫</span></div>`;
  if (id === 'editing') return `<div class="editing-stage"><span class="subtitle-preview">先整理問題</span><div class="cute-strip"><i></i><i></i><i></i><i></i></div><span class="autosave-chip">自動儲存</span></div>`;
  if (id === 'style') return `<div class="style-stage"><div class="safe-frame"><span class="styled-caption">雙語字幕</span><span class="safe-guide"></span></div><div class="style-dots"><i></i><i></i><i></i><i></i></div></div>`;
  if (id === 'outputs') return `<div class="output-stage"><span class="format-chip">TXT</span><span class="format-chip">SRT</span><span class="format-chip">VTT</span><span class="format-chip">JSON</span><span class="format-chip">CSV</span><span class="format-chip">ASS</span><span class="burned-file">MP4</span></div>`;
  if (id === 'insights') return `<div class="insight-stage"><div class="source-lines"><i></i><i></i><i></i><i></i></div><span class="insight-arrow"></span><div class="insight-result"><strong>摘要</strong><span>行動 1</span><span>行動 2</span></div></div>`;
  if (id === 'live') return `<div class="live-stage"><div class="mic-orb"><i></i><i></i><i></i></div><div class="live-caption-lines"><span>而家講緊…</span><i></i><i></i></div><span class="prompt-card">短提示</span></div>`;
  if (id === 'camman') return `<div class="camman-stage"><div class="cam-people"><i></i><i></i><i></i><i></i></div><div class="cam-laptop"><i></i><i></i><i></i><i></i></div></div>`;
  if (id === 'settings') return `<div class="settings-stage"><div class="local-api">Local API</div><span class="shortcut-path"></span><div class="model-disk">模型</div><span class="loopback-label">127.0.0.1</span></div>`;
  return '<div class="demo-placeholder"></div>';
}

document.querySelectorAll('[data-icon]').forEach(el => el.replaceWith(icon(el.dataset.icon, el.className)));
document.querySelectorAll('[data-content]').forEach(el => el.textContent = content[el.dataset.content]);
const evidenceLabels = { implemented: '本機功能', historical: '有歷史實測紀錄' };
text('catalog-intro', catalog.intro);
text('catalog-boundary-text', catalog.boundary);
text('not-provided-title', catalog.notProvided.title);
text('not-provided-intro', catalog.notProvided.intro);
catalog.categories.forEach((category, index) => {
  const items = featuresByCategory(category.id);
  const details = document.createElement('details');
  details.className = 'catalog-category';
  details.dataset.categoryId = category.id;
  details.open = false;
  const summary = document.createElement('summary');
  const indexLabel = document.createElement('span');
  indexLabel.className = 'catalog-index';
  indexLabel.textContent = String(index + 1).padStart(2, '0');
  const categoryIcon = document.createElement('span');
  categoryIcon.className = 'catalog-icon';
  categoryIcon.append(icon(category.icon));
  const heading = document.createElement('span');
  heading.className = 'catalog-heading';
  const title = document.createElement('strong');
  title.textContent = category.title;
  const summaryText = document.createElement('p');
  summaryText.textContent = category.summary;
  heading.append(title, summaryText);
  const count = document.createElement('span');
  count.className = 'catalog-count';
  count.textContent = `${items.length} 項`;
  const chevron = document.createElement('span');
  chevron.className = 'catalog-chevron';
  chevron.append(icon('ChevronRight'));
  summary.append(indexLabel, categoryIcon, heading, count, chevron);
  const body = document.createElement('div');
  body.className = 'catalog-body';
  items.forEach(feature => {
    const card = document.createElement('article');
    card.className = 'catalog-card';
    const cardHeader = document.createElement('div');
    cardHeader.className = 'catalog-card-header';
    const cardTitle = document.createElement('h4');
    cardTitle.textContent = feature.title;
    const badge = document.createElement('span');
    badge.className = 'catalog-badge';
    badge.dataset.evidence = feature.evidence;
    badge.textContent = evidenceLabels[feature.evidence];
    cardHeader.append(cardTitle, badge);
    const fields = document.createElement('dl');
    for (const key of ['situation', 'input', 'output', 'conditions']) {
      const field = document.createElement('div');
      field.className = 'catalog-field';
      const label = document.createElement('dt');
      label.textContent = catalog.labels[key];
      const value = document.createElement('dd');
      value.textContent = feature[key];
      field.append(label, value);
      fields.append(field);
    }
    card.append(cardHeader, fields);
    body.append(card);
  });
  details.append(summary, body);
  $('catalog-list').append(details);
});

function renderFeatureDemos() {
  const grid = $('feature-demo-grid');
  catalog.categories.forEach(category => {
    const demo = category.demo;
    const card = document.createElement('article');
    card.className = 'feature-demo-card';
    card.dataset.categoryId = category.id;
    card.innerHTML = `
      <div class="demo-stage" data-demo="${category.id}" data-running="true" aria-hidden="${category.id !== 'import'}">${demoVisual(category.id)}</div>
      <div class="feature-demo-copy">
        <p class="eyebrow"><span class="small-dot"></span> ${category.title}</p>
        <h3>${demo.hook}</h3>
        <ol class="demo-steps">${demo.steps.map(step => `<li>${step}</li>`).join('')}</ol>
        <p class="demo-output">${demo.output}</p>
      </div>
      <button type="button" class="text-link demo-more" data-open-category="${category.id}">睇細節 <i data-icon="ArrowRight"></i></button>`;
    card.querySelectorAll('[data-icon]').forEach(el => el.replaceWith(icon(el.dataset.icon, el.className)));
    grid.append(card);
  });

  const importCard = grid.querySelector('[data-category-id="import"]');
  const importDemo = catalog.categories[0].demo;
  function restartImportAnimation() {
    const stage = importCard.querySelector('.demo-stage');
    stage.dataset.running = 'false';
    void stage.offsetWidth;
    stage.dataset.running = 'true';
  }
  importCard.querySelectorAll('[data-import-mode]').forEach(button => button.addEventListener('click', () => {
    importCard.querySelectorAll('[data-import-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    importCard.querySelector('#import-output').textContent = importDemo.modeOutputs[button.dataset.importMode];
    restartImportAnimation();
  }));
  importCard.querySelector('#import-replay').addEventListener('click', restartImportAnimation);

  document.querySelectorAll('[data-open-category]').forEach(button => button.addEventListener('click', () => {
    const details = document.querySelector(`.catalog-category[data-category-id="${button.dataset.openCategory}"]`);
    if (!details) return;
    details.open = true;
    details.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
  }));
}
renderFeatureDemos();
catalog.notProvided.items.forEach(item => {
  const listItem = document.createElement('li');
  const itemHeader = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = item.title;
  const status = document.createElement('span');
  status.className = 'status-chip';
  status.textContent = catalog.notProvided.status;
  itemHeader.append(title, status);
  const note = document.createElement('p');
  note.textContent = item.note;
  listItem.append(itemHeader, note);
  $('not-provided-items').append(listItem);
});
text('simulation-label', ui.simulated); text('demo-app-name', ui.app); text('time-note', ui.compressed);
text('example-label', content.examples.label);
text('beta-title', content.beta.title); text('beta-status', content.beta.status); text('beta-body', content.beta.body);
content.beta.updates.forEach(update => {
  const item = document.createElement('li');
  item.textContent = update;
  $('release-updates').append(item);
});
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
text('download-note', download.note); text('download-meta', download.requirementsDetail);
download.requirementsQuick.forEach(requirement => {
  const chip = document.createElement('li');
  chip.textContent = requirement;
  $('download-specs').append(chip);
});
text('install-warning', download.warning); text('damaged-warning', download.damagedWarning);
$('apple-support').href = download.supportUrl;
download.steps.forEach(step => {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  const heading = document.createElement('h3'); heading.textContent = step.title;
  button.append(heading); item.append(button); $('install-steps').append(item);
});
const installSteps = [...document.querySelectorAll('#install-steps button')];
const installWalkthrough = $('download-walkthrough');
const INSTALL_TOTAL = 12000;
const INSTALL_SCENE = INSTALL_TOTAL / download.steps.length;
let installTime = 0;
let installPlaying = false;
let installInView = false;
let installFrame = 0;
let installLastTick = 0;

function installSceneAt(time) {
  return Math.min(download.steps.length - 1, Math.floor(time / INSTALL_SCENE));
}
const clamp01 = value => Math.max(0, Math.min(1, value));
const clickPulse = (value, start, peak, end) => {
  if (value <= start || value >= end) return 0;
  return value < peak ? (value - start) / (peak - start) : (end - value) / (end - peak);
};
function renderInstallStep(time, fromPlayback = false) {
  const step = installSceneAt(time);
  installWalkthrough.dataset.step = String(step);
  installWalkthrough.querySelectorAll('.download-scene').forEach(scene => {
    const index = Number(scene.dataset.installScene);
    const current = index === step;
    scene.hidden = !current;
    scene.querySelectorAll('[data-install-field]').forEach(field => {
      field.textContent = download.steps[index][field.dataset.installField];
    });
  });
  installSteps.forEach((button, index) => button.setAttribute('aria-pressed', String(index === step)));
  text('install-current', download.steps[step].action);
  const sceneElapsed = fromPlayback ? time - step * INSTALL_SCENE : 0;
  const sceneProgress = fromPlayback ? sceneElapsed / INSTALL_SCENE : 0;
  const overall = fromPlayback ? time / INSTALL_TOTAL : step / download.steps.length;
  $('install-progress-fill').style.transform = `scaleX(${overall})`;
  installWalkthrough.style.setProperty('--scene-progress', String(sceneProgress));
  installWalkthrough.style.setProperty('--drag-progress', String(clamp01(sceneProgress / .75)));
  installWalkthrough.style.setProperty('--icon-approach', String(clamp01(sceneProgress / .45)));
  installWalkthrough.style.setProperty('--settings-approach', String(clamp01(sceneProgress / .65)));
  installWalkthrough.style.setProperty('--click-one', String(step === 3 ? clickPulse(sceneProgress, .52, .59, .66) : clickPulse(sceneProgress, .48, .54, .60)));
  installWalkthrough.style.setProperty('--click-two', String(step === 2 ? clickPulse(sceneProgress, .66, .72, .78) : 0));
  const seconds = Math.floor((fromPlayback ? time : step * INSTALL_SCENE) / 1000);
  $('install-time').textContent = `0:${String(seconds).padStart(2, '0')} / 0:12`;
}
function renderInstallControls() {
  const play = $('install-play');
  const atEnd = installTime >= INSTALL_TOTAL;
  const label = motion.matches ? (atEnd ? '重播' : '下一幕') : installPlaying ? '暫停' : atEnd ? '重播' : '播放';
  play.replaceChildren(icon(installPlaying && !motion.matches ? 'Pause' : atEnd || motion.matches ? 'RotateCcw' : 'Play'), Object.assign(document.createElement('span'), { textContent: label }));
  play.setAttribute('aria-pressed', String(installPlaying));
  play.setAttribute('aria-label', label);
  play.title = label;
}
function stopInstallLoop() {
  if (installFrame) cancelAnimationFrame(installFrame);
  installFrame = 0;
  installLastTick = 0;
}
function pauseInstall(fromUser = true) {
  installPlaying = false;
  stopInstallLoop();
  installWalkthrough.dataset.playing = 'false';
  renderInstallControls();
  if (fromUser) installWalkthrough.dataset.manualPaused = 'true';
}
function playInstall() {
  if (motion.matches) {
    const next = (installSceneAt(installTime) + 1) % download.steps.length;
    installTime = next * INSTALL_SCENE;
    renderInstallStep(installTime);
    renderInstallControls();
    return;
  }
  if (!installInView || document.hidden) return;
  if (installTime >= INSTALL_TOTAL) installTime = 0;
  installPlaying = true;
  installWalkthrough.dataset.playing = 'true';
  installWalkthrough.dataset.manualPaused = 'false';
  renderInstallControls();
  installLastTick = performance.now();
  const advance = now => {
    if (!installPlaying) return;
    installTime = Math.min(INSTALL_TOTAL, installTime + now - installLastTick);
    installLastTick = now;
    renderInstallStep(installTime, true);
    if (installTime >= INSTALL_TOTAL) {
      pauseInstall(false);
      return;
    }
    installFrame = requestAnimationFrame(advance);
  };
  installFrame = requestAnimationFrame(advance);
}
function selectInstallStep(index) {
  pauseInstall();
  installTime = index * INSTALL_SCENE;
  renderInstallStep(installTime);
  renderInstallControls();
}
installSteps.forEach((button, index) => {
  button.addEventListener('click', () => selectInstallStep(index));
  button.addEventListener('focus', () => selectInstallStep(index));
  button.addEventListener('pointerenter', () => selectInstallStep(index));
});
$('install-play').addEventListener('click', () => {
  if (installPlaying && !motion.matches) pauseInstall();
  else if (motion.matches && installTime >= INSTALL_TOTAL) selectInstallStep(0);
  else playInstall();
});
$('install-replay').addEventListener('click', () => {
  pauseInstall(false);
  installTime = 0;
  renderInstallStep(0);
  if (!motion.matches) playInstall();
  else renderInstallControls();
});
installWalkthrough.addEventListener('pointerenter', () => pauseInstall());
installWalkthrough.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  const current = installSceneAt(installTime);
  const next = event.key === 'ArrowRight' ? current + 1 : current + download.steps.length - 1;
  selectInstallStep(next % download.steps.length);
});
new IntersectionObserver(entries => {
  const wasInView = installInView;
  installInView = entries.some(entry => entry.isIntersecting);
  if (wasInView && !installInView) pauseInstall(false);
}, { threshold: .25 }).observe(installWalkthrough);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseInstall(false);
});
installWalkthrough.setAttribute('aria-label', `四步安裝示意：${download.steps.map(step => step.title).join('、')}`);
renderInstallStep(0);
renderInstallControls();
content.beta.details.forEach(([title, body], index) => {
  const detail = document.createElement('details');
  const summary = document.createElement('summary'); summary.textContent = title;
  const paragraph = document.createElement('p'); paragraph.textContent = body;
  detail.append(summary, paragraph); detail.open = index === 0; $('beta-details').append(detail);
});
content.speakers.forEach((speaker, index) => {
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

function announce(value) {
  if (lastAnnouncement !== value) { text('announcer', value); lastAnnouncement = value; }
}
function render() {
  const time = video.currentTime;
  const s = stateAt(time);
  if (scenario) { s.scene = 4; s.enrolled = 4; s.active = scenario === 'unknown' ? -1 : scenario === 'review' || scenario === 'confirmed' ? 1 : 0; s.status = scenario; }
  const scene = content.scenes[s.scene];
  $('story').dataset.scene = String(s.scene);
  $('story').dataset.mode = scenario || time >= DURATION ? 'interactive' : 'tutorial';
  $('story').dataset.playing = String(!video.paused && !video.ended);
  const active = content.speakers[s.active];
  $('story').style.setProperty('--speaker-active', active?.color || '#896012');
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
  let title = ui.setup, detail = '2-15 位講者 · 呢度示範 4 位', action = ui.start;
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
  text('story-time', `0:${String(Math.floor(time)).padStart(2, '0')} / 0:${String(Math.floor(DURATION)).padStart(2, '0')}`);
  $('previous-scene').disabled = s.scene === 0 && !scenario;
  $('next-scene').disabled = s.scene === 4;
  document.querySelectorAll('#scene-nav button').forEach((el, i) => {
    if (i === s.scene) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
  });
  announce(`${scene.label}。${title}。${detail}`);
}
function playButton() {
  const playing = !video.paused && !video.ended;
  $('play').replaceChildren(icon(playing ? 'Pause' : 'Play'));
  const label = motion.matches ? (stateAt(video.currentTime).scene === content.scenes.length - 1 ? ui.replay : ui.nextScene) : playing ? ui.pause : video.currentTime >= DURATION ? ui.replay : ui.play;
  $('play').setAttribute('aria-label', label); $('play').title = label;
}
function pause() { video.pause(); $('story').dataset.playing = 'false'; playButton(); }
function clearScenario() {
  clearTimeout(scenarioTimer); scenario = null;
  document.querySelectorAll('[data-scenario]').forEach(b => b.setAttribute('aria-pressed', 'false'));
}
function seek(value) {
  pause(); clearScenario();
  video.currentTime = Math.max(0, Math.min(DURATION, Number(value) || 0));
  render(); playButton();
}
async function play() {
  if (motion.matches) { const s = stateAt(video.currentTime); seek(content.scenes[(s.scene + 1) % 5].start); return; }
  if (!video.paused && !video.ended) { pause(); return; }
  clearScenario();
  if (video.ended || video.currentTime >= DURATION) video.currentTime = 0;
  if (video.seeking) await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));
  video.play().catch(() => { render(); playButton(); });
  if ($('story').getBoundingClientRect().top < 0) $('story').scrollIntoView({behavior:'smooth',block:'start'});
}
for (const eventName of ['loadedmetadata', 'timeupdate', 'seeked', 'play', 'pause', 'ended']) video.addEventListener(eventName, () => { render(); playButton(); });
video.addEventListener('click', () => {
  if (motion.matches) {
    const s = stateAt(video.currentTime);
    seek(content.scenes[(s.scene + 1) % 5].start);
  } else play();
});
$('play').addEventListener('click', play);
$('replay').addEventListener('click', () => { seek(0); if (!motion.matches) play(); });
$('story-seek').addEventListener('input', e => seek(e.target.value));
$('previous-scene').addEventListener('click', () => seek(content.scenes[Math.max(0, stateAt(video.currentTime).scene - 1)].start));
$('next-scene').addEventListener('click', () => seek(content.scenes[Math.min(4, stateAt(video.currentTime).scene + 1)].start));
$('hero-demo').addEventListener('click', e => {
  e.preventDefault();
  seek(0);
  $('story').scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
});
document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => {
  pause(); clearScenario(); video.currentTime = DURATION;
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

function settleInitialHash() {
  if (!initialHash) return;
  const target = document.querySelector(initialHash);
  if (!target) return;
  requestAnimationFrame(() => {
    const top = target.getBoundingClientRect().top + window.scrollY - 32;
    window.scrollTo({ top, behavior: 'instant' });
  });
}
if (document.readyState === 'complete') settleInitialHash();
else window.addEventListener('load', settleInitialHash, { once: true });

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
