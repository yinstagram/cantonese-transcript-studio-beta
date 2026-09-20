// One text authority for the website, storyboard and interactive demonstration.
export const content = {
  brand: 'Cantonese Transcript Studio',
  subtitle: '由廣東話，去到你嘅下一個作品。',
  intro: '整理錄音、編輯字幕，拍攝時知道邊個接住講。為 Mac 上嘅廣東話製作流程而設。',
  speakers: [
    { name: '講者 1', short: '01', color: '#147c64', position: '14%' },
    { name: '講者 2', short: '02', color: '#3166c5', position: '38%' },
    { name: '講者 3', short: '03', color: '#ac4d73', position: '61%' },
    { name: '講者 4', short: '04', color: '#927117', position: '85%' }
  ],
  ui: {
    app: 'Lazy Camman', setup: '設定今次拍攝', enroll: '講者聲音註冊',
    record: '請同一個講者對住麥克風自然講約 10 秒，唔好中途換人。',
    next: '註冊下一位講者', allEnrolled: '所有講者已完成註冊',
    start: '開始 Lazy Camman', enrolled: '已註冊', notEnrolled: '未註冊',
    listening: '正在聆聽', review: '核對中', reviewDetail: '偵測到另一把聲，核對中…',
    confirmed: '講者已轉換', uncertain: '未確定講者', now: '而家',
    simulated: '互動示範，非即時辨認', compressed: '短片已加快；實際每人約 10 秒',
    same: '同一位講者繼續講，唔會重複提示。',
    unknownDetail: '呢個示範顯示辨認未有把握時嘅狀態。實際效果會受收音環境影響。',
    ready: '四位講者已就緒', liveDetail: '畫面顯示已登錄講者嘅名稱、顏色同轉人提示。',
    play: '播放教學', pause: '暫停', replay: '重播', previous: '上一幕', nextScene: '下一幕'
  },
  scenes: [
    { start: 0, end: 2, title: '四個人，一場訪問。', detail: '拍攝時，你想知道邊位接住講。', label: '訪問現場' },
    { start: 2, end: 4, title: '先記低每一把聲。', detail: '建立 project，設定講者名稱同顏色。', label: '設定拍攝' },
    { start: 4, end: 10.4, title: '逐位講，逐位記。', detail: '完成一位，再開始下一位。', label: '逐位註冊' },
    { start: 10.4, end: 12.4, title: '人齊，就可以開始。', detail: '全部講者完成註冊，先可以開始辨認。', label: '開始拍攝' },
    { start: 12.4, end: 15, title: '邊個接住講，一眼睇到。', detail: '由核對到確認，留意名稱同顏色。', label: '講者提示' }
  ],
  examples: {
    label: '格式示例 · 非實測轉錄結果',
    lines: ['今次我哋想講吓，點樣準備一場訪問。', '先整理問題，再逐位確認收音。'],
    times: [['00:00:01,000', '00:00:04,000'], ['00:00:04,500', '00:00:07,000']]
  },
  beta: {
    title: 'Beta，仲喺打磨。', status: 'v0.8.22 朋友測試版可下載',
    body: '已完成本機隔離環境基本測試；未喺另一部乾淨 Mac 驗證，請保留原始檔。',
    updates: [
      'SRT、VTT、TXT 預設唔再強制加入 Speaker 1；想要講者名先自行開啟選項。',
      '字幕編輯加入剪片式 timeline，可以邊聽邊改，並一鍵套用 AI 修正建議。',
      '新增 SRT、VTT、TXT 字幕格式互轉。',
      '第一次開 App 會出四步 B 風格動畫新手引導，逐步帶住用輸入、覆核、Lazy Camman 同匯出。',
      '時間碼只能估算時會明確標示要覆核，唔會靜靜當成高信心結果。'
    ],
    download: {
      ready: true,
      url: 'https://github.com/yinstagram/cantonese-transcript-studio-beta/releases/download/v0.8.22-friend-beta.2/CantoneseTranscriptStudio-0.8.22-friend-beta-arm64.zip',
      preparingLabel: '下載準備中',
      readyLabel: '下載朋友測試版 ZIP',
      note: 'v0.8.22 · Build 47 · ZIP 約 211MB',
      requirementsQuick: ['Apple Silicon Mac', 'macOS 26.2 或以上', '建議 16GB RAM', '預留 20GB 空間'],
      requirementsDetail: '首次設定模型約下載 10GB（視乎選擇），唔會預先附喺 ZIP 內；AI 提示需要另行設定本機 runtime。',
      steps: [
        {
          title: '下載 ZIP',
          action: '下載朋友測試版 ZIP',
          target: 'Downloads',
          result: '原始 ZIP 已保留喺 Downloads'
        },
        {
          title: '刪舊版並放入 Applications',
          action: '先將舊 CTS Beta 拖去 Trash；再解壓新版，拖入 Applications',
          target: 'Applications 舊版 → Trash；Downloads 新版 → Applications',
          targetFrom: 'Downloads',
          targetTo: 'Applications',
          result: 'Applications 只保留一個新 CTS Beta'
        },
        {
          title: '雙擊開一次',
          action: '雙擊 CTS Beta',
          target: 'CTS Beta',
          result: 'macOS 顯示被封鎖提示'
        },
        {
          title: '允許開啟',
          action: '系統設定 → 私隱與保安 → Open Anyway',
          target: 'Privacy & Security',
          result: '返回 CTS Beta 再開一次'
        }
      ],
      warning: '朋友測試版，未經 Apple 公證。',
      damagedWarning: '如果系統提示「已損壞」或「惡意軟件」，唔好繼續開啟，直接聯絡 Yin。',
      supportUrl: 'https://support.apple.com/zh-hk/102445'
    },
    details: [
      ['測試狀態', '朋友 Beta 供安裝同基本使用測試；唔代表所有功能已完成測試。'],
      ['Lazy Camman', '實驗功能，講者提示未做準確度認證；未提供相機、gimbal 自動追蹤或手機背景控制。'],
      ['AI 即時提示', '實驗功能，需要另行設定本機 runtime；唔保證延遲或答案準確度。']
    ]
  }
};

export function releaseDownload(download = content.beta.download) {
  return {
    ready: download.ready === true,
    href: download.ready === true ? download.url : null,
    label: download.ready === true ? download.readyLabel : download.preparingLabel
  };
}
