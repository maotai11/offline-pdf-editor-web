const state = {
  pdfjs: null,
  pdfLib: null,
  pdfLibReadOnlyReason: "",
  fileName: "",
  currentPage: 1,
  totalPages: 0,
  scale: 1.25,
  activeTab: "Home",
  activeTool: "select",
  annColor: "#ffcc33",
  annWidth: 2,
  stampText: "REVIEWED",
  stampImageDataUrl: "",
  stampPresets: [],
  pageLabelRules: [],
  annotations: {},
  selectedAnnotationId: null,
  selectedAnnotationIds: [],
  annotationSearch: "",
  annotationFilter: "all",
  customBookmarks: [],
  selectedCustomBookmarkId: null,
  undoStack: [],
  redoStack: [],
  wizardType: null,
  wizardStep: 1,
  commandIndex: 0,
  commands: [],
  searchHits: [],
  searchHitDetails: [],
  searchCursor: -1,
  thumbScale: 0.25,
  viewMode: "continuous",
  attachments: [],
  readingMode: "normal",
  highContrast: false,
  presentationTimer: null,
  docs: [],
  activeDocId: null,
  settingsResolve: null,
};

const RECENT_KEY = "offline_pdf_recent2";
const RECOVERY_KEY = "offline_pdf_recovery_v1";
const LOG_KEY = "offline_pdf_logs_v1";
const SHORTCUTS_KEY = "offline_pdf_shortcuts_v1";
const STAMP_PRESET_KEY = "offline_pdf_stamp_presets_v1";

const TABS = ["Home", "Edit", "Annotate", "Page", "Tools", "View"];
const TAB_LABELS = {
  Home: "首頁",
  Edit: "編輯",
  Annotate: "註解",
  Page: "頁面",
  Tools: "工具",
  View: "檢視",
};

const TOOLBAR = {
  Home: [
    { label: "檔案", items: [["open", "開啟", "big"], ["save", "儲存", "big"], ["saveAs", "另存新檔", ""], ["printAdvanced", "列印", ""]] },
    { label: "導覽", items: [["prev", "上一頁", ""], ["next", "下一頁", ""], ["goto", "前往頁面", ""]] },
    { label: "縮放", items: [["zoomOut", "-", ""], ["zoomLabel", "100%", ""], ["zoomIn", "+", ""], ["fitWidth", "符合頁寬", ""]] },
  ],
  Edit: [
    { label: "歷程", items: [["undo", "復原", ""], ["redo", "重做", ""]] },
    { label: "搜尋", items: [["find", "搜尋", ""], ["findNext", "下一個", ""]] },
  ],
  Annotate: [
    {
      label: "工具",
      items: [
        ["toolSelect", "選取", ""],
        ["toolHighlight", "螢光筆", ""],
        ["toolText", "文字", ""],
        ["toolRect", "Rect", ""],
        ["toolEllipse", "橢圓", ""],
        ["toolLine", "直線", ""],
        ["toolArrow", "箭頭", ""],
        ["toolFreehand", "手繪", ""],
        ["toolRedact", "遮蔽", ""],
        ["toolSticky", "便利貼", ""],
        ["stampReviewed", "已閱章", ""],
        ["stampApproved", "核准章", ""],
        ["stampUrgent", "急件章", ""],
        ["stampImage", "圖片章", ""],
        ["stampManager", "印章管理", ""],
        ["crossSeal", "跨頁騎縫章", ""],
        ["editAnn", "編輯已選", ""],
      ],
    },
  ],
  Page: [
    { label: "轉換", items: [["rotate90", "旋轉 90", ""], ["rotate270", "旋轉 270", ""], ["rotateRange", "範圍旋轉", ""]] },
    { label: "管理", items: [["deletePage", "刪除頁面", ""], ["deleteRange", "範圍刪除", ""], ["insertBlank", "插入空白頁", ""], ["insertFromPdf", "從 PDF 插入", ""], ["extractPages", "提取頁面", ""], ["copyToDoc", "複製到其他文件", ""], ["moveToDoc", "移動到其他文件", ""], ["cropPage", "裁切目前頁", ""], ["cropRange", "範圍裁切", ""], ["setBoxes", "設定頁框", ""]] },
  ],
  Tools: [
    { label: "精靈", items: [["wizardMerge", "合併精靈", ""], ["wizardSplit", "拆分精靈", ""], ["wizardBatch", "批次精靈", ""], ["wizardConvert", "轉換精靈", ""]] },
    { label: "文件", items: [["watermarkAdvanced", "浮水印", ""], ["pageNumbers", "頁碼", ""], ["pageLabels", "頁面標籤", ""], ["headerFooter", "頁首頁尾", ""], ["metadata", "中繼資料", ""], ["addLink", "新增連結", ""], ["insertImage", "插入圖片", ""], ["exportRegion", "匯出區域", ""]] },
    { label: "進階", items: [["formBuilder", "新增表單欄位", ""], ["formFill", "填寫表單", ""], ["formImport", "匯入表單資料", ""], ["formExport", "匯出表單 JSON", ""], ["formExportCsv", "匯出表單 CSV", ""], ["formExportXfdf", "匯出表單 XFDF", ""], ["xfaInfo", "XFA 資訊", ""], ["extractImages", "提取圖片", ""], ["replaceImage", "替換圖片區域", ""], ["securityOps", "安全操作", ""], ["bookmarkManager", "書籤管理", ""], ["compressDoc", "壓縮", ""], ["bates", "Bates 編號", ""], ["flattenAnn", "扁平化註解", ""], ["applyRedact", "套用遮蔽", ""]] },
    { label: "診斷", items: [["exportLog", "匯出日誌", ""], ["clearLog", "清除日誌", ""], ["editShortcuts", "快捷鍵", ""]] },
  ],
  View: [
    { label: "面板", items: [["panelThumb", "縮圖", ""], ["panelBookmark", "書籤", ""], ["panelAnnot", "註解", ""], ["panelAttach", "附件", ""]] },
    { label: "縮圖", items: [["thumbSm", "縮圖 -", ""], ["thumbLg", "縮圖 +", ""]] },
    { label: "模式", items: [["modeSingle", "單頁", ""], ["modeCont", "連續", ""], ["modeTwo", "雙頁", ""]] },
    { label: "閱讀", items: [["readNormal", "一般", ""], ["readNight", "夜間", ""], ["readWarm", "護眼", ""]] },
    { label: "無障礙", items: [["toggleContrast", "高對比", ""], ["present", "簡報模式", ""], ["presentAuto", "自動播放", ""]] },
  ],
};

const $ = (id) => document.getElementById(id);
const baseName = (name) => (name || "document").replace(/\.pdf$/i, "");
const extensionOf = (name) => {
  const n = String(name || "");
  const idx = n.lastIndexOf(".");
  if (idx < 0 || idx === n.length - 1) return "";
  return n.slice(idx + 1);
};
const safeAttr = (s) => String(s).replace(/"/g, "&quot;");
const genId = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : `ann-${Math.random().toString(36).slice(2, 10)}`);
const DEFAULT_SHORTCUTS = {
  open: "Ctrl+O",
  save: "Ctrl+S",
  undo: "Ctrl+Z",
  redo: "Ctrl+Y",
  print: "Ctrl+P",
  find: "Ctrl+F",
  findNext: "Ctrl+G",
  commandPalette: "Ctrl+Shift+P",
  nextPage: "PageDown",
  prevPage: "PageUp",
  scrollTop: "Home",
};

function init() {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "lib/pdf.worker.min.js";
  initMessaging();
  bindErrorLogging();
  setupAdvancedAnnotationUI();
  setupSearchResultsUI();
  setupBookmarkManagerUI();
  renderTabs();
  switchTab("Home");
  bindEvents();
  renderRecent();
  loadStampPresets();
  buildCommands();
  startAutoBackupTimer();
  applyReadingAndA11y();
  updateStatus();
  renderDocTabs();
}

function initMessaging() {
  if (window.__nativeAlert) return;
  window.__nativeAlert = window.alert ? window.alert.bind(window) : null;
  window.alert = (msg) => {
    const text = String(msg ?? "");
    const isErr = /(failed|error|invalid|unable|read-only|no valid|must|失敗|錯誤|無法|無效|至少)/i.test(text);
    showToast(text, isErr ? "error" : "info");
  };
}

function showToast(message, type = "info", timeoutMs = 2600) {
  const root = $("toastStack");
  if (!root) return;
  const node = document.createElement("div");
  node.className = `toast${type === "error" ? " error" : ""}`;
  node.textContent = message;
  root.appendChild(node);
  setTimeout(() => node.remove(), timeoutMs);
}

function openSettingsDialog({ title, fields, submitText = "套用" }) {
  return new Promise((resolve) => {
    const dlg = $("settingsDlg");
    const form = $("sdForm");
    const titleEl = $("sdTitle");
    const ok = $("sdOk");
    const cancel = $("sdCancel");
    if (!dlg || !form || !titleEl || !ok || !cancel) return resolve(null);
    titleEl.textContent = title || "設定";
    ok.textContent = submitText;
    form.innerHTML = "";
    fields.forEach((f) => {
      const lab = document.createElement("label");
      lab.textContent = f.label;
      let input;
      if (f.type === "select") {
        input = document.createElement("select");
        (f.options || []).forEach((o) => {
          const opt = document.createElement("option");
          opt.value = o.value;
          opt.textContent = o.label;
          if (String(o.value) === String(f.value ?? "")) opt.selected = true;
          input.appendChild(opt);
        });
      } else {
        input = document.createElement("input");
        input.type = f.type || "text";
        if (f.min != null) input.min = String(f.min);
        if (f.step != null) input.step = String(f.step);
        input.value = f.value != null ? String(f.value) : "";
        if (f.placeholder) input.placeholder = f.placeholder;
      }
      input.id = `sd_${f.key}`;
      lab.appendChild(input);
      form.appendChild(lab);
    });
    const close = (val) => {
      dlg.classList.add("hidden");
      ok.onclick = null;
      cancel.onclick = null;
      resolve(val);
    };
    ok.onclick = () => {
      const out = {};
      fields.forEach((f) => {
        const el = $(`sd_${f.key}`);
        out[f.key] = el ? el.value : "";
      });
      close(out);
    };
    cancel.onclick = () => close(null);
    dlg.classList.remove("hidden");
  });
}

function setupBookmarkManagerUI() {
  const panel = $("sp-bookmark");
  if (!panel || $("bmTools")) return;
  const box = document.createElement("div");
  box.id = "bmTools";
  box.className = "fg";
  box.style.marginBottom = "8px";
  box.innerHTML = `
    <label>書籤
      <button id="bmAdd">新增</button>
    </label>
    <label>書籤
      <button id="bmRename">重新命名</button>
    </label>
    <label>書籤
      <button id="bmDelete">刪除</button>
    </label>
    <label>書籤
      <button id="bmClearLocal">清除本機</button>
    </label>`;
  panel.insertBefore(box, $("bms"));
  $("bmAdd").addEventListener("click", addCustomBookmarkPrompt);
  $("bmRename").addEventListener("click", renameCustomBookmarkPrompt);
  $("bmDelete").addEventListener("click", deleteCustomBookmarkPrompt);
  $("bmClearLocal").addEventListener("click", () => {
    if (!confirm("要清除所有自訂書籤嗎？")) return;
    state.customBookmarks = [];
    state.selectedCustomBookmarkId = null;
    renderBookmarks();
    persistRecoveryForFile();
  });
}

function setupAdvancedAnnotationUI() {
  const panel = $("sp-annotation");
  if (!panel || $("annSearch")) return;
  const box = document.createElement("div");
  box.className = "fg";
  box.style.marginBottom = "8px";
  box.innerHTML = `
    <label>搜尋
      <input id="annSearch" placeholder="包含文字...">
    </label>
    <label>篩選
      <select id="annFilter">
        <option value="all">全部</option>
        <option value="text">文字</option>
        <option value="highlight">螢光標記</option>
      </select>
    </label>
    <label>選取
      <button id="annSelectAll">全選篩選結果</button>
    </label>
    <label>選取
      <button id="annClearSel">清除選取</button>
    </label>
    <label>選取批次
      <button id="annSelDelete">刪除已選</button>
    </label>
    <label>選取批次
      <button id="annSelGreen">改成綠色</button>
    </label>
    <label>已選文字
      <input id="annSelText" placeholder="文字註解內容">
    </label>
    <label>已選樣式
      <input id="annSelColor" type="color" value="#ffcc33">
    </label>
    <label>已選樣式
      <input id="annSelWidth" type="number" min="1" max="12" value="2">
    </label>
    <label>套用到已選
      <button id="annApplyStyle">套用樣式</button>
    </label>
    <label>套用到已選
      <button id="annApplyText">套用文字</button>
    </label>
    <label>印章預設
      <select id="stampPresetSel"></select>
    </label>
    <label>印章預設
      <button id="stampPresetUse">使用預設</button>
    </label>
    <label>印章預設
      <button id="stampPresetSave">儲存目前設定</button>
    </label>
    <label>印章預設
      <button id="stampPresetDelete">刪除預設</button>
    </label>
    <label>顏色
      <input id="annColor" type="color" value="#ffcc33">
    </label>
    <label>線寬
      <input id="annWidth" type="number" min="1" max="12" value="2">
    </label>`;
  panel.insertBefore(box, $("anns"));

  $("annSearch").addEventListener("input", () => {
    state.annotationSearch = $("annSearch").value.trim().toLowerCase();
    renderAnnotationPanel();
  });
  $("annFilter").addEventListener("change", () => {
    state.annotationFilter = $("annFilter").value;
    renderAnnotationPanel();
  });
  $("annSelectAll").addEventListener("click", () => {
    state.selectedAnnotationIds = getFilteredAnnotations().map((a) => a.id);
    state.selectedAnnotationId = state.selectedAnnotationIds[0] || null;
    renderAnnotationPanel();
    redrawAllAnnotationLayers();
    refreshContextStrip();
  });
  $("annClearSel").addEventListener("click", () => {
    state.selectedAnnotationIds = [];
    state.selectedAnnotationId = null;
    renderAnnotationPanel();
    redrawAllAnnotationLayers();
    refreshContextStrip();
  });
  $("annSelDelete").addEventListener("click", () => batchDeleteSelectedAnnotations());
  $("annSelGreen").addEventListener("click", () => batchColorSelectedHighlights("rgba(120,250,150,.42)"));
  $("annApplyStyle").addEventListener("click", () => {
    const color = $("annSelColor").value || state.annColor || "#ffcc33";
    const width = parseInt($("annSelWidth").value || String(state.annWidth || 2), 10);
    applyStyleToSelectedAnnotations({ color, width });
  });
  $("annApplyText").addEventListener("click", () => {
    const text = $("annSelText").value || "";
    applyTextToSelectedTextAnnotations(text);
  });
  $("stampPresetUse").addEventListener("click", () => applySelectedStampPreset());
  $("stampPresetSave").addEventListener("click", () => saveCurrentStampAsPreset());
  $("stampPresetDelete").addEventListener("click", () => deleteSelectedStampPreset());
  $("annColor").addEventListener("input", () => {
    state.annColor = $("annColor").value || "#ffcc33";
  });
  $("annWidth").addEventListener("input", () => {
    const v = parseInt($("annWidth").value || "2", 10);
    state.annWidth = Math.max(1, Math.min(12, Number.isFinite(v) ? v : 2));
  });
  refreshSelectedAnnotationEditor();
  renderStampPresetOptions();
}

function setupSearchResultsUI() {
  const panel = $("sp-bookmark");
  if (!panel || $("searchHits")) return;
  const box = document.createElement("div");
  box.id = "searchHits";
  box.className = "note";
  box.style.marginTop = "8px";
  box.textContent = "沒有搜尋結果";
  panel.appendChild(box);
}

function bindEvents() {
  $("openHome").addEventListener("click", () => $("file").click());
  $("dropHome").addEventListener("click", () => $("file").click());
  $("file").addEventListener("change", onPickMainFile);
  $("delAnn").addEventListener("click", deleteSelectedAnnotation);
  $("cpyTxt").addEventListener("click", copyCurrentPageText);
  $("annBatchRun").addEventListener("click", runAnnotationBatch);
  $("attAddBtn").addEventListener("click", () => $("attIn").click());
  $("attIn").addEventListener("change", onPickAttachments);
  $("attSaveInfo").addEventListener("click", applyAttachmentsToPdf);

  document.querySelectorAll(".stab").forEach((btn) => {
    btn.addEventListener("click", () => setSidePanel(btn.dataset.p));
  });

  $("wc").addEventListener("click", closeWizard);
  $("wp").addEventListener("click", () => setWizardStep(state.wizardStep - 1));
  $("wn").addEventListener("click", onWizardNext);

  $("q").addEventListener("input", renderCommandList);
  $("q").addEventListener("keydown", onCommandKeyDown);

  ["dragenter", "dragover"].forEach((evt) => {
    document.addEventListener(evt, (e) => {
      e.preventDefault();
      $("ov").classList.add("show");
    });
  });
  ["dragleave", "drop"].forEach((evt) => {
    document.addEventListener(evt, (e) => {
      e.preventDefault();
      if (evt === "drop") onDropFiles(e);
      $("ov").classList.remove("show");
    });
  });

  $("view").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY);
  });
  $("view").addEventListener("scroll", updateBackToTopVisibility);
  $("toTop").addEventListener("click", scrollViewToTop);
  document.addEventListener("click", () => {
    $("menu").style.display = "none";
  });

  document.addEventListener("keydown", onGlobalShortcut);
  updateBackToTopVisibility();
}

function scrollViewToTop() {
  const view = $("view");
  if (!view) return;
  view.scrollTo({ top: 0, behavior: "smooth" });
}

function updateBackToTopVisibility() {
  const view = $("view");
  const btn = $("toTop");
  if (!view || !btn) return;
  btn.classList.toggle("show", view.scrollTop > 480);
}

function renderTabs() {
  const tabs = $("tabs");
  tabs.innerHTML = "";
  TABS.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.dataset.tabKey = tab;
    btn.textContent = TAB_LABELS[tab] || tab;
    btn.addEventListener("click", () => switchTab(tab));
    tabs.appendChild(btn);
  });
}

function switchTab(tabName) {
  state.activeTab = tabName;
  [...$("tabs").children].forEach((n) => {
    n.classList.toggle("active", n.dataset.tabKey === tabName);
  });
  renderToolbar();
}

function renderToolbar() {
  const bar = $("bar");
  bar.innerHTML = "";
  const groups = TOOLBAR[state.activeTab] || [];
  groups.forEach((group) => {
    const wrap = document.createElement("div");
    wrap.className = "grp";
    const label = document.createElement("span");
    label.className = "lab";
    label.textContent = group.label;
    wrap.appendChild(label);

    group.items.forEach(([id, text, cls]) => {
      const btn = document.createElement("button");
      btn.textContent = id === "zoomLabel" ? `${Math.round((state.scale / 1.25) * 100)}%` : text;
      btn.className = cls || "";
      const isActiveTool = isToolbarActionActive(id);
      btn.classList.toggle("active-tool", isActiveTool);
      if (isActiveTool) btn.setAttribute("aria-pressed", "true");
      btn.addEventListener("click", () => onToolbarAction(id));
      wrap.appendChild(btn);
    });
    bar.appendChild(wrap);
  });
}

function isToolbarActionActive(actionId) {
  if (actionId === "toolSelect") return state.activeTool === "select";
  if (actionId === "toolHighlight") return state.activeTool === "highlight";
  if (actionId === "toolText") return state.activeTool === "text";
  if (actionId === "toolRect") return state.activeTool === "rect";
  if (actionId === "toolEllipse") return state.activeTool === "ellipse";
  if (actionId === "toolLine") return state.activeTool === "line";
  if (actionId === "toolArrow") return state.activeTool === "arrow";
  if (actionId === "toolFreehand") return state.activeTool === "freehand";
  if (actionId === "toolRedact") return state.activeTool === "redact";
  if (actionId === "toolSticky") return state.activeTool === "sticky";
  if (actionId === "stampImage") return state.activeTool === "stampImage";
  if (actionId === "stampReviewed") return state.activeTool === "stampText" && state.stampText === "REVIEWED";
  if (actionId === "stampApproved") return state.activeTool === "stampText" && state.stampText === "APPROVED";
  if (actionId === "stampUrgent") return state.activeTool === "stampText" && state.stampText === "URGENT";
  return false;
}

function setSidePanel(panelName) {
  document.querySelectorAll(".stab").forEach((x) => x.classList.remove("active"));
  document.querySelector(`.stab[data-p="${panelName}"]`)?.classList.add("active");
  document.querySelectorAll(".sp").forEach((x) => x.classList.remove("active"));
  $(`sp-${panelName}`)?.classList.add("active");
}

async function onPickMainFile(e) {
  const files = [...(e.target.files || [])].filter((f) => f.name.toLowerCase().endsWith(".pdf"));
  if (!files.length) return;
  e.target.value = "";
  await openPdfFiles(files);
}

async function onDropFiles(e) {
  const files = [...(e.dataTransfer?.files || [])].filter((f) => f.name.toLowerCase().endsWith(".pdf"));
  if (!files.length) return;
  await openPdfFiles(files);
}

function onGlobalShortcut(e) {
  if (e.key === "Escape") {
    closeCommandPalette();
    closeWizard();
    $("menu").style.display = "none";
    return;
  }
  const tag = (e.target && e.target.tagName ? e.target.tagName.toUpperCase() : "");
  const isEditing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target && e.target.isContentEditable);
  if (isEditing && !(e.ctrlKey || e.metaKey || e.altKey)) return;
  const combo = eventToCombo(e);
  const map = getShortcuts();
  const action = Object.keys(map).find((k) => normalizeCombo(map[k]) === combo);
  if (!action) return;
  e.preventDefault();
  runShortcutAction(action);
}

function ensureDocStateDefaults(docState) {
  const d = docState || {};
  return {
    annotations: d.annotations || {},
    selectedAnnotationId: d.selectedAnnotationId || null,
    selectedAnnotationIds: Array.isArray(d.selectedAnnotationIds) ? d.selectedAnnotationIds : d.selectedAnnotationId ? [d.selectedAnnotationId] : [],
    customBookmarks: Array.isArray(d.customBookmarks) ? d.customBookmarks : [],
    selectedCustomBookmarkId: d.selectedCustomBookmarkId || null,
    attachments: Array.isArray(d.attachments) ? d.attachments : [],
    currentPage: Number.isFinite(d.currentPage) ? d.currentPage : 1,
    scale: Number.isFinite(d.scale) ? d.scale : 1.25,
    viewMode: d.viewMode || "continuous",
    thumbScale: Number.isFinite(d.thumbScale) ? d.thumbScale : 0.25,
    undoStack: Array.isArray(d.undoStack) ? d.undoStack : [],
    redoStack: Array.isArray(d.redoStack) ? d.redoStack : [],
    pageLabelRules: Array.isArray(d.pageLabelRules) ? d.pageLabelRules : [],
  };
}

function newDocRecord(fileName, bytes) {
  return {
    id: genId(),
    fileName,
    bytes,
    docState: ensureDocStateDefaults(null),
  };
}

async function openPdfFiles(files) {
  const added = [];
  for (const file of files) {
    const normalized = await readAndNormalizePdfFile(file);
    const doc = newDocRecord(file.name, normalized);
    state.docs.push(doc);
    pushRecent(file.name);
    added.push(doc.id);
  }
  renderDocTabs();
  if (added.length) {
    await activateDocument(added[added.length - 1], { isFreshOpen: true });
    $("home").classList.add("hidden");
    $("app").classList.remove("hidden");
  }
}

async function openPdfFile(file) {
  try {
    await openPdfFiles([file]);
  } catch (err) {
    console.error("openPdfFile failed:", err);
    alert(`開啟失敗：${err.message}`);
  }
}

