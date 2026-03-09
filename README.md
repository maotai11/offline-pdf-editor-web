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

### 中文字元無法寫入 PDF

**影響功能：** 浮水印、頁碼、頁首頁尾、新增表單欄位標籤

**現象：** 在上述功能輸入中文，畫面預覽正常，但**下載的 PDF 用其他閱讀器（Acrobat、系統預設）開啟後，中文字元消失或顯示空白**。

**原因：** 目前使用的 PDF 寫入函式庫預設字型（Helvetica）不支援 CJK 字元，中文字元在寫入 PDF 時被靜默略過。

**目前建議：** 上述功能請使用英文、數字或符號。中文標注請改用「便利貼」或「文字框」工具（這些是 Canvas 覆蓋層，不經過 PDF 寫入引擎）。

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
