// One public feature authority for the website. Derived from the private
// 2026-09-20 native app source audit; do not add marketing-only claims here.
export const catalog = {
  eyebrow: '完整功能表',
  title: 'App 入面，全部做到啲乜。',
  intro: '十個分類，每個先睇動畫理解流程；要逐項細節先展開。',
  boundary: '清單由現有 App 功能入口整理；有歷史實測紀錄嘅功能會標明。朋友 Beta 未逐項重新驗證，實際效果視乎你部機、模型同收音環境。',
  labels: {
    situation: '適合咩情況',
    input: '輸入乜',
    output: '輸出乜',
    conditions: '條件／限制'
  },
  categories: [
    {
      id: 'import', title: '匯入與轉錄', icon: 'FileAudio', summary: '本機檔案、公開網址、批次排隊同歷史紀錄。',
      demo: {
        hook: '貼一條公開連結，揀影片、音訊或字幕。',
        steps: ['貼公開 URL', '揀下載內容', '入隊同睇狀態'],
        output: '可處理媒體 · 音訊 · 字幕',
        platforms: ['YouTube', 'Instagram', 'Threads', 'X', 'TikTok', 'Facebook', 'Reddit', 'Bilibili'],
        modes: ['影片', '音訊', '字幕'],
        modeOutputs: {
          '影片': 'MP4 · 可處理影片',
          '音訊': 'M4A · 分離音訊',
          '字幕': 'SRT / VTT · 字幕檔'
        },
        replay: '重播匯入示意'
      }
    },
    {
      id: 'review', title: '轉錄覆核', icon: 'Search', summary: '搜尋、時間碼、低信心提示、模型比對同講者標示。',
      demo: { hook: '邊句可疑，先睇邊句。', steps: ['搜尋關鍵字', '睇時間碼', '覆核低信心'], output: '已覆核逐字稿' }
    },
    {
      id: 'dictionary', title: '個人詞庫', icon: 'BookUser', summary: '人名、專有詞、修正記憶同匯入匯出。',
      demo: { hook: '你嘅名，唔使次次手改。', steps: ['加入正確寫法', '保留修正記憶', '匯出備份'], output: '個人詞庫檔' }
    },
    {
      id: 'editing', title: '字幕後製', icon: 'Captions', summary: '改字、調時間、重新斷句、講者分配同自動儲存。',
      demo: { hook: '逐字稿變成可交片字幕。', steps: ['改字', '調時間', '重新斷句'], output: '字幕 project' }
    },
    {
      id: 'style', title: '字幕外觀與翻譯', icon: 'Palette', summary: '字體顏色位置、Brand Kit、安全範圍、雙語同純譯文。',
      demo: { hook: '字幕樣式保持喺安全範圍。', steps: ['揀樣式', '對安全範圍', '出雙語／譯文'], output: '樣式預覽 · 字幕檔' }
    },
    {
      id: 'outputs', title: '實際輸出', icon: 'FileOutput', summary: 'TXT、SRT、VTT、JSON、CSV、ASS 同燒字幕 MP4。',
      demo: { hook: '同一個 project，交畀下一個流程。', steps: ['揀格式', '核對內容', '匯出檔案'], output: 'TXT · SRT · VTT · JSON · CSV · ASS · MP4' }
    },
    {
      id: 'insights', title: 'AI 整理', icon: 'Sparkles', summary: '摘要、重點、行動清單、概念解釋同原文依據。',
      demo: { hook: '長對話先變做可跟進清單。', steps: ['讀逐字稿', '摘重點', '連返原文'], output: '摘要 · 行動清單' }
    },
    {
      id: 'live', title: '現場輔助', icon: 'Mic', summary: '即時字幕、AI 問答輕量提示同訪問提示。',
      demo: { hook: '現場聽唔切，畫面幫你跟。', steps: ['開麥克風', '睇即時字幕', '用短提示'], output: '現場字幕 · 提示卡' }
    },
    {
      id: 'camman', title: 'Lazy Camman', icon: 'Users', summary: '建立講者、逐位註冊、轉人提示同未能確認狀態。',
      demo: { hook: '先認聲，再睇邊個接住講。', steps: ['建立講者', '逐位註冊', '顯示轉人'], output: '講者標籤 · 轉人提示' }
    },
    {
      id: 'settings', title: '自動化與設定', icon: 'Settings', summary: 'Local API、Apple Shortcuts、模型準備同連線邊界。',
      demo: { hook: '本機流程可以接去 Shortcuts。', steps: ['開 Local API', '配置 Shortcut', '準備模型'], output: '本機工作 · 匯出文字' }
    }
  ],
  features: [
    { id: 'media-import', category: 'import', title: '音訊／影片與批次轉錄', situation: '整理錄音或影片對話', input: '本機影音檔案', output: '排隊處理後嘅逐字稿', conditions: '需準備模型；批次完成唔代表文字準確，仍要覆核。', evidence: 'implemented' },
    { id: 'public-url', category: 'import', title: '公開網址匯入', situation: '整理網上公開影音', input: '支援來源嘅公開網址', output: '匯入工作及可處理媒體', conditions: '需要連線；唔保證所有網址可用，唔會借用瀏覽器登入 cookies。', evidence: 'implemented' },
    { id: 'queue-retry-history', category: 'import', title: '排隊、取消、重試、歷史紀錄', situation: '多份檔案或中途失敗', input: '已建立嘅工作', output: '工作狀態、重試入口及歷史結果', conditions: '歷史紀錄唔等於已完成；要睇每份工作狀態。', evidence: 'implemented' },
    { id: 'search-time-confidence', category: 'review', title: '搜尋、時間碼、低信心提示', situation: '快速搵句子及優先覆核可疑段落', input: '已產生嘅逐字稿', output: '搜尋結果、段落時間碼、覆核提示', conditions: '提示唔係準確率保證；冇提示亦可能有錯。', evidence: 'implemented' },
    { id: 'model-consensus', category: 'review', title: '模型比對與共識覆核', situation: '比較唔同辨認結果', input: '已準備模型與錄音／工作結果', output: '比較畫面及候選覆核結果', conditions: '需要額外模型同資源；多模型同意亦唔代表一定正確。', evidence: 'implemented' },
    { id: 'speaker-labels', category: 'review', title: '講者標示', situation: '整理多人對話', input: '錄音及預計講者設定', output: '段落講者標籤', conditions: '要開啟相關設定；唔好同 Lazy Camman 已註冊聲紋身份混為一談。', evidence: 'implemented' },
    { id: 'dictionary-terms', category: 'dictionary', title: '人名、專有詞與別名', situation: '同一批名詞經常聽錯', input: '正確寫法與別名', output: '個人修正詞條', conditions: '修正映射唔係任意改寫句子，唔保證每次辨認都正確。', evidence: 'implemented' },
    { id: 'dictionary-memory', category: 'dictionary', title: '修正記憶、學習開關、匯入／匯出', situation: '重用或備份自己嘅詞庫', input: '修正記憶或詞庫檔案', output: '本機詞庫與匯出檔案', conditions: '歷史 RPC 測試唔代表新版 UI 已重新實測；可控制學習及刪除詞條。', evidence: 'historical' },
    { id: 'subtitle-text-time', category: 'editing', title: '改字、調時間與重新斷句', situation: '將逐字稿執成字幕', input: '字幕段落與影音', output: '修改後字幕 project', conditions: '重新斷句後仍要核對時間與意思；未承諾零漂移。', evidence: 'implemented' },
    { id: 'subtitle-speakers', category: 'editing', title: '講者名稱與段落分配', situation: '整理多人字幕', input: '講者資料與字幕段落', output: '分配咗講者嘅字幕', conditions: '人工分配同自動辨認係唔同操作。', evidence: 'implemented' },
    { id: 'subtitle-autosave', category: 'editing', title: '自動儲存與衝突提示', situation: '持續修改字幕', input: '編輯動作', output: '儲存狀態與 project 版本', conditions: '留意未儲存／失敗／衝突狀態，唔好只見到編輯畫面就當已保存。', evidence: 'implemented' },
    { id: 'subtitle-style', category: 'style', title: '字體、顏色、陰影、底色與位置', situation: '配合影片字幕外觀', input: '字幕與樣式設定', output: '預覽及燒字幕樣式', conditions: '字體要喺本機可用；位置入口係底部間距，唔宣稱任意拖放排版。純 SRT／TXT 唔承載呢啲外觀。', evidence: 'implemented' },
    { id: 'brand-safe-zone', category: 'style', title: 'Brand Kit 與安全範圍', situation: '重用品牌字幕外觀', input: '儲存樣式與安全範圍選項', output: '可套用樣式及預覽參考', conditions: '仍要睇最終影片有冇遮擋或出界。', evidence: 'implemented' },
    { id: 'subtitle-translation', category: 'style', title: '雙語、純譯文與譯文修改', situation: '交付另一種語言字幕', input: '已儲存字幕、目標語言', output: '譯文、雙語／純譯文字幕及預覽', conditions: '本機模型結果要覆核；project 改咗可令翻譯過期，唔可當新版本。', evidence: 'historical' },
    { id: 'txt-exports', category: 'outputs', title: '普通／時間碼 TXT', situation: '閱讀、交稿或跟時間搵內容', input: '逐字稿／字幕 project', output: '純文字或帶時間碼文字', conditions: '文字檔唔保留字幕外觀；時間碼要覆核。', evidence: 'implemented' },
    { id: 'srt-vtt-exports', category: 'outputs', title: 'SRT／VTT', situation: '交畀支援字幕檔嘅播放器或剪輯流程', input: '字幕 project', output: '帶時間碼字幕檔', conditions: '匯入兼容度以目標軟件為準；唔承諾完整樣式保留或 NLE 專用 XML。', evidence: 'implemented' },
    { id: 'json-csv-exports', category: 'outputs', title: 'JSON／CSV', situation: '後續資料處理或表格覆核', input: '字幕 project', output: '結構化 JSON 或 CSV', conditions: '唔係自動剪片時間線；私人內容唔可直接用作公開下載樣本。', evidence: 'implemented' },
    { id: 'ass-export', category: 'outputs', title: 'ASS 樣式字幕', situation: '需要有樣式嘅翻譯字幕或燒字幕流程', input: '翻譯結果及樣式', output: 'ASS 字幕檔', conditions: '普通六格式匯出清單冇 ASS；翻譯匯出及 renderer 另有 ASS，唔好話所有位置都有。', evidence: 'historical' },
    { id: 'burned-mp4', category: 'outputs', title: '燒字幕 MP4', situation: '交付已經嵌入字幕嘅影片', input: '影片、字幕與樣式', output: 'H264 MP4；可原文、雙語或純譯文', conditions: '需 FFmpeg／libass；字幕已燒入畫面，唔係可獨立關閉字幕軌。要檢查完成檔案，唔只睇進度。', evidence: 'historical' },
    { id: 'ai-insights', category: 'insights', title: '摘要、重點與行動清單', situation: '長對話整理成可跟進內容', input: '完成嘅逐字稿', output: 'AI 整理結果及原文依據', conditions: '衍生內容唔等於原話，應按依據返回逐字稿覆核。', evidence: 'implemented' },
    { id: 'concept-explanation', category: 'insights', title: '概念解釋與核對建議', situation: '遇到唔熟悉嘅概念', input: '逐字稿概念', output: '解釋、建議及需核對提示', conditions: '唔係已查證網上資料；模型可以出錯。', evidence: 'implemented' },
    { id: 'live-captions', category: 'live', title: '即時字幕', situation: '現場跟住對話', input: '麥克風音訊', output: '現場字幕及可複製文字', conditions: '需麥克風權限與模型；延遲、收音、口音會影響結果，未重新實測。', evidence: 'implemented' },
    { id: 'live-light-qa', category: 'live', title: 'AI 問答／輕量短提示', situation: '聽到問題或指定題材時輔助理解', input: '已確認字幕、題材、背景資料', output: '短提示卡或資料不足狀態', conditions: '唔係無限制聊天；本機資源不足可停用提示而保留字幕，答案唔會寫入字幕，唔保證準確或低延遲。', evidence: 'implemented' },
    { id: 'interview-coach', category: 'live', title: '訪問提示', situation: '按問題表拍訪問', input: '問題、預期意思、必講概念及現場字幕', output: '可能已講／未講內容與追問提示', conditions: '人工開始收答案、完成題目同轉題；未校準字幕唔代表受訪者實際意思，AI 唔自動跳題。', evidence: 'implemented' },
    { id: 'camman-project-enroll', category: 'camman', title: '建立 project 與逐位註冊', situation: '拍固定一班人嘅訪問', input: '2 至 15 位講者資料，每人約 10 秒聲音', output: '本機講者 project 與註冊狀態', conditions: '逐位註冊，唔中途換人；加密特徵依賴本機安全儲存，唔由聲紋推斷真人身份。', evidence: 'implemented' },
    { id: 'camman-switch-unknown', category: 'camman', title: '辨認、轉人提示與未能確認', situation: '現場留意邊位接住講', input: '已註冊講者與現場音訊', output: '名稱、顏色、講者／轉人提示及未能確認狀態', conditions: '示意動畫唔係辨認成績；收音與重疊講話需實測。相機仍由人控制。', evidence: 'implemented' },
    { id: 'local-api-shortcuts', category: 'settings', title: 'Local API／Apple Shortcuts', situation: '用本機流程送檔轉錄', input: '本機檔案與已授權 API request', output: '工作狀態與完成後匯出文字', conditions: 'App 開住、設定 opt-in 並按指引重開；只監聽 loopback，token 唔可公開。Shortcut 需自行配置 helper，唔係手機背景 App。', evidence: 'implemented' },
    { id: 'models-hardware', category: 'settings', title: '模型準備與硬件需求', situation: '首次安裝或調整本機模型', input: '模型下載、核對及記憶體選項', output: '模型可用狀態與資源提示', conditions: '需下載空間及相應記憶體；最低規格未做獨立安裝驗證，唔寫死未證實數字。', evidence: 'implemented' },
    { id: 'local-network-boundary', category: 'settings', title: '本機處理與連線例外', situation: '了解資料處理位置', input: '本機媒體或主動網上匯入', output: '本機工作及結果', conditions: '模型下載及公開網址匯入需要連線；唔可將「本機轉錄」宣傳為任何情況都完全無網絡。', evidence: 'implemented' }
  ],
  notProvided: {
    title: '呢啲仲未提供',
    intro: '網站唔會暗示以下功能已存在。',
    status: '未提供',
    items: [
      { id: 'gimbal-control', title: '相機／gimbal 自動追蹤控制', note: '而家相機同 gimbal 仍由你控制；Lazy Camman 提供嘅係講者提示。' },
      { id: 'mobile-background', title: '電話／iPad 背景運行', note: '而家係 Mac App；未提供手機背景偵測或遙控 B 機。' },
      { id: 'multicam-sync', title: '自動多機音訊同步與剪輯 XML', note: '字幕匯出唔等於多機時間線同步；未提供自動剪片 XML。' }
    ]
  }
};

export function featuresByCategory(categoryId, features = catalog.features) {
  return features.filter(feature => feature.category === categoryId);
}