function normalizePdfBytes(bytes, name) {
  if (!bytes?.length) {
    throw new Error(`${name} is empty`);
  }
  // Support accidental paste/import of "data:application/pdf;base64,...."
  const probe = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, Math.min(bytes.length, 2048)));
  if (probe.startsWith("data:application/pdf;base64,")) {
    const b64 = probe.slice("data:application/pdf;base64,".length).trim();
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    bytes = out;
  }
  let headerOffset = -1;
  for (let i = 0; i <= Math.min(bytes.length - 5, 65536); i += 1) {
    if (bytes[i] === 0x25 && bytes[i + 1] === 0x50 && bytes[i + 2] === 0x44 && bytes[i + 3] === 0x46 && bytes[i + 4] === 0x2d) {
      headerOffset = i;
      break;
    }
  }
  if (headerOffset < 0) {
    const hex = [...bytes.slice(0, 16)].map((b) => b.toString(16).padStart(2, "0")).join(" ");
    throw new Error(`${name} has no %PDF- header. bytes: ${hex}`);
  }
  return headerOffset > 0 ? bytes.slice(headerOffset) : bytes;
}

async function readAndNormalizePdfFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return normalizePdfBytes(bytes, file?.name || "document.pdf");
}

async function loadPdfBytes(bytes, fileName, options = {}) {
  const opts = options || {};
  // Keep separate copies: PDF.js worker may transfer/detach the underlying buffer.
  const bytesForPdfJs = bytes.slice();
  const bytesForPdfLib = bytes.slice();
  state.pdfjs = await pdfjsLib.getDocument({ data: bytesForPdfJs }).promise;
  state.pdfLib = null;
  state.pdfLibReadOnlyReason = "";
  try {
    state.pdfLib = await PDFLib.PDFDocument.load(bytesForPdfLib, { ignoreEncryption: true });
  } catch (err) {
    state.pdfLibReadOnlyReason = err?.message || "PDF write engine parse failed";
    pushLog("warn", "pdf-lib load failed; opened in read-only mode", { error: state.pdfLibReadOnlyReason });
    alert(`已以唯讀模式開啟。\n原因：${state.pdfLibReadOnlyReason}`);
  }
  state.fileName = fileName || "document.pdf";
  state.currentPage = 1;
  state.totalPages = state.pdfjs.numPages;
  state.annotations = {};
  state.selectedAnnotationId = null;
  state.selectedAnnotationIds = [];
  state.customBookmarks = [];
  state.selectedCustomBookmarkId = null;
  state.attachments = [];
  state.undoStack = [];
  state.redoStack = [];
  if (opts.docState) {
    const d = ensureDocStateDefaults(opts.docState);
    state.annotations = d.annotations;
    state.selectedAnnotationId = d.selectedAnnotationId;
    state.selectedAnnotationIds = d.selectedAnnotationIds;
    state.customBookmarks = d.customBookmarks;
    state.selectedCustomBookmarkId = d.selectedCustomBookmarkId;
    state.attachments = d.attachments;
    state.currentPage = Math.max(1, Math.min(state.totalPages, d.currentPage));
    state.scale = d.scale;
    state.viewMode = d.viewMode;
    state.thumbScale = d.thumbScale;
    state.undoStack = d.undoStack;
    state.redoStack = d.redoStack;
    state.pageLabelRules = d.pageLabelRules;
  } else {
    saveSnapshot();
  }

  await renderPages();
  await renderThumbnails();
  await renderBookmarks();
  if (!opts.skipRecoveryPrompt) maybeRestoreRecoveryForFile(state.fileName);
  renderAnnotationPanel();
  renderAttachmentPanel();
  renderToolbar();
  applyViewMode();
  updateStatus();
}

async function persistActiveDocument() {
  if (!state.activeDocId) return;
  const doc = state.docs.find((d) => d.id === state.activeDocId);
  if (!doc) return;
  try {
    if (state.pdfLib) {
      const bytes = await state.pdfLib.save();
      doc.bytes = normalizePdfBytes(new Uint8Array(bytes), state.fileName || doc.fileName);
    }
  } catch {
    // Keep last valid bytes if save fails.
  }
  doc.fileName = state.fileName || doc.fileName;
  doc.docState = ensureDocStateDefaults({
    annotations: state.annotations,
    selectedAnnotationId: state.selectedAnnotationId,
    selectedAnnotationIds: state.selectedAnnotationIds,
    customBookmarks: state.customBookmarks,
    selectedCustomBookmarkId: state.selectedCustomBookmarkId,
    attachments: state.attachments,
    currentPage: state.currentPage,
    scale: state.scale,
    viewMode: state.viewMode,
    thumbScale: state.thumbScale,
    undoStack: state.undoStack,
    redoStack: state.redoStack,
    pageLabelRules: state.pageLabelRules,
  });
}

function renderDocTabs() {
  const root = $("docTabs");
  if (!root) return;
  if (!state.docs.length) {
    root.innerHTML = "";
    root.classList.add("hidden");
    return;
  }
  root.classList.remove("hidden");
  root.innerHTML = "";
  state.docs.forEach((doc) => {
    const tab = document.createElement("button");
    tab.className = `doc-tab${doc.id === state.activeDocId ? " active" : ""}`;
    tab.innerHTML = `<span class="name">${doc.fileName}</span><span class="x" title="關閉">x</span>`;
    tab.addEventListener("click", async (e) => {
      if (e.target?.classList?.contains("x")) return;
      await activateDocument(doc.id, { isFreshOpen: false });
    });
    tab.addEventListener("dragover", (e) => {
      if (doc.id === state.activeDocId) return;
      e.preventDefault();
    });
    tab.addEventListener("drop", async (e) => {
      if (doc.id === state.activeDocId) return;
      const raw = e.dataTransfer?.getData("text/plain") || "";
      const p = Number(raw);
      if (!Number.isFinite(p) || p < 1 || p > state.totalPages) return;
      await transferPagesToDocument([p - 1], doc.id, false);
    });
    tab.querySelector(".x")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      await closeDocument(doc.id);
    });
    root.appendChild(tab);
  });
}

async function activateDocument(docId, options = {}) {
  const opts = options || {};
  const target = state.docs.find((d) => d.id === docId);
  if (!target) return;
  if (state.activeDocId && state.activeDocId !== docId) await persistActiveDocument();
  state.activeDocId = docId;
  await loadPdfBytes(target.bytes.slice(), target.fileName, {
    docState: target.docState,
    skipRecoveryPrompt: !opts.isFreshOpen,
  });
  renderDocTabs();
}

async function closeDocument(docId) {
  const idx = state.docs.findIndex((d) => d.id === docId);
  if (idx < 0) return;
  if (state.activeDocId === docId) await persistActiveDocument();
  state.docs.splice(idx, 1);
  if (!state.docs.length) {
    state.activeDocId = null;
    state.pdfjs = null;
    state.pdfLib = null;
    state.fileName = "";
    state.totalPages = 0;
    state.currentPage = 1;
    $("pages").innerHTML = "";
    $("thumbs").innerHTML = "";
    $("home").classList.remove("hidden");
    $("app").classList.add("hidden");
    renderDocTabs();
    updateStatus();
    return;
  }
  const next = state.docs[Math.max(0, idx - 1)] || state.docs[0];
  await activateDocument(next.id, { isFreshOpen: false });
}

async function renderPages() {
  const container = $("pages");
  container.innerHTML = "";
  for (let p = 1; p <= state.totalPages; p += 1) {
    const page = await state.pdfjs.getPage(p);
    const viewport = page.getViewport({ scale: state.scale });
    const wrap = document.createElement("div");
    wrap.className = "pw";
    wrap.dataset.page = String(p);

    const canvas = document.createElement("canvas");
    canvas.className = "pc";
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ann = document.createElement("div");
    ann.className = "ann";
    ann.style.width = `${canvas.width}px`;
    ann.style.height = `${canvas.height}px`;

    wrap.append(canvas, ann);
    container.appendChild(wrap);

    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    bindPageLayer(canvas, ann, p);
    redrawAnnotationLayer(p);
  }
}

function bindPageLayer(canvas, annLayer, pageNum) {
  const drawTools = new Set(["highlight", "rect", "ellipse", "line", "arrow", "freehand", "redact"]);
  let draw = null;

  const getXY = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  canvas.addEventListener("mousedown", (e) => {
    if (!drawTools.has(state.activeTool)) return;
    const pt = getXY(e);
    draw = { sx: pt.x, sy: pt.y, ex: pt.x, ey: pt.y, points: [pt] };
    e.preventDefault();
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!draw) return;
    const pt = getXY(e);
    draw.ex = pt.x;
    draw.ey = pt.y;
    if (state.activeTool === "freehand") {
      draw.points.push(pt);
    }
  });

  const finishDraw = () => {
    if (!draw) return;
    const { sx, sy, ex, ey, points } = draw;
    draw = null;
    const color = state.annColor || "#ffcc33";
    const width = Math.max(1, state.annWidth || 2);
    if (state.activeTool === "freehand") {
      if (!points || points.length < 2) return;
      pushAnnotation({ id: genId(), page: pageNum, type: "f", points, color, width });
      redrawAnnotationLayer(pageNum);
      return;
    }
    if (state.activeTool === "line" || state.activeTool === "arrow") {
      const d = Math.hypot(ex - sx, ey - sy);
      if (d < 3) return;
      pushAnnotation({ id: genId(), page: pageNum, type: state.activeTool === "line" ? "l" : "a", x1: sx, y1: sy, x2: ex, y2: ey, color, width });
      redrawAnnotationLayer(pageNum);
      return;
    }
    const x = Math.min(sx, ex);
    const y = Math.min(sy, ey);
    const w = Math.abs(ex - sx);
    const h = Math.abs(ey - sy);
    if (w < 3 || h < 3) return;
    if (state.activeTool === "highlight") {
      pushAnnotation({ id: genId(), page: pageNum, type: "h", x, y, w, h, color: hexToRgba(color, 0.35) });
    } else if (state.activeTool === "redact") {
      pushAnnotation({ id: genId(), page: pageNum, type: "rd", x, y, w, h, color: "rgba(0,0,0,0.82)" });
    } else if (state.activeTool === "rect") {
      pushAnnotation({ id: genId(), page: pageNum, type: "r", x, y, w, h, color, width });
    } else if (state.activeTool === "ellipse") {
      pushAnnotation({ id: genId(), page: pageNum, type: "e", x, y, w, h, color, width });
    }
    redrawAnnotationLayer(pageNum);
  };

  canvas.addEventListener("mouseup", finishDraw);
  canvas.addEventListener("mouseleave", finishDraw);

  canvas.addEventListener("click", (e) => {
    if (drawTools.has(state.activeTool)) return;
    const { x, y } = getXY(e);
    if (state.activeTool === "sticky") {
      const text = prompt("Sticky note text", "Note");
      if (text == null) return;
      pushAnnotation({ id: genId(), page: pageNum, type: "n", x, y, w: 120, h: 64, text, color: "#fff7a8" });
      redrawAnnotationLayer(pageNum);
      return;
    }
    if (state.activeTool === "stampText") {
      const text = state.stampText || "REVIEWED";
      pushAnnotation({ id: genId(), page: pageNum, type: "s", x, y, w: 150, h: 42, text, color: state.annColor || "#ff5b5b", width: Math.max(1, state.annWidth || 2) });
      redrawAnnotationLayer(pageNum);
      return;
    }
    if (state.activeTool === "stampImage") {
      if (!state.stampImageDataUrl) return alert("Select a stamp image first.");
      pushAnnotation({ id: genId(), page: pageNum, type: "si", x, y, w: 140, h: 70, src: state.stampImageDataUrl });
      redrawAnnotationLayer(pageNum);
      return;
    }
    if (state.activeTool === "text") {
      const text = prompt("Text");
      if (!text) return;
      pushAnnotation({ id: genId(), page: pageNum, type: "t", x, y, text });
      redrawAnnotationLayer(pageNum);
      return;
    }
    selectAnnotationByHit(pageNum, x, y);
  });

  annLayer.addEventListener("click", (e) => {
    const target = e.target.closest("[data-id]");
    if (!target) return;
    selectAnnotation(target.dataset.id);
    e.stopPropagation();
  });
}

function pushAnnotation(annotation) {
  if (!state.annotations[annotation.page]) {
    state.annotations[annotation.page] = [];
  }
  state.annotations[annotation.page].push(annotation);
  state.selectedAnnotationId = annotation.id;
  state.selectedAnnotationIds = [annotation.id];
  renderAnnotationPanel();
  refreshContextStrip();
  saveSnapshot();
}

function redrawAnnotationLayer(pageNum) {
  const wrap = $("pages").querySelector(`.pw[data-page="${pageNum}"]`);
  if (!wrap) return;
  const layer = wrap.querySelector(".ann");
  layer.innerHTML = "";

  const pageAnnotations = state.annotations[pageNum] || [];
  pageAnnotations.forEach((ann) => {
    const node = document.createElement("div");
    if (ann.type === "h") {
      node.className = "mark";
      Object.assign(node.style, {
        left: `${ann.x}px`,
        top: `${ann.y}px`,
        width: `${ann.w}px`,
        height: `${ann.h}px`,
        background: ann.color,
      });
    } else if (ann.type === "rd") {
      node.className = "mark";
      Object.assign(node.style, {
        left: `${ann.x}px`,
        top: `${ann.y}px`,
        width: `${ann.w}px`,
        height: `${ann.h}px`,
        background: ann.color || "rgba(0,0,0,0.82)",
        border: "1px solid #222",
      });
    } else if (ann.type === "t") {
      node.className = "txt";
      Object.assign(node.style, { left: `${ann.x}px`, top: `${ann.y}px` });
      node.textContent = ann.text;
    } else if (ann.type === "n") {
      node.className = "note-ann";
      Object.assign(node.style, {
        left: `${ann.x}px`,
        top: `${ann.y}px`,
        width: `${ann.w || 120}px`,
        minHeight: `${ann.h || 64}px`,
        background: ann.color || "#fff7a8",
      });
      node.textContent = ann.text || "Note";
    } else if (ann.type === "s") {
      node.className = "stamp-ann";
      Object.assign(node.style, {
        left: `${ann.x}px`,
        top: `${ann.y}px`,
        width: `${ann.w || 150}px`,
        minHeight: `${ann.h || 42}px`,
        color: ann.color || "#ff5b5b",
        borderColor: ann.color || "#ff5b5b",
        borderWidth: `${ann.width || 2}px`,
      });
      node.textContent = ann.text || "REVIEWED";
    } else if (ann.type === "si") {
      node.className = "stamp-img-ann";
      Object.assign(node.style, {
        left: `${ann.x}px`,
        top: `${ann.y}px`,
        width: `${ann.w || 140}px`,
        height: `${ann.h || 70}px`,
      });
      const img = document.createElement("img");
      img.src = ann.src || "";
      img.alt = "stamp";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      node.appendChild(img);
    } else if (ann.type === "r" || ann.type === "e") {
      node.className = "mark";
      Object.assign(node.style, {
        left: `${ann.x}px`,
        top: `${ann.y}px`,
        width: `${ann.w}px`,
        height: `${ann.h}px`,
        border: `${ann.width || 2}px solid ${ann.color || "#ffcc33"}`,
        background: "transparent",
        borderRadius: ann.type === "e" ? "50%" : "0",
      });
    } else if (ann.type === "l" || ann.type === "a" || ann.type === "f") {
      Object.assign(node.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("viewBox", `0 0 ${wrap.querySelector(".pc").width} ${wrap.querySelector(".pc").height}`);
      svg.style.position = "absolute";
      svg.style.inset = "0";
      if (ann.type === "f") {
        const pl = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        pl.setAttribute("points", (ann.points || []).map((p) => `${p.x},${p.y}`).join(" "));
        pl.setAttribute("fill", "none");
        pl.setAttribute("stroke", ann.color || "#ffcc33");
        pl.setAttribute("stroke-width", String(ann.width || 2));
        pl.setAttribute("stroke-linecap", "round");
        pl.setAttribute("stroke-linejoin", "round");
        svg.appendChild(pl);
      } else {
        const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
        ln.setAttribute("x1", String(ann.x1));
        ln.setAttribute("y1", String(ann.y1));
        ln.setAttribute("x2", String(ann.x2));
        ln.setAttribute("y2", String(ann.y2));
        ln.setAttribute("stroke", ann.color || "#ffcc33");
        ln.setAttribute("stroke-width", String(ann.width || 2));
        ln.setAttribute("stroke-linecap", "round");
        svg.appendChild(ln);
        if (ann.type === "a") {
          const dx = ann.x2 - ann.x1;
          const dy = ann.y2 - ann.y1;
          const len = Math.max(1, Math.hypot(dx, dy));
          const ux = dx / len;
          const uy = dy / len;
          const size = 8 + (ann.width || 2);
          const leftX = ann.x2 - ux * size - uy * (size * 0.5);
          const leftY = ann.y2 - uy * size + ux * (size * 0.5);
          const rightX = ann.x2 - ux * size + uy * (size * 0.5);
          const rightY = ann.y2 - uy * size - ux * (size * 0.5);
          const head = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
          head.setAttribute("points", `${ann.x2},${ann.y2} ${leftX},${leftY} ${rightX},${rightY}`);
          head.setAttribute("fill", ann.color || "#ffcc33");
          svg.appendChild(head);
        }
      }
      node.appendChild(svg);
    }
    node.dataset.id = ann.id;
    if (state.selectedAnnotationId === ann.id || state.selectedAnnotationIds.includes(ann.id)) node.classList.add("sel");
    layer.appendChild(node);
  });
}

function redrawAllAnnotationLayers() {
  for (let p = 1; p <= state.totalPages; p += 1) {
    redrawAnnotationLayer(p);
  }
}

function selectAnnotationByHit(pageNum, x, y) {
  const arr = state.annotations[pageNum] || [];
  let found = null;
  for (const ann of arr) {
    if ((ann.type === "h" || ann.type === "rd" || ann.type === "r" || ann.type === "e" || ann.type === "n" || ann.type === "s" || ann.type === "si") && x >= ann.x && x <= ann.x + (ann.w || 120) && y >= ann.y && y <= ann.y + (ann.h || 64)) {
      found = ann;
    }
    if (ann.type === "t" && Math.abs(x - ann.x) < 60 && Math.abs(y - ann.y) < 24) {
      found = ann;
    }
    if ((ann.type === "l" || ann.type === "a") && distancePointToSegment(x, y, ann.x1, ann.y1, ann.x2, ann.y2) <= Math.max(6, (ann.width || 2) + 3)) {
      found = ann;
    }
    if (ann.type === "f") {
      const pts = ann.points || [];
      for (let i = 1; i < pts.length; i += 1) {
        if (distancePointToSegment(x, y, pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y) <= Math.max(6, (ann.width || 2) + 3)) {
          found = ann;
          break;
        }
      }
    }
  }
  if (!found) {
    state.selectedAnnotationId = null;
    refreshContextStrip();
    redrawAnnotationLayer(pageNum);
    return;
  }
  selectAnnotation(found.id);
}

function distancePointToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  const nx = x1 + t * dx;
  const ny = y1 + t * dy;
  return Math.hypot(px - nx, py - ny);
}

function hexToRgba(hex, alpha) {
  const h = String(hex || "#ffcc33").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const a = Number.isFinite(alpha) ? alpha : 0.35;
  return `rgba(${r},${g},${b},${a})`;
}

function selectAnnotation(annotationId) {
  state.selectedAnnotationId = annotationId;
  if (!state.selectedAnnotationIds.includes(annotationId)) {
    state.selectedAnnotationIds = [annotationId];
  }
  redrawAllAnnotationLayers();
  renderAnnotationPanel();
  refreshContextStrip();
}

function deleteSelectedAnnotation() {
  if (!state.selectedAnnotationId) return;
  Object.keys(state.annotations).forEach((page) => {
    state.annotations[page] = state.annotations[page].filter((a) => a.id !== state.selectedAnnotationId);
  });
  state.selectedAnnotationId = null;
  state.selectedAnnotationIds = [];
  redrawAllAnnotationLayers();
  renderAnnotationPanel();
  refreshContextStrip();
  saveSnapshot();
}

function editSelectedAnnotation() {
  if (!state.selectedAnnotationIds.length && !state.selectedAnnotationId) return;
  const text = $("annSelText");
  if (text) {
    text.focus();
    text.select();
    return;
  }
  alert("Use annotation panel to edit selected annotation(s).");
}

function refreshContextStrip() {
  $("ctx").classList.toggle("show", !!state.selectedAnnotationId || state.selectedAnnotationIds.length > 0);
  refreshSelectedAnnotationEditor();
}

function getSelectedAnnotations() {
  const ids = state.selectedAnnotationIds.length ? state.selectedAnnotationIds : state.selectedAnnotationId ? [state.selectedAnnotationId] : [];
  if (!ids.length) return [];
  const set = new Set(ids);
  return Object.values(state.annotations)
    .flat()
    .filter((a) => set.has(a.id));
}

