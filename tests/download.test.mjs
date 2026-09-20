import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { content, releaseDownload } from '../content.js';

const expectedUrl = 'https://github.com/yinstagram/cantonese-transcript-studio-beta/releases/download/v0.8.22-friend-beta.2/CantoneseTranscriptStudio-0.8.22-friend-beta-arm64.zip';

test('verified friend beta download is active and closed state stays actionless', () => {
  const state = releaseDownload(content.beta.download);
  assert.equal(content.beta.download.ready, true);
  assert.equal(state.ready, true);
  assert.equal(state.href, expectedUrl);
  assert.equal(state.label, '下載朋友測試版 ZIP');
  assert.equal(content.beta.status, 'v0.8.22 朋友測試版可下載');
  assert.match(content.beta.body, /已完成本機隔離環境基本測試/);
  assert.match(content.beta.body, /未喺另一部乾淨 Mac 驗證/);
  assert.match(content.beta.body, /請保留原始檔/);

  const closed = releaseDownload({ ...content.beta.download, ready: false });
  assert.equal(closed.ready, false);
  assert.equal(closed.href, null);
  assert.equal(closed.label, '下載準備中');
});

test('the ready state uses the single release URL authority', () => {
  const state = releaseDownload({ ...content.beta.download, ready: true });
  assert.equal(state.ready, true);
  assert.equal(state.href, expectedUrl);
  assert.equal(state.label, '下載朋友測試版 ZIP');
});

test('friend beta install guidance is concise, safe, and complete', () => {
  const download = content.beta.download;
  assert.equal(download.note, 'v0.8.22 · Build 47 · ZIP 約 211MB');
  assert.deepEqual(download.requirementsQuick, [
    'Apple Silicon Mac', 'macOS 26.2 或以上', '建議 16GB RAM', '預留 20GB 空間'
  ]);
  assert.match(download.requirementsDetail, /首次設定模型約下載 10GB/);
  assert.match(download.requirementsDetail, /視乎選擇/);
  assert.match(download.requirementsDetail, /唔會預先附/);
  assert.ok(!('requirements' in download), 'requirements must not exist as a second authority');
  assert.equal(download.steps.length, 4);
  assert.deepEqual(download.steps.map(step => step.title), [
    '下載 ZIP', '刪舊版並放入 Applications', '雙擊開一次', '允許開啟'
  ]);
  assert.deepEqual(download.steps.map(step => [step.action, step.target, step.result]), [
    ['下載朋友測試版 ZIP', 'Downloads', '原始 ZIP 已保留喺 Downloads'],
    ['先將舊 CTS Beta 拖去 Trash；再解壓新版，拖入 Applications', 'Applications 舊版 → Trash；Downloads 新版 → Applications', 'Applications 只保留一個新 CTS Beta'],
    ['雙擊 CTS Beta', 'CTS Beta', 'macOS 顯示被封鎖提示'],
    ['系統設定 → 私隱與保安 → Open Anyway', 'Privacy & Security', '返回 CTS Beta 再開一次']
  ]);
  assert.equal(download.warning, '朋友測試版，未經 Apple 公證。');
  assert.match(download.damagedWarning, /已損壞|惡意軟件/);
  assert.match(download.damagedWarning, /唔好繼續開啟/);
  assert.match(download.damagedWarning, /聯絡 Yin/);
  assert.equal(download.supportUrl, 'https://support.apple.com/zh-hk/102445');
  assert.equal(content.beta.updates.length, 5);
  assert.match(content.beta.updates[0], /預設唔再強制加入 Speaker 1/);
  assert.match(content.beta.updates[1], /邊聽邊改/);
  assert.match(content.beta.updates[2], /格式互轉/);
  assert.match(content.beta.updates[3], /動畫新手引導/);
  assert.match(content.beta.updates[4], /明確標示要覆核/);

  const details = Object.fromEntries(content.beta.details);
  assert.match(details['測試狀態'], /唔代表所有功能已完成測試/);
  assert.match(details['Lazy Camman'], /未做準確度認證/);
  assert.match(details['AI 即時提示'], /另行設定本機 runtime/);
  assert.match(details['AI 即時提示'], /唔保證延遲或答案準確度/);
});

