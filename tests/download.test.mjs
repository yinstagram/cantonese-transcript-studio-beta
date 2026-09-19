import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { content, releaseDownload } from '../content.js';

const expectedUrl = 'https://github.com/yinstagram/cantonese-transcript-studio-beta/releases/download/v0.8.21-friend-beta.1/CantoneseTranscriptStudio-0.8.21-friend-beta-arm64.zip';

test('verified friend beta download is active and closed state stays actionless', () => {
  const state = releaseDownload(content.beta.download);
  assert.equal(content.beta.download.ready, true);
  assert.equal(state.ready, true);
  assert.equal(state.href, expectedUrl);
  assert.equal(state.label, '下載朋友測試版 ZIP');
  assert.equal(content.beta.status, '朋友測試版可下載');
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
  assert.equal(download.note, 'v0.8.21 · Build 45 · ZIP 211MB');
  assert.match(download.requirements, /Apple Silicon Mac/);
  assert.match(download.requirements, /macOS 26\.2 或以上/);
  assert.match(download.requirements, /建議 16GB RAM/);
  assert.match(download.requirements, /預留 20GB 可用空間/);
  assert.match(download.requirements, /首次設定模型約下載 10GB/);
  assert.match(download.requirements, /視乎選擇/);
  assert.match(download.requirements, /唔會預先附/);
  assert.equal(download.steps.length, 3);
  assert.match(download.steps[0][1], /下載 ZIP/);
  assert.match(download.steps[0][1], /Cantonese Transcript Studio Beta/);
  assert.match(download.steps[0][1], /拖入 Applications/);
  assert.match(download.steps[1][1], /雙擊/);
  assert.match(download.steps[1][1], /如果見到被封鎖/);
  assert.match(download.steps[2][1], /私隱與保安/);
  assert.equal(download.steps[2][0], '強制開啟／仍要打開（Open Anyway）');
  assert.ok(download.steps[2][1].includes('強制開啟／仍要打開（Open Anyway）'));
  assert.match(download.steps[2][1], /如要求登入就登入/);
  assert.match(download.steps[2][1], /確認開啟/);
  assert.equal(download.warning, '朋友測試版，未經 Apple 公證。');
  assert.match(download.damagedWarning, /已損壞|惡意軟件/);
  assert.match(download.damagedWarning, /唔好繼續開啟/);
  assert.match(download.damagedWarning, /聯絡 Yin/);
  assert.equal(download.supportUrl, 'https://support.apple.com/zh-hk/102445');

  const details = Object.fromEntries(content.beta.details);
  assert.match(details['測試狀態'], /唔代表所有功能已完成測試/);
  assert.match(details['Lazy Camman'], /未做準確度認證/);
  assert.match(details['AI 即時提示'], /另行設定本機 runtime/);
  assert.match(details['AI 即時提示'], /唔保證延遲或答案準確度/);
});

test('markup keeps download metadata in one file and noscript honest', async () => {
  const html = await readFile('index.html', 'utf8');
  const app = await readFile('app.js', 'utf8');
  const ctaCount = (html.match(/data-download-cta/g) || []).length;
  assert.equal(ctaCount, 2);
  assert.ok(html.includes('id="download-hero"'));
  assert.ok(html.includes('id="download-beta"'));
  assert.ok(html.includes('id="install-steps"'));
  assert.ok(html.includes('id="damaged-warning"'));
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
    /開啟任何來源|Anywhere|sudo\s|spctl\s|--master-disable|xattr\s+-|csrutil\s/i
  );
});
