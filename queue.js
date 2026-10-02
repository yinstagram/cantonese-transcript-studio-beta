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
      boundary: '呢項係 10/2 內部升級驗收，唔等同 9/22 公開朋友 ZIP。單機升級驗收；未覆蓋另一部乾淨 Mac、Keychain 首次遷移或全部歷史 project 逐一開啟。'
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
    },
    {
      id: 'o8-production-timing-gate',
      title: '小薯茄 O8 自動 timing gate',
      status: 'completed',
      result: 'Production path 完成 1,443 cues／10,420 字；自然斷句選出 1,096 個邊界，全部文字保留。1,443 個 cue 與模型字級時間一致；相對模型字級時間，結尾偏差不超過 500ms，無重疊、倒轉或出界；TXT、timestamp TXT、SRT、VTT、JSON、CSV hash read-back 全部一致，Speaker 前綴 0。',
      boundary: '只係自動 gate PASS；17 個指定播放位仍要人耳人眼覆核。YouTube 字幕唔係人工 gold，所以最終準確度同 release verdict 仍未宣告。'
    }
  ],
  items: [
    {
      id: 'o8-human-playback-review',
      priority: 'P1',
      title: 'O8 17 個播放位人手覆核',
      task: '按已選時間位逐段聽返：0:00、0:21、0:25、0:44、1:38、4:40、8:00、10:48、13:56、17:21、20:09、23:02、23:28、26:56、28:33、30:13、31:48。每段答文字啱唔啱、開始有冇遲過半秒、結尾有冇截聲、斷句自然唔自然。',
      output: '17 個樣本嘅人手 verdict、問題時間碼同修正清單；任何一個 No 就先修再重跑 gate。',
      candidateSrt: {
        path: 'assets/o8-candidate-20261002.srt',
        sha256: '70e73f267a5130baba3eadef0f1f80a3e570789749940aac8273d64e60ca1a96'
      },
      reviewPoints: [
        { label: '0:00', seconds: 0 },
        { label: '0:21', seconds: 21 },
        { label: '0:25', seconds: 25 },
        { label: '0:44', seconds: 44 },
        { label: '1:38', seconds: 98 },
        { label: '4:40', seconds: 280 },
        { label: '8:00', seconds: 480 },
        { label: '10:48', seconds: 648 },
        { label: '13:56', seconds: 836 },
        { label: '17:21', seconds: 1041 },
        { label: '20:09', seconds: 1209 },
        { label: '23:02', seconds: 1382 },
        { label: '23:28', seconds: 1408 },
        { label: '26:56', seconds: 1616 },
        { label: '28:33', seconds: 1713 },
        { label: '30:13', seconds: 1813 },
        { label: '31:48', seconds: 1908 }
      ]
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