function toHexColor(color) {
  const s = String(color || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(s)) return s;
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (!m) return "#ffcc33";
  const parts = m[1]
    .split(",")
    .map((x) => Number(x.trim()))
    .filter((n) => Number.isFinite(n));
  const r = Math.max(0, Math.min(255, Math.round(parts[0] ?? 255)));
  const g = Math.max(0, Math.min(255, Math.round(parts[1] ?? 204)));
  const b = Math.max(0, Math.min(255, Math.round(parts[2] ?? 51)));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function refreshSelectedAnnotationEditor() {
  const textEl = $("annSelText");
  const colorEl = $("annSelColor");
  const widthEl = $("annSelWidth");
  if (!textEl || !colorEl || !widthEl) return;
  const selected = getSelectedAnnotations();
  const hasSel = selected.length > 0;
  textEl.disabled = !hasSel;
  colorEl.disabled = !hasSel;
  widthEl.disabled = !hasSel;
  $("annApplyStyle").disabled = !hasSel;
  $("annApplyText").disabled = !hasSel;
  if (!hasSel) {
    textEl.value = "";
    return;
  }
  const first = selected[0];
  colorEl.value = toHexColor(first.color || state.annColor || "#ffcc33");
  widthEl.value = String(Math.max(1, Math.min(12, first.width || state.annWidth || 2)));
  const allText = selected.every((a) => a.type === "t" || a.type === "n" || a.type === "s");
  textEl.disabled = !allText;
  $("annApplyText").disabled = !allText;
  textEl.value = allText ? String(first.text || "") : "";
}

function applyStyleToSelectedAnnotations({ color, width }) {
  const selected = getSelectedAnnotations();
  if (!selected.length) return;
  const strokeW = Math.max(1, Math.min(12, Number.isFinite(width) ? width : state.annWidth || 2));
  const c = color || state.annColor || "#ffcc33";
  selected.forEach((ann) => {
    if (ann.type === "t" || ann.type === "si") return;
    if (ann.type === "h") ann.color = hexToRgba(c, 0.35);
    else ann.color = c;
    if (ann.type !== "h" && ann.type !== "n") ann.width = strokeW;
  });
  redrawAllAnnotationLayers();
  renderAnnotationPanel();
  refreshSelectedAnnotationEditor();
  saveSnapshot();
}

function applyTextToSelectedTextAnnotations(text) {
  const selected = getSelectedAnnotations();
  if (!selected.length) return;
  selected.forEach((ann) => {
    if (ann.type === "t" || ann.type === "n" || ann.type === "s") ann.text = text;
  });
  redrawAllAnnotationLayers();
  renderAnnotationPanel();
  saveSnapshot();
}

function getFilteredAnnotations() {
  const all = Object.values(state.annotations).flat();
  return all.filter((ann) => {
    if (state.annotationFilter === "text" && ann.type !== "t") return false;
    if (state.annotationFilter === "highlight" && ann.type !== "h") return false;
    if (!state.annotationSearch) return true;
    if (ann.type === "t") return String(ann.text || "").toLowerCase().includes(state.annotationSearch);
    return `${ann.page} ${ann.type}`.toLowerCase().includes(state.annotationSearch);
  });
}

function renderAnnotationPanel() {
  const all = getFilteredAnnotations();
  const root = $("anns");
  if (!all.length) {
    root.className = "note";
    root.textContent = "No annotations (current filter)";
    return;
  }
  root.className = "";
  root.innerHTML = "";
  all.forEach((ann) => {
    const typeLabel =
      ann.type === "h"
        ? "highlight"
        : ann.type === "t"
          ? "text"
          : ann.type === "r"
            ? "rect"
            : ann.type === "e"
              ? "ellipse"
              : ann.type === "l"
                ? "line"
                : ann.type === "a"
                  ? "arrow"
                  : ann.type === "f"
                    ? "freehand"
                    : ann.type === "n"
                      ? "sticky"
                      : ann.type === "s"
                        ? "stamp"
                        : ann.type === "si"
                          ? "stamp-image"
                          : ann.type === "rd"
                            ? "redaction"
                    : ann.type;
    const row = document.createElement("div");
    row.className = `thumb${state.selectedAnnotationIds.includes(ann.id) || state.selectedAnnotationId === ann.id ? " active" : ""}`;
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        <input type="checkbox" data-ann-check="${ann.id}" ${state.selectedAnnotationIds.includes(ann.id) ? "checked" : ""}>
        <span>Page ${ann.page} - ${typeLabel}</span>
      </div>
      ${ann.type === "t" || ann.type === "n" || ann.type === "s" ? `<div style="font-size:11px;color:#9aabc0;margin-top:4px">${String(ann.text || "").slice(0, 80)}</div>` : ""}
    `;
    row.querySelector(`[data-ann-check="${ann.id}"]`).addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (ev.target.checked) {
        if (!state.selectedAnnotationIds.includes(ann.id)) state.selectedAnnotationIds.push(ann.id);
      } else {
        state.selectedAnnotationIds = state.selectedAnnotationIds.filter((id) => id !== ann.id);
      }
      state.selectedAnnotationId = state.selectedAnnotationIds[0] || null;
      renderAnnotationPanel();
      redrawAllAnnotationLayers();
      refreshContextStrip();
    });
    row.addEventListener("click", () => {
      const wrap = $("pages").querySelector(`.pw[data-page="${ann.page}"]`);
      if (wrap) wrap.scrollIntoView({ behavior: "smooth", block: "center" });
      selectAnnotation(ann.id);
    });
    root.appendChild(row);
  });
}

function batchDeleteSelectedAnnotations() {
  if (!state.selectedAnnotationIds.length) return;
  const set = new Set(state.selectedAnnotationIds);
  Object.keys(state.annotations).forEach((p) => {
    state.annotations[p] = state.annotations[p].filter((a) => !set.has(a.id));
  });
  state.selectedAnnotationIds = [];
  state.selectedAnnotationId = null;
  redrawAllAnnotationLayers();
  renderAnnotationPanel();
  refreshContextStrip();
  saveSnapshot();
}

function batchColorSelectedHighlights(color) {
  if (!state.selectedAnnotationIds.length) return;
  const set = new Set(state.selectedAnnotationIds);
  Object.values(state.annotations)
    .flat()
    .forEach((a) => {
      if (set.has(a.id) && a.type === "h") a.color = color;
    });
  redrawAllAnnotationLayers();
  renderAnnotationPanel();
  saveSnapshot();
}

function parseAnnotationRangeInput(raw) {
  const v = (raw || "").trim().toLowerCase();
  if (!v || v === "all") return Array.from({ length: state.totalPages }, (_, i) => i + 1);
  const idx = parseRange(v, state.totalPages);
  return idx.map((i) => i + 1);
}

function runAnnotationBatch() {
  const action = $("annBatchAction")?.value || "delete";
  const targets = parseAnnotationRangeInput($("annRange")?.value || "all");
  if (!targets.length) {
    alert("No valid target pages.");
    return;
  }

  if (action === "delete") {
    targets.forEach((p) => {
      if (state.annotations[p]) state.annotations[p] = [];
    });
  } else if (action === "highlight-yellow" || action === "highlight-green") {
    const color = action === "highlight-yellow" ? "rgba(255,215,88,.45)" : "rgba(120,250,150,.42)";
    targets.forEach((p) => {
      (state.annotations[p] || []).forEach((a) => {
        if (a.type === "h") a.color = color;
      });
    });
  }

  state.selectedAnnotationId = null;
  redrawAllAnnotationLayers();
  renderAnnotationPanel();
  refreshContextStrip();
  saveSnapshot();
}

async function onPickAttachments(e) {
  const files = [...(e.target.files || [])];
  e.target.value = "";
  if (!files.length) return;
  for (const f of files) {
    const bytes = new Uint8Array(await f.arrayBuffer());
    state.attachments.push({
      id: genId(),
      name: f.name,
      type: f.type || "application/octet-stream",
      bytes,
    });
  }
  renderAttachmentPanel();
}

function renderAttachmentPanel() {
  const root = $("atts");
  if (!root) return;
  if (!state.attachments.length) {
    root.className = "note";
    root.textContent = "No attachments";
    return;
  }
  root.className = "";
  root.innerHTML = "";
  state.attachments.forEach((att) => {
    const row = document.createElement("div");
    row.className = "thumb";
    row.innerHTML = `<div style="text-align:left">${att.name}</div><div style="display:flex;gap:6px;margin-top:6px"><button data-act="download">Download</button><button data-act="remove">Remove</button></div>`;
    row.querySelector('[data-act="download"]').addEventListener("click", (ev) => {
      ev.stopPropagation();
      const blob = new Blob([att.bytes], { type: att.type || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = att.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    });
    row.querySelector('[data-act="remove"]').addEventListener("click", (ev) => {
      ev.stopPropagation();
      state.attachments = state.attachments.filter((x) => x.id !== att.id);
      renderAttachmentPanel();
    });
    root.appendChild(row);
  });
}

async function applyAttachmentsToPdf() {
  if (!state.pdfLib) {
    alert("Open a PDF first.");
    return;
  }
  if (!state.attachments.length) {
    alert("No attachments to apply.");
    return;
  }
  if (typeof state.pdfLib.attach !== "function") {
    alert("Current pdf-lib build does not support attachments.");
    return;
  }
  for (const att of state.attachments) {
    await state.pdfLib.attach(att.bytes, att.name, { mimeType: att.type || "application/octet-stream" });
  }
  alert(`Applied ${state.attachments.length} attachment(s) to current PDF. Save file to persist.`);
}

async function renderThumbnails() {
  const list = $("thumbs");
  list.innerHTML = "";
  let draggingFrom = null;
  for (let p = 1; p <= state.totalPages; p += 1) {
    const page = await state.pdfjs.getPage(p);
    const viewport = page.getViewport({ scale: state.thumbScale });
    const item = document.createElement("div");
    item.className = `thumb${p === state.currentPage ? " active" : ""}`;
    item.dataset.page = String(p);
    item.draggable = true;
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    const label = document.createElement("div");
    label.textContent = `Page ${getPageLabel(p)}`;
    item.append(canvas, label);
    item.addEventListener("click", () => goToPage(p));
    item.addEventListener("dragstart", (e) => {
      draggingFrom = p;
      e.dataTransfer?.setData("text/plain", String(p));
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    });
    item.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    item.addEventListener("drop", async () => {
      if (!draggingFrom || draggingFrom === p) return;
      await movePageByDrag(draggingFrom, p);
      draggingFrom = null;
    });
    list.appendChild(item);
  }
}

function applyViewMode() {
  const pages = $("pages");
  pages.style.gridTemplateColumns = "";
  const wraps = [...pages.querySelectorAll(".pw")];
  if (state.viewMode === "two") {
    pages.style.gridTemplateColumns = "repeat(2, max-content)";
    wraps.forEach((w) => {
      w.style.display = "";
    });
    return;
  }
  if (state.viewMode === "single") {
    wraps.forEach((w) => {
      w.style.display = Number(w.dataset.page) === state.currentPage ? "" : "none";
    });
    return;
  }
  wraps.forEach((w) => {
    w.style.display = "";
  });
}

function applyReadingAndA11y() {
  const body = document.body;
  body.classList.remove("reading-normal", "reading-night", "reading-warm");
  body.classList.add(`reading-${state.readingMode}`);
  body.classList.toggle("a11y-high-contrast", state.highContrast);
}

async function togglePresentationMode(autoPlay) {
  const root = document.documentElement;
  const inFs = !!document.fullscreenElement;
  if (!inFs) {
    await root.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
  if (state.presentationTimer) {
    clearInterval(state.presentationTimer);
    state.presentationTimer = null;
  }
  if (!inFs && autoPlay) {
    const sec = Number(prompt("Auto-play interval seconds", "3"));
    const ms = Math.max(1, Number.isFinite(sec) ? sec : 3) * 1000;
    state.presentationTimer = setInterval(() => {
      if (!document.fullscreenElement) {
        clearInterval(state.presentationTimer);
        state.presentationTimer = null;
        return;
      }
      if (state.currentPage < state.totalPages) goToPage(state.currentPage + 1);
      else goToPage(1);
    }, ms);
  }
}

async function movePageByDrag(fromPage, toPage) {
  if (!state.pdfLib) return;
  const from = fromPage - 1;
  const to = toPage - 1;
  const [copied] = await state.pdfLib.copyPages(state.pdfLib, [from]);
  state.pdfLib.insertPage(to, copied);
  const removeIndex = from < to ? from : from + 1;
  state.pdfLib.removePage(removeIndex);
  await reloadFromPdfLib();
  goToPage(to + 1);
}

async function renderBookmarks() {
  const root = $("bms");
  root.className = "";
  root.innerHTML = "";

  const customHeader = document.createElement("div");
  customHeader.className = "note";
  customHeader.textContent = "Custom bookmarks";
  root.appendChild(customHeader);
  if (!state.customBookmarks.length) {
    const empty = document.createElement("div");
    empty.className = "thumb";
    empty.textContent = "No custom bookmarks";
    root.appendChild(empty);
  } else {
    let draggingId = null;
    state.customBookmarks.forEach((bm) => {
      const row = document.createElement("div");
      row.className = `thumb${state.selectedCustomBookmarkId === bm.id ? " active" : ""}`;
      row.draggable = true;
      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:6px;align-items:center">
          <span>[P${bm.page}] ${bm.title}</span>
          <span style="display:flex;gap:4px">
            <button data-bm-ren="${bm.id}">Ren</button>
            <button data-bm-del="${bm.id}">Del</button>
          </span>
        </div>`;
      row.addEventListener("click", () => {
        state.selectedCustomBookmarkId = bm.id;
        goToPage(bm.page);
        renderBookmarks();
      });
      row.querySelector(`[data-bm-ren="${bm.id}"]`)?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        state.selectedCustomBookmarkId = bm.id;
        renameCustomBookmarkPrompt();
      });
      row.querySelector(`[data-bm-del="${bm.id}"]`)?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        state.selectedCustomBookmarkId = bm.id;
        deleteCustomBookmarkPrompt();
      });
      row.addEventListener("dragstart", () => {
        draggingId = bm.id;
      });
      row.addEventListener("dragover", (ev) => ev.preventDefault());
      row.addEventListener("drop", () => {
        if (!draggingId || draggingId === bm.id) return;
        const from = state.customBookmarks.findIndex((x) => x.id === draggingId);
        const to = state.customBookmarks.findIndex((x) => x.id === bm.id);
        if (from < 0 || to < 0) return;
        const arr = state.customBookmarks.slice();
        const [m] = arr.splice(from, 1);
        arr.splice(to, 0, m);
        state.customBookmarks = arr;
        persistRecoveryForFile();
        renderBookmarks();
      });
      root.appendChild(row);
    });
  }

  const pdfHeader = document.createElement("div");
  pdfHeader.className = "note";
  pdfHeader.style.marginTop = "8px";
  pdfHeader.textContent = "PDF outline";
  root.appendChild(pdfHeader);

  try {
    const outline = await state.pdfjs.getOutline();
    if (!outline?.length) {
      const empty = document.createElement("div");
      empty.className = "thumb";
      empty.textContent = "No embedded outline";
      root.appendChild(empty);
      return;
    }
    const walk = (items, depth = 0) => {
      items.forEach(async (item) => {
        const row = document.createElement("div");
        row.className = "thumb";
        row.style.marginLeft = `${depth * 12}px`;
        row.textContent = item.title || "Untitled";
        row.addEventListener("click", async () => {
          let dest = item.dest;
          if (typeof dest === "string") dest = await state.pdfjs.getDestination(dest);
          if (dest?.[0]) {
            const pageIndex = await state.pdfjs.getPageIndex(dest[0]);
            goToPage(pageIndex + 1);
          }
        });
        root.appendChild(row);
        if (item.items?.length) walk(item.items, depth + 1);
      });
    };
    walk(outline);
  } catch {
    const err = document.createElement("div");
    err.className = "thumb";
    err.textContent = "Outline render failed";
    root.appendChild(err);
  }
}

function addCustomBookmarkPrompt() {
  if (!state.pdfjs) return alert("Open a PDF first.");
  const page = Number(prompt("Bookmark page number", String(state.currentPage)));
  if (!Number.isFinite(page) || page < 1 || page > state.totalPages) return alert("Invalid page number.");
  const title = (prompt("Bookmark title", `Bookmark P${page}`) || "").trim();
  if (!title) return;
  state.customBookmarks.push({ id: genId(), page, title });
  state.selectedCustomBookmarkId = null;
  renderBookmarks();
  persistRecoveryForFile();
}

function renameCustomBookmarkPrompt() {
  if (!state.selectedCustomBookmarkId) return alert("Select a custom bookmark first.");
  const bm = state.customBookmarks.find((x) => x.id === state.selectedCustomBookmarkId);
  if (!bm) return alert("Selected bookmark not found.");
  const title = prompt("Rename bookmark", bm.title);
  if (title == null) return;
  bm.title = title.trim() || bm.title;
  renderBookmarks();
  persistRecoveryForFile();
}

function deleteCustomBookmarkPrompt() {
  if (!state.selectedCustomBookmarkId) return alert("Select a custom bookmark first.");
  state.customBookmarks = state.customBookmarks.filter((x) => x.id !== state.selectedCustomBookmarkId);
  state.selectedCustomBookmarkId = null;
  renderBookmarks();
  persistRecoveryForFile();
}

function openBookmarkManagerPrompt() {
  const action = (prompt("Bookmark manager: add / rename / delete / list", "list") || "").trim().toLowerCase();
  if (action === "add") return addCustomBookmarkPrompt();
  if (action === "rename") return renameCustomBookmarkPrompt();
  if (action === "delete") return deleteCustomBookmarkPrompt();
  if (action === "list") {
    const lines = state.customBookmarks.map((b) => `[P${b.page}] ${b.title}`).join("\n");
    alert(lines || "No custom bookmarks");
  }
}

function goToPage(pageNum) {
  if (!state.totalPages) return;
  state.currentPage = Math.max(1, Math.min(state.totalPages, pageNum));
  const wrap = $("pages").querySelector(`.pw[data-page="${state.currentPage}"]`);
  if (wrap) wrap.scrollIntoView({ behavior: "smooth", block: "center" });
  document.querySelectorAll(".thumb").forEach((t) => {
    if (t.dataset.page) t.classList.toggle("active", Number(t.dataset.page) === state.currentPage);
  });
  applyViewMode();
  updateStatus();
}

function toRoman(num) {
  const n = Math.max(1, Math.floor(num));
  const map = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  let x = n;
  map.forEach(([v, s]) => {
    while (x >= v) {
      out += s;
      x -= v;
    }
  });
  return out;
}

function getPageLabel(pageNum) {
  const p = Number(pageNum);
  const rule = (state.pageLabelRules || []).find((r) => p >= r.from && p <= r.to);
  if (!rule) return String(p);
  const base = (rule.start || 1) + (p - rule.from);
  if (rule.style === "roman-lower") return toRoman(base).toLowerCase();
  if (rule.style === "roman-upper") return toRoman(base);
  if (rule.style === "prefix") return `${rule.prefix || ""}${base}`;
  return String(base);
}

function updateStatus() {
  if (!state.pdfjs) {
    $("st").textContent = "尚未開啟檔案";
    return;
  }
  const annCount = Object.values(state.annotations).reduce((sum, arr) => sum + arr.length, 0);
  const ro = state.pdfLib ? "" : " | 唯讀";
  const label = getPageLabel(state.currentPage);
  $("st").textContent = `${state.fileName} | 第 ${label} 頁 (${state.currentPage}/${state.totalPages}) | 縮放 ${Math.round((state.scale / 1.25) * 100)}% | 註解 ${annCount}${ro}`;
}

async function onToolbarAction(actionId) {
  if (actionId === "open") return $("file").click();
  if (actionId === "save") return savePdf(false);
  if (actionId === "saveAs") return savePdf(true);
  if (actionId === "prev") return goToPage(state.currentPage - 1);
  if (actionId === "next") return goToPage(state.currentPage + 1);
  if (actionId === "goto") {
    const target = parseInt(prompt("前往頁碼", String(state.currentPage)), 10);
    if (!Number.isNaN(target)) goToPage(target);
    return;
  }
  if (actionId === "zoomOut") return zoom(-0.15);
  if (actionId === "zoomIn") return zoom(0.15);
  if (actionId === "fitWidth") return fitWidth();
  if (actionId === "undo") return undo();
  if (actionId === "redo") return redo();
  if (actionId === "find") return promptFind();
  if (actionId === "findNext") return findNext();
  if (actionId === "toolSelect") {
    state.activeTool = "select";
    return renderToolbar();
  }
  if (actionId === "toolHighlight") {
    state.activeTool = "highlight";
    return renderToolbar();
  }
  if (actionId === "toolText") {
    state.activeTool = "text";
    return renderToolbar();
  }
  if (actionId === "toolRect") {
    state.activeTool = "rect";
    return renderToolbar();
  }
  if (actionId === "toolEllipse") {
    state.activeTool = "ellipse";
    return renderToolbar();
  }
  if (actionId === "toolLine") {
    state.activeTool = "line";
    return renderToolbar();
  }
  if (actionId === "toolArrow") {
    state.activeTool = "arrow";
    return renderToolbar();
  }
  if (actionId === "toolFreehand") {
    state.activeTool = "freehand";
    return renderToolbar();
  }
  if (actionId === "toolRedact") {
    state.activeTool = "redact";
    return renderToolbar();
  }
  if (actionId === "toolSticky") {
    state.activeTool = "sticky";
    return renderToolbar();
  }
  if (actionId === "stampReviewed") {
    state.activeTool = "stampText";
    state.stampText = "REVIEWED";
    return renderToolbar();
  }
  if (actionId === "stampApproved") {
    state.activeTool = "stampText";
    state.stampText = "APPROVED";
    return renderToolbar();
  }
  if (actionId === "stampUrgent") {
    state.activeTool = "stampText";
    state.stampText = "URGENT";
    return renderToolbar();
  }
  if (actionId === "stampImage") return pickStampImageAndActivate();
  if (actionId === "stampManager") return openStampManagerPrompt();
  if (actionId === "crossSeal") return applyCrossPageSealPrompt();
  if (actionId === "editAnn") return editSelectedAnnotation();
  if (actionId === "rotate90") return rotateCurrentPage(90);
  if (actionId === "rotate270") return rotateCurrentPage(270);
  if (actionId === "rotateRange") return rotatePagesByRangePrompt();
  if (actionId === "deletePage") return deleteCurrentPage();
  if (actionId === "deleteRange") return deletePagesByRangePrompt();
  if (actionId === "insertBlank") return insertBlankPage();
  if (actionId === "insertFromPdf") return insertPagesFromExternalPdfPrompt();
  if (actionId === "extractPages") return extractPagesPrompt();
  if (actionId === "copyToDoc") return transferPagesToOtherDocumentPrompt(false);
  if (actionId === "moveToDoc") return transferPagesToOtherDocumentPrompt(true);
  if (actionId === "cropPage") return cropCurrentPagePrompt();
  if (actionId === "cropRange") return cropPagesByRangePrompt();
  if (actionId === "setBoxes") return setPageBoxesPrompt();
  if (actionId === "printAdvanced") return printPdfWithOptionsPrompt();
  if (actionId === "wizardMerge") return openWizard("merge");
  if (actionId === "wizardSplit") return openWizard("split");
  if (actionId === "wizardBatch") return openWizard("batch");
  if (actionId === "wizardConvert") return openWizard("convert");
  if (actionId === "watermarkAdvanced") return applyAdvancedWatermarkPrompt();
  if (actionId === "pageNumbers") return applyPageNumbersPrompt();
  if (actionId === "pageLabels") return configurePageLabelsPrompt();
  if (actionId === "headerFooter") return applyHeaderFooterPrompt();
  if (actionId === "metadata") return editMetadataPrompt();
  if (actionId === "addLink") return addHyperlinkPrompt();
  if (actionId === "insertImage") return insertImagePrompt();
  if (actionId === "exportRegion") return exportImageRegionPrompt();
  if (actionId === "formBuilder") return addFormFieldPrompt();
  if (actionId === "formFill") return fillFormPrompt();
  if (actionId === "formImport") return importFormDataPrompt();
  if (actionId === "formExport") return exportFormDataJson();
  if (actionId === "formExportCsv") return exportFormDataCsv();
  if (actionId === "formExportXfdf") return exportFormDataXfdf();
  if (actionId === "xfaInfo") return showXfaInfo();
  if (actionId === "extractImages") return extractImagesPrompt();
  if (actionId === "replaceImage") return replaceImageRegionPrompt();
  if (actionId === "securityOps") return openSecurityOpsHelp();
  if (actionId === "bookmarkManager") return openBookmarkManagerPrompt();
  if (actionId === "compressDoc") return compressDocumentPrompt();
  if (actionId === "bates") return applyBatesNumberingPrompt();
  if (actionId === "flattenAnn") return flattenAnnotationsToPdf();
  if (actionId === "applyRedact") return applyRedactionsToPdf();
  if (actionId === "exportLog") return exportDiagnosticsLog();
  if (actionId === "clearLog") return clearDiagnosticsLog();
  if (actionId === "editShortcuts") return editShortcutBindings();
  if (actionId === "panelThumb") return setSidePanel("thumb");
  if (actionId === "panelBookmark") return setSidePanel("bookmark");
  if (actionId === "panelAnnot") return setSidePanel("annotation");
  if (actionId === "panelAttach") return setSidePanel("attachment");
  if (actionId === "thumbSm") {
    state.thumbScale = Math.max(0.1, state.thumbScale - 0.05);
    return renderThumbnails();
  }
  if (actionId === "thumbLg") {
    state.thumbScale = Math.min(0.6, state.thumbScale + 0.05);
    return renderThumbnails();
  }
  if (actionId === "modeSingle") {
    state.viewMode = "single";
    return applyViewMode();
  }
  if (actionId === "modeCont") {
    state.viewMode = "continuous";
    return applyViewMode();
  }
  if (actionId === "modeTwo") {
    state.viewMode = "two";
    return applyViewMode();
  }
  if (actionId === "readNormal") {
    state.readingMode = "normal";
    return applyReadingAndA11y();
  }
  if (actionId === "readNight") {
    state.readingMode = "night";
    return applyReadingAndA11y();
  }
  if (actionId === "readWarm") {
    state.readingMode = "warm";
    return applyReadingAndA11y();
  }
  if (actionId === "toggleContrast") {
    state.highContrast = !state.highContrast;
    return applyReadingAndA11y();
  }
  if (actionId === "present") return togglePresentationMode(false);
  if (actionId === "presentAuto") return togglePresentationMode(true);
}

