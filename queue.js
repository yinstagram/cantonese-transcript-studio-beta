// Public evidence queue for tasks that still need real-product acceptance.
// Keep this separate from features.js: shipped UI entry points and acceptance
// evidence are different authorities.
export const testQueue = {
  eyebrow: '要試',
  title: '下一輪真實項目驗收。',
  intro: '網站唔用單元測試或報告代替產品驗收。呢度記低已完成嘅實機證據，同仲要用真素材跑一次嘅項目。',
  updated: '2026-10-02',
  evidenceTitle: '已經有輸出',
  queueTitle: '排住要試',
  statuses: {
    verified: '實機已驗',
    completed: '已跑完',
    queued: '要試'
  },
  evidence: [
    {
      id: 'm2-native-export',
      title: '字幕原生儲存 8 個 gate',
      status: 'verified',
      result: '真 macOS save panel 完成：正確 .srt 檔名、內容、取消、覆寫、Speaker 開／關及移除前綴。',
      boundary: '已補回安裝版實際 worker 匯出 read-back；未證明另一部乾淨 Mac 或首次安裝 onboarding。'
    },
    {
      id: 'installed-upgrade',
      title: '安裝版升級與資料保留',
      status: 'verified',
      result: 'Installed App 已升級至 v0.8.24 Build 55（bundle hash 與 candidate 一致）：6,440 job artifacts、192 model assets、3 個 speaker profiles、4 個 YouTube imports、settings 及 correction memory 全部 0 missing／0 changed。',
      boundary: '單機升級驗收；未覆蓋另一部乾淨 Mac、Keychain 首次遷移或全部歷史 project 逐一開啟。'
    },
    {
      id: 'real-edit-loop',
      title: '真片聽住改完整閉環',
      status: 'verified',
      result: '真實 60 秒錄音：邊播邊改、時間微調、分割／合併、Undo／Redo、儲存、關閉重開，SRT 逐 cue text／time／order 與 project 一致，Speaker 預設唔加前綴。',
      boundary: '經 production worker 匯入；原生 file-picker／drag-drop onboarding 仍係獨立 gate，亦唔代表 ASR 準確度。'
    },
    {
      id: 'pomato-smoke',
      title: '小薯茄／Pomato 31:58 真片',
      status: 'completed',
      result: '處理完成 412 cues；TXT／SRT／VTT／JSON／CSV 輸出、integrity seal 及文字交叉檢查有 receipt。',
      baseline: 'YouTube zh-HK 字幕只作 ASR comparison baseline：HK normalized CER 77.4842%、timing median 689ms、P95 4637.776ms、1310／1310 diagnostic fail。',
      boundary: '唔係人工 gold reference，因此唔當準確度 PASS；數值用來定位差異，唔用來宣稱好或差。'
    }
  ],
  items: [
    {
      id: 'timing-natural-segmentation',
      priority: 'P1',
      title: '時間偏移與自然斷句',
      task: '用小薯茄同一素材量 timing baseline，並觸發真實 fallback 場景，確認自然斷句唔丟字、可 Undo、可保存。',
      output: '每 cue timing 差異、錯字分類、fallback 狀態同編輯後 project。'
    },
    {
      id: 'triple-review-pure-audio',
      priority: 'P2',
      title: '三重覆核與純錄音可靠性',
      task: '用朋友同類素材重現三重覆核失敗同 Voice Memos 純錄音問題，再測 cancel、retry、resume。',
      output: '分層 receipt、失敗原因、修正後同素材 PASS 證據。'
    },
    {
      id: 'multi-speaker-baseline',
      priority: 'P3',
      title: '多人講嘢準確度 baseline',
      task: '固定三組素材：單人、輪流講、重疊講嘢；人名、數字、中英混合分開統計。',
      output: '每組 CER／錯字分類／failure sample，唔用平均數遮住差檔。'
    }
  ]
};
