# Offline PDF Studio（離線 PDF 編輯器）

可離線執行（支援 `file://`）的單頁 PDF 工具，主要功能包含：
- 開啟/儲存 PDF、縮放與導覽
- 註解（螢光筆、文字、圖形、印章、遮蔽）
- 合併/拆分/批次處理精靈
- 多文件分頁與頁面搬移
- 表單/書籤/附件/頁碼/浮水印等工具

---

## 1. 下載專案

### 方法 A：Git 下載（建議）
```bash
git clone https://github.com/maotai11/offline-pdf-editor-web.git
cd offline-pdf-editor-web
```

### 方法 B：ZIP 下載
1. 打開倉庫：`https://github.com/maotai11/offline-pdf-editor-web`
2. 點 `Code` -> `Download ZIP`
3. 解壓縮到本機資料夾

---

## 2. 如何使用

### 直接開啟（離線）
1. 進入專案資料夾
2. 直接雙擊 `index.html`（或右鍵用瀏覽器開啟）
3. 點「開啟檔案」選 PDF，或拖曳 PDF 到頁面

### 瀏覽器相容說明

| 瀏覽器 | 直接雙擊 | 說明 |
|--------|---------|------|
| **Firefox** | ✅ 直接可用 | 推薦，離線使用首選 |
| **Edge** | ✅ 通常可用 | 多數版本正常 |
| **Chrome** | ⚠️ 需額外設定 | 見下方說明 |
| **Safari** | 🔶 部分功能 | File API 行為略有差異 |

#### Chrome 使用說明

Chrome 預設禁止本機 `file://` 頁面存取同目錄下的其他本機檔案（Worker 跨來源限制），
直接雙擊開啟可能導致 PDF 無法渲染。

**解法 A：改用 Firefox 或 Edge（最簡單）**

**解法 B：用指令啟動 Chrome**
```bat
chrome.exe --allow-file-access-from-files
```
啟動後再從 Chrome 開啟 `index.html`。

**解法 C：用本機伺服器（任何瀏覽器皆可）**
```bash
python -m http.server 5500
```
然後開啟：`http://localhost:5500/index.html`

---

## 3. 目錄說明

- `index.html`：主頁
- `app.js`：核心邏輯
- `styles.css`：樣式
- `lib/`：離線函式庫（PDF.js / pdf-lib / JSZip）
- `cli/pdf_toolkit.ps1`：進階 CLI 工具（加密/OCR/比對等）

---

## 4. 進階 CLI（可選）

在專案根目錄執行：
```powershell
powershell -ExecutionPolicy Bypass -File .\cli\pdf_toolkit.ps1 -Action help
```

常見範例：
```powershell
# 加密
powershell -ExecutionPolicy Bypass -File .\cli\pdf_toolkit.ps1 -Action encrypt -Input in.pdf -Output out.pdf -UserPassword 1234 -OwnerPassword owner

# PDF 轉文字
powershell -ExecutionPolicy Bypass -File .\cli\pdf_toolkit.ps1 -Action pdf2text -Input in.pdf -Output out.txt
```

---

## 5. 已知限制

### 中文字元寫入 PDF（需手動載入字型）

**影響功能：** 浮水印、頁碼、頁首頁尾、連結標籤、表單 radio 選項

**背景說明：** PDF 寫入函式庫的內建字型（Helvetica/Times 等）均不支援 CJK 字元。若不載入字型，中文字元在寫入 PDF 時會被靜默略過。

**解決方法：**
1. 在工具列選單點選 **「載入 CJK 字型…」**（或命令面板輸入「字型」）
2. 選取本機的 `.ttf` / `.otf` 字型檔（例如 `NotoSansCJK-Regular.ttf`、`kaiu.ttf`）
3. 字型載入後，浮水印/頁碼/頁首尾/Bates 等功能的文字寫入將自動使用此字型