async function zoom(delta) {
  if (!state.pdfjs) return;
  state.scale = Math.max(0.4, Math.min(3.5, state.scale + delta));
  await renderPages();
  applyViewMode();
  renderToolbar();
  updateStatus();
}

async function fitWidth() {
  if (!state.pdfjs) return;
  const page = await state.pdfjs.getPage(state.currentPage);
  const viewport = page.getViewport({ scale: 1 });
  state.scale = Math.max(0.4, Math.min(3.5, ($("view").clientWidth - 60) / viewport.width));
  await renderPages();
  applyViewMode();
  renderToolbar();
  updateStatus();
}

function saveSnapshot() {
  state.undoStack.push(
    JSON.stringify({
      annotations: state.annotations,
      selectedAnnotationId: state.selectedAnnotationId,
      selectedAnnotationIds: state.selectedAnnotationIds,
      customBookmarks: state.customBookmarks,
      selectedCustomBookmarkId: state.selectedCustomBookmarkId,
    }),
  );
  if (state.undoStack.length > 150) state.undoStack.shift();
  state.redoStack = [];
  persistRecoveryForFile();
}

function restoreSnapshot(raw) {
  const snap = JSON.parse(raw);
  state.annotations = snap.annotations || {};
  state.selectedAnnotationId = snap.selectedAnnotationId || null;
  state.selectedAnnotationIds = Array.isArray(snap.selectedAnnotationIds) ? snap.selectedAnnotationIds : state.selectedAnnotationId ? [state.selectedAnnotationId] : [];
  state.customBookmarks = Array.isArray(snap.customBookmarks) ? snap.customBookmarks : state.customBookmarks;
  state.selectedCustomBookmarkId = snap.selectedCustomBookmarkId || null;
  redrawAllAnnotationLayers();
  renderAnnotationPanel();
  renderBookmarks();
  refreshContextStrip();
  updateStatus();
}

function undo() {
  if (state.undoStack.length < 2) return;
  state.redoStack.push(state.undoStack.pop());
  restoreSnapshot(state.undoStack[state.undoStack.length - 1]);
}

function redo() {
  if (!state.redoStack.length) return;
  const snap = state.redoStack.pop();
  state.undoStack.push(snap);
  restoreSnapshot(snap);
}

async function rotateCurrentPage(degrees) {
  if (!state.pdfLib) return;
  const page = state.pdfLib.getPage(state.currentPage - 1);
  const current = page.getRotation().angle;
  page.setRotation(PDFLib.degrees((current + degrees) % 360));
  await reloadFromPdfLib();
}

async function deleteCurrentPage() {
  if (!state.pdfLib) return;
  if (state.totalPages <= 1) {
    alert("At least one page must remain.");
    return;
  }
  if (!confirm(`Delete page ${state.currentPage}?`)) return;
  state.pdfLib.removePage(state.currentPage - 1);
  await reloadFromPdfLib();
}

async function rotatePagesByRangePrompt() {
  if (!state.pdfLib) return;
  const values = await openSettingsDialog({
    title: "範圍旋轉設定",
    submitText: "旋轉",
    fields: [
      { key: "range", label: "頁面範圍", type: "text", value: `1-${state.totalPages}`, placeholder: "例如 1-3,5" },
      {
        key: "degrees",
        label: "旋轉角度",
        type: "select",
        value: "90",
        options: [
          { value: "90", label: "90°" },
          { value: "180", label: "180°" },
          { value: "270", label: "270°" },
        ],
      },
    ],
  });
  if (!values) return;
  const range = String(values.range || "");
  const degrees = Number(values.degrees);
  if (![90, 180, 270].includes(degrees)) {
    alert("Invalid degree.");
    return;
  }
  const indices = parseRange(range, state.totalPages);
  if (!indices.length) {
    alert("No valid pages in range.");
    return;
  }
  indices.forEach((i) => {
    const p = state.pdfLib.getPage(i);
    const cur = p.getRotation().angle;
    p.setRotation(PDFLib.degrees((cur + degrees) % 360));
  });
  await reloadFromPdfLib();
}

async function deletePagesByRangePrompt() {
  if (!state.pdfLib) return;
  const range = prompt("Delete page range (e.g. 2,4-6)", "");
  if (!range) return;
  const indices = parseRange(range, state.totalPages);
  if (!indices.length) {
    alert("No valid pages in range.");
    return;
  }
  if (indices.length >= state.totalPages) {
    alert("At least one page must remain.");
    return;
  }
  if (!confirm(`Delete ${indices.length} page(s)?`)) return;
  indices
    .slice()
    .sort((a, b) => b - a)
    .forEach((i) => state.pdfLib.removePage(i));
  await reloadFromPdfLib();
}

async function insertBlankPage() {
  if (!state.pdfLib) return;
  const pos = prompt("Insert blank page position: before / after / end", "after") || "after";
  state.pdfLib.addPage([595, 842]);
  const newIndex = state.pdfLib.getPageCount() - 1;
  let target = pos === "before" ? state.currentPage - 1 : pos === "after" ? state.currentPage : state.pdfLib.getPageCount() - 1;
  if (target !== newIndex) {
    const [copied] = await state.pdfLib.copyPages(state.pdfLib, [newIndex]);
    state.pdfLib.insertPage(target, copied);
    state.pdfLib.removePage(newIndex + (target <= newIndex ? 1 : 0));
  }
  await reloadFromPdfLib();
}

function applyCropToPageByMargins(page, top, right, bottom, left) {
  const s = page.getSize();
  const x = Math.max(0, left);
  const y = Math.max(0, bottom);
  const w = Math.max(1, s.width - Math.max(0, left) - Math.max(0, right));
  const h = Math.max(1, s.height - Math.max(0, top) - Math.max(0, bottom));
  page.setCropBox(x, y, w, h);
}

function applyCropToPageByTopRect(page, x, yTop, w, h) {
  const s = page.getSize();
  const rx = Math.max(0, x);
  const rw = Math.max(1, Math.min(w, s.width - rx));
  const by = Math.max(0, s.height - yTop - h);
  const rh = Math.max(1, Math.min(h, s.height - by));
  page.setCropBox(rx, by, rw, rh);
}

function getSelectedCropRect() {
  const selected = getSelectedAnnotations();
  if (!selected.length) return null;
  const ann = selected.find((a) => ["h", "rd", "r", "e"].includes(a.type)) || selected[0];
  const x = Number(ann?.x);
  const yTop = Number(ann?.y);
  const w = Number(ann?.w);
  const h = Number(ann?.h);
  if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n > 0)) return null;
  return { x, yTop, w, h };
}

async function cropCurrentPagePrompt() {
  if (!state.pdfLib) return alert("Open a writable PDF first.");
  const values = await openSettingsDialog({
    title: "目前頁面裁切",
    submitText: "套用裁切",
    fields: [
      {
        key: "mode",
        label: "裁切模式",
        type: "select",
        value: "selection",
        options: [
          { value: "selection", label: "使用目前選取區域" },
          { value: "margins", label: "使用邊距" },
          { value: "rect", label: "使用固定矩形" },
        ],
      },
      { key: "top", label: "上邊距 (pt)", type: "number", value: "20", min: 0, step: 1 },
      { key: "right", label: "右邊距 (pt)", type: "number", value: "20", min: 0, step: 1 },
      { key: "bottom", label: "下邊距 (pt)", type: "number", value: "20", min: 0, step: 1 },
      { key: "left", label: "左邊距 (pt)", type: "number", value: "20", min: 0, step: 1 },
      { key: "x", label: "Rect X (pt)", type: "number", value: "20", min: 0, step: 1 },
      { key: "yTop", label: "Rect Y (pt, from top)", type: "number", value: "20", min: 0, step: 1 },
      { key: "w", label: "Rect 寬度 (pt)", type: "number", value: "555", min: 1, step: 1 },
      { key: "h", label: "Rect 高度 (pt)", type: "number", value: "802", min: 1, step: 1 },
    ],
  });
  if (!values) return;
  const mode = String(values.mode || "selection").trim().toLowerCase();
  const page = state.pdfLib.getPage(state.currentPage - 1);
  if (mode === "selection") {
    const box = getSelectedCropRect();
    if (!box) return alert("請先在頁面上建立或選取一個矩形/螢光/遮蔽區域。");
    applyCropToPageByTopRect(page, box.x, box.yTop, box.w, box.h);
  } else if (mode === "rect") {
    const x = Number(values.x);
    const yTop = Number(values.yTop);
    const w = Number(values.w);
    const h = Number(values.h);
    if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n >= 0)) return alert("Invalid rectangle values.");
    applyCropToPageByTopRect(page, x, yTop, w, h);
  } else {
    const top = Number(values.top);
    const right = Number(values.right);
    const bottom = Number(values.bottom);
    const left = Number(values.left);
    if (![top, right, bottom, left].every((n) => Number.isFinite(n) && n >= 0)) return alert("Invalid margins.");
    applyCropToPageByMargins(page, top, right, bottom, left);
  }
  await reloadFromPdfLib();
}

async function cropPagesByRangePrompt() {
  if (!state.pdfLib) return alert("Open a writable PDF first.");
  const values = await openSettingsDialog({
    title: "範圍裁切設定",
    submitText: "套用裁切",
    fields: [
      { key: "range", label: "頁面範圍", type: "text", value: "all", placeholder: "all / 1-3,5 / odd / even" },
      {
        key: "mode",
        label: "裁切模式",
        type: "select",
        value: "margins",
        options: [
          { value: "margins", label: "使用邊距" },
          { value: "rect", label: "使用固定矩形" },
        ],
      },
      { key: "top", label: "上邊距 (pt)", type: "number", value: "20", min: 0, step: 1 },
      { key: "right", label: "右邊距 (pt)", type: "number", value: "20", min: 0, step: 1 },
      { key: "bottom", label: "下邊距 (pt)", type: "number", value: "20", min: 0, step: 1 },
      { key: "left", label: "左邊距 (pt)", type: "number", value: "20", min: 0, step: 1 },
      { key: "x", label: "Rect X (pt)", type: "number", value: "20", min: 0, step: 1 },
      { key: "yTop", label: "Rect Y (pt, from top)", type: "number", value: "20", min: 0, step: 1 },
      { key: "w", label: "Rect 寬度 (pt)", type: "number", value: "555", min: 1, step: 1 },
      { key: "h", label: "Rect 高度 (pt)", type: "number", value: "802", min: 1, step: 1 },
    ],
  });
  if (!values) return;
  const range = String(values.range || "all");
  const idx = parseRangeExtended(range, state.totalPages);
  if (!idx.length) return alert("No valid pages.");
  const mode = String(values.mode || "margins").trim().toLowerCase();
  if (mode === "rect") {
    const x = Number(values.x);
    const yTop = Number(values.yTop);
    const w = Number(values.w);
    const h = Number(values.h);
    if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n >= 0)) return alert("Invalid rectangle values.");
    idx.forEach((i) => applyCropToPageByTopRect(state.pdfLib.getPage(i), x, yTop, w, h));
  } else {
    const top = Number(values.top);
    const right = Number(values.right);
    const bottom = Number(values.bottom);
    const left = Number(values.left);
    if (![top, right, bottom, left].every((n) => Number.isFinite(n) && n >= 0)) return alert("Invalid margins.");
    idx.forEach((i) => applyCropToPageByMargins(state.pdfLib.getPage(i), top, right, bottom, left));
  }
  await reloadFromPdfLib();
}

function setPdfPageBox(page, boxName, x, y, w, h) {
  const ctx = state.pdfLib.context;
  const PDFName = PDFLib.PDFName;
  page.node.set(PDFName.of(boxName), ctx.obj([x, y, x + w, y + h]));
}

async function setPageBoxesPrompt() {
  if (!state.pdfLib) return alert("Open a writable PDF first.");
  const range = prompt("Target pages (all or 1-3,5)", String(state.currentPage));
  if (range == null) return;
  const idx = parseRangeExtended(range, state.totalPages);
  if (!idx.length) return alert("No valid pages.");
  const boxesRaw = (prompt("Boxes to set (crop,trim,bleed) comma-separated", "crop,trim") || "crop,trim").toLowerCase();
  const setCrop = boxesRaw.includes("crop");
  const setTrim = boxesRaw.includes("trim");
  const setBleed = boxesRaw.includes("bleed");
  if (!setCrop && !setTrim && !setBleed) return alert("No valid boxes selected.");
  const x = Number(prompt("Box X (pt, from left)", "20"));
  const yTop = Number(prompt("Box Y (pt, from top)", "20"));
  const w = Number(prompt("Box width (pt)", "555"));
  const h = Number(prompt("Box height (pt)", "802"));
  if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n >= 0)) return alert("Invalid box geometry.");

  idx.forEach((i) => {
    const page = state.pdfLib.getPage(i);
    const s = page.getSize();
    const by = Math.max(0, s.height - yTop - h);
    const rw = Math.max(1, Math.min(w, s.width - Math.max(0, x)));
    const rh = Math.max(1, Math.min(h, s.height - by));
    const rx = Math.max(0, x);
    if (setCrop) page.setCropBox(rx, by, rw, rh);
    if (setTrim) setPdfPageBox(page, "TrimBox", rx, by, rw, rh);
    if (setBleed) setPdfPageBox(page, "BleedBox", rx, by, rw, rh);
  });
  await reloadFromPdfLib();
}

async function reloadFromPdfLib() {
  const bytes = await state.pdfLib.save();
  await loadPdfBytes(normalizePdfBytes(new Uint8Array(bytes), state.fileName || "document.pdf"), state.fileName || "document.pdf", { skipRecoveryPrompt: true });
}

async function savePdf(promptName) {
  if (!state.pdfLib) {
    alert("This file is opened in read-only mode. Save is unavailable.");
    return;
  }
  const bytes = await state.pdfLib.save();
  const defaultName = state.fileName || "document.pdf";
  const outputName = promptName ? prompt("Output file name", defaultName) || defaultName : defaultName;
  downloadBytes(bytes, outputName);
}

function inferMimeTypeFromName(name) {
  const lower = String(name || "").toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".zip")) return "application/zip";
  if (lower.endsWith(".json")) return "application/json";
  if (lower.endsWith(".csv")) return "text/csv";
  if (lower.endsWith(".txt")) return "text/plain";
  if (lower.endsWith(".xfdf")) return "application/vnd.adobe.xfdf";
  if (lower.endsWith(".ps1")) return "text/plain";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

function downloadBytes(bytes, name, mimeType) {
  const url = URL.createObjectURL(new Blob([bytes], { type: mimeType || inferMimeTypeFromName(name) }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

async function printPdf() {
  if (!state.pdfLib) {
    alert("This file is opened in read-only mode. Print is unavailable.");
    return;
  }
  const bytes = await state.pdfLib.save();
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const win = window.open(url);
  if (win) win.onload = () => win.print();
}

function parseRangeExtended(expr, total) {
  const raw = (expr || "").trim().toLowerCase();
  if (!raw || raw === "all") return Array.from({ length: total }, (_, i) => i);
  const parts = raw.split(",").map((x) => x.trim()).filter(Boolean);
  const hasOdd = parts.includes("odd");
  const hasEven = parts.includes("even");
  const base = parseRange(
    parts
      .filter((x) => x !== "odd" && x !== "even")
      .join(","),
    total,
  );
  const selected = new Set(base);
  if (hasOdd) {
    for (let p = 1; p <= total; p += 2) selected.add(p - 1);
  }
  if (hasEven) {
    for (let p = 2; p <= total; p += 2) selected.add(p - 1);
  }
  return [...selected].sort((a, b) => a - b);
}

async function printPdfWithOptionsPrompt() {
  if (!state.pdfLib) {
    alert("This file is opened in read-only mode. Print is unavailable.");
    return;
  }
  const rangeExpr = prompt("Print range: all / 1-3,8 / odd / even", "all");
  if (rangeExpr == null) return;
  const parity = (prompt("Parity filter: all / odd / even", "all") || "all").trim().toLowerCase();
  if (!["all", "odd", "even"].includes(parity)) return alert("Invalid parity.");
  const idx = parseRangeExtended(rangeExpr, state.totalPages);
  const filtered = idx.filter((i) => {
    const p = i + 1;
    if (parity === "odd") return p % 2 === 1;
    if (parity === "even") return p % 2 === 0;
    return true;
  });
  if (!filtered.length) return alert("No pages selected for print.");
  const out = await PDFLib.PDFDocument.create();
  const copied = await out.copyPages(state.pdfLib, filtered);
  copied.forEach((p) => out.addPage(p));
  const bytes = await out.save();
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const win = window.open(url);
  if (win) {
    win.onload = () => win.print();
  }
}

async function extractPagesPrompt() {
  if (!state.pdfLib) return alert("Open a writable PDF first.");
  const range = prompt("Extract page range (all or 1-3,5,odd,even)", String(state.currentPage));
  if (range == null) return;
  const idx = parseRangeExtended(range, state.totalPages);
  if (!idx.length) return alert("No valid pages selected.");
  const mode = (prompt("After extract: open / download", "open") || "open").trim().toLowerCase();
  if (!["open", "download"].includes(mode)) return alert("Invalid mode.");
  const outName = (prompt("Output file name", `${baseName(state.fileName)}-extract.pdf`) || `${baseName(state.fileName)}-extract.pdf`).trim();
  const out = await PDFLib.PDFDocument.create();
  const copied = await out.copyPages(state.pdfLib, idx);
  copied.forEach((p) => out.addPage(p));
  const bytes = await out.save();
  if (mode === "download") {
    downloadBytes(bytes, outName);
  } else {
    await loadPdfBytes(new Uint8Array(bytes), outName);
  }
}

async function insertPagesFromExternalPdfPrompt() {
  if (!state.pdfLib) return alert("Open a writable PDF first.");
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf,application/pdf";
  input.onchange = async () => {
    try {
      const file = input.files?.[0];
      if (!file) return;
      const src = await PDFLib.PDFDocument.load(await readAndNormalizePdfFile(file), { ignoreEncryption: true });
      const srcTotal = src.getPageCount();
      const range = prompt(`Source page range for "${file.name}" (all or 1-3,5)`, "all");
      if (range == null) return;
      const srcIdx = parseRangeExtended(range, srcTotal);
      if (!srcIdx.length) return alert("No valid source pages selected.");
      const pos = (prompt("Insert position: before / after / end", "after") || "after").trim().toLowerCase();
      if (!["before", "after", "end"].includes(pos)) return alert("Invalid position.");
      let insertAt = state.pdfLib.getPageCount();
      if (pos === "before") insertAt = Math.max(0, state.currentPage - 1);
      else if (pos === "after") insertAt = Math.min(state.pdfLib.getPageCount(), state.currentPage);
      const pages = await state.pdfLib.copyPages(src, srcIdx);
      pages.forEach((p, n) => state.pdfLib.insertPage(insertAt + n, p));
      await reloadFromPdfLib();
      goToPage(insertAt + 1);
    } catch (err) {
      alert(`Insert from PDF failed: ${err.message || err}`);
    }
  };
  input.click();
}

function getOtherDocs() {
  return state.docs.filter((d) => d.id !== state.activeDocId);
}

function getDocById(id) {
  return state.docs.find((d) => d.id === id);
}

async function transferPagesToDocument(srcIdx, targetDocId, removeFromSource) {
  if (!state.pdfLib) return alert("Open a writable PDF first.");
  const target = getDocById(targetDocId);
  if (!target) return alert("Target document not found.");
  if (!srcIdx.length) return alert("No pages selected.");
  if (removeFromSource && srcIdx.length >= state.totalPages) return alert("At least one page must remain in source.");

  const targetPdf = await PDFLib.PDFDocument.load(target.bytes.slice(), { ignoreEncryption: true });
  const copied = await targetPdf.copyPages(state.pdfLib, srcIdx);
  copied.forEach((p) => targetPdf.addPage(p));
  const targetBytes = await targetPdf.save();
  target.bytes = normalizePdfBytes(new Uint8Array(targetBytes), target.fileName);

  if (removeFromSource) {
    srcIdx
      .slice()
      .sort((a, b) => b - a)
      .forEach((i) => state.pdfLib.removePage(i));
    await reloadFromPdfLib();
  }
  renderDocTabs();
  alert(`${removeFromSource ? "Moved" : "Copied"} ${srcIdx.length} page(s) to ${target.fileName}`);
}

async function transferPagesToOtherDocumentPrompt(removeFromSource) {
  if (!state.pdfLib) return alert("Open a writable PDF first.");
  const other = getOtherDocs();
  if (!other.length) return alert("Need at least 2 open documents.");
  const range = prompt("Page range to transfer (all / 1-3,5 / odd / even)", String(state.currentPage));
  if (range == null) return;
  const srcIdx = parseRangeExtended(range, state.totalPages);
  if (!srcIdx.length) return alert("No valid source pages.");
  const lines = other.map((d, i) => `${i + 1}. ${d.fileName}`).join("\n");
  const pick = Number(prompt(`Target document number:\n${lines}`, "1"));
  if (!Number.isFinite(pick) || pick < 1 || pick > other.length) return alert("Invalid target.");
  await transferPagesToDocument(srcIdx, other[pick - 1].id, removeFromSource);
}

async function copyCurrentPageText() {
  if (!state.pdfjs) return;
  const page = await state.pdfjs.getPage(state.currentPage);
  const textContent = await page.getTextContent();
  const text = textContent.items.map((x) => x.str).join(" ");
  try {
    await navigator.clipboard.writeText(text);
    alert(`Copied ${text.length} chars`);
  } catch {
    alert(text || "No extractable text");
  }
}

async function exportImageRegionPrompt() {
  if (!state.pdfjs) return alert("Open a PDF first.");
  const canvas = $("pages").querySelector(`.pw[data-page="${state.currentPage}"] canvas`);
  if (!canvas) return alert("Page canvas not found.");
  const dW = canvas.width;
  const dH = canvas.height;
  const x = Number(prompt(`Region X (0-${dW - 1})`, "0"));
  const y = Number(prompt(`Region Y (0-${dH - 1})`, "0"));
  const w = Number(prompt("Region width", String(Math.max(1, Math.floor(dW / 2)))));
  const h = Number(prompt("Region height", String(Math.max(1, Math.floor(dH / 2)))));
  if (![x, y, w, h].every((n) => Number.isFinite(n))) return alert("Invalid numeric values.");
  const rx = Math.max(0, Math.min(dW - 1, Math.floor(x)));
  const ry = Math.max(0, Math.min(dH - 1, Math.floor(y)));
  const rw = Math.max(1, Math.min(dW - rx, Math.floor(w)));
  const rh = Math.max(1, Math.min(dH - ry, Math.floor(h)));
  const out = document.createElement("canvas");
  out.width = rw;
  out.height = rh;
  const ctx = out.getContext("2d");
  ctx.drawImage(canvas, rx, ry, rw, rh, 0, 0, rw, rh);
  out.toBlob((blob) => {
    if (!blob) return alert("Export region failed.");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName(state.fileName)}-p${String(state.currentPage).padStart(3, "0")}-region.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, "image/png");
}

async function insertImagePrompt() {
  if (!state.pdfLib) return alert("Open a writable PDF first.");
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/jpg";
  input.onchange = async () => {
    try {
      const file = input.files?.[0];
      if (!file) return;
      const page = state.pdfLib.getPage(state.currentPage - 1);
      const s = page.getSize();
      const x = Number(prompt("Image X (pt)", "60"));
      const yTop = Number(prompt("Image Y from top (pt)", "120"));
      const w = Number(prompt("Image width (pt)", "180"));
      const h = Number(prompt("Image height (pt)", "120"));
      if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n > 0)) return alert("Invalid geometry.");
      const y = s.height - yTop - h;
      const ext = file.name.toLowerCase();
      const bytes = await file.arrayBuffer();
      let img;
      if (ext.endsWith(".png")) img = await state.pdfLib.embedPng(bytes);
      else img = await state.pdfLib.embedJpg(bytes);
      page.drawImage(img, { x, y, width: w, height: h });
      await reloadFromPdfLib();
    } catch (err) {
      alert(`Insert image failed: ${err.message || err}`);
    }
  };
  input.click();
}

async function extractImagesPrompt() {
  if (!state.pdfjs) return alert("Open a PDF first.");
  const range = prompt("Extract rendered page images range (all or 1-3,5)", "all");
  if (range == null) return;
  const idx = parseRangeExtended(range, state.totalPages);
  if (!idx.length) return alert("No valid pages.");
  const fmt = (prompt("Format: png / jpg", "png") || "png").trim().toLowerCase();
  const scale = Math.max(0.5, Math.min(4, Number(prompt("Scale factor (0.5-4)", "2")) || 2));
  const jpgQ = Math.max(0.4, Math.min(0.98, Number(prompt("JPG quality (0.4-0.98)", "0.86")) || 0.86));
  const zip = new JSZip();
  for (const i of idx) {
    const p = i + 1;
    const page = await state.pdfjs.getPage(p);
    const vp = page.getViewport({ scale });
    const c = document.createElement("canvas");
    c.width = Math.ceil(vp.width);
    c.height = Math.ceil(vp.height);
    await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    const dataUrl = fmt === "jpg" ? c.toDataURL("image/jpeg", jpgQ) : c.toDataURL("image/png");
    const ab = await (await fetch(dataUrl)).arrayBuffer();
    zip.file(`${baseName(state.fileName)}-p${String(p).padStart(3, "0")}.${fmt === "jpg" ? "jpg" : "png"}`, new Uint8Array(ab));
  }
  const pack = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  const blob = new Blob([pack], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${baseName(state.fileName)}-images.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

async function replaceImageRegionPrompt() {
  if (!state.pdfLib) return alert("Open a writable PDF first.");
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/jpg,image/webp";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    const pageNum = Number(prompt("Target page number", String(state.currentPage)));
    if (!Number.isFinite(pageNum) || pageNum < 1 || pageNum > state.totalPages) return alert("Invalid page.");
    const x = Number(prompt("Region X (pt, left)", "60"));
    const yTop = Number(prompt("Region Y from top (pt)", "120"));
    const w = Number(prompt("Region width (pt)", "180"));
    const h = Number(prompt("Region height (pt)", "120"));
    if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n > 0)) return alert("Invalid geometry.");
    const page = state.pdfLib.getPage(pageNum - 1);
    const s = page.getSize();
    const y = s.height - yTop - h;
    page.drawRectangle({ x, y, width: w, height: h, color: PDFLib.rgb(1, 1, 1) });
    const bytes = await file.arrayBuffer();
    const lower = file.name.toLowerCase();
    const img = lower.endsWith(".png") ? await state.pdfLib.embedPng(bytes) : await state.pdfLib.embedJpg(bytes);
    page.drawImage(img, { x, y, width: w, height: h });
    await reloadFromPdfLib();
  };
  input.click();
}

