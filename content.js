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
    simulated: '互動示範，非即時辨認', compressed: '註冊片段已加快；實際每人約 10 秒',
    same: '同一位講者繼續講，唔會重複提示。',
    unknownDetail: '呢個示範顯示辨認未有把握時嘅狀態。實際效果會受收音環境影響。',
    ready: '四位講者已就緒', liveDetail: '畫面顯示已登錄講者嘅名稱、顏色同轉人提示。',
    play: '播放教學', pause: '暫停', replay: '重播', previous: '上一幕', nextScene: '下一幕'
  },
  scenes: [
    { start: 0, end: 5, title: '四個人，一場訪問。', detail: '拍攝時，你想知道邊位接住講。', label: '訪問現場' },
    { start: 5, end: 9, title: '先記低每一把聲。', detail: '喺 Lazy Camman 建立 project，設定講者名稱同顏色。', label: '設定拍攝' },
    { start: 9, end: 21, title: '逐位講，逐位記。', detail: '每人約 10 秒。完成一位，再手動開始下一位。', label: '逐位註冊' },
    { start: 21, end: 25, title: '人齊，就可以開始。', detail: '全部講者完成註冊，先可以開始今次辨認。', label: '開始拍攝' },
    { start: 25, end: 35, title: '邊個接住講，一眼睇到。', detail: '由核對到確認，跟住名稱同顏色留意轉人。', label: '講者提示' }
  ],
  examples: {
    label: '格式示例 · 非實測轉錄結果',
    lines: ['今次我哋想講吓，點樣準備一場訪問。', '先整理問題，再逐位確認收音。'],
    times: [['00:00:01,000', '00:00:04,000'], ['00:00:04,500', '00:00:07,000']]
  },
  beta: {
    title: 'Beta，仲喺打磨。', status: '公開下載準備中',
    body: '現有版本已喺開發用 Mac 測試，但朋友直接下載安裝嘅流程未完成驗證。下載入口會喺獨立安裝測試通過後開放。',
    details: [
      ['平台', '現階段以 Apple Silicon Mac 為主。正式最低系統要求會跟下載版一齊公布。'],
      ['本機處理', '設定完成後，轉錄喺 Mac 本機進行。首次下載模型同主動匯入網上影片需要連線。'],
      ['Lazy Camman', '現有功能係講者辨認同轉人提示；未提供相機、gimbal 自動追蹤或手機背景控制。'],
      ['AI 即時提示', '實驗功能。可根據現場字幕同背景資料提供短提示；唔保證延遲或答案準確度。']
    ]
  }
};