test('markup keeps download metadata in one file and noscript honest', async () => {
  const html = await readFile('index.html', 'utf8');
  const app = await readFile('app.js', 'utf8');
  const styles = await readFile('styles.css', 'utf8');
  const share = await stat('assets/cts-share-v0.8.22.jpg');
  assert.ok(share.isFile());
  assert.ok(share.size > 50000);
  const ctaCount = (html.match(/data-download-cta/g) || []).length;
  assert.equal(ctaCount, 2);
  assert.ok(html.includes('id="download-hero"'));
  assert.ok(html.includes('id="download-beta"'));
  assert.ok(html.includes('id="install-steps"'));
  assert.ok(html.includes('id="download-walkthrough"'));
  assert.ok(html.includes('id="install-play"'));
  assert.ok(html.includes('id="install-replay"'));
  assert.ok(html.includes('id="install-time"'));
  assert.ok(html.includes('id="install-current"'));
  assert.ok(html.includes('id="damaged-warning"'));
  assert.ok(html.includes('id="release-updates"'));
  assert.ok(html.includes('未有 OTA 自動更新'));
  assert.ok(html.includes('assets/cts-share-v0.8.22.jpg'));
  assert.ok(!html.includes('assets/interview-guests.webp'));
  assert.ok(html.includes('class="skip-link"'));
  assert.match(styles, /\.skip-link\{top:10px;opacity:0;pointer-events:none;transform:translateY\(-180%\)\}/);
  assert.match(styles, /\.skip-link:focus\{opacity:1;pointer-events:auto;transform:none\}/);
  assert.ok(app.includes('renderInstallStep(0)'));
  assert.ok(app.includes('const INSTALL_TOTAL = 12000'));
  assert.ok(app.includes('function pauseInstall(fromUser = true)'));
  assert.ok(app.includes('installWalkthrough.dataset.manualPaused'));
  assert.ok(app.includes('scene.hidden = !current'));
  assert.ok(app.includes("text('install-current', download.steps[step].action)"));
  assert.ok(app.includes("installWalkthrough.addEventListener('pointerenter', () => pauseInstall())"));
  assert.ok(!app.includes("installWalkthrough.addEventListener('pointerleave'"));
  assert.match(styles, /\.download-walkthrough/);
  assert.match(styles, /\.install-steps button\[aria-pressed=true\]/);
  assert.match(styles, /--scene-progress/);
  assert.match(styles, /--drag-progress/);
  assert.match(styles, /--icon-approach/);
  assert.match(styles, /--settings-approach/);
  assert.ok(html.includes('class="dl-app-target"'));
  assert.ok(html.includes('class="dl-settings"><b data-install-field="target"></b><span class="dl-open">'));
  assert.ok(!html.includes('>動作<'));
  assert.ok(!html.includes('cursor 雙擊'));
  assert.ok(html.includes('下載 Beta'));
  assert.ok(html.includes('開啟 JavaScript 後可以下載 Beta'));
  assert.ok(!html.includes('公開下載準備中'));
  assert.ok(!html.includes(expectedUrl));
  assert.ok(!app.includes(expectedUrl));
  assert.ok(!/data-download-cta[^>]*href=/.test(html));
  assert.ok(app.includes('button.disabled = !downloadState.ready'));
  assert.ok(app.includes('if (state.ready && state.href)'));
  assert.doesNotMatch(
    [html, app, JSON.stringify(content)].join('\n'),
    /開啟任何來源|Open Anywhere|sudo\s|spctl\s|--master-disable|xattr\s+-|csrutil\s/i
  );
});