function openSecurityOpsHelp() {
  const msg = [
    "Security operations (password/permissions/signing/redaction) are exposed via CLI helper.",
    "Use terminal in project root:",
    "powershell -ExecutionPolicy Bypass -File .\\cli\\pdf_toolkit.ps1 -Action help",
    "Examples:",
    "Encrypt: ... -Action encrypt -Input in.pdf -Output out.pdf -UserPassword 1234 -OwnerPassword owner",
    "Decrypt: ... -Action decrypt -Input in.pdf -Output out.pdf -Password 1234",
    "Permissions: ... -Action permissions -Input in.pdf -Output out.pdf -OwnerPassword owner -Allow print",
    "OCR: ... -Action ocr -Input in.pdf -Output out-ocr.pdf -Lang eng",
    "Batch text: ... -Action batch-pdf2text -Glob *.pdf -OutDir .\\txt",
  ].join("\n");
  alert(msg);
}

function pickStampImageAndActivate() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/jpg,image/webp";
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.stampImageDataUrl = String(reader.result || "");
      state.activeTool = "stampImage";
      renderToolbar();
      alert("Stamp image loaded. Click on page to place.");
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function openStampManagerPrompt() {
  const action = (prompt("Stamp manager: use / save / delete / list", "list") || "").trim().toLowerCase();
  if (action === "use") return applySelectedStampPreset();
  if (action === "save") return saveCurrentStampAsPreset();
  if (action === "delete") return deleteSelectedStampPreset();
  if (action === "list") {
    const lines = (state.stampPresets || []).map((x, i) => `${i + 1}. ${x.name}`).join("\n");
    alert(lines || "No presets");
  }
}

function loadImageElement(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image decode failed"));
    img.src = dataUrl;
  });
}

function sliceImageVertical(img, index, total) {
  const sx = Math.floor((img.width * index) / total);
  const ex = Math.floor((img.width * (index + 1)) / total);
  const sw = Math.max(1, ex - sx);
  const c = document.createElement("canvas");
  c.width = sw;
  c.height = img.height;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, sx, 0, sw, img.height, 0, 0, sw, img.height);
  return c.toDataURL("image/png");
}

async function applyCrossPageSealPrompt() {
  if (!state.pdfjs) return alert("Open a PDF first.");
  const range = prompt("Cross-seal page range (e.g. 2-5)", `${state.currentPage}-${Math.min(state.totalPages, state.currentPage + 1)}`);
  if (range == null) return;
  const idx = parseRangeExtended(range, state.totalPages);
  if (!idx.length) return alert("No valid pages.");
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/jpg,image/webp";
  input.onchange = async () => {
    try {
      const file = input.files?.[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = async () => {
        try {
          const src = String(r.result || "");
          const img = await loadImageElement(src);
          const pages = idx.map((i) => i + 1);
          for (let i = 0; i < pages.length; i += 1) {
            const p = pages[i];
            const slice = sliceImageVertical(img, i, pages.length);
            const wrap = $("pages").querySelector(`.pw[data-page="${p}"]`);
            const canvas = wrap?.querySelector(".pc");
            if (!canvas) continue;
            const targetW = Math.max(26, Math.min(160, Math.floor(canvas.width * 0.2)));
            const sliceW = Math.max(1, Math.floor(img.width / pages.length));
            const targetH = Math.max(20, Math.floor((img.height / sliceW) * targetW));
            const x = canvas.width - targetW - 8;
            const y = Math.max(6, Math.floor((canvas.height - targetH) / 2));
            pushAnnotation({ id: genId(), page: p, type: "si", x, y, w: targetW, h: targetH, src: slice });
          }
          redrawAllAnnotationLayers();
          saveSnapshot();
        } catch (err2) {
          alert(`Cross-page seal failed: ${err2.message || err2}`);
        }
      };
      r.readAsDataURL(file);
    } catch (err) {
      alert(`Cross-page seal failed: ${err.message || err}`);
    }
  };
  input.click();
}

function promptFind() {
  if (!state.pdfjs) return;
  const q = prompt("Find text", "");
  if (!q) return;
  searchAll(q);
}

async function searchAll(query) {
  state.searchHits = [];
  state.searchHitDetails = [];
  state.searchCursor = -1;
  const keyword = query.toLowerCase();
  for (let p = 1; p <= state.totalPages; p += 1) {
    const page = await state.pdfjs.getPage(p);
    const textContent = await page.getTextContent();
    const raw = textContent.items.map((x) => x.str).join(" ");
    const text = raw.toLowerCase();
    const at = text.indexOf(keyword);
    if (at >= 0) {
      state.searchHits.push(p);
      const start = Math.max(0, at - 30);
      const end = Math.min(raw.length, at + keyword.length + 30);
      state.searchHitDetails.push({ page: p, snippet: raw.slice(start, end) });
    }
  }
  if (!state.searchHits.length) {
    renderSearchHitPanel();
    alert("No matches");
    return;
  }
  state.searchCursor = 0;
  renderSearchHitPanel();
  goToPage(state.searchHits[0]);
  alert(`Found in ${state.searchHits.length} page(s). Ctrl+G for next.`);
}

function findNext() {
  if (!state.searchHits.length) return;
  state.searchCursor = (state.searchCursor + 1) % state.searchHits.length;
  goToPage(state.searchHits[state.searchCursor]);
  renderSearchHitPanel();
}

function renderSearchHitPanel() {
  const root = $("searchHits");
  if (!root) return;
  if (!state.searchHitDetails.length) {
    root.className = "note";
    root.textContent = "No search results";
    return;
  }
  root.className = "";
  root.innerHTML = "";
  state.searchHitDetails.forEach((h, idx) => {
    const row = document.createElement("div");
    row.className = `thumb${idx === state.searchCursor ? " active" : ""}`;
    row.innerHTML = `<div style="text-align:left">Page ${h.page}</div><div style="font-size:11px;color:#9aabc0;text-align:left;margin-top:4px">${h.snippet.replace(/</g, "&lt;")}</div>`;
    row.addEventListener("click", () => {
      state.searchCursor = idx;
      goToPage(h.page);
      renderSearchHitPanel();
    });
    root.appendChild(row);
  });
}

function openContextMenu(x, y) {
  const items = [
    ["開啟", () => $("file").click()],
    ["儲存", () => savePdf(false)],
    ["列印（範圍/奇偶）", () => printPdfWithOptionsPrompt()],
    ["複製頁面文字", () => copyCurrentPageText()],
    ["匯出區域圖片", () => exportImageRegionPrompt()],
    ["插入圖片", () => insertImagePrompt()],
    ["編輯已選註解", () => editSelectedAnnotation()],
    ["套用遮蔽", () => applyRedactionsToPdf()],
    ["旋轉 90", () => rotateCurrentPage(90)],
    ["範圍旋轉", () => rotatePagesByRangePrompt()],
    ["從 PDF 插入", () => insertPagesFromExternalPdfPrompt()],
    ["提取頁面", () => extractPagesPrompt()],
    ["複製頁面到其他文件", () => transferPagesToOtherDocumentPrompt(false)],
    ["移動頁面到其他文件", () => transferPagesToOtherDocumentPrompt(true)],
    ["裁切頁面", () => cropCurrentPagePrompt()],
    ["範圍裁切", () => cropPagesByRangePrompt()],
    ["設定 Crop/Trim/Bleed", () => setPageBoxesPrompt()],
    ["刪除頁面", () => deleteCurrentPage()],
    ["範圍刪除", () => deletePagesByRangePrompt()],
    ["命令面板", () => openCommandPalette()],
  ];
  const menu = $("menu");
  menu.innerHTML = "";
  items.forEach(([label, action]) => {
    const b = document.createElement("button");
    b.className = "mi";
    b.textContent = label;
    b.addEventListener("click", () => {
      menu.style.display = "none";
      action();
    });
    menu.appendChild(b);
  });
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.display = "block";
}

function openWizard(type) {
  state.wizardType = type;
  state.wizardStep = 1;
  $("wiz").classList.add("show");
  renderWizard();
}

function closeWizard() {
  $("wiz").classList.remove("show");
  state.wizardType = null;
}

function setWizardStep(step) {
  state.wizardStep = Math.max(1, Math.min(3, step));
  renderWizard();
}

function onWizardNext() {
  if (state.wizardType === "batch" && state.wizardStep === 1) {
    window.__batchOp = $("bo")?.value || window.__batchOp || "watermark";
  }
  if (state.wizardType === "batch" && state.wizardStep === 2) {
    window.__batchConfig = {
      prefix: $("bp")?.value,
      wm: $("bw")?.value,
      delRange: $("br")?.value,
      angle: $("ba")?.value,
      pnStart: $("bpnStart")?.value,
      pnPos: $("bpnPos")?.value,
      pnSize: $("bpnSize")?.value,
      bPrefix: $("bbPrefix")?.value,
      bStart: $("bbStart")?.value,
      bDigits: $("bbDigits")?.value,
      bSuffix: $("bbSuffix")?.value,
      downloadMode: $("bdm")?.value,
      headerTpl: $("bh")?.value,
      footerTpl: $("bf")?.value,
      hfSize: $("bhfs")?.value,
      metaTitle: $("bmt")?.value,
      metaAuthor: $("bma")?.value,
      metaSubject: $("bmsu")?.value,
      metaKeywords: $("bmkw")?.value,
      cropMarginsRaw: $("bcrop")?.value,
      cropRangeRaw: $("bcropRange")?.value,
      wantReport: $("breport")?.value,
      cliOutDir: $("bCliOutDir")?.value,
      cliUser: $("bCliUser")?.value,
      cliOwner: $("bCliOwner")?.value,
      cliAllow: $("bCliAllow")?.value,
      cliLang: $("bCliLang")?.value,
    };
  }
  if (state.wizardType === "convert" && state.wizardStep === 1) {
    window.__convertMode = $("cvMode")?.value || window.__convertMode || "pdf-to-images";
    window.__convertScale = $("cvScale")?.value || window.__convertScale || "2";
  }
  if (state.wizardType === "convert" && state.wizardStep === 2) {
    window.__convertConfig = {
      quality: $("cvQuality")?.value,
      cliOut: $("cvCliOut")?.value,
      cliInput2: $("cvCliInput2")?.value,
      cliLang: $("cvOcrLang")?.value,
    };
  }
  if (state.wizardStep < 3) {
    setWizardStep(state.wizardStep + 1);
    return;
  }
  if (state.wizardType === "split") runSplitWizard();
  if (state.wizardType === "merge") runMergeWizard();
  if (state.wizardType === "batch") runBatchWizard();
  if (state.wizardType === "convert") runConvertWizard();
}

function renderWizard() {
  [1, 2, 3].forEach((n) => {
    $(`s${n}`).classList.toggle("on", n === state.wizardStep);
  });
  $("wp").disabled = state.wizardStep === 1;
  if (state.wizardType === "split") renderSplitWizard();
  if (state.wizardType === "merge") renderMergeWizard();
  if (state.wizardType === "batch") renderBatchWizard();
  if (state.wizardType === "convert") renderConvertWizard();
}

async function applyAdvancedWatermarkPrompt() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const text = prompt("Watermark text", "CONFIDENTIAL");
  if (!text) return;
  const rangeInput = prompt("Page range (all or 1-3,5)", "all") || "all";
  const opacity = Number(prompt("Opacity (0.05 - 1.0)", "0.18"));
  const angle = Number(prompt("Angle (degrees)", "35"));
  const fontSize = Number(prompt("Font size", "34"));
  const pages = parseAnnotationRangeInput(rangeInput);
  if (!pages.length) return alert("No valid pages.");
  pages.forEach((pNum) => {
    const p = state.pdfLib.getPage(pNum - 1);
    const s = p.getSize();
    p.drawText(text, {
      x: s.width * 0.18,
      y: s.height * 0.48,
      size: Number.isFinite(fontSize) ? fontSize : 34,
      rotate: PDFLib.degrees(Number.isFinite(angle) ? angle : 35),
      opacity: Math.max(0.05, Math.min(1, Number.isFinite(opacity) ? opacity : 0.18)),
    });
  });
  await reloadFromPdfLib();
}

async function applyPageNumbersPrompt() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const rangeInput = prompt("Page range (all or 1-3,5)", "all") || "all";
  const startNo = Number(prompt("Start number", "1"));
  const pos = (prompt("Position: tl/tr/bl/br", "br") || "br").toLowerCase();
  const size = Number(prompt("Font size", "12"));
  const pages = parseAnnotationRangeInput(rangeInput);
  if (!pages.length) return alert("No valid pages.");
  pages.forEach((pNum, idx) => {
    const page = state.pdfLib.getPage(pNum - 1);
    const s = page.getSize();
    const label = String((Number.isFinite(startNo) ? startNo : 1) + idx);
    const m = 24;
    let x = s.width - m;
    let y = m;
    if (pos === "tl") {
      x = m;
      y = s.height - m;
    } else if (pos === "tr") {
      x = s.width - m;
      y = s.height - m;
    } else if (pos === "bl") {
      x = m;
      y = m;
    }
    page.drawText(label, { x, y, size: Number.isFinite(size) ? size : 12 });
  });
  await reloadFromPdfLib();
}

function configurePageLabelsPrompt() {
  if (!state.pdfjs) return alert("Open a PDF first.");
  const mode = (prompt("Page labels: clear / decimal / roman-lower / roman-upper / prefix", "decimal") || "decimal").trim().toLowerCase();
  if (mode === "clear") {
    state.pageLabelRules = [];
    renderThumbnails();
    updateStatus();
    persistRecoveryForFile();
    return;
  }
  if (!["decimal", "roman-lower", "roman-upper", "prefix"].includes(mode)) return alert("Invalid mode.");
  const range = prompt("Label range (all or 1-10)", "all");
  if (range == null) return;
  const idx = parseRangeExtended(range, state.totalPages);
  if (!idx.length) return alert("No valid pages.");
  const from = Math.min(...idx) + 1;
  const to = Math.max(...idx) + 1;
  const start = Number(prompt("Start value", "1"));
  if (!Number.isFinite(start) || start < 1) return alert("Invalid start value.");
  let prefix = "";
  if (mode === "prefix") prefix = prompt("Prefix text", "A-") ?? "A-";
  state.pageLabelRules = (state.pageLabelRules || []).filter((r) => to < r.from || from > r.to);
  state.pageLabelRules.push({ from, to, style: mode, start: Math.floor(start), prefix });
  state.pageLabelRules.sort((a, b) => a.from - b.from);
  renderThumbnails();
  updateStatus();
  persistRecoveryForFile();
}

async function applyHeaderFooterPrompt() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const template = prompt("Header/Footer template. Variables: {page} {total} {date}", "{page}/{total}  {date}");
  if (template == null) return;
  const rangeInput = prompt("Page range (all or 1-3,5)", "all") || "all";
  const position = (prompt("Position: top-left / top-right / bottom-left / bottom-right", "top-right") || "top-right").toLowerCase();
  const size = Number(prompt("Font size", "10"));
  const pages = parseAnnotationRangeInput(rangeInput);
  if (!pages.length) return alert("No valid pages.");

  const total = state.totalPages;
  const dateStr = new Date().toISOString().slice(0, 10);
  pages.forEach((pNum) => {
    const page = state.pdfLib.getPage(pNum - 1);
    const s = page.getSize();
    const text = template
      .replaceAll("{page}", String(pNum))
      .replaceAll("{total}", String(total))
      .replaceAll("{date}", dateStr);
    const m = 24;
    let x = m;
    let y = m;
    if (position === "top-left") {
      x = m;
      y = s.height - m;
    } else if (position === "top-right") {
      x = s.width - m * 4;
      y = s.height - m;
    } else if (position === "bottom-right") {
      x = s.width - m * 4;
      y = m;
    }
    page.drawText(text, { x, y, size: Number.isFinite(size) ? size : 10 });
  });
  await reloadFromPdfLib();
}

async function editMetadataPrompt() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const title = prompt("Title", "") ?? "";
  const author = prompt("Author", "") ?? "";
  const subject = prompt("Subject", "") ?? "";
  const keywordsRaw = prompt("Keywords (comma-separated)", "") ?? "";
  const producer = prompt("Producer", "Offline PDF Studio") ?? "Offline PDF Studio";

  state.pdfLib.setTitle(title);
  state.pdfLib.setAuthor(author);
  state.pdfLib.setSubject(subject);
  const keywords = keywordsRaw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  state.pdfLib.setKeywords(keywords);
  state.pdfLib.setProducer(producer);
  state.pdfLib.setCreator("Offline PDF Studio");
  state.pdfLib.setModificationDate(new Date());
  await reloadFromPdfLib();
}

async function addHyperlinkPrompt() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const pNum = Number(prompt("Target page number", String(state.currentPage)));
  if (!Number.isFinite(pNum) || pNum < 1 || pNum > state.totalPages) return alert("Invalid page number.");
  const url = (prompt("URL (https://...)", "https://") || "").trim();
  if (!/^https?:\/\//i.test(url)) return alert("Invalid URL.");
  const x = Number(prompt("Rectangle X (pt, left origin)", "50"));
  const yTop = Number(prompt("Rectangle Y from top (pt)", "50"));
  const w = Number(prompt("Rectangle width (pt)", "240"));
  const h = Number(prompt("Rectangle height (pt)", "28"));
  if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n > 0)) return alert("Invalid rectangle values.");

  const page = state.pdfLib.getPage(pNum - 1);
  const s = page.getSize();
  const y = s.height - yTop - h;
  try {
    const ctx = state.pdfLib.context;
    const PDFName = PDFLib.PDFName;
    const PDFString = PDFLib.PDFString;
    const PDFArray = PDFLib.PDFArray;

    const action = ctx.obj({
      Type: PDFName.of("Action"),
      S: PDFName.of("URI"),
      URI: PDFString.of(url),
    });
    const actionRef = ctx.register(action);
    const link = ctx.obj({
      Type: PDFName.of("Annot"),
      Subtype: PDFName.of("Link"),
      Rect: ctx.obj([x, y, x + w, y + h]),
      Border: ctx.obj([0, 0, 1]),
      A: actionRef,
    });
    const linkRef = ctx.register(link);
    let annots = page.node.lookup(PDFName.of("Annots"), PDFArray);
    if (!annots) {
      annots = ctx.obj([]);
      page.node.set(PDFName.of("Annots"), annots);
    }
    annots.push(linkRef);

    // Visual helper box + label.
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      borderWidth: 1,
      opacity: 0.1,
    });
    page.drawText(url.slice(0, 80), { x: x + 4, y: y + h / 2 - 5, size: 10 });
    await reloadFromPdfLib();
  } catch (err) {
    alert(`Failed to add link annotation: ${err.message}`);
  }
}

async function addFormFieldPrompt() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const type = (prompt("Form field type: text / checkbox / radio / dropdown / signature", "text") || "text").trim().toLowerCase();
  const name = (prompt("Field name", `field_${Date.now()}`) || "").trim();
  if (!name) return;
  const pageNum = Number(prompt("Target page number", String(state.currentPage)));
  if (!Number.isFinite(pageNum) || pageNum < 1 || pageNum > state.totalPages) return alert("Invalid page.");
  const x = Number(prompt("X (pt)", "60"));
  const yTop = Number(prompt("Y from top (pt)", "120"));
  const w = Number(prompt("Width (pt)", "180"));
  const h = Number(prompt("Height (pt)", "24"));
  if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n > 0)) return alert("Invalid geometry.");

  const page = state.pdfLib.getPage(pageNum - 1);
  const s = page.getSize();
  const y = s.height - yTop - h;
  const form = state.pdfLib.getForm();
  if (type === "checkbox") {
    const cb = form.createCheckBox(name);
    cb.addToPage(page, { x, y, width: w, height: h });
  } else if (type === "radio") {
    const opts = (prompt("Radio options (comma separated)", "A,B,C") || "A,B,C")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    if (!opts.length) return alert("No radio options.");
    const rg = form.createRadioGroup(name);
    const eachH = Math.max(14, Math.floor(h / opts.length));
    opts.forEach((opt, i) => {
      rg.addOptionToPage(opt, page, { x, y: y + (opts.length - 1 - i) * eachH, width: 12, height: 12 });
      page.drawText(opt, { x: x + 18, y: y + (opts.length - 1 - i) * eachH + 1, size: 10 });
    });
  } else if (type === "dropdown") {
    const opts = (prompt("Dropdown options (comma separated)", "Option1,Option2") || "Option1,Option2")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    if (!opts.length) return alert("No dropdown options.");
    const dd = form.createDropdown(name);
    dd.setOptions(opts);
    dd.select(opts[0]);
    dd.addToPage(page, { x, y, width: w, height: h });
  } else if (type === "signature") {
    const tf = form.createTextField(name);
    tf.setText("");
    tf.addToPage(page, { x, y, width: w, height: h });
    page.drawText("Sign here", { x: x + 4, y: y + h / 2 - 4, size: 9, color: PDFLib.rgb(0.35, 0.35, 0.35) });
  } else {
    const tf = form.createTextField(name);
    tf.setText("");
    tf.addToPage(page, { x, y, width: w, height: h });
  }
  await reloadFromPdfLib();
}

