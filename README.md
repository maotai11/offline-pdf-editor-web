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

### 可選：用本機伺服器開啟
若你偏好 `http://localhost`：
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

## 5. 常見問題

### Q1: 開檔出現 `No PDF header found`
- 代表選到的檔案不是有效 PDF（或檔案已損毀）。
- 請確認副檔名與內容一致，建議先用其他閱讀器測試可否開啟。

### Q2: 顯示唯讀模式
- 代表檔案可顯示，但寫入引擎無法解析該 PDF 結構。
- 仍可瀏覽，若要編輯請先用其他工具另存一份後再開啟。

### Q3: `file://` 能不能用？
- 可以，本專案已內建本機 `lib/`，可離線開啟。

---

## 6. 授權

本專案程式碼授權請依倉庫後續 `LICENSE` 設定為準。