**字型取得方式（免費）：**
- [Noto Sans CJK](https://fonts.google.com/noto/specimen/Noto+Sans+TC)：Google 提供，支援繁體中文
- Windows 內建：`C:\Windows\Fonts\kaiu.ttf`（標楷體）、`msjh.ttc`（微軟正黑）

> **注意：** 字型僅存於記憶體中，重新整理後需重新載入。Canvas 標注（文字框、便利貼）本來就支援中文，不受此限制影響。

---

### Tagged PDF / PDF/UA 無障礙支援（A4-1）

**現況：** 本工具**不支援**產生 Tagged PDF（ISO 32000 / PDF/UA-1 ISO 14289）。

| 功能 | 支援狀態 |
|------|---------|
| 閱讀 Tagged PDF 標籤 | ❌ 不支援（顯示仍正常） |
| 寫入 `/StructTreeRoot`、`/MarkInfo` | ❌ pdf-lib 未實作 |
| 輔助技術（VoiceOver / NVDA）語意朗讀 | ❌ 輸出結構為非標記 PDF |
| Acrobat Preflight「PDF/UA-1」合規 | ❌ 必然不合格 |
| Canvas 標注的文字可被選取 / 截取 | ⚠️ 受限（文字層與繪圖層分離） |

**適用場景建議：**
- 若文件需通過 PDF/UA 或無障礙審查，請以本工具完成視覺編輯後，再透過 **Adobe Acrobat Pro「閱讀順序」工具** 或 **PAC 3 驗證器** 補充無障礙標記。
- 本工具定位為視覺編輯與批次處理輔助工具，無法取代完整的 Tagged PDF 工作流程。

---

### Preflight 相容性說明（A4-2）

以下列出本工具輸出 PDF 在常見 Preflight 規範下的預期結果：

| 規範 | 輸出結果 | 說明 |
|------|---------|------|
| **PDF/A-1b** | ⚠️ 通常不合格 | 缺乏 XMP 中繼資料 `/OutputIntents`、色彩描述檔 |
| **PDF/A-2b** | ⚠️ 通常不合格 | 同上，且 pdf-lib 不寫入 sRGB 輸出意圖 |
| **PDF/UA-1** | ❌ 不合格 | 無標記結構（見上方說明） |
| **PDF/X-1a** | ❌ 不合格 | 缺 `/TrimBox`、CMYK 色彩空間、輸出意圖 |
| **ISO 32000-1（一般 PDF）** | ✅ 基本合格 | 結構合法、字型嵌入（載入字型時）、XRef 正確 |
| **Acrobat Preflight「列印品質」** | ✅ 通常通過 | 視內容而定，無出血/裁切設定 |

**Preflight 修復建議：**
1. 若需 PDF/A，請在 Acrobat Pro 使用「另存為其他 → PDF/A」，或使用 Ghostscript：
   ```bash
   gs -dPDFA=2 -dBATCH -dNOPAUSE -sColorConversionStrategy=sRGB \
      -sDEVICE=pdfwrite -dPDFACompatibilityPolicy=1 \
      -sOutputFile=out_pdfa.pdf input.pdf
   ```
2. 連結標注已依 ISO 32000 設定 `/F=4`（列印旗標）與 `/P`（頁面參照），符合 Acrobat 連結標注基本規範。
3. Canvas 標注在扁平化（Ctrl+S 儲存）後轉為頁面內容串流，不含額外 `/Annot` 結構，對 Preflight 透明。

---

### Canvas 標注與 PDF 結構操作不可混用

**影響功能：** 螢光筆、矩形、橢圓、箭頭、文字框、便利貼、印章、遮蔽

**現象：** 先加 Canvas 標注，再執行任何 PDF 結構操作（浮水印、頁碼、頁首頁尾、旋轉、裁切、插入/刪除頁面、超連結、表單欄位...），**Canvas 標注將全部消失且無法復原**。

**目前建議：** 請依照以下順序操作：
1. 先完成所有 PDF 結構編輯（浮水印、旋轉、合併...）
2. 最後再加 Canvas 標注
3. Ctrl+S 儲存（Canvas 標注需透過「扁平化」才能永久嵌入 PDF）

---

### 自動備份在隱私模式下無效

本工具使用瀏覽器 `localStorage` 儲存每 30 秒自動備份的標注資料。
在**隱私瀏覽模式**或停用 localStorage 的環境下，備份功能無效，請務必手動 Ctrl+S 儲存。

---

## 6. 常見問題

### Q1: 開檔出現 `No PDF header found`
- 代表選到的檔案不是有效 PDF（或檔案已損毀）。
- 請確認副檔名與內容一致，建議先用其他閱讀器測試可否開啟。

### Q2: 顯示唯讀模式
- 代表檔案可顯示，但寫入引擎無法解析該 PDF 結構。
- 仍可瀏覽，若要編輯請先用其他工具另存一份後再開啟。

### Q3: `file://` 能不能用？
- 可以，本專案已內建本機 `lib/`，可離線開啟。

---

## 7. 授權

本專案程式碼授權請依倉庫後續 `LICENSE` 設定為準。