async function fillFormPrompt() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const form = state.pdfLib.getForm();
  const fields = form.getFields();
  if (!fields.length) return alert("No form fields.");
  const hint = fields.map((f) => `${f.getName()}=`).join("\n");
  const input = prompt("Fill fields using key=value per line\nCheckbox: true/false", hint);
  if (input == null) return;
  const kv = {};
  input
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .forEach((line) => {
      const i = line.indexOf("=");
      if (i < 0) return;
      kv[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    });
  fields.forEach((f) => {
    const name = f.getName();
    if (!(name in kv)) return;
    const value = kv[name];
    const typeName = f.constructor.name;
    if (typeName.includes("CheckBox")) {
      if (/^(1|true|yes|on)$/i.test(value)) f.check();
      else f.uncheck();
    } else if (typeName.includes("RadioGroup")) {
      f.select(value);
    } else if (typeName.includes("TextField")) {
      f.setText(value);
    } else if (typeName.includes("Dropdown") || typeName.includes("OptionList")) {
      f.select(value);
    }
  });
  await reloadFromPdfLib();
}

function exportFormDataFromFields(fields) {
  const out = {};
  fields.forEach((f) => {
    const name = f.getName();
    const typeName = f.constructor.name;
    try {
      if (typeName.includes("CheckBox")) out[name] = f.isChecked();
      else if (typeName.includes("RadioGroup")) out[name] = f.getSelected?.() ?? "";
      else if (typeof f.getText === "function") out[name] = f.getText();
      else out[name] = "(unsupported field type)";
    } catch {
      out[name] = "(read failed)";
    }
  });
  return out;
}

function exportFormDataJson() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const form = state.pdfLib.getForm();
  const fields = form.getFields();
  if (!fields.length) return alert("No form fields.");
  const out = exportFormDataFromFields(fields);
  const bytes = new TextEncoder().encode(JSON.stringify(out, null, 2));
  const blob = new Blob([bytes], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `form-data-${Date.now()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function exportFormDataCsv() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const form = state.pdfLib.getForm();
  const fields = form.getFields();
  if (!fields.length) return alert("No form fields.");
  const out = exportFormDataFromFields(fields);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = ["name,value"];
  Object.entries(out).forEach(([k, v]) => lines.push(`${esc(k)},${esc(v)}`));
  const blob = new Blob([new TextEncoder().encode(lines.join("\n"))], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `form-data-${Date.now()}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function exportFormDataXfdf() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const form = state.pdfLib.getForm();
  const fields = form.getFields();
  if (!fields.length) return alert("No form fields.");
  const out = exportFormDataFromFields(fields);
  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const body = Object.entries(out)
    .map(([k, v]) => `<field name="${esc(k)}"><value>${esc(v)}</value></field>`)
    .join("");
  const xfdf = `<?xml version="1.0" encoding="UTF-8"?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields>${body}</fields></xfdf>`;
  const blob = new Blob([new TextEncoder().encode(xfdf)], { type: "application/vnd.adobe.xfdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `form-data-${Date.now()}.xfdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function parseCsvFormData(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return {};
  const out = {};
  for (let i = 1; i < lines.length; i += 1) {
    const m = lines[i].match(/^"((?:[^"]|"")*)","((?:[^"]|"")*)"$/);
    if (!m) continue;
    const k = m[1].replace(/""/g, '"');
    const v = m[2].replace(/""/g, '"');
    out[k] = v;
  }
  return out;
}

function parseXfdfFormData(text) {
  const out = {};
  const re = /<field\s+name="([^"]+)">[\s\S]*?<value>([\s\S]*?)<\/value>[\s\S]*?<\/field>/gi;
  let m;
  while ((m = re.exec(text))) {
    out[m[1]] = m[2].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  }
  return out;
}

async function importFormDataPrompt() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.csv,.xfdf,application/json,text/csv,application/xml,text/xml";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    let kv = {};
    const lower = file.name.toLowerCase();
    try {
      if (lower.endsWith(".json")) kv = JSON.parse(text);
      else if (lower.endsWith(".csv")) kv = parseCsvFormData(text);
      else if (lower.endsWith(".xfdf") || lower.endsWith(".xml")) kv = parseXfdfFormData(text);
      else return alert("Unsupported form data format.");
    } catch (err) {
      return alert(`Import parse failed: ${err.message || err}`);
    }
    const form = state.pdfLib.getForm();
    const fields = form.getFields();
    fields.forEach((f) => {
      const name = f.getName();
      if (!(name in kv)) return;
      const value = kv[name];
      const typeName = f.constructor.name;
      try {
        if (typeName.includes("CheckBox")) {
          if (/^(1|true|yes|on)$/i.test(String(value))) f.check();
          else f.uncheck();
        } else if (typeName.includes("RadioGroup")) {
          f.select(String(value));
        } else if (typeName.includes("Dropdown") || typeName.includes("OptionList")) {
          f.select(String(value));
        } else if (typeName.includes("TextField")) {
          f.setText(String(value));
        }
      } catch {
        // Skip invalid values to keep import resilient.
      }
    });
    await reloadFromPdfLib();
  };
  input.click();
}

async function showXfaInfo() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  try {
    const bytes = await state.pdfLib.save();
    const probe = new TextDecoder("latin1").decode(bytes.slice(0, Math.min(bytes.length, 400000)));
    const hasXfa = /\/XFA\b/.test(probe);
    alert(hasXfa ? "XFA marker detected (limited support in browser editor)." : "No XFA marker detected.");
  } catch {
    alert("Unable to inspect XFA info.");
  }
}

async function compressDocumentPrompt() {
  if (!state.pdfjs) return alert("Open a PDF first.");
  const quality = Math.max(0.35, Math.min(0.98, Number(prompt("JPEG quality (0.35-0.98)", "0.75")) || 0.75));
  const scale = Math.max(0.4, Math.min(2, Number(prompt("Render scale (0.4-2.0)", "1.0")) || 1));
  const keepName = confirm("Keep original name? (Cancel => append -compressed)");
  if (!confirm("Compression rebuilds pages as images (text/search/form may be flattened). Continue?")) return;

  const doc = await PDFLib.PDFDocument.create();
  for (let p = 1; p <= state.totalPages; p += 1) {
    const page = await state.pdfjs.getPage(p);
    const vp = page.getViewport({ scale });
    const c = document.createElement("canvas");
    c.width = Math.ceil(vp.width);
    c.height = Math.ceil(vp.height);
    await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    const dataUrl = c.toDataURL("image/jpeg", quality);
    const jpgBytes = await (await fetch(dataUrl)).arrayBuffer();
    const jpg = await doc.embedJpg(jpgBytes);
    const dPage = doc.addPage([jpg.width, jpg.height]);
    dPage.drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height });
  }
  const out = await doc.save();
  const outName = keepName ? state.fileName : `${baseName(state.fileName)}-compressed.pdf`;
  await loadPdfBytes(new Uint8Array(out), outName);
  alert("Compression complete.");
}

async function applyBatesNumberingPrompt() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const prefix = prompt("Bates prefix", "DOC-") ?? "DOC-";
  const suffix = prompt("Bates suffix", "") ?? "";
  const start = Number(prompt("Start number", "1"));
  const digits = Number(prompt("Digits", "6"));
  const rangeInput = prompt("Page range (all or 1-3,5)", "all") || "all";
  const pos = (prompt("Position: tl/tr/bl/br", "br") || "br").toLowerCase();
  const pages = parseAnnotationRangeInput(rangeInput);
  if (!pages.length) return alert("No valid pages.");

  pages.forEach((pNum, i) => {
    const page = state.pdfLib.getPage(pNum - 1);
    const s = page.getSize();
    const num = String((Number.isFinite(start) ? start : 1) + i).padStart(Number.isFinite(digits) ? digits : 6, "0");
    const text = `${prefix}${num}${suffix}`;
    const m = 24;
    let x = s.width - m * 4;
    let y = m;
    if (pos === "tl") {
      x = m;
      y = s.height - m;
    } else if (pos === "tr") {
      x = s.width - m * 4;
      y = s.height - m;
    } else if (pos === "bl") {
      x = m;
      y = m;
    }
    page.drawText(text, { x, y, size: 10 });
  });
  await reloadFromPdfLib();
}

async function flattenAnnotationsToPdf() {
  if (!state.pdfLib) return alert("Open a PDF first.");
  const count = Object.values(state.annotations).reduce((s, a) => s + a.length, 0);
  if (!count) return alert("No annotations to flatten.");
  if (!confirm(`Flatten ${count} annotation(s) into PDF content?`)) return;
  Object.entries(state.annotations).forEach(([pageStr, anns]) => {
    const pNum = Number(pageStr);
    const page = state.pdfLib.getPage(pNum - 1);
    anns.forEach((a) => {
      if (a.type === "h") {
        page.drawRectangle({
          x: a.x,
          y: page.getSize().height - a.y - a.h,
          width: a.w,
          height: a.h,
          opacity: 0.35,
        });
      } else if (a.type === "rd") {
        page.drawRectangle({
          x: a.x,
          y: page.getSize().height - a.y - a.h,
          width: a.w,
          height: a.h,
          color: PDFLib.rgb(0, 0, 0),
        });
      } else if (a.type === "t") {
        page.drawText(a.text || "", {
          x: a.x,
          y: page.getSize().height - a.y - 14,
          size: 12,
        });
      } else if (a.type === "r" || a.type === "e") {
        page.drawRectangle({
          x: a.x,
          y: page.getSize().height - a.y - a.h,
          width: a.w,
          height: a.h,
          borderWidth: a.width || 2,
          borderColor: parseRgbColor(a.color, 1, 0.8, 0.2),
          color: undefined,
          borderOpacity: 1,
        });
      } else if (a.type === "l" || a.type === "a") {
        page.drawLine({
          start: { x: a.x1, y: page.getSize().height - a.y1 },
          end: { x: a.x2, y: page.getSize().height - a.y2 },
          thickness: a.width || 2,
          color: parseRgbColor(a.color, 1, 0.8, 0.2),
        });
      } else if (a.type === "n" || a.type === "s") {
        page.drawRectangle({
          x: a.x,
          y: page.getSize().height - a.y - (a.h || 64),
          width: a.w || 120,
          height: a.h || 64,
          color: a.type === "n" ? parseRgbColor(a.color, 1, 0.96, 0.66) : PDFLib.rgb(1, 1, 1),
          borderWidth: a.type === "s" ? a.width || 2 : 1,
          borderColor: parseRgbColor(a.color, 0.5, 0.2, 0.2),
        });
        page.drawText(a.text || "", {
          x: (a.x || 0) + 4,
          y: page.getSize().height - (a.y || 0) - 18,
          size: 10,
          color: parseRgbColor(a.color, 0.3, 0.3, 0.3),
        });
      }
    });
  });
  state.annotations = {};
  state.selectedAnnotationId = null;
  state.selectedAnnotationIds = [];
  await reloadFromPdfLib();
}

function parseRgbColor(color, dr, dg, db) {
  const s = String(color || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(s)) {
    const r = parseInt(s.slice(1, 3), 16) / 255;
    const g = parseInt(s.slice(3, 5), 16) / 255;
    const b = parseInt(s.slice(5, 7), 16) / 255;
    return PDFLib.rgb(r, g, b);
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (!m) return PDFLib.rgb(dr, dg, db);
  const p = m[1].split(",").map((x) => Number(x.trim()));
  const r = Number.isFinite(p[0]) ? Math.max(0, Math.min(255, p[0])) / 255 : dr;
  const g = Number.isFinite(p[1]) ? Math.max(0, Math.min(255, p[1])) / 255 : dg;
  const b = Number.isFinite(p[2]) ? Math.max(0, Math.min(255, p[2])) / 255 : db;
  return PDFLib.rgb(r, g, b);
}

async function applyRedactionsToPdf() {
  if (!state.pdfLib) return alert("Open a writable PDF first.");
  const marks = Object.values(state.annotations).flat().filter((a) => a.type === "rd");
  if (!marks.length) return alert("No redaction marks.");
  if (!confirm(`Apply ${marks.length} redaction mark(s) permanently?`)) return;
  Object.entries(state.annotations).forEach(([pageStr, anns]) => {
    const page = state.pdfLib.getPage(Number(pageStr) - 1);
    anns
      .filter((a) => a.type === "rd")
      .forEach((a) => {
        page.drawRectangle({
          x: a.x,
          y: page.getSize().height - a.y - a.h,
          width: a.w,
          height: a.h,
          color: PDFLib.rgb(0, 0, 0),
        });
      });
  });
  Object.keys(state.annotations).forEach((p) => {
    state.annotations[p] = (state.annotations[p] || []).filter((a) => a.type !== "rd");
  });
  state.selectedAnnotationId = null;
  state.selectedAnnotationIds = [];
  await reloadFromPdfLib();
}

function renderConvertWizard() {
  $("wt").textContent = "轉換精靈";
  if (state.wizardStep === 1) {
    $("wb").innerHTML = `
      <div class="fg">
        <label>模式
          <select id="cvMode">
            <option value="pdf-to-images">PDF -> 圖片 (PNG)</option>
            <option value="images-to-pdf">圖片 -> PDF</option>
            <option value="office-to-pdf-cli">Office -> PDF（CLI 計畫）</option>
            <option value="pdf-to-text-cli">PDF -> 文字（CLI 計畫）</option>
            <option value="pdf-ocr-cli">PDF OCR -> 可搜尋 PDF（CLI 計畫）</option>
            <option value="compare-cli">PDF 比對（CLI 計畫）</option>
          </select>
        </label>
        <label>縮放 / DPI 倍率
          <input id="cvScale" type="number" step="0.1" min="0.5" max="5" value="2">
        </label>
      </div>`;
    $("wn").textContent = "下一步";
    return;
  }
  if (state.wizardStep === 2) {
    $("wb").innerHTML = `
      <div class="fg">
        <label>影像格式
          <select id="cvQuality">
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
          </select>
        </label>
        <label>圖片轉 PDF
          <button id="cvPickImages">選擇圖片</button>
        </label>
        <label>CLI 輸出目錄
          <input id="cvCliOut" value="./out">
        </label>
        <label>CLI 輸入 #2（比對模式）
          <input id="cvCliInput2" value="new.pdf">
        </label>
        <label>OCR 語言
          <input id="cvOcrLang" value="eng">
        </label>
      </div>
      <div id="cvImgList" class="note" style="margin-top:10px">尚未選擇圖片</div>`;
    $("cvPickImages").addEventListener("click", () => $("imgIn").click());
    $("imgIn").onchange = () => {
      window.__convertImages = [...$("imgIn").files];
      const box = $("cvImgList");
      if (!window.__convertImages.length) {
        box.className = "note";
        box.textContent = "尚未選擇圖片";
        return;
      }
      box.className = "";
      box.innerHTML = window.__convertImages.map((f, i) => `<div class='thumb'>${i + 1}. ${f.name}</div>`).join("");
    };
    $("wn").textContent = "下一步";
    return;
  }
  $("wb").innerHTML = "<div class='note'>已準備執行轉換。</div>";
  $("wn").textContent = "執行";
}

async function runConvertWizard() {
  const cc = window.__convertConfig || {};
  const mode = $("cvMode")?.value || window.__convertMode || "pdf-to-images";
  const scale = Math.max(0.5, Math.min(5, Number($("cvScale")?.value || window.__convertScale || 2)));
  const quality = $("cvQuality")?.value || cc.quality || "png";
  const cliOut = ($("cvCliOut")?.value || cc.cliOut || "./out").trim() || "./out";
  const cliInput2 = ($("cvCliInput2")?.value || cc.cliInput2 || "new.pdf").trim() || "new.pdf";
  const cliLang = ($("cvOcrLang")?.value || cc.cliLang || "eng").trim() || "eng";
  if (mode === "pdf-to-images") {
    if (!state.pdfjs) return alert("請先開啟 PDF。");
    for (let p = 1; p <= state.totalPages; p += 1) {
      const page = await state.pdfjs.getPage(p);
      const vp = page.getViewport({ scale });
      const c = document.createElement("canvas");
      c.width = Math.ceil(vp.width);
      c.height = Math.ceil(vp.height);
      await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
      const mime = quality === "jpg" ? "image/jpeg" : "image/png";
      const dataUrl = c.toDataURL(mime, 0.92);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${baseName(state.fileName)}-p${String(p).padStart(3, "0")}.${quality === "jpg" ? "jpg" : "png"}`;
      a.click();
    }
    closeWizard();
    alert(`已匯出 ${state.totalPages} 張圖片。`);
    return;
  }
  if (mode.endsWith("-cli")) {
    const fileA = state.fileName || "input.pdf";
    const lines = [
      "$ErrorActionPreference='Stop'",
      "$root = Split-Path -Parent $MyInvocation.MyCommand.Path",
      "$tool = Join-Path $root 'cli\\pdf_toolkit.ps1'",
      `New-Item -ItemType Directory -Path ${psQuote(cliOut)} -Force | Out-Null`,
      "",
    ];
    if (mode === "office-to-pdf-cli") {
      lines.push(`# Replace input path with your Office file path`);
      lines.push(`& powershell -ExecutionPolicy Bypass -File $tool -Action office2pdf -Input ${psQuote("input.docx")} -OutDir ${psQuote(cliOut)}`);
    } else if (mode === "pdf-to-text-cli") {
      lines.push(`& powershell -ExecutionPolicy Bypass -File $tool -Action pdf2text -Input ${psQuote(fileA)} -Output ${psQuote(`${cliOut}/${baseName(fileA)}.txt`)}`);
    } else if (mode === "pdf-ocr-cli") {
      lines.push(`& powershell -ExecutionPolicy Bypass -File $tool -Action ocr -Input ${psQuote(fileA)} -Output ${psQuote(`${cliOut}/${baseName(fileA)}.ocr.pdf`)} -Lang ${psQuote(cliLang)}`);
    } else if (mode === "compare-cli") {
      lines.push(`& powershell -ExecutionPolicy Bypass -File $tool -Action compare -Input ${psQuote(fileA)} -Input2 ${psQuote(cliInput2)} -OutDir ${psQuote(cliOut)}`);
    }
    downloadBytes(new TextEncoder().encode(`${lines.join("\n")}\n`), `convert-${Date.now()}.ps1`, "text/plain");
    closeWizard();
    alert("已產生 CLI 轉換計畫腳本。");
    return;
  }
  const images = window.__convertImages || [];
  if (!images.length) return alert("尚未選擇圖片。");
  const doc = await PDFLib.PDFDocument.create();
  for (const f of images) {
    const bytes = new Uint8Array(await f.arrayBuffer());
    const lower = f.name.toLowerCase();
    let embedded;
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) embedded = await doc.embedJpg(bytes);
    else embedded = await doc.embedPng(bytes);
    const page = doc.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
  }
  const out = await doc.save();
  downloadBytes(out, `images-${Date.now()}.pdf`);
  closeWizard();
}

function renderSplitWizard() {
  $("wt").textContent = "拆分精靈";
  if (state.wizardStep === 1) {
    $("wb").innerHTML = `
      <div class="fg">
        <label>模式
          <select id="sm">
            <option value="every">每 N 頁拆分</option>
            <option value="range">指定範圍（例 1-3,5-8）</option>
            <option value="bookmark">依書籤拆分</option>
          </select>
        </label>
        <label>N 頁
          <input id="sn" type="number" min="1" value="1">
        </label>
      </div>`;
    $("wn").textContent = "下一步";
    return;
  }
  if (state.wizardStep === 2) {
    $("wb").innerHTML = `
      <div class="fg">
        <label>檔名前綴
          <input id="sp" value="${safeAttr(baseName(state.fileName))}">
        </label>
        <label>流水號起始
          <input id="ss" type="number" min="0" value="1">
        </label>
        <label>流水號位數
          <input id="sd" type="number" min="1" max="8" value="3">
        </label>
        <label>流水號遞增
          <input id="stp" type="number" min="1" value="1">
        </label>
        <label>下載模式
          <select id="dm">
            <option value="multi">多檔下載</option>
            <option value="single">單一壓縮包</option>
          </select>
        </label>
        <label>範圍表達式
          <input id="sr" placeholder="1-3,5-8">
        </label>
      </div>`;
    $("wn").textContent = "下一步";
    return;
  }
  $("wb").innerHTML = "<div class='note'>準備拆分。命名規則：{prefix}-{serial}.pdf</div>";
  $("wn").textContent = "執行";
}

async function runSplitWizard() {
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const mode = $("sm")?.value || "every";
  const prefix = ($("sp")?.value || "").trim() || baseName(state.fileName);
  const start = parseInt($("ss")?.value || "1", 10);
  const digits = parseInt($("sd")?.value || "3", 10);
  const step = parseInt($("stp")?.value || "1", 10);
  const n = Math.max(1, parseInt($("sn")?.value || "1", 10));
  const expr = ($("sr")?.value || "").trim();
  const downloadMode = $("dm")?.value || "multi";

  let groups = [];
  let bookmarkNames = [];
  if (mode === "range" && expr) {
    const indices = parseRange(expr, state.totalPages);
    if (!indices.length) return alert("Invalid range expression.");
    groups = [indices];
  } else if (mode === "bookmark") {
    const entries = await getOutlineSplitEntries();
    if (!entries.length) return alert("No bookmark destinations found.");
    groups = entries.map((e) => e.indices);
    bookmarkNames = entries.map((e) => e.title);
  } else {
    for (let i = 0; i < state.totalPages; i += n) {
      const g = [];
      for (let j = i; j < Math.min(i + n, state.totalPages); j += 1) g.push(j);
      groups.push(g);
    }
  }

  let serial = start;
  const outputs = [];
  for (const g of groups) {
    const out = await PDFLib.PDFDocument.create();
    const copied = await out.copyPages(state.pdfLib, g);
    copied.forEach((p) => out.addPage(p));
    const bytes = await out.save();
    const titlePart = bookmarkNames.length ? `-${sanitizeFileNamePart(bookmarkNames[outputs.length] || "")}` : "";
    const name = `${prefix}-${String(serial).padStart(digits, "0")}${titlePart}.pdf`;
    outputs.push({ name, bytes });
    serial += step;
  }
  if (downloadMode === "single") {
    if (typeof JSZip === "undefined") {
      alert("ZIP library not found. Falling back to multi-file download.");
      outputs.forEach((f) => downloadBytes(f.bytes, f.name));
    } else {
      const zip = new JSZip();
      outputs.forEach((f) => zip.file(f.name, f.bytes));
      const pack = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
      downloadBytes(pack, `${prefix}-split.zip`);
    }
  } else {
    outputs.forEach((f) => downloadBytes(f.bytes, f.name));
  }
  closeWizard();
  alert(`拆分完成：${groups.length} 個檔案。`);
}

function sanitizeFileNamePart(name) {
  const s = String(name || "").trim().replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "-");
  return s.slice(0, 36) || "part";
}

async function getOutlineSplitEntries() {
  if (!state.pdfjs) return [];
  const outline = await state.pdfjs.getOutline();
  if (!outline?.length) return [];
  const starts = [];
  const walk = async (items, depth = 0) => {
    for (const item of items) {
      let dest = item.dest;
      if (typeof dest === "string") dest = await state.pdfjs.getDestination(dest);
      if (dest?.[0]) {
        const pageIndex = await state.pdfjs.getPageIndex(dest[0]);
        starts.push({ page: pageIndex + 1, title: item.title || `Bookmark ${starts.length + 1}`, depth });
      }
      if (item.items?.length) await walk(item.items, depth + 1);
    }
  };
  await walk(outline, 0);
  if (!starts.length) return [];

  // Prefer top-level bookmarks for split boundaries; fallback to all levels.
  const source = starts.some((x) => x.depth === 0) ? starts.filter((x) => x.depth === 0) : starts;
  const sorted = source
    .filter((x) => x.page >= 1 && x.page <= state.totalPages)
    .sort((a, b) => a.page - b.page);
  const unique = [];
  const seen = new Set();
  sorted.forEach((x) => {
    if (seen.has(x.page)) return;
    seen.add(x.page);
    unique.push(x);
  });
  if (!unique.length) return [];

  const out = [];
  for (let i = 0; i < unique.length; i += 1) {
    const start = unique[i].page;
    const end = i + 1 < unique.length ? unique[i + 1].page - 1 : state.totalPages;
    if (end < start) continue;
    const indices = [];
    for (let p = start; p <= end; p += 1) indices.push(p - 1);
    out.push({ title: unique[i].title, indices });
  }
  return out;
}

function renderMergeWizard() {
  $("wt").textContent = "合併精靈";
  if (!window.__mergeItems) window.__mergeItems = [];
  if (!window.__mergeCurrentRange) window.__mergeCurrentRange = "all";
  if (state.wizardStep === 1) {
    const includeCurrent = (window.__mergeIncludeCurrent ?? "yes") !== "no";
    syncCurrentMergeItem(includeCurrent);
    $("wb").innerHTML = `
      <div class="fg">
        <label>Input files
          <button id="pm">Add PDF files</button>
        </label>
        <label>Input files
          <button id="pmClear">Clear file list</button>
        </label>
        <label>Include current document
          <select id="mic" value="${includeCurrent ? "yes" : "no"}">
            <option value="yes"${includeCurrent ? " selected" : ""}>Yes</option>
            <option value="no"${includeCurrent ? "" : " selected"}>No</option>
          </select>
        </label>
        <label>Current doc range
          <input id="mcr" value="${safeAttr(window.__mergeCurrentRange || "all")}" placeholder="all or 1-3,5">
        </label>
      </div>
      <div id="ml" class="note" style="margin-top:10px">尚未選擇檔案</div>`;
    $("pm").addEventListener("click", () => $("mergeIn").click());
    $("pmClear").addEventListener("click", () => {
      window.__mergeItems = (window.__mergeItems || []).filter((x) => x.kind !== "file");
      syncCurrentMergeItem(($("mic")?.value || "yes") !== "no");
      renderMergeStep1List();
    });
    $("mic").addEventListener("change", () => {
      window.__mergeIncludeCurrent = $("mic").value;
      syncCurrentMergeItem(($("mic").value || "yes") !== "no");
      renderMergeStep1List();
    });
    $("mcr").addEventListener("input", () => {
      window.__mergeCurrentRange = $("mcr").value.trim() || "all";
      const curr = (window.__mergeItems || []).find((x) => x.kind === "current");
      if (curr) curr.range = window.__mergeCurrentRange;
    });
    $("mergeIn").onchange = async () => {
      await appendMergeFiles([...( $("mergeIn").files || [])]);
      $("mergeIn").value = "";
      renderMergeStep1List();
    };
    renderMergeStep1List();
    $("wn").textContent = "下一步";
    return;
  }
  if (state.wizardStep === 2) {
    const rows = (window.__mergeItems || [])
      .map(
        (f, i) => `<li draggable="true" data-i="${i}" style="border:1px solid var(--l);border-radius:8px;padding:8px;background:#253040">
          <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
            <div style="text-align:left">
              <div><strong>${f.kind === "current" ? "[目前文件]" : "[檔案]"} ${f.name}</strong></div>
              <div class="mut">${Number.isFinite(f.totalPages) ? `${f.totalPages} 頁` : "頁數未知"}</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center">
              <input data-range="${safeAttr(f.id)}" value="${safeAttr(f.range || "all")}" placeholder="all or 1-3,5" style="min-width:140px">
              <select data-preset="${safeAttr(f.id)}">
                <option value="">預設</option>
                <option value="all">全部</option>
                <option value="odd">奇數頁</option>
                <option value="even">偶數頁</option>
              </select>
              ${f.kind === "file" ? `<button data-del="${safeAttr(f.id)}">移除</button>` : ""}
            </div>
          </div>
        </li>`,
      )
      .join("");
    $("wb").innerHTML = `<p class='note'>可拖曳排序，每列可設定頁碼範圍。</p><ul id='mo' style='display:grid;gap:8px;padding-left:18px'>${rows || "<li>沒有檔案</li>"}</ul>`;
    bindMergeRangeInputs();
    bindMergeRangePresets();
    bindMergeRowDelete();
    bindMergeSort();
    $("wn").textContent = "下一步";
    return;
  }
  const itemCount = (window.__mergeItems || []).length;
  const defaultName = `merged-${Date.now()}.pdf`;
  $("wb").innerHTML = `
    <div class='fg'>
      <label>輸出檔名
        <input id="mOutName" value="${safeAttr(defaultName)}">
      </label>
      <label>合併後
        <select id="mAfter">
          <option value="open">在應用程式中開啟</option>
          <option value="download">僅下載</option>
        </select>
      </label>
      <label>摘要
        <div class="note">準備合併 ${itemCount} 個來源項目。</div>
      </label>
    </div>`;
  $("wn").textContent = "執行";
}

function bindMergeSort() {
  const list = $("mo");
  if (!list) return;
  let dragIndex = -1;
  list.querySelectorAll("li[data-i]").forEach((li) => {
    li.ondragstart = () => {
      dragIndex = Number(li.dataset.i);
    };
    li.ondragover = (e) => e.preventDefault();
    li.ondrop = () => {
      const targetIndex = Number(li.dataset.i);
      if (dragIndex < 0 || targetIndex < 0 || dragIndex === targetIndex) return;
      const arr = window.__mergeItems || [];
      const [item] = arr.splice(dragIndex, 1);
      arr.splice(targetIndex, 0, item);
      window.__mergeItems = arr;
      renderWizard();
    };
  });
}

function bindMergeRangeInputs() {
  document.querySelectorAll("input[data-range]").forEach((inp) => {
    inp.addEventListener("input", () => {
      const id = inp.getAttribute("data-range");
      const item = (window.__mergeItems || []).find((x) => x.id === id);
      if (item) item.range = inp.value.trim() || "all";
    });
  });
}

function bindMergeRangePresets() {
  document.querySelectorAll("select[data-preset]").forEach((sel) => {
    sel.addEventListener("change", () => {
      const id = sel.getAttribute("data-preset");
      const item = (window.__mergeItems || []).find((x) => x.id === id);
      if (!item) return;
      if (sel.value === "all") item.range = "all";
      else if (sel.value === "odd") item.range = "1-999999, odd";
      else if (sel.value === "even") item.range = "2-999999, even";
      else return;
      const input = document.querySelector(`input[data-range="${CSS.escape(id)}"]`);
      if (!input) return;
      input.value = item.range;
      // Normalize odd/even pseudo presets into explicit ranges based on known page count.
      if (sel.value === "odd" || sel.value === "even") {
        input.value = buildOddEvenRange(item.totalPages || 0, sel.value === "odd");
        item.range = input.value || "all";
      }
    });
  });
}

function buildOddEvenRange(total, odd) {
  if (!Number.isFinite(total) || total < 1) return "all";
  const pages = [];
  for (let p = odd ? 1 : 2; p <= total; p += 2) pages.push(p);
  return pages.join(",");
}

function bindMergeRowDelete() {
  document.querySelectorAll("button[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-del");
      window.__mergeItems = (window.__mergeItems || []).filter((x) => x.id !== id);
      renderWizard();
    });
  });
}

function syncCurrentMergeItem(includeCurrent) {
  if (!window.__mergeItems) window.__mergeItems = [];
  window.__mergeItems = window.__mergeItems.filter((x) => x.kind !== "current");
  if (!includeCurrent || !state.pdfLib) return;
  window.__mergeItems.unshift({
    id: "current-doc",
    kind: "current",
    name: state.fileName || "Current document",
    totalPages: state.totalPages || (state.pdfLib ? state.pdfLib.getPageCount() : null),
    range: window.__mergeCurrentRange || "all",
  });
}

async function getFilePageCount(file) {
  try {
    const doc = await PDFLib.PDFDocument.load(await readAndNormalizePdfFile(file), { ignoreEncryption: true });
    return doc.getPageCount();
  } catch {
    return null;
  }
}

async function appendMergeFiles(files) {
  if (!window.__mergeItems) window.__mergeItems = [];
  const items = window.__mergeItems;
  for (const file of files) {
    const sig = `${file.name}|${file.size}|${file.lastModified}`;
    if (items.some((x) => x.kind === "file" && x.sig === sig)) continue;
    const totalPages = await getFilePageCount(file);
    items.push({
      id: genId(),
      kind: "file",
      sig,
      name: file.name,
      file,
      totalPages,
      range: "all",
    });
  }
}

function renderMergeStep1List() {
  const box = $("ml");
  if (!box) return;
  const arr = (window.__mergeItems || []).filter((x) => x.kind === "file");
  if (!arr.length) {
    box.className = "note";
    box.textContent = "尚未選擇外部檔案";
    return;
  }
  box.className = "";
  box.innerHTML = arr
    .map((f, i) => `<div class='thumb'>${i + 1}. ${f.name}${Number.isFinite(f.totalPages) ? ` (${f.totalPages}p)` : ""}</div>`)
    .join("");
}

async function runMergeWizard() {
  const items = window.__mergeItems || [];
  if (!items.length) return alert("沒有可合併的輸入項目。");
  const merged = await PDFLib.PDFDocument.create();
  const invalid = [];
  const outputName = (($("mOutName")?.value || "").trim() || `merged-${Date.now()}.pdf`).replace(/[\\/:*?"<>|]/g, "_");
  const after = $("mAfter")?.value || "open";

  for (const src of items) {
    let doc = null;
    let total = 0;
    if (src.kind === "current") {
      if (!state.pdfLib) continue;
      doc = state.pdfLib;
      total = doc.getPageCount();
    } else {
      doc = await PDFLib.PDFDocument.load(await readAndNormalizePdfFile(src.file), { ignoreEncryption: true });
      total = doc.getPageCount();
    }
    const expr = (src.range || "all").trim().toLowerCase();
    const idx = !expr || expr === "all" ? Array.from({ length: total }, (_, i) => i) : parseRange(expr, total);
    if (!idx.length) {
      invalid.push(`${src.name}: "${src.range}"`);
      continue;
    }
    const copied = await merged.copyPages(doc, idx);
    copied.forEach((p) => merged.addPage(p));
  }
  if (invalid.length) {
    alert(`已略過 ${invalid.length} 個範圍無效/空白的項目：\n${invalid.join("\n")}`);
  }
  if (!merged.getPageCount()) return alert("沒有可合併的頁面。");

  const bytes = await merged.save();
  if (after === "download") {
    downloadBytes(bytes, outputName.endsWith(".pdf") ? outputName : `${outputName}.pdf`);
  } else {
    await loadPdfBytes(new Uint8Array(bytes), outputName.endsWith(".pdf") ? outputName : `${outputName}.pdf`);
  }
  closeWizard();
}

function renderBatchWizard() {
  $("wt").textContent = "批次精靈";
  if (state.wizardStep === 1) {
    $("wb").innerHTML = `
      <div class="fg">
        <label>操作
          <select id="bo">
            <option value="watermark">批次浮水印</option>
            <option value="rotate">批次旋轉</option>
            <option value="delete-range">批次刪除頁碼範圍</option>
            <option value="page-numbers">批次頁碼</option>
            <option value="bates">批次 Bates 編號</option>
            <option value="header-footer">批次頁首頁尾</option>
            <option value="metadata">批次中繼資料</option>
            <option value="flatten-form">批次表單扁平化</option>
            <option value="crop-margins">批次頁邊裁切</option>
            <option value="redact-pages">批次頁面遮蔽</option>
            <option value="cli-encrypt">CLI 計畫：批次加密</option>
            <option value="cli-permissions">CLI 計畫：批次權限</option>
            <option value="cli-pdf2text">CLI 計畫：批次 PDF 轉文字</option>
            <option value="cli-ocr">CLI 計畫：批次 OCR PDF</option>
          </select>
        </label>
        <label>輸入檔案
          <button id="pb">選擇 PDF 檔案</button>
        </label>
      </div>
      <div id="bl" class="note" style="margin-top:10px">尚未選擇檔案</div>`;
    $("pb").addEventListener("click", () => $("batchIn").click());
    $("batchIn").onchange = () => {
      window.__batchFiles = [...$("batchIn").files];
      const box = $("bl");
      if (!window.__batchFiles.length) {
        box.className = "note";
        box.textContent = "尚未選擇檔案";
        return;
      }
      box.className = "";
      box.innerHTML = window.__batchFiles.map((f, i) => `<div class='thumb'>${i + 1}. ${f.name}</div>`).join("");
    };
    $("wn").textContent = "下一步";
    return;
  }
  if (state.wizardStep === 2) {
    $("wb").innerHTML = `
      <div class="fg">
        <label>輸出前綴
          <input id="bp" value="batch">
        </label>
        <label>浮水印文字
          <input id="bw" value="CONFIDENTIAL">
        </label>
        <label>刪除範圍
          <input id="br" placeholder="e.g. 2,4-6">
        </label>
        <label>旋轉角度
          <select id="ba">
            <option value="90">90</option>
            <option value="180">180</option>
            <option value="270">270</option>
          </select>
        </label>
        <label>頁碼起始
          <input id="bpnStart" type="number" value="1">
        </label>
        <label>頁碼位置
          <select id="bpnPos">
            <option value="rb">right-bottom</option>
            <option value="lb">left-bottom</option>
            <option value="rt">right-top</option>
            <option value="lt">left-top</option>
          </select>
        </label>
        <label>頁碼字體大小
          <input id="bpnSize" type="number" min="6" value="10">
        </label>
        <label>Bates 前綴
          <input id="bbPrefix" value="DOC-">
        </label>
        <label>Bates 起始
          <input id="bbStart" type="number" min="0" value="1">
        </label>
        <label>Bates 位數
          <input id="bbDigits" type="number" min="1" max="12" value="6">
        </label>
        <label>Bates 後綴
          <input id="bbSuffix" value="">
        </label>
        <label>下載模式
          <select id="bdm">
            <option value="multi">多檔下載</option>
            <option value="single">單一 ZIP</option>
          </select>
        </label>
        <label>頁首模板
          <input id="bh" value="">
        </label>
        <label>頁尾模板
          <input id="bf" value="Page {page}/{total}">
        </label>
        <label>頁首頁尾字體大小
          <input id="bhfs" type="number" min="6" value="10">
        </label>
        <label>中繼資料標題
          <input id="bmt" value="">
        </label>
        <label>中繼資料作者
          <input id="bma" value="">
        </label>
        <label>中繼資料主題
          <input id="bmsu" value="">
        </label>
        <label>中繼資料關鍵字（逗號分隔）
          <input id="bmkw" value="">
        </label>
        <label>裁切 上/右/下/左（pt）
          <input id="bcrop" value="20,20,20,20">
        </label>
        <label>裁切頁碼範圍（每檔）
          <input id="bcropRange" value="all">
        </label>
        <label>報表
          <select id="breport">
            <option value="yes">下載 JSON 報表</option>
            <option value="no">不下載</option>
          </select>
        </label>
        <label>CLI 輸出目錄
          <input id="bCliOutDir" value="./out">
        </label>
        <label>CLI 使用者密碼
          <input id="bCliUser" value="user1234">
        </label>
        <label>CLI 擁有者密碼
          <input id="bCliOwner" value="owner1234">
        </label>
        <label>CLI 允許權限（permissions 模式）
          <select id="bCliAllow">
            <option value="none">none</option>
            <option value="print">print</option>
            <option value="annotate">annotate</option>
            <option value="form">form</option>
            <option value="extract">extract</option>
            <option value="all">all</option>
          </select>
        </label>
        <label>CLI OCR 語言
          <input id="bCliLang" value="eng">
        </label>
      </div>`;
    $("wn").textContent = "下一步";
    return;
  }
  $("wb").innerHTML = "<div class='note'>準備執行批次操作。</div>";
  $("wn").textContent = "執行";
}

async function runBatchWizard() {
  const bc = window.__batchConfig || {};
  const op = $("bo")?.value || window.__batchOp || "watermark";
  const files = window.__batchFiles || [];
  if (!files.length) return alert("尚未選擇檔案。");
  const prefix = ($("bp")?.value || bc.prefix || "").trim() || "batch";
  const wm = $("bw")?.value || bc.wm || "CONFIDENTIAL";
  const delRange = ($("br")?.value || bc.delRange || "").trim();
  const angle = parseInt($("ba")?.value || bc.angle || "90", 10) || 90;
  const pnStart = parseInt($("bpnStart")?.value || bc.pnStart || "1", 10) || 1;
  const pnPos = $("bpnPos")?.value || bc.pnPos || "rb";
  const pnSize = Math.max(6, parseInt($("bpnSize")?.value || bc.pnSize || "10", 10) || 10);
  const bPrefix = $("bbPrefix")?.value ?? bc.bPrefix ?? "DOC-";
  const bStart = parseInt($("bbStart")?.value || bc.bStart || "1", 10) || 1;
  const bDigits = Math.max(1, parseInt($("bbDigits")?.value || bc.bDigits || "6", 10) || 6);
  const bSuffix = $("bbSuffix")?.value ?? bc.bSuffix ?? "";
  const downloadMode = $("bdm")?.value || bc.downloadMode || "multi";
  const headerTpl = $("bh")?.value ?? bc.headerTpl ?? "";
  const footerTpl = $("bf")?.value ?? bc.footerTpl ?? "";
  const hfSize = Math.max(6, parseInt($("bhfs")?.value || bc.hfSize || "10", 10) || 10);
  const metaTitle = $("bmt")?.value ?? bc.metaTitle ?? "";
  const metaAuthor = $("bma")?.value ?? bc.metaAuthor ?? "";
  const metaSubject = $("bmsu")?.value ?? bc.metaSubject ?? "";
  const metaKeywords = $("bmkw")?.value ?? bc.metaKeywords ?? "";
  const cropMarginsRaw = ($("bcrop")?.value || bc.cropMarginsRaw || "20,20,20,20").trim();
  const cropRangeRaw = ($("bcropRange")?.value || bc.cropRangeRaw || "all").trim();
  const wantReport = ($("breport")?.value || bc.wantReport || "yes") !== "no";
  const cliOutDir = ($("bCliOutDir")?.value || bc.cliOutDir || "./out").trim() || "./out";
  const cliUser = $("bCliUser")?.value || bc.cliUser || "user1234";
  const cliOwner = $("bCliOwner")?.value || bc.cliOwner || "owner1234";
  const cliAllow = $("bCliAllow")?.value || bc.cliAllow || "none";
  const cliLang = ($("bCliLang")?.value || bc.cliLang || "eng").trim() || "eng";
  const today = new Date().toISOString().slice(0, 10);

  if (op.startsWith("cli-")) {
    const script = buildBatchCliPlan({
      op,
      files,
      outDir: cliOutDir,
      userPassword: cliUser,
      ownerPassword: cliOwner,
      allow: cliAllow,
      ocrLang: cliLang,
    });
    downloadBytes(new TextEncoder().encode(script), `${prefix}-batch-cli.ps1`, "text/plain");
    const manifest = {
      ts: new Date().toISOString(),
      operation: op,
      outDir: cliOutDir,
      inputCount: files.length,
      inputs: files.map((f) => f.name),
      note: "Run generated script in project root where cli/pdf_toolkit.ps1 exists.",
    };
    if (wantReport) downloadBytes(new TextEncoder().encode(JSON.stringify(manifest, null, 2)), `${prefix}-batch-cli.json`, "application/json");
    closeWizard();
    alert(`已為 ${files.length} 個檔案產生 CLI 批次腳本。`);
    return;
  }

  let i = 1;
  let batesSerial = bStart;
  const outputs = [];
  const report = [];
  for (const file of files) {
    try {
      const doc = await PDFLib.PDFDocument.load(await readAndNormalizePdfFile(file), { ignoreEncryption: true });
      if (op === "rotate") {
        doc.getPages().forEach((p) => p.setRotation(PDFLib.degrees((p.getRotation().angle + angle) % 360)));
      } else if (op === "delete-range") {
        const total = doc.getPageCount();
        const idx = parseRange(delRange || "", total);
        if (idx.length && idx.length < total) {
          idx
            .slice()
            .sort((a, b) => b - a)
            .forEach((iPage) => doc.removePage(iPage));
        }
      } else if (op === "watermark") {
        doc.getPages().forEach((p) => {
          const s = p.getSize();
          p.drawText(wm, { x: s.width * 0.18, y: s.height * 0.48, size: 34, rotate: PDFLib.degrees(35), opacity: 0.18 });
        });
      } else if (op === "page-numbers") {
        let num = pnStart;
        doc.getPages().forEach((p) => {
          const s = p.getSize();
          let x = s.width - 56;
          let y = 18;
          if (pnPos === "lb") {
            x = 24;
            y = 18;
          } else if (pnPos === "rt") {
            x = s.width - 56;
            y = s.height - (pnSize + 10);
          } else if (pnPos === "lt") {
            x = 24;
            y = s.height - (pnSize + 10);
          }
          p.drawText(String(num), { x, y, size: pnSize, color: PDFLib.rgb(0.12, 0.12, 0.12) });
          num += 1;
        });
      } else if (op === "bates") {
        doc.getPages().forEach((p) => {
          const s = p.getSize();
          const tag = `${bPrefix}${String(batesSerial).padStart(bDigits, "0")}${bSuffix}`;
          p.drawText(tag, { x: s.width - 150, y: 16, size: 10, color: PDFLib.rgb(0.15, 0.15, 0.15) });
          batesSerial += 1;
        });
      } else if (op === "header-footer") {
        const total = doc.getPageCount();
        doc.getPages().forEach((p, idx) => {
          const s = p.getSize();
          const vars = {
            page: String(idx + 1),
            total: String(total),
            date: today,
            file: file.name,
          };
          const fill = (tpl) =>
            String(tpl || "").replace(/\{(page|total|date|file)\}/g, (_, k) => vars[k] || "");
          const header = fill(headerTpl);
          const footer = fill(footerTpl);
          if (header) p.drawText(header, { x: 24, y: s.height - (hfSize + 8), size: hfSize, color: PDFLib.rgb(0.2, 0.2, 0.2) });
          if (footer) p.drawText(footer, { x: 24, y: 14, size: hfSize, color: PDFLib.rgb(0.2, 0.2, 0.2) });
        });
      } else if (op === "metadata") {
        if (metaTitle.trim()) doc.setTitle(metaTitle.replace(/\{file\}/g, file.name));
        if (metaAuthor.trim()) doc.setAuthor(metaAuthor);
        if (metaSubject.trim()) doc.setSubject(metaSubject);
        if (metaKeywords.trim()) doc.setKeywords(metaKeywords.split(",").map((x) => x.trim()).filter(Boolean));
        doc.setProducer("Offline PDF Studio");
        doc.setCreator("Offline PDF Studio");
        doc.setModificationDate(new Date());
      } else if (op === "flatten-form") {
        try {
          const form = doc.getForm();
          form.flatten();
        } catch {
          // Non-form PDFs are still valid batch inputs.
        }
      } else if (op === "crop-margins") {
        const nums = cropMarginsRaw.split(",").map((x) => Number(x.trim()));
        if (nums.length !== 4 || nums.some((n) => !Number.isFinite(n) || n < 0)) throw new Error("Invalid crop margins. Use top,right,bottom,left");
        const [top, right, bottom, left] = nums;
        const total = doc.getPageCount();
        const idx = parseRangeExtended(cropRangeRaw, total);
        if (!idx.length) throw new Error("No valid crop range.");
        idx.forEach((iPage) => {
          const p = doc.getPage(iPage);
          const s = p.getSize();
          const x = Math.max(0, left);
          const y = Math.max(0, bottom);
          const w = Math.max(1, s.width - Math.max(0, left) - Math.max(0, right));
          const h = Math.max(1, s.height - Math.max(0, top) - Math.max(0, bottom));
          p.setCropBox(x, y, w, h);
        });
      } else if (op === "redact-pages") {
        const total = doc.getPageCount();
        const idx = parseRangeExtended(delRange || "all", total);
        if (!idx.length) throw new Error("No valid redaction pages.");
        idx.forEach((iPage) => {
          const p = doc.getPage(iPage);
          const s = p.getSize();
          p.drawRectangle({ x: 0, y: 0, width: s.width, height: s.height, color: PDFLib.rgb(0, 0, 0) });
        });
      }
      const bytes = await doc.save();
      const outName = `${prefix}-${String(i).padStart(3, "0")}.pdf`;
      outputs.push({ name: outName, bytes });
      report.push({ input: file.name, status: "ok", output: outName, pages: doc.getPageCount() });
      i += 1;
    } catch (err) {
      report.push({ input: file.name, status: "error", error: err?.message || String(err) });
    }
  }
  if (downloadMode === "single") {
    if (typeof JSZip === "undefined") {
      alert("找不到 ZIP 函式庫，改為多檔下載。");
      outputs.forEach((f) => downloadBytes(f.bytes, f.name));
    } else {
      const zip = new JSZip();
      outputs.forEach((f) => zip.file(f.name, f.bytes));
      const pack = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
      downloadBytes(pack, `${prefix}-batch.zip`);
    }
  } else {
    outputs.forEach((f) => downloadBytes(f.bytes, f.name));
  }
  if (wantReport) {
    const reportBytes = new TextEncoder().encode(
      JSON.stringify(
        {
          ts: new Date().toISOString(),
          operation: op,
          inputCount: files.length,
          outputCount: outputs.length,
          failedCount: report.filter((x) => x.status !== "ok").length,
          items: report,
        },
        null,
        2,
      ),
    );
    const blob = new Blob([reportBytes], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prefix}-batch-report.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  closeWizard();
  const failed = report.filter((x) => x.status !== "ok").length;
  alert(`批次完成：成功 ${outputs.length}/${files.length}${failed ? `，失敗 ${failed}` : ""}。`);
}

function psQuote(value) {
  return `'${String(value ?? "").replace(/'/g, "''")}'`;
}

function buildBatchCliPlan({ op, files, outDir, userPassword, ownerPassword, allow, ocrLang }) {
  const lines = [
    "$ErrorActionPreference='Stop'",
    `$root = Split-Path -Parent $MyInvocation.MyCommand.Path`,
    "$tool = Join-Path $root 'cli\\pdf_toolkit.ps1'",
    `New-Item -ItemType Directory -Path ${psQuote(outDir)} -Force | Out-Null`,
    "",
  ];
  files.forEach((file) => {
    const inName = file.name;
    const stem = baseName(inName);
    const ext = extensionOf(inName) || "pdf";
    if (op === "cli-encrypt") {
      lines.push(`& powershell -ExecutionPolicy Bypass -File $tool -Action encrypt -Input ${psQuote(inName)} -Output ${psQuote(`${outDir}/${stem}.enc.${ext}`)} -UserPassword ${psQuote(userPassword)} -OwnerPassword ${psQuote(ownerPassword)}`);
    } else if (op === "cli-permissions") {
      lines.push(`& powershell -ExecutionPolicy Bypass -File $tool -Action permissions -Input ${psQuote(inName)} -Output ${psQuote(`${outDir}/${stem}.perm.${ext}`)} -OwnerPassword ${psQuote(ownerPassword)} -UserPassword ${psQuote(userPassword)} -Allow ${psQuote(allow)}`);
    } else if (op === "cli-pdf2text") {
      lines.push(`& powershell -ExecutionPolicy Bypass -File $tool -Action pdf2text -Input ${psQuote(inName)} -Output ${psQuote(`${outDir}/${stem}.txt`)}`);
    } else if (op === "cli-ocr") {
      lines.push(`& powershell -ExecutionPolicy Bypass -File $tool -Action ocr -Input ${psQuote(inName)} -Output ${psQuote(`${outDir}/${stem}.ocr.${ext}`)} -Lang ${psQuote(ocrLang)}`);
    }
  });
  return `${lines.join("\n")}\n`;
}

function parseRange(expr, total) {
  const set = new Set();
  expr
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .forEach((part) => {
      if (part.includes("-")) {
        const [a, b] = part.split("-").map((x) => Number(x.trim()));
        if (Number.isFinite(a) && Number.isFinite(b)) {
          for (let n = Math.min(a, b); n <= Math.max(a, b); n += 1) {
            if (n >= 1 && n <= total) set.add(n - 1);
          }
        }
      } else {
        const n = Number(part);
        if (Number.isFinite(n) && n >= 1 && n <= total) set.add(n - 1);
      }
    });
  return [...set].sort((a, b) => a - b);
}

function buildCommands() {
  state.commands = [
    ["open", "開啟 PDF", "Ctrl+O"],
    ["save", "儲存", "Ctrl+S"],
    ["split", "開啟拆分精靈", ""],
    ["merge", "開啟合併精靈", ""],
    ["batch", "開啟批次精靈", ""],
    ["convert", "開啟轉換精靈", ""],
    ["watermark", "套用浮水印", ""],
    ["pageNumbers", "套用頁碼", ""],
    ["pageLabels", "設定頁面標籤", ""],
    ["readNight", "夜間閱讀模式", ""],
    ["toggleContrast", "切換高對比", ""],
    ["present", "簡報模式", ""],
    ["headerFooter", "套用頁首頁尾", ""],
    ["metadata", "編輯中繼資料", ""],
    ["addLink", "新增超連結", ""],
    ["insertImage", "插入圖片", ""],
    ["exportRegion", "匯出區域 PNG", ""],
    ["formBuilder", "新增表單欄位", ""],
    ["formFill", "填寫表單", ""],
    ["formImport", "匯入表單資料", ""],
    ["formExport", "匯出表單 JSON", ""],
    ["formExportCsv", "匯出表單 CSV", ""],
    ["formExportXfdf", "匯出表單 XFDF", ""],
    ["xfaInfo", "XFA 資訊", ""],
    ["extractImages", "提取圖片", ""],
    ["replaceImage", "替換圖片區域", ""],
    ["securityOps", "安全操作（CLI）", ""],
    ["bookmarkManager", "書籤管理", ""],
    ["compressDoc", "壓縮文件", ""],
    ["extractPages", "提取頁面", ""],
    ["insertFromPdf", "從 PDF 插入", ""],
    ["printAdvanced", "列印（範圍/奇偶）", "Ctrl+P"],
    ["copyToDoc", "複製頁面到其他文件", ""],
    ["moveToDoc", "移動頁面到其他文件", ""],
    ["exportLog", "匯出診斷日誌", ""],
    ["editShortcuts", "編輯快捷鍵", ""],
    ["rotate90", "旋轉頁面 90", ""],
    ["rotateRange", "範圍旋轉", ""],
    ["cropPage", "裁切目前頁", ""],
    ["cropRange", "範圍裁切", ""],
    ["setBoxes", "設定 Crop/Trim/Bleed", ""],
    ["deletePage", "刪除目前頁", ""],
    ["deleteRange", "刪除頁碼範圍", ""],
    ["editAnn", "編輯已選註解", ""],
    ["toolRect", "工具：矩形", ""],
    ["toolEllipse", "工具：橢圓", ""],
    ["toolLine", "工具：直線", ""],
    ["toolArrow", "工具：箭頭", ""],
    ["toolFreehand", "工具：手繪", ""],
    ["toolRedact", "工具：遮蔽", ""],
    ["applyRedact", "套用遮蔽", ""],
    ["toolSticky", "工具：便利貼", ""],
    ["stampReviewed", "印章：已閱", ""],
    ["stampApproved", "印章：核准", ""],
    ["stampUrgent", "印章：急件", ""],
    ["stampImage", "印章：圖片", ""],
    ["stampManager", "印章管理", ""],
    ["crossSeal", "跨頁騎縫章", ""],
    ["find", "搜尋文字", "Ctrl+F"],
    ["next", "下一頁", "PageDown"],
    ["prev", "上一頁", "PageUp"],
  ];
}

function openCommandPalette() {
  state.commandIndex = 0;
  $("q").value = "";
  $("cmd").classList.add("show");
  renderCommandList();
  $("q").focus();
}

function closeCommandPalette() {
  $("cmd").classList.remove("show");
}

function renderCommandList() {
  const q = $("q").value.trim().toLowerCase();
  const rows = state.commands.filter((c) => c[1].toLowerCase().includes(q) || c[0].includes(q));
  const root = $("ql");
  root.innerHTML = "";
  rows.forEach((row, idx) => {
    const b = document.createElement("button");
    b.className = `qi${idx === state.commandIndex ? " on" : ""}`;
    b.dataset.command = row[0];
    b.innerHTML = `<span>${row[1]}</span><span class="k">${row[2]}</span>`;
    b.addEventListener("click", () => runCommand(row[0]));
    root.appendChild(b);
  });
  if (state.commandIndex >= rows.length) state.commandIndex = Math.max(0, rows.length - 1);
  highlightCommandSelection();
}

function highlightCommandSelection() {
  [...$("ql").querySelectorAll(".qi")].forEach((x, i) => x.classList.toggle("on", i === state.commandIndex));
}

function onCommandKeyDown(e) {
  const items = [...$("ql").querySelectorAll(".qi")];
  if (!items.length) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    state.commandIndex = Math.min(items.length - 1, state.commandIndex + 1);
    highlightCommandSelection();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    state.commandIndex = Math.max(0, state.commandIndex - 1);
    highlightCommandSelection();
  } else if (e.key === "Enter") {
    e.preventDefault();
    const cmd = items[state.commandIndex]?.dataset.command;
    if (cmd) runCommand(cmd);
  } else if (e.key === "Escape") {
    closeCommandPalette();
  }
}

function runCommand(cmd) {
  closeCommandPalette();
  const map = {
    open: () => $("file").click(),
    save: () => savePdf(false),
    split: () => openWizard("split"),
    merge: () => openWizard("merge"),
    batch: () => openWizard("batch"),
    convert: () => openWizard("convert"),
    watermark: () => applyAdvancedWatermarkPrompt(),
    pageNumbers: () => applyPageNumbersPrompt(),
    pageLabels: () => configurePageLabelsPrompt(),
    readNight: () => {
      state.readingMode = "night";
      applyReadingAndA11y();
    },
    toggleContrast: () => {
      state.highContrast = !state.highContrast;
      applyReadingAndA11y();
    },
    present: () => togglePresentationMode(false),
    headerFooter: () => applyHeaderFooterPrompt(),
    metadata: () => editMetadataPrompt(),
    addLink: () => addHyperlinkPrompt(),
    insertImage: () => insertImagePrompt(),
    exportRegion: () => exportImageRegionPrompt(),
    formBuilder: () => addFormFieldPrompt(),
    formFill: () => fillFormPrompt(),
    formImport: () => importFormDataPrompt(),
    formExport: () => exportFormDataJson(),
    formExportCsv: () => exportFormDataCsv(),
    formExportXfdf: () => exportFormDataXfdf(),
    xfaInfo: () => showXfaInfo(),
    extractImages: () => extractImagesPrompt(),
    replaceImage: () => replaceImageRegionPrompt(),
    securityOps: () => openSecurityOpsHelp(),
    bookmarkManager: () => openBookmarkManagerPrompt(),
    compressDoc: () => compressDocumentPrompt(),
    extractPages: () => extractPagesPrompt(),
    insertFromPdf: () => insertPagesFromExternalPdfPrompt(),
    printAdvanced: () => printPdfWithOptionsPrompt(),
    copyToDoc: () => transferPagesToOtherDocumentPrompt(false),
    moveToDoc: () => transferPagesToOtherDocumentPrompt(true),
    exportLog: () => exportDiagnosticsLog(),
    editShortcuts: () => editShortcutBindings(),
    rotate90: () => rotateCurrentPage(90),
    rotateRange: () => rotatePagesByRangePrompt(),
    cropPage: () => cropCurrentPagePrompt(),
    cropRange: () => cropPagesByRangePrompt(),
    setBoxes: () => setPageBoxesPrompt(),
    deletePage: () => deleteCurrentPage(),
    deleteRange: () => deletePagesByRangePrompt(),
    editAnn: () => editSelectedAnnotation(),
    toolRect: () => {
      state.activeTool = "rect";
      renderToolbar();
    },
    toolEllipse: () => {
      state.activeTool = "ellipse";
      renderToolbar();
    },
    toolLine: () => {
      state.activeTool = "line";
      renderToolbar();
    },
    toolArrow: () => {
      state.activeTool = "arrow";
      renderToolbar();
    },
    toolFreehand: () => {
      state.activeTool = "freehand";
      renderToolbar();
    },
    toolRedact: () => {
      state.activeTool = "redact";
      renderToolbar();
    },
    applyRedact: () => applyRedactionsToPdf(),
    toolSticky: () => {
      state.activeTool = "sticky";
      renderToolbar();
    },
    stampReviewed: () => {
      state.activeTool = "stampText";
      state.stampText = "REVIEWED";
      renderToolbar();
    },
    stampApproved: () => {
      state.activeTool = "stampText";
      state.stampText = "APPROVED";
      renderToolbar();
    },
    stampUrgent: () => {
      state.activeTool = "stampText";
      state.stampText = "URGENT";
      renderToolbar();
    },
    stampImage: () => pickStampImageAndActivate(),
    stampManager: () => openStampManagerPrompt(),
    crossSeal: () => applyCrossPageSealPrompt(),
    find: () => promptFind(),
    next: () => goToPage(state.currentPage + 1),
    prev: () => goToPage(state.currentPage - 1),
  };
  map[cmd]?.();
}

function getRecent() {
  try {
    const arr = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function pushRecent(fileName) {
  const arr = getRecent();
  const next = [fileName, ...arr.filter((x) => x !== fileName)].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  renderRecent();
}

function renderRecent() {
  const arr = getRecent();
  const list = $("recent");
  list.innerHTML = "";
  if (!arr.length) {
    const li = document.createElement("li");
    li.innerHTML = "<span>沒有最近項目</span><button>清除</button>";
    li.querySelector("button").addEventListener("click", () => {
      localStorage.removeItem(RECENT_KEY);
      renderRecent();
    });
    list.appendChild(li);
    return;
  }
  arr.forEach((name) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = name;
    const b = document.createElement("button");
    b.textContent = "開啟";
    b.title = "受瀏覽器安全限制，需重新選擇檔案";
    b.addEventListener("click", () => $("file").click());
    li.append(span, b);
    list.appendChild(li);
  });
}

function loadStampPresets() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STAMP_PRESET_KEY) || "[]");
    state.stampPresets = Array.isArray(parsed) ? parsed.filter((x) => x && x.id && x.name && x.dataUrl).slice(0, 40) : [];
  } catch {
    state.stampPresets = [];
  }
  renderStampPresetOptions();
}

function saveStampPresets() {
  localStorage.setItem(STAMP_PRESET_KEY, JSON.stringify(state.stampPresets || []));
  renderStampPresetOptions();
}

function renderStampPresetOptions() {
  const sel = $("stampPresetSel");
  if (!sel) return;
  sel.innerHTML = "";
  if (!state.stampPresets.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No presets";
    sel.appendChild(opt);
    return;
  }
  state.stampPresets.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    sel.appendChild(opt);
  });
}

function getSelectedStampPreset() {
  const id = $("stampPresetSel")?.value;
  if (!id) return null;
  return (state.stampPresets || []).find((x) => x.id === id) || null;
}

function applySelectedStampPreset() {
  const p = getSelectedStampPreset();
  if (!p) return alert("No stamp preset selected.");
  state.stampImageDataUrl = p.dataUrl;
  state.activeTool = "stampImage";
  renderToolbar();
}

function saveCurrentStampAsPreset() {
  if (!state.stampImageDataUrl) return alert("No current stamp image loaded.");
  const name = (prompt("Preset name", `Stamp ${state.stampPresets.length + 1}`) || "").trim();
  if (!name) return;
  state.stampPresets.push({ id: genId(), name, dataUrl: state.stampImageDataUrl });
  saveStampPresets();
}

function deleteSelectedStampPreset() {
  const p = getSelectedStampPreset();
  if (!p) return;
  if (!confirm(`Delete preset "${p.name}"?`)) return;
  state.stampPresets = state.stampPresets.filter((x) => x.id !== p.id);
  saveStampPresets();
}

function getRecoveryStore() {
  try {
    const raw = localStorage.getItem(RECOVERY_KEY) || "{}";
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistRecoveryForFile() {
  if (!state.fileName) return;
  const store = getRecoveryStore();
  store[state.fileName] = {
    updatedAt: Date.now(),
    currentPage: state.currentPage,
    annotations: state.annotations,
    selectedAnnotationId: state.selectedAnnotationId,
    selectedAnnotationIds: state.selectedAnnotationIds,
    customBookmarks: state.customBookmarks,
    selectedCustomBookmarkId: state.selectedCustomBookmarkId,
    scale: state.scale,
    viewMode: state.viewMode,
    pageLabelRules: state.pageLabelRules,
  };
  localStorage.setItem(RECOVERY_KEY, JSON.stringify(store));
}

function maybeRestoreRecoveryForFile(fileName) {
  const store = getRecoveryStore();
  const rec = store[fileName];
  if (!rec) return;
  const ageMinutes = Math.floor((Date.now() - (rec.updatedAt || 0)) / 60000);
  const ok = confirm(`Found auto backup for "${fileName}" (${ageMinutes} min ago). Restore?`);
  if (!ok) return;
  state.annotations = rec.annotations || {};
  state.selectedAnnotationId = rec.selectedAnnotationId || null;
  state.selectedAnnotationIds = Array.isArray(rec.selectedAnnotationIds) ? rec.selectedAnnotationIds : state.selectedAnnotationId ? [state.selectedAnnotationId] : [];
  state.customBookmarks = Array.isArray(rec.customBookmarks) ? rec.customBookmarks : [];
  state.selectedCustomBookmarkId = rec.selectedCustomBookmarkId || null;
  state.currentPage = Math.max(1, Math.min(state.totalPages, rec.currentPage || 1));
  state.scale = typeof rec.scale === "number" ? rec.scale : state.scale;
  state.viewMode = rec.viewMode || state.viewMode;
  state.pageLabelRules = Array.isArray(rec.pageLabelRules) ? rec.pageLabelRules : [];
  redrawAllAnnotationLayers();
  renderAnnotationPanel();
  renderBookmarks();
  refreshContextStrip();
  goToPage(state.currentPage);
}

function startAutoBackupTimer() {
  setInterval(() => {
    if (!state.fileName || !state.pdfjs) return;
    persistRecoveryForFile();
  }, 20000);
}

function getLogEntries() {
  try {
    const raw = localStorage.getItem(LOG_KEY) || "[]";
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function pushLog(level, message, extra = null) {
  const arr = getLogEntries();
  arr.push({
    ts: new Date().toISOString(),
    level,
    message,
    extra,
    file: state.fileName || null,
    page: state.currentPage || null,
    userAgent: navigator.userAgent,
  });
  if (arr.length > 500) arr.splice(0, arr.length - 500);
  localStorage.setItem(LOG_KEY, JSON.stringify(arr));
}

function bindErrorLogging() {
  window.addEventListener("error", (e) => {
    pushLog("error", e.message || "window error", {
      source: e.filename,
      line: e.lineno,
      col: e.colno,
    });
  });
  window.addEventListener("unhandledrejection", (e) => {
    pushLog("error", "unhandledrejection", {
      reason: String(e.reason),
    });
  });
  pushLog("info", "session-start");
}

function exportDiagnosticsLog() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "offline-pdf-studio",
    state: {
      fileName: state.fileName,
      currentPage: state.currentPage,
      totalPages: state.totalPages,
      scale: state.scale,
      viewMode: state.viewMode,
      annotationCount: Object.values(state.annotations).reduce((s, a) => s + a.length, 0),
      attachmentCount: state.attachments.length,
    },
    logs: getLogEntries(),
  };
  const bytes = new TextEncoder().encode(JSON.stringify(payload, null, 2));
  const blob = new Blob([bytes], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `diagnostics-${Date.now()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function clearDiagnosticsLog() {
  localStorage.removeItem(LOG_KEY);
  pushLog("info", "log-cleared");
  alert("Diagnostics log cleared.");
}

function normalizeCombo(s) {
  if (!s) return "";
  return String(s)
    .split("+")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => (/^ctrl$/i.test(x) ? "Ctrl" : /^shift$/i.test(x) ? "Shift" : /^alt$/i.test(x) ? "Alt" : x.length === 1 ? x.toUpperCase() : x))
    .sort((a, b) => {
      const rank = { Ctrl: 1, Shift: 2, Alt: 3 };
      return (rank[a] || 10) - (rank[b] || 10);
    })
    .join("+");
}

function eventToCombo(e) {
  const parts = [];
  if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
  if (e.shiftKey) parts.push("Shift");
  if (e.altKey) parts.push("Alt");
  let key = e.key;
  if (key.length === 1) key = key.toUpperCase();
  if (key === " ") key = "Space";
  if (["Control", "Shift", "Alt", "Meta"].includes(key)) return "";
  parts.push(key);
  return normalizeCombo(parts.join("+"));
}

function getShortcuts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SHORTCUTS_KEY) || "{}");
    return { ...DEFAULT_SHORTCUTS, ...(parsed || {}) };
  } catch {
    return { ...DEFAULT_SHORTCUTS };
  }
}

function saveShortcuts(map) {
  localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(map));
}

function runShortcutAction(action) {
  const map = {
    open: () => $("file").click(),
    save: () => savePdf(false),
    undo: () => undo(),
    redo: () => redo(),
    print: () => printPdfWithOptionsPrompt(),
    find: () => promptFind(),
    findNext: () => findNext(),
    commandPalette: () => openCommandPalette(),
    nextPage: () => goToPage(state.currentPage + 1),
    prevPage: () => goToPage(state.currentPage - 1),
    scrollTop: () => scrollViewToTop(),
  };
  map[action]?.();
}

function editShortcutBindings() {
  const map = getShortcuts();
  const actions = Object.keys(DEFAULT_SHORTCUTS);
  const lines = actions.map((k) => `${k}: ${map[k]}`);
  const input = prompt(
    "Edit shortcuts. One per line: action=combo\\nExample: open=Ctrl+O\\n\\n" + lines.join("\\n"),
    lines.map((x) => x.replace(": ", "=")).join("\n"),
  );
  if (input == null) return;
  const next = { ...map };
  input
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [k, v] = line.split("=").map((x) => x.trim());
      if (!k || !v || !DEFAULT_SHORTCUTS[k]) return;
      next[k] = normalizeCombo(v);
    });
  saveShortcuts(next);
  alert("Shortcuts updated.");
}

init();
