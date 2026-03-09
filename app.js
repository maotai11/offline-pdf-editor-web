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
    { label: "選取", items: [["toolSelect", "▷ 選取", ""]] },
    {
      label: "繪圖",
      items: [
        ["toolHighlight", "螢光", ""],
        ["toolRect", "矩形", ""],
        ["toolEllipse", "橢圓", ""],
        ["toolLine", "直線", ""],
        ["toolArrow", "箭頭", ""],
        ["toolFreehand", "手繪", ""],
        ["toolRedact", "遮蔽", ""],
      ],
    },
    {
      label: "標注",
      items: [
        ["toolText", "文字", ""],
        ["toolSticky", "便利貼", ""],
      ],
    },
    {
      label: "章戳",
      items: [
        ["stampReviewed", "已閱", ""],
        ["stampApproved", "核准", ""],
        ["stampUrgent", "急件", ""],
        ["stampImage", "圖章", ""],
        ["stampManager", "管理印章", ""],
        ["crossSeal", "騎縫章", ""],
      ],
    },
    {
      label: "操作",
      items: [
        ["editAnn", "編輯", ""],
        ["flattenAnn", "扁平化", ""],
        ["applyRedact", "套用遮蔽", ""],
      ],
    },
  ],
  Page: [
    { label: "轉換", items: [["rotate90", "旋轉 90", ""], ["rotate270", "旋轉 270", ""], ["rotateRange", "範圍旋轉", ""]] },
    { label: "管理", items: [["deletePage", "刪除頁面", ""], ["deleteRange", "範圍刪除", ""], ["insertBlank", "插入空白頁", ""], ["insertFromPdf", "從 PDF 插入", ""], ["extractPages", "提取頁面", ""], ["copyToDoc", "複製到其他文件", ""], ["moveToDoc", "移動到其他文件", ""], ["cropPage", "框選裁切", ""], ["cropRange", "範圍裁切", ""], ["setBoxes", "設定頁框", ""]] },
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
  // Apply initial select-mode class so annotations are draggable immediately
  $("pages")?.classList.toggle("select-mode", state.activeTool === "select");
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

function openSettingsDialog({ title, fields, submitText = "套用", message = "" }) {
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
    if (message) {
      const _mp = document.createElement("p");
      _mp.style.cssText = "margin:0 0 12px;font-size:14px;line-height:1.6;color:var(--t)";
      _mp.textContent = message;
      form.appendChild(_mp);
    }
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
      } else if (f.type === "textarea") {
        input = document.createElement("textarea");
        input.rows = f.rows || 6;
        input.style.cssText = "width:100%;font-family:monospace;font-size:12px;resize:vertical";
        input.value = f.value != null ? String(f.value) : "";
        if (f.placeholder) input.placeholder = f.placeholder;
      } else {
        input = document.createElement("input");
        input.type = f.type || "text";
        if (f.min != null) input.min = String(f.min);
        if (f.max != null) input.max = String(f.max);
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

async function openConfirmDialog(message, okText = "確定", cancelText = "取消") {
  const result = await openSettingsDialog({
    title: "確認",
    message,
    submitText: okText,
    fields: [],
  });
  return result !== null;
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
  $("bmClearLocal").addEventListener("click", async () => {
    if (!(await openConfirmDialog("確定要清除所有自訂書籤？", "清除"))) return;
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

function applyCtxFieldToAnnotation(key, rawVal) {
  const selected = getSelectedAnnotations();
  if (!selected.length) return;
  selected.forEach((ann) => {
    const val = Number(rawVal);
    if (key === "color") {
      if (ann.type === "h") ann.color = hexToRgba(rawVal, 0.35);
      else if (ann.type !== "si") ann.color = rawVal;
    } else if (key === "width" && Number.isFinite(val)) {
      if (!["h", "n", "si", "t"].includes(ann.type)) ann.width = Math.max(1, Math.min(12, val));
    } else if (key === "text") {
      if (["t", "n", "s"].includes(ann.type)) ann.text = rawVal;
    } else if (key === "x" && Number.isFinite(val)) {
      if (ann.type === "l" || ann.type === "a") ann.x1 = val; else ann.x = val;
    } else if (key === "y" && Number.isFinite(val)) {
      if (ann.type === "l" || ann.type === "a") ann.y1 = val; else ann.y = val;
    } else if (key === "w" && Number.isFinite(val) && val > 0) {
      ann.w = val;
    } else if (key === "h" && Number.isFinite(val) && val > 0) {
      ann.h = val;
    }
  });
  redrawAllAnnotationLayers();
  renderAnnotationPanel();
  saveSnapshot();
}

function bindEvents() {
  $("openHome").addEventListener("click", () => $("file").click());
  $("dropHome").addEventListener("click", () => $("file").click());
  $("file").addEventListener("change", onPickMainFile);
  $("delAnn").addEventListener("click", deleteSelectedAnnotation);
  $("cpyTxt").addEventListener("click", copyCurrentPageText);
  $("ctxDup")?.addEventListener("click", duplicateSelectedAnnotation);
  $("ctxColor")?.addEventListener("input", (e) => applyCtxFieldToAnnotation("color", e.target.value));
  $("ctxWidth")?.addEventListener("input", (e) => applyCtxFieldToAnnotation("width", e.target.value));
  $("ctxText")?.addEventListener("input", (e) => applyCtxFieldToAnnotation("text", e.target.value));
  $("ctxX")?.addEventListener("input", (e) => applyCtxFieldToAnnotation("x", e.target.value));
  $("ctxY")?.addEventListener("input", (e) => applyCtxFieldToAnnotation("y", e.target.value));
  $("ctxW")?.addEventListener("input", (e) => applyCtxFieldToAnnotation("w", e.target.value));
  $("ctxH")?.addEventListener("input", (e) => applyCtxFieldToAnnotation("h", e.target.value));
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
  if (actionId === "cropPage") return state.activeTool === "crop";
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
    addToRecent(file.name);
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

function pdfBytesHaveEncryption(bytes) {
  // Scan trailer area (last 8KB) for /Encrypt entry in trailer dict
  const tail = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(-8192));
  return /\/Encrypt\s/.test(tail);
}

function pdfBytesHaveSignature(bytes) {
  // /SigFlags in AcroForm indicates at least one signature field exists
  // /ByteRange indicates a signed region is present in the file
  const scan = (chunk) => /\/SigFlags/.test(chunk) || /\/ByteRange\s*\[/.test(chunk);
  const head = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, 65536));
  const tail = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(-65536));
  return scan(head) || scan(tail);
}

async function loadPdfBytes(bytes, fileName, options = {}) {
  const opts = options || {};
  // Keep separate copies: PDF.js worker may transfer/detach the underlying buffer.
  const bytesForPdfJs = bytes.slice();
  const bytesForPdfLib = bytes.slice();

  // --- P0 Security checks (only on fresh user-initiated opens, not internal reloads) ---
  if (!opts.docState) {
    const hasEncryption = pdfBytesHaveEncryption(bytes);
    const hasSignature = pdfBytesHaveSignature(bytes);
    if (hasEncryption) {
      pushLog("warn", "開啟加密 PDF", { fileName });
      alert(
        "⚠️ 安全提醒：此 PDF 含有加密保護。\n\n" +
        "本工具以「略過加密」模式開啟，儲存後加密將被移除，" +
        "任何人均可開啟輸出的 PDF，請注意資料保護。\n\n" +
        "如需保留加密，請在下載後使用 CLI 工具（pdf_toolkit.ps1 encrypt）重新加密。"
      );
    }
    if (hasSignature) {
      pushLog("warn", "開啟含數位簽章 PDF", { fileName });
      alert(
        "⚠️ 安全提醒：此 PDF 含有數位簽章。\n\n" +
        "任何儲存操作（包含不修改內容的 Ctrl+S）都會使所有數位簽章失效，" +
        "因為本工具採用全文重寫模式，無法保留簽章的 ByteRange 完整性。\n\n" +
        "如需保留簽章，請不要使用本工具儲存此文件。"
      );
    }
  }

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
  if (!opts.skipRecoveryPrompt) await maybeRestoreRecoveryForFile(state.fileName);
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
  if (!state.pdfjs || state.totalPages === 0) return;
  // P1-1: Device Pixel Ratio for sharp rendering on high-DPI screens
  const dpr = window.devicePixelRatio || 1;
  const container = $("pages");
  container.innerHTML = "";

  // Phase 1: Build all DOM placeholders using first page for size estimation.
  // This lets the user see the page layout immediately before rendering completes.
  const firstPage = await state.pdfjs.getPage(1);
  const firstVp = firstPage.getViewport({ scale: state.scale });
  const wraps = [];
  for (let p = 1; p <= state.totalPages; p += 1) {
    const wrap = document.createElement("div");
    wrap.className = "pw";
    wrap.dataset.page = String(p);
    wrap.style.minHeight = `${firstVp.height}px`;

    const canvas = document.createElement("canvas");
    canvas.className = "pc";

    // P1-3: Text selection layer (transparent overlay, pointer-events via CSS)
    const textLayerDiv = document.createElement("div");
    textLayerDiv.className = "textLayer";

    const ann = document.createElement("div");
    ann.className = "ann";

    wrap.append(canvas, textLayerDiv, ann);
    container.appendChild(wrap);
    wraps.push(wrap);
  }

  // Phase 2: P1-2 Batch rendering (3 pages at a time) to keep UI responsive.
  // Sequential per-page await blocked the main thread for ~10s on 100-page PDFs.
  const BATCH = 3;
  for (let i = 0; i < state.totalPages; i += BATCH) {
    const pageNums = Array.from(
      { length: Math.min(BATCH, state.totalPages - i) },
      (_, k) => i + k + 1
    );
    await Promise.all(pageNums.map(async (p) => {
      const page = await state.pdfjs.getPage(p);
      const viewport = page.getViewport({ scale: state.scale });
      const hiResViewport = page.getViewport({ scale: state.scale * dpr });
      const wrap = wraps[p - 1];
      const canvas = wrap.querySelector(".pc");
      const textLayerDiv = wrap.querySelector(".textLayer");
      const ann = wrap.querySelector(".ann");

      // P1-1: Canvas physical size = DPR-scaled for sharp rendering;
      //        CSS display size = layout pixels
      canvas.width = Math.round(hiResViewport.width);
      canvas.height = Math.round(hiResViewport.height);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      textLayerDiv.style.width = `${viewport.width}px`;
      textLayerDiv.style.height = `${viewport.height}px`;
      ann.style.width = `${viewport.width}px`;
      ann.style.height = `${viewport.height}px`;

      await page.render({ canvasContext: canvas.getContext("2d"), viewport: hiResViewport }).promise;

      // P1-3: Render text layer for text selection (in select-tool mode via CSS)
      try {
        const textContent = await page.getTextContent();
        textLayerDiv.innerHTML = "";
        pdfjsLib.renderTextLayer({ textContent, container: textLayerDiv, viewport, textDivs: [] });
      } catch { /* text layer not available for this page/version */ }

      bindPageLayer(canvas, ann, p);
      redrawAnnotationLayer(p);
    }));
    // Yield to main thread between batches so the UI stays responsive
    await new Promise((r) => setTimeout(r, 0));
  }
}

function bindPageLayer(canvas, annLayer, pageNum) {
  const drawTools = new Set(["highlight", "rect", "ellipse", "line", "arrow", "freehand", "redact", "crop"]);
  let draw = null;
  let previewEl = null;
  const wrap = canvas.parentElement;

  const getXY = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const updatePreview = (x, y, w, h) => {
    if (!previewEl) {
      previewEl = document.createElement("div");
      previewEl.className = "draw-preview";
      wrap.appendChild(previewEl);
    }
    previewEl.classList.toggle("crop-mode", state.activeTool === "crop");
    Object.assign(previewEl.style, {
      display: "block",
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
    });
  };

  const clearPreview = () => {
    if (previewEl) previewEl.style.display = "none";
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
    // Live preview for box-type tools
    const boxTools = ["highlight", "rect", "ellipse", "redact", "crop"];
    if (boxTools.includes(state.activeTool)) {
      updatePreview(
        Math.min(draw.sx, draw.ex), Math.min(draw.sy, draw.ey),
        Math.abs(draw.ex - draw.sx), Math.abs(draw.ey - draw.sy)
      );
    }
  });

  const finishDraw = () => {
    clearPreview();
    if (!draw) return;
    const { sx, sy, ex, ey, points } = draw;
    draw = null;
    // Handle crop tool: show overlay with confirm/cancel instead of creating annotation
    if (state.activeTool === "crop") {
      const x = Math.min(sx, ex);
      const y = Math.min(sy, ey);
      const w = Math.abs(ex - sx);
      const h = Math.abs(ey - sy);
      if (w >= 10 && h >= 10) showCropOverlay(wrap, pageNum, x, y, w, h);
      return;
    }
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

  canvas.addEventListener("click", async (e) => {
    if (drawTools.has(state.activeTool)) return;
    const { x, y } = getXY(e);
    if (state.activeTool === "sticky") {
      const vals = await openSettingsDialog({
        title: "新增便利貼",
        submitText: "確定",
        fields: [{ key: "text", label: "便利貼內容", type: "text", value: "備注" }],
      });
      if (!vals) return;
      const text = String(vals.text || "備注");
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
      if (!state.stampImageDataUrl) return alert("請先選擇印章圖片。");
      pushAnnotation({ id: genId(), page: pageNum, type: "si", x, y, w: 140, h: 70, src: state.stampImageDataUrl });
      redrawAnnotationLayer(pageNum);
      return;
    }
    if (state.activeTool === "text") {
      const vals = await openSettingsDialog({
        title: "新增文字",
        submitText: "確定",
        fields: [{ key: "text", label: "文字內容", type: "text", value: "" }],
      });
      if (!vals || !vals.text.trim()) return;
      pushAnnotation({ id: genId(), page: pageNum, type: "t", x, y, text: vals.text, color: state.annColor || "#202020" });
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
      Object.assign(node.style, { left: `${ann.x}px`, top: `${ann.y}px`, color: ann.color || "#202020" });
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

    // Drag-to-move: only active when select tool is used
    node.addEventListener("mousedown", (e) => {
      if (state.activeTool !== "select") return;
      e.preventDefault();
      e.stopPropagation();
      selectAnnotation(ann.id);

      const startCX = e.clientX;
      const startCY = e.clientY;
      // canvas display size may differ from canvas pixel size - get the ratio
      const canvas = wrap.querySelector(".pc");
      const rect = canvas ? canvas.getBoundingClientRect() : wrap.getBoundingClientRect();
      const ratioX = canvas ? canvas.width / rect.width : 1;
      const ratioY = canvas ? canvas.height / rect.height : 1;

      const orig = {
        x: ann.x, y: ann.y, w: ann.w, h: ann.h,
        x1: ann.x1, y1: ann.y1, x2: ann.x2, y2: ann.y2,
        points: ann.points ? ann.points.map((p) => ({ x: p.x, y: p.y })) : null,
      };

      const onMove = (mv) => {
        const dx = (mv.clientX - startCX) * ratioX;
        const dy = (mv.clientY - startCY) * ratioY;
        if (ann.type === "l" || ann.type === "a") {
          ann.x1 = orig.x1 + dx; ann.y1 = orig.y1 + dy;
          ann.x2 = orig.x2 + dx; ann.y2 = orig.y2 + dy;
        } else if (ann.type === "f" && orig.points) {
          ann.points = orig.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
        } else {
          ann.x = orig.x + dx;
          ann.y = orig.y + dy;
        }
        redrawAnnotationLayer(pageNum);
        refreshCtxPanel();
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        saveSnapshot();
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });

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

function hasCJK(text) {
  return /[\u2E80-\u2FFF\u3000-\u303F\u3040-\u30FF\u3100-\u312F\u3200-\u32FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA48F\uF900-\uFAFF\uFE30-\uFE4F]/.test(text);
}

function warnIfCJK(text, context) {
  if (!hasCJK(text)) return false;
  alert(`⚠️ 注意：「${context}」包含中文字元。\n\n目前使用的 PDF 寫入引擎不支援 CJK 字型，中文字元在儲存的 PDF 中將顯示為空白。\n\n建議改用英文或數字，或使用「便利貼/文字框」工具加中文標注。`);
  return true;
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
  alert("請使用左側「註解」面板來編輯已選取的註解。");
}

function refreshContextStrip() {
  $("ctx").classList.toggle("show", !!state.selectedAnnotationId || state.selectedAnnotationIds.length > 0);
  refreshSelectedAnnotationEditor();
  refreshCtxPanel();
}

function refreshCtxPanel() {
  const ann = getSelectedAnnotations()[0];
  const hasBox = ann && ["h", "rd", "r", "e", "n", "s", "si"].includes(ann.type);
  const hasLine = ann && ["l", "a"].includes(ann.type);
  const hasFree = ann && ann.type === "f";
  const hasText = ann && ["t", "n", "s"].includes(ann.type);
  const hasColor = ann && ann.type !== "si";
  const hasWidth = ann && !["h", "n", "si", "t"].includes(ann.type);

  // Color
  const ctxColor = $("ctxColor");
  if (ctxColor) {
    ctxColor.disabled = !hasColor;
    if (ann && hasColor) ctxColor.value = toHexColor(ann.color || state.annColor || "#ffcc33");
  }

  // Width
  const ctxWidth = $("ctxWidth");
  if (ctxWidth) {
    ctxWidth.disabled = !hasWidth;
    if (ann && hasWidth) ctxWidth.value = String(ann.width || 2);
  }

  // Text
  const ctxTextWrap = $("ctxTextWrap");
  const ctxText = $("ctxText");
  if (ctxTextWrap && ctxText) {
    ctxTextWrap.style.display = hasText ? "" : "none";
    if (hasText) ctxText.value = String(ann.text || "");
  }

  // Position/size
  const setField = (id, val, show) => {
    const wrap = $(id + "Wrap");
    const inp = $(id);
    if (!wrap || !inp) return;
    wrap.style.display = show ? "" : "none";
    if (show && val != null) inp.value = String(Math.round(val));
  };

  if (hasBox) {
    setField("ctxX", ann.x, true);
    setField("ctxY", ann.y, true);
    setField("ctxW", ann.w, true);
    setField("ctxH", ann.h, true);
  } else if (hasLine) {
    setField("ctxX", ann.x1, true);
    setField("ctxY", ann.y1, true);
    setField("ctxW", null, false);
    setField("ctxH", null, false);
  } else if (hasFree || !ann) {
    ["ctxX", "ctxY", "ctxW", "ctxH"].forEach((id) => {
      const w = $(id + "Wrap");
      if (w) w.style.display = "none";
    });
  }
}

function duplicateSelectedAnnotation() {
  const ann = getSelectedAnnotations()[0];
  if (!ann) return;
  const clone = JSON.parse(JSON.stringify(ann));
  clone.id = genId();
  // Offset slightly so it's visually distinct
  const offset = 16;
  if (clone.x != null) clone.x += offset;
  if (clone.y != null) clone.y += offset;
  if (clone.x1 != null) { clone.x1 += offset; clone.x2 += offset; }
  if (clone.y1 != null) { clone.y1 += offset; clone.y2 += offset; }
  if (clone.points) clone.points = clone.points.map((p) => ({ x: p.x + offset, y: p.y + offset }));
  pushAnnotation(clone);
  redrawAnnotationLayer(ann.page);
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
    alert("沒有有效目標頁面。");
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
    row.innerHTML = `<div style="text-align:left">${att.name}</div><div style="display:flex;gap:6px;margin-top:6px"><button data-act="download">下載</button><button data-act="remove">移除</button></div>`;
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
    alert("請先開啟 PDF。");
    return;
  }
  if (!state.attachments.length) {
    alert("沒有附件可套用。");
    return;
  }
  if (typeof state.pdfLib.attach !== "function") {
    alert("目前版本的 pdf-lib 不支援附件功能。");
    return;
  }
  for (const att of state.attachments) {
    await state.pdfLib.attach(att.bytes, att.name, { mimeType: att.type || "application/octet-stream" });
  }
  alert(`已將 ${state.attachments.length} 個附件套用到 PDF。請儲存以保留。`);
}

async function renderThumbnails() {
  const dpr = window.devicePixelRatio || 1;
  const list = $("thumbs");
  list.innerHTML = "";
  let draggingFrom = null;
  for (let p = 1; p <= state.totalPages; p += 1) {
    const page = await state.pdfjs.getPage(p);
    const viewport = page.getViewport({ scale: state.thumbScale });
    const hiResViewport = page.getViewport({ scale: state.thumbScale * dpr });
    const item = document.createElement("div");
    item.className = `thumb${p === state.currentPage ? " active" : ""}`;
    item.dataset.page = String(p);
    item.draggable = true;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(hiResViewport.width);
    canvas.height = Math.round(hiResViewport.height);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport: hiResViewport }).promise;
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
    const vals = await openSettingsDialog({
      title: "自動播放設定",
      submitText: "開始播放",
      fields: [{ key: "sec", label: "每頁停留秒數", type: "number", value: "3", min: 1, step: 1 }],
    });
    const sec = vals ? Number(vals.sec) : 0;
    if (!sec || !Number.isFinite(sec)) return;
    const ms = Math.max(1, sec) * 1000;
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

async function addCustomBookmarkPrompt() {
  if (!state.pdfjs) return alert("請先開啟 PDF。");
  const abVals = await openSettingsDialog({
    title: "新增書籤",
    submitText: "新增",
    fields: [
      { key: "page", label: "頁碼", type: "number", value: String(state.currentPage), min: "1", step: "1" },
      { key: "title", label: "書籤名稱", type: "text", value: `書籤 P${state.currentPage}` },
    ],
  });
  if (!abVals) return;
  const page = Number(abVals.page);
  if (!Number.isFinite(page) || page < 1 || page > state.totalPages) return alert("頁碼無效。");
  const title = (abVals.title || "").trim();
  if (!title) return;
  state.customBookmarks.push({ id: genId(), page, title });
  state.selectedCustomBookmarkId = null;
  renderBookmarks();
  persistRecoveryForFile();
}

async function renameCustomBookmarkPrompt() {
  if (!state.selectedCustomBookmarkId) return alert("請先選取一個自訂書籤。");
  const bm = state.customBookmarks.find((x) => x.id === state.selectedCustomBookmarkId);
  if (!bm) return alert("找不到已選取的書籤。");
  const rbVals = await openSettingsDialog({
    title: "重新命名書籤",
    submitText: "確定",
    fields: [{ key: "title", label: "書籤名稱", type: "text", value: bm.title }],
  });
  if (!rbVals) return;
  bm.title = (rbVals.title || "").trim() || bm.title;
  renderBookmarks();
  persistRecoveryForFile();
}

async function deleteCustomBookmarkPrompt() {
  if (!state.selectedCustomBookmarkId) return alert("請先選取一個自訂書籤。");
  state.customBookmarks = state.customBookmarks.filter((x) => x.id !== state.selectedCustomBookmarkId);
  state.selectedCustomBookmarkId = null;
  renderBookmarks();
  persistRecoveryForFile();
}

async function openBookmarkManagerPrompt() {
  const bmMgrVals = await openSettingsDialog({
    title: "書籤管理",
    submitText: "執行",
    fields: [{ key: "action", label: "動作", type: "select", value: "list", options: [
      { value: "list", label: "列出所有書籤" },
      { value: "add", label: "新增書籤" },
      { value: "rename", label: "重新命名書籤" },
      { value: "delete", label: "刪除書籤" },
    ]}],
  });
  if (!bmMgrVals) return;
  const action = bmMgrVals.action || "list";
  if (action === "add") return addCustomBookmarkPrompt();
  if (action === "rename") return renameCustomBookmarkPrompt();
  if (action === "delete") return deleteCustomBookmarkPrompt();
  if (action === "list") {
    const lines = state.customBookmarks.map((b) => `[P${b.page}] ${b.title}`).join("\n");
    alert(lines || "目前沒有自訂書籤");
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

function setActiveTool(tool) {
  state.activeTool = tool;
  const pages = $("pages");
  if (pages) pages.classList.toggle("select-mode", tool === "select");
  renderToolbar();
}

async function onToolbarAction(actionId) {
  if (actionId === "open") return $("file").click();
  if (actionId === "save") return savePdf(false);
  if (actionId === "saveAs") return savePdf(true);
  if (actionId === "prev") return goToPage(state.currentPage - 1);
  if (actionId === "next") return goToPage(state.currentPage + 1);
  if (actionId === "goto") {
    openSettingsDialog({
      title: "前往頁面",
      submitText: "前往",
      fields: [{ key: "p", label: `頁碼（1～${state.totalPages}）`, type: "number", value: String(state.currentPage), min: "1", max: String(state.totalPages), step: "1" }],
    }).then(v => { if (v) { const p = Number(v.p); if (Number.isFinite(p) && p >= 1 && p <= state.totalPages) goToPage(p); } });
    return;
  }
  if (actionId === "zoomOut") return zoom(-0.15);
  if (actionId === "zoomIn") return zoom(0.15);
  if (actionId === "fitWidth") return fitWidth();
  if (actionId === "undo") return undo();
  if (actionId === "redo") return redo();
  if (actionId === "find") return promptFind();
  if (actionId === "findNext") return findNext();
  if (actionId === "toolSelect") { removeCropOverlay(); return setActiveTool("select"); }
  if (actionId === "toolHighlight") { removeCropOverlay(); return setActiveTool("highlight"); }
  if (actionId === "toolText") return setActiveTool("text");
  if (actionId === "toolRect") return setActiveTool("rect");
  if (actionId === "toolEllipse") return setActiveTool("ellipse");
  if (actionId === "toolLine") return setActiveTool("line");
  if (actionId === "toolArrow") return setActiveTool("arrow");
  if (actionId === "toolFreehand") return setActiveTool("freehand");
  if (actionId === "toolRedact") return setActiveTool("redact");
  if (actionId === "toolSticky") return setActiveTool("sticky");
  if (actionId === "stampReviewed") {
    state.stampText = "REVIEWED";
    return setActiveTool("stampText");
  }
  if (actionId === "stampApproved") {
    state.stampText = "APPROVED";
    return setActiveTool("stampText");
  }
  if (actionId === "stampUrgent") {
    state.stampText = "URGENT";
    return setActiveTool("stampText");
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
  if (actionId === "cropPage") {
    if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
    setActiveTool("crop");
    showToast("拖曳選取要保留的區域（框外部分將被裁掉），確認後點「套用裁切」", "info", 4000);
    return;
  }
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
  if (actionId === "commandPalette") return openCommandPalette();
  if (actionId === "findNext") return findNext();
  if (actionId === "scrollTop") return scrollViewToTop();
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
    alert("至少需要保留一頁。");
    return;
  }
  if (!(await openConfirmDialog(`確定刪除第 ${state.currentPage} 頁？`, "刪除"))) return;
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
    alert("旋轉角度無效。");
    return;
  }
  const indices = parseRange(range, state.totalPages);
  if (!indices.length) {
    alert("範圍內沒有有效頁面。");
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
  const vals = await openSettingsDialog({
    title: "刪除頁面範圍",
    submitText: "刪除",
    fields: [{ key: "range", label: "頁面範圍（例如 2,4-6 或 all）", type: "text", value: "", placeholder: "例如 2,4-6 或 all" }],
  });
  if (!vals || !vals.range.trim()) return;
  const indices = parseRange(vals.range, state.totalPages);
  if (!indices.length) return alert("範圍內沒有有效頁面。");
  if (indices.length >= state.totalPages) return alert("至少需要保留一頁。");
  const ok = await openConfirmDialog(`確定刪除第 ${indices.map(i=>i+1).join('、')} 頁（共 ${indices.length} 頁）？`, "刪除");
  if (!ok) return;
  indices
    .slice()
    .sort((a, b) => b - a)
    .forEach((i) => state.pdfLib.removePage(i));
  await reloadFromPdfLib();
}

async function insertBlankPage() {
  if (!state.pdfLib) return;
  const vals = await openSettingsDialog({
    title: "插入空白頁",
    submitText: "插入",
    fields: [{ key: "pos", label: "插入位置", type: "select", value: "after", options: [
      { value: "before", label: "在目前頁之前" },
      { value: "after", label: "在目前頁之後" },
      { value: "end", label: "文件末尾" },
    ]}],
  });
  if (!vals) return;
  const pos = vals.pos || "after";
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

function removeCropOverlay() {
  document.querySelectorAll(".crop-overlay").forEach((el) => el.remove());
}

function showCropOverlay(wrap, pageNum, x, y, w, h) {
  removeCropOverlay();

  const overlay = document.createElement("div");
  overlay.className = "crop-overlay";
  Object.assign(overlay.style, {
    left: `${x}px`,
    top: `${y}px`,
    width: `${w}px`,
    height: `${h}px`,
  });

  const bar = document.createElement("div");
  bar.className = "crop-confirm-bar";
  // If selection bottom is near page bottom, flip confirm bar to top
  if (y + h > wrap.offsetHeight - 60) {
    bar.style.bottom = "auto";
    bar.style.top = "-44px";
  }

  const okBtn = document.createElement("button");
  okBtn.textContent = "✓ 套用裁切";
  okBtn.className = "crop-ok-btn";
  okBtn.onclick = async () => {
    if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
    const scale = state.scale;
    const page = state.pdfLib.getPage(pageNum - 1);
    // Convert canvas pixels → PDF points (divide by scale)
    applyCropToPageByTopRect(page, x / scale, y / scale, w / scale, h / scale);
    removeCropOverlay();
    state.activeTool = "select";
    renderToolbar();
    await reloadFromPdfLib();
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "✕ 取消";
  cancelBtn.className = "crop-cancel-btn";
  cancelBtn.onclick = () => {
    removeCropOverlay();
    state.activeTool = "select";
    renderToolbar();
  };

  bar.appendChild(okBtn);
  bar.appendChild(cancelBtn);
  overlay.appendChild(bar);
  wrap.appendChild(overlay);
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
  if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
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
    if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n >= 0)) return alert("矩形數值無效。");
    applyCropToPageByTopRect(page, x, yTop, w, h);
  } else {
    const top = Number(values.top);
    const right = Number(values.right);
    const bottom = Number(values.bottom);
    const left = Number(values.left);
    if (![top, right, bottom, left].every((n) => Number.isFinite(n) && n >= 0)) return alert("邊距數值無效。");
    applyCropToPageByMargins(page, top, right, bottom, left);
  }
  await reloadFromPdfLib();
}

async function cropPagesByRangePrompt() {
  if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
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
  if (!idx.length) return alert("沒有有效頁面。");
  const mode = String(values.mode || "margins").trim().toLowerCase();
  if (mode === "rect") {
    const x = Number(values.x);
    const yTop = Number(values.yTop);
    const w = Number(values.w);
    const h = Number(values.h);
    if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n >= 0)) return alert("矩形數值無效。");
    idx.forEach((i) => applyCropToPageByTopRect(state.pdfLib.getPage(i), x, yTop, w, h));
  } else {
    const top = Number(values.top);
    const right = Number(values.right);
    const bottom = Number(values.bottom);
    const left = Number(values.left);
    if (![top, right, bottom, left].every((n) => Number.isFinite(n) && n >= 0)) return alert("邊距數值無效。");
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
  if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
  const sbVals = await openSettingsDialog({
    title: "設定頁框（Crop/Trim/Bleed）",
    submitText: "套用",
    fields: [
      { key: "range", label: "目標頁面", type: "text", value: String(state.currentPage), placeholder: "all / 1-3,5" },
      { key: "boxes", label: "要設定的頁框", type: "select", value: "crop,trim", options: [
        { value: "crop", label: "僅 CropBox" },
        { value: "trim", label: "僅 TrimBox" },
        { value: "bleed", label: "僅 BleedBox" },
        { value: "crop,trim", label: "Crop + Trim" },
        { value: "crop,trim,bleed", label: "全部" },
      ]},
      { key: "x", label: "X（pt，從左）", type: "number", value: "20", min: "0", step: "1" },
      { key: "yTop", label: "Y（pt，從頂）", type: "number", value: "20", min: "0", step: "1" },
      { key: "w", label: "寬（pt）", type: "number", value: "555", min: "1", step: "1" },
      { key: "h", label: "高（pt）", type: "number", value: "802", min: "1", step: "1" },
    ],
  });
  if (!sbVals) return;
  const idx = parseRangeExtended(sbVals.range || String(state.currentPage), state.totalPages);
  if (!idx.length) return alert("沒有有效頁面。");
  const boxesRaw = (sbVals.boxes || "crop,trim").toLowerCase();
  const setCrop = boxesRaw.includes("crop");
  const setTrim = boxesRaw.includes("trim");
  const setBleed = boxesRaw.includes("bleed");
  if (!setCrop && !setTrim && !setBleed) return alert("請至少選取一種頁框類型。");
  const x = Number(sbVals.x);
  const yTop = Number(sbVals.yTop);
  const w = Number(sbVals.w);
  const h = Number(sbVals.h);
  if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n >= 0)) return alert("框架幾何數值無效。");

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
  const savedDocState = {
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
  };
  await loadPdfBytes(normalizePdfBytes(new Uint8Array(bytes), state.fileName || "document.pdf"), state.fileName || "document.pdf", { skipRecoveryPrompt: true, docState: savedDocState });
}

async function savePdf(promptName) {
  if (!state.pdfLib) {
    alert("此檔案以唯讀模式開啟，無法儲存。");
    return;
  }
  const bytes = await state.pdfLib.save();
  const defaultName = state.fileName || "document.pdf";
  let outputName = defaultName;
  if (promptName) {
    const snVals = await openSettingsDialog({
      title: "另存新檔",
      submitText: "儲存",
      fields: [{ key: "name", label: "檔名", type: "text", value: defaultName }],
    });
    if (!snVals) return;
    outputName = (snVals.name || defaultName).trim();
  }
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
    alert("此檔案以唯讀模式開啟，無法列印。");
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
    alert("此檔案以唯讀模式開啟，無法列印。");
    return;
  }
  const pVals = await openSettingsDialog({
    title: "進階列印",
    submitText: "列印",
    fields: [
      { key: "range", label: "頁面範圍", type: "text", value: "all", placeholder: "all / 1-3,8 / odd / even" },
      { key: "parity", label: "奇偶過濾", type: "select", value: "all", options: [
        { value: "all", label: "全部" }, { value: "odd", label: "僅奇數頁" }, { value: "even", label: "僅偶數頁" },
      ]},
    ],
  });
  if (!pVals) return;
  const rangeExpr = pVals.range || "all";
  const parity = pVals.parity || "all";
  const idx = parseRangeExtended(rangeExpr, state.totalPages);
  const filtered = idx.filter((i) => {
    const p = i + 1;
    if (parity === "odd") return p % 2 === 1;
    if (parity === "even") return p % 2 === 0;
    return true;
  });
  if (!filtered.length) return alert("沒有選取要列印的頁面。");
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
  if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
  const epVals = await openSettingsDialog({
    title: "提取頁面",
    submitText: "提取",
    fields: [
      { key: "range", label: "頁面範圍", type: "text", value: String(state.currentPage), placeholder: "all / 1-3,5 / odd" },
      { key: "mode", label: "提取後動作", type: "select", value: "open", options: [
        { value: "open", label: "在新分頁開啟" }, { value: "download", label: "下載" },
      ]},
      { key: "outName", label: "輸出檔名", type: "text", value: `${baseName(state.fileName)}-extract.pdf` },
    ],
  });
  if (!epVals) return;
  const idx = parseRangeExtended(epVals.range || String(state.currentPage), state.totalPages);
  if (!idx.length) return alert("沒有選取有效頁面。");
  const mode = epVals.mode || "open";
  const outName = (epVals.outName || `${baseName(state.fileName)}-extract.pdf`).trim();
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
  if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf,application/pdf";
  input.onchange = async () => {
    try {
      const file = input.files?.[0];
      if (!file) return;
      const src = await PDFLib.PDFDocument.load(await readAndNormalizePdfFile(file), { ignoreEncryption: true });
      const srcTotal = src.getPageCount();
      const ipVals = await openSettingsDialog({
        title: `插入頁面：${file.name}`,
        submitText: "插入",
        fields: [
          { key: "range", label: `來源頁面範圍（共 ${srcTotal} 頁）`, type: "text", value: "all", placeholder: "all / 1-3,5" },
          { key: "pos", label: "插入位置", type: "select", value: "after", options: [
            { value: "before", label: "在目前頁之前" }, { value: "after", label: "在目前頁之後" }, { value: "end", label: "文件末尾" },
          ]},
        ],
      });
      if (!ipVals) return;
      const srcIdx = parseRangeExtended(ipVals.range || "all", srcTotal);
      if (!srcIdx.length) return alert("沒有選取來源頁面。");
      const pos = ipVals.pos || "after";
      let insertAt = state.pdfLib.getPageCount();
      if (pos === "before") insertAt = Math.max(0, state.currentPage - 1);
      else if (pos === "after") insertAt = Math.min(state.pdfLib.getPageCount(), state.currentPage);
      const pages = await state.pdfLib.copyPages(src, srcIdx);
      pages.forEach((p, n) => state.pdfLib.insertPage(insertAt + n, p));
      await reloadFromPdfLib();
      goToPage(insertAt + 1);
    } catch (err) {
      alert(`從 PDF 插入失敗：${err.message || err}`);
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
  if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
  const target = getDocById(targetDocId);
  if (!target) return alert("找不到目標文件。");
  if (!srcIdx.length) return alert("沒有選取頁面。");
  if (removeFromSource && srcIdx.length >= state.totalPages) return alert("來源文件至少需保留一頁。");

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
  alert(`已${removeFromSource ? "移動" : "複製"} ${srcIdx.length} 頁到「${target.fileName}」`);
}

async function transferPagesToOtherDocumentPrompt(removeFromSource) {
  if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
  const other = getOtherDocs();
  if (!other.length) return alert("需要至少 2 個已開啟的文件。");
  const tpVals = await openSettingsDialog({
    title: removeFromSource ? "移動頁面到其他文件" : "複製頁面到其他文件",
    submitText: removeFromSource ? "移動" : "複製",
    fields: [
      { key: "range", label: "頁面範圍", type: "text", value: String(state.currentPage), placeholder: "all / 1-3,5 / odd" },
      { key: "target", label: "目標文件", type: "select", value: "0", options: other.map((d, i) => ({ value: String(i), label: d.fileName })) },
    ],
  });
  if (!tpVals) return;
  const srcIdx = parseRangeExtended(tpVals.range || String(state.currentPage), state.totalPages);
  if (!srcIdx.length) return alert("沒有有效來源頁面。");
  const pick = Number(tpVals.target) + 1;
  if (!Number.isFinite(pick) || pick < 1 || pick > other.length) return alert("目標無效。");
  await transferPagesToDocument(srcIdx, other[pick - 1].id, removeFromSource);
}

async function copyCurrentPageText() {
  if (!state.pdfjs) return;
  const page = await state.pdfjs.getPage(state.currentPage);
  const textContent = await page.getTextContent();
  const text = textContent.items.map((x) => x.str).join(" ");
  try {
    await navigator.clipboard.writeText(text);
    alert(`已複製 ${text.length} 個字元`);
  } catch {
    alert(text || "此頁沒有可提取的文字");
  }
}

async function exportImageRegionPrompt() {
  if (!state.pdfjs) return alert("請先開啟 PDF。");
  const canvas = $("pages").querySelector(`.pw[data-page="${state.currentPage}"] canvas`);
  if (!canvas) return alert("找不到頁面畫布。");
  const dW = canvas.width;
  const dH = canvas.height;
  const erVals = await openSettingsDialog({
    title: "匯出頁面區域圖片",
    submitText: "匯出",
    fields: [
      { key: "x", label: `區域 X（0～${dW-1}）`, type: "number", value: "0", min: "0", step: "1" },
      { key: "y", label: `區域 Y（0～${dH-1}）`, type: "number", value: "0", min: "0", step: "1" },
      { key: "w", label: "寬度（像素）", type: "number", value: String(Math.max(1, Math.floor(dW / 2))), min: "1", step: "1" },
      { key: "h", label: "高度（像素）", type: "number", value: String(Math.max(1, Math.floor(dH / 2))), min: "1", step: "1" },
    ],
  });
  if (!erVals) return;
  const x = Number(erVals.x);
  const y = Number(erVals.y);
  const w = Number(erVals.w);
  const h = Number(erVals.h);
  if (![x, y, w, h].every((n) => Number.isFinite(n))) return alert("數值無效。");
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
    if (!blob) return alert("匯出區域失敗。");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName(state.fileName)}-p${String(state.currentPage).padStart(3, "0")}-region.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, "image/png");
}

async function insertImagePrompt() {
  if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/jpg";
  input.onchange = async () => {
    try {
      const file = input.files?.[0];
      if (!file) return;
      const page = state.pdfLib.getPage(state.currentPage - 1);
      const s = page.getSize();
      const iiVals = await openSettingsDialog({
        title: `插入圖片：${file.name}`,
        submitText: "插入",
        fields: [
          { key: "x", label: "X（pt）", type: "number", value: "60", min: "0", step: "1" },
          { key: "yTop", label: "Y 從頂端（pt）", type: "number", value: "120", min: "0", step: "1" },
          { key: "w", label: "寬（pt）", type: "number", value: "180", min: "1", step: "1" },
          { key: "h", label: "高（pt）", type: "number", value: "120", min: "1", step: "1" },
        ],
      });
      if (!iiVals) return;
      const x = Number(iiVals.x);
      const yTop = Number(iiVals.yTop);
      const w = Number(iiVals.w);
      const h = Number(iiVals.h);
      if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n > 0)) return alert("幾何數值無效。");
      const y = s.height - yTop - h;
      const ext = file.name.toLowerCase();
      const bytes = await file.arrayBuffer();
      let img;
      if (ext.endsWith(".png")) img = await state.pdfLib.embedPng(bytes);
      else img = await state.pdfLib.embedJpg(bytes);
      page.drawImage(img, { x, y, width: w, height: h });
      await reloadFromPdfLib();
    } catch (err) {
      alert(`插入圖片失敗：${err.message || err}`);
    }
  };
  input.click();
}

async function extractImagesPrompt() {
  if (!state.pdfjs) return alert("請先開啟 PDF。");
  const eiVals = await openSettingsDialog({
    title: "提取頁面圖片",
    submitText: "提取並下載",
    fields: [
      { key: "range", label: "頁面範圍", type: "text", value: "all", placeholder: "all / 1-3,5" },
      { key: "fmt", label: "格式", type: "select", value: "png", options: [{ value: "png", label: "PNG" }, { value: "jpg", label: "JPG" }] },
      { key: "scale", label: "縮放係數（0.5～4）", type: "number", value: "2", min: "0.5", max: "4", step: "0.5" },
      { key: "jpgQ", label: "JPG 品質（0.4～0.98）", type: "number", value: "0.86", min: "0.4", max: "0.98", step: "0.02" },
    ],
  });
  if (!eiVals) return;
  const idx = parseRangeExtended(eiVals.range || "all", state.totalPages);
  if (!idx.length) return alert("沒有有效頁面。");
  const fmt = (eiVals.fmt || "png").trim().toLowerCase();
  const scale = Math.max(0.5, Math.min(4, Number(eiVals.scale) || 2));
  const jpgQ = Math.max(0.4, Math.min(0.98, Number(eiVals.jpgQ) || 0.86));
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
  if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/jpg,image/webp";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    const riVals = await openSettingsDialog({
      title: `替換圖片區域：${file.name}`,
      submitText: "替換",
      fields: [
        { key: "page", label: "目標頁碼", type: "number", value: String(state.currentPage), min: "1", step: "1" },
        { key: "x", label: "區域 X（pt）", type: "number", value: "60", min: "0", step: "1" },
        { key: "yTop", label: "區域 Y 從頂端（pt）", type: "number", value: "120", min: "0", step: "1" },
        { key: "w", label: "寬（pt）", type: "number", value: "180", min: "1", step: "1" },
        { key: "h", label: "高（pt）", type: "number", value: "120", min: "1", step: "1" },
      ],
    });
    if (!riVals) return;
    const pageNum = Number(riVals.page);
    if (!Number.isFinite(pageNum) || pageNum < 1 || pageNum > state.totalPages) return alert("頁碼無效。");
    const x = Number(riVals.x);
    const yTop = Number(riVals.yTop);
    const w = Number(riVals.w);
    const h = Number(riVals.h);
    if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n > 0)) return alert("幾何數值無效。");
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
      showToast("印章圖片已載入，點擊頁面放置。");
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

async function openStampManagerPrompt() {
  const smVals = await openSettingsDialog({
    title: "印章管理",
    submitText: "執行",
    fields: [{ key: "action", label: "動作", type: "select", value: "list", options: [
      { value: "list", label: "列出預設印章" },
      { value: "use", label: "使用選取的預設" },
      { value: "save", label: "儲存目前印章為預設" },
      { value: "delete", label: "刪除選取的預設" },
    ]}],
  });
  if (!smVals) return;
  const action = smVals.action || "list";
  if (action === "use") return applySelectedStampPreset();
  if (action === "save") return saveCurrentStampAsPreset();
  if (action === "delete") return deleteSelectedStampPreset();
  if (action === "list") {
    const lines = (state.stampPresets || []).map((x, i) => `${i + 1}. ${x.name}`).join("\n");
    alert(lines || "目前沒有印章預設");
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
  if (!state.pdfjs) return alert("請先開啟 PDF。");
  const csVals = await openSettingsDialog({
    title: "騎縫章",
    submitText: "選擇圖片",
    message: "設定後將提示您選擇騎縫章圖片檔案",
    fields: [
      { key: "range", label: "頁面範圍（例如 2-5）", type: "text", value: `${state.currentPage}-${Math.min(state.totalPages, state.currentPage + 1)}` },
    ],
  });
  if (!csVals) return;
  const idx = parseRangeExtended(csVals.range || String(state.currentPage), state.totalPages);
  if (!idx.length) return alert("沒有有效頁面。");
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
          alert(`騎縫章失敗：${err2.message || err2}`);
        }
      };
      r.readAsDataURL(file);
    } catch (err) {
      alert(`騎縫章失敗：${err.message || err}`);
    }
  };
  input.click();
}

async function promptFind() {
  if (!state.pdfjs) return;
  const fVals = await openSettingsDialog({
    title: "搜尋文字",
    submitText: "搜尋",
    fields: [{ key: "q", label: "搜尋關鍵字", type: "text", value: "" }],
  });
  if (!fVals || !fVals.q.trim()) return;
  searchAll(fVals.q.trim());
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
    alert("沒有符合結果");
    return;
  }
  state.searchCursor = 0;
  renderSearchHitPanel();
  goToPage(state.searchHits[0]);
  alert(`在 ${state.searchHits.length} 頁找到符合結果，按 Ctrl+G 前往下一個。`);
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
    ["框選裁切目前頁", () => { if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。"); setActiveTool("crop"); showToast("在頁面上拖曳框選要保留的區域，確認後點「套用裁切」", "info", 3500); }],
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
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const vals = await openSettingsDialog({
    title: "浮水印設定",
    submitText: "套用浮水印",
    fields: [
      { key: "text", label: "浮水印文字（建議用英文或數字）", type: "text", value: "CONFIDENTIAL" },
      { key: "range", label: "頁面範圍", type: "text", value: "all", placeholder: "all / 1-3,5 / odd" },
      { key: "opacity", label: "透明度（0.05～1.0）", type: "number", value: "0.18", min: "0.05", step: "0.01" },
      { key: "angle", label: "傾斜角度（度）", type: "number", value: "35", step: "1" },
      { key: "fontSize", label: "字體大小", type: "number", value: "34", min: "6", step: "1" },
    ],
  });
  if (!vals || !vals.text.trim()) return;
  const text = vals.text.trim();
  warnIfCJK(text, "浮水印文字");
  const rangeInput = vals.range || "all";
  const opacity = Number(vals.opacity);
  const angle = Number(vals.angle);
  const fontSize = Number(vals.fontSize);
  const wPages = parseAnnotationRangeInput(rangeInput);
  if (!wPages.length) return alert("沒有有效頁面。");
  wPages.forEach((pNum) => {
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
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const vals = await openSettingsDialog({
    title: "頁碼設定",
    submitText: "套用頁碼",
    fields: [
      { key: "range", label: "頁面範圍", type: "text", value: "all", placeholder: "all / 1-3,5 / odd" },
      { key: "startNo", label: "起始頁碼", type: "number", value: "1", min: "1", step: "1" },
      { key: "pos", label: "位置", type: "select", value: "br", options: [
        { value: "tl", label: "左上" }, { value: "tr", label: "右上" },
        { value: "bl", label: "左下" }, { value: "br", label: "右下" },
      ]},
      { key: "size", label: "字體大小", type: "number", value: "12", min: "6", step: "1" },
    ],
  });
  if (!vals) return;
  const rangeInput = vals.range || "all";
  const startNo = Number(vals.startNo);
  const pos = vals.pos || "br";
  const size = Number(vals.size);
  const pnPages = parseAnnotationRangeInput(rangeInput);
  if (!pnPages.length) return alert("沒有有效頁面。");
  pnPages.forEach((pNum, idx) => {
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

async function configurePageLabelsPrompt() {
  if (!state.pdfjs) return alert("請先開啟 PDF。");
  const vals = await openSettingsDialog({
    title: "頁面標籤設定",
    submitText: "套用",
    fields: [
      { key: "mode", label: "標籤模式", type: "select", value: "decimal", options: [
        { value: "clear", label: "清除頁籤" },
        { value: "decimal", label: "阿拉伯數字（1,2,3…）" },
        { value: "roman-lower", label: "小寫羅馬（i,ii,iii…）" },
        { value: "roman-upper", label: "大寫羅馬（I,II,III…）" },
        { value: "prefix", label: "自訂前綴" },
      ]},
      { key: "range", label: "頁面範圍", type: "text", value: "all", placeholder: "all / 1-10" },
      { key: "start", label: "起始值", type: "number", value: "1", min: "1", step: "1" },
      { key: "prefix", label: "前綴文字（僅限「自訂前綴」模式）", type: "text", value: "A-" },
    ],
  });
  if (!vals) return;
  const mode = vals.mode || "decimal";
  if (mode === "clear") {
    state.pageLabelRules = [];
    renderThumbnails();
    updateStatus();
    persistRecoveryForFile();
    return;
  }
  const idx = parseRangeExtended(vals.range || "all", state.totalPages);
  if (!idx.length) return alert("沒有有效頁面。");
  const from = Math.min(...idx) + 1;
  const to = Math.max(...idx) + 1;
  const start = Number(vals.start);
  if (!Number.isFinite(start) || start < 1) return alert("起始值無效。");
  const prefix = mode === "prefix" ? (vals.prefix || "A-") : "";
  state.pageLabelRules = (state.pageLabelRules || []).filter((r) => to < r.from || from > r.to);
  state.pageLabelRules.push({ from, to, style: mode, start: Math.floor(start), prefix });
  state.pageLabelRules.sort((a, b) => a.from - b.from);
  renderThumbnails();
  updateStatus();
  persistRecoveryForFile();
}

async function applyHeaderFooterPrompt() {
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const vals = await openSettingsDialog({
    title: "頁首/頁尾設定",
    submitText: "套用",
    fields: [
      { key: "template", label: "範本（可用 {page} {total} {date}）", type: "text", value: "{page}/{total}  {date}" },
      { key: "range", label: "頁面範圍", type: "text", value: "all", placeholder: "all / 1-3,5 / odd" },
      { key: "position", label: "位置", type: "select", value: "top-right", options: [
        { value: "top-left", label: "頂端左側" }, { value: "top-right", label: "頂端右側" },
        { value: "bottom-left", label: "底端左側" }, { value: "bottom-right", label: "底端右側" },
      ]},
      { key: "size", label: "字體大小", type: "number", value: "10", min: "6", step: "1" },
    ],
  });
  if (!vals) return;
  const template = vals.template ?? "";
  warnIfCJK(template, "頁首/頁尾範本");
  const rangeInput = vals.range || "all";
  const position = vals.position || "top-right";
  const size = Number(vals.size);
  const hfPages = parseAnnotationRangeInput(rangeInput);
  if (!hfPages.length) return alert("沒有有效頁面。");

  const total = state.totalPages;
  const dateStr = new Date().toISOString().slice(0, 10);
  hfPages.forEach((pNum) => {
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
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const vals = await openSettingsDialog({
    title: "編輯 PDF 中繼資料",
    submitText: "套用",
    fields: [
      { key: "title", label: "標題", type: "text", value: "" },
      { key: "author", label: "作者", type: "text", value: "" },
      { key: "subject", label: "主旨", type: "text", value: "" },
      { key: "keywords", label: "關鍵字（逗號分隔）", type: "text", value: "" },
      { key: "producer", label: "製作程式", type: "text", value: "Offline PDF Studio" },
    ],
  });
  if (!vals) return;
  const title = vals.title ?? "";
  const author = vals.author ?? "";
  const subject = vals.subject ?? "";
  const keywordsRaw = vals.keywords ?? "";
  const producer = vals.producer ?? "Offline PDF Studio";

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
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const vals = await openSettingsDialog({
    title: "新增超連結",
    submitText: "插入",
    fields: [
      { key: "page", label: "目標頁碼", type: "number", value: String(state.currentPage), min: "1", step: "1" },
      { key: "url", label: "URL（https://...）", type: "text", value: "https://", placeholder: "https://example.com" },
      { key: "x", label: "矩形 X（pt）", type: "number", value: "50", min: "0", step: "1" },
      { key: "yTop", label: "矩形 Y 從頂端（pt）", type: "number", value: "50", min: "0", step: "1" },
      { key: "w", label: "矩形寬（pt）", type: "number", value: "240", min: "1", step: "1" },
      { key: "h", label: "矩形高（pt）", type: "number", value: "28", min: "1", step: "1" },
    ],
  });
  if (!vals) return;
  const pNum = Number(vals.page);
  if (!Number.isFinite(pNum) || pNum < 1 || pNum > state.totalPages) return alert("頁碼無效。");
  const url = (vals.url || "").trim();
  if (!/^https?:\/\//i.test(url)) return alert("URL 格式無效。");
  const x = Number(vals.x);
  const yTop = Number(vals.yTop);
  const w = Number(vals.w);
  const h = Number(vals.h);
  if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n > 0)) return alert("矩形數值無效。");

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
    alert(`新增連結失敗：${err.message}`);
  }
}

async function addFormFieldPrompt() {
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const vals = await openSettingsDialog({
    title: "新增表單欄位",
    submitText: "新增",
    fields: [
      { key: "type", label: "欄位類型", type: "select", value: "text", options: [
        { value: "text", label: "文字框" }, { value: "checkbox", label: "勾選框" },
        { value: "radio", label: "單選（radio）" }, { value: "dropdown", label: "下拉選單" },
        { value: "signature", label: "簽名欄" },
      ]},
      { key: "name", label: "欄位名稱", type: "text", value: `field_${Date.now()}` },
      { key: "opts", label: "選項（radio/下拉，逗號分隔）", type: "text", value: "A,B,C" },
      { key: "page", label: "目標頁碼", type: "number", value: String(state.currentPage), min: "1", step: "1" },
      { key: "x", label: "X（pt）", type: "number", value: "60", min: "0", step: "1" },
      { key: "yTop", label: "Y 從頂端（pt）", type: "number", value: "120", min: "0", step: "1" },
      { key: "w", label: "寬（pt）", type: "number", value: "180", min: "1", step: "1" },
      { key: "h", label: "高（pt）", type: "number", value: "24", min: "1", step: "1" },
    ],
  });
  if (!vals) return;
  const type = (vals.type || "text").trim().toLowerCase();
  const name = (vals.name || "").trim();
  if (!name) return;
  const pageNum = Number(vals.page);
  if (!Number.isFinite(pageNum) || pageNum < 1 || pageNum > state.totalPages) return alert("頁碼無效。");
  const x = Number(vals.x);
  const yTop = Number(vals.yTop);
  const w = Number(vals.w);
  const h = Number(vals.h);
  if (![x, yTop, w, h].every((n) => Number.isFinite(n) && n > 0)) return alert("幾何數值無效。");

  const page = state.pdfLib.getPage(pageNum - 1);
  const s = page.getSize();
  const y = s.height - yTop - h;
  const form = state.pdfLib.getForm();
  if (type === "checkbox") {
    const cb = form.createCheckBox(name);
    cb.addToPage(page, { x, y, width: w, height: h });
  } else if (type === "radio") {
    const opts = (vals.opts || "A,B,C").split(",").map((o) => o.trim()).filter(Boolean);
    if (!opts.length) return alert("沒有選項（radio）。");
    const rg = form.createRadioGroup(name);
    const eachH = Math.max(14, Math.floor(h / opts.length));
    opts.forEach((opt, i) => {
      rg.addOptionToPage(opt, page, { x, y: y + (opts.length - 1 - i) * eachH, width: 12, height: 12 });
      page.drawText(opt, { x: x + 18, y: y + (opts.length - 1 - i) * eachH + 1, size: 10 });
    });
  } else if (type === "dropdown") {
    const opts = (vals.opts || "Option1,Option2").split(",").map((o) => o.trim()).filter(Boolean);
    if (!opts.length) return alert("沒有選項（下拉）。");
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
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const form = state.pdfLib.getForm();
  const fields = form.getFields();
  if (!fields.length) return alert("沒有表單欄位。");
  const hint = fields.map((f) => `${f.getName()}=`).join("\n");
  const ffVals = await openSettingsDialog({
    title: "填寫表單欄位",
    submitText: "填入",
    fields: [{ key: "raw", label: "欄位值（field=value 每行一組）", type: "textarea", value: hint, placeholder: hint }],
  });
  if (!ffVals) return;
  const lines = ffVals.raw.split("\n").map(l => l.trim()).filter(Boolean);
  lines.forEach(line => {
    const eq = line.indexOf("=");
    if (eq < 1) return;
    const fname = line.slice(0, eq).trim();
    const fval = line.slice(eq + 1);
    try {
      const field = form.getField(fname);
      if (field.constructor.name === "PDFCheckBox") { fval.trim().toLowerCase() === "true" ? field.check() : field.uncheck(); }
      else if (field.getText !== undefined) { field.setText(fval); }
    } catch { /* skip unknown fields */ }
  });
  await reloadFromPdfLib();
}

function getShortcuts() {
  try {
    const overrides = JSON.parse(localStorage.getItem(SHORTCUTS_KEY) || "{}");
    return Object.assign({}, DEFAULT_SHORTCUTS, overrides);
  } catch { return Object.assign({}, DEFAULT_SHORTCUTS); }
}

async function editShortcutBindings() {
  const currentMap = getShortcuts();
  const hint = Object.entries(currentMap).map(([k, v]) => `${k}=${v}`).join("\n");
  const scVals = await openSettingsDialog({
    title: "快捷鍵設定",
    submitText: "儲存",
    fields: [{ key: "raw", label: "快捷鍵（action=key 每行一組，例如 save=Ctrl+S）", type: "textarea", value: hint }],
  });
  if (!scVals) return;
  const lines = scVals.raw.split("\n").map(l => l.trim()).filter(Boolean);
  const out = {};
  lines.forEach(line => { const i = line.indexOf("="); if (i > 0) out[line.slice(0,i).trim()] = line.slice(i+1).trim(); });
  localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(out));
  alert("快捷鍵已更新。");
}

async function compressDocumentPrompt() {
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const cVals = await openSettingsDialog({
    title: "壓縮 PDF",
    submitText: "壓縮並下載",
    fields: [
      { key: "level", label: "壓縮等級", type: "select", value: "medium", options: [
        { value: "low", label: "低（較快，較大）" },
        { value: "medium", label: "中等（建議）" },
        { value: "high", label: "高（較慢，較小）" },
      ]},
      { key: "name", label: "輸出檔名", type: "text", value: `${baseName(state.fileName)}-compressed.pdf` },
    ],
  });
  if (!cVals) return;
  const bytes = await state.pdfLib.save({ useObjectStreams: cVals.level !== "low" });
  downloadBytes(bytes, (cVals.name || `${baseName(state.fileName)}-compressed.pdf`).trim());
}

async function applyBatesNumberingPrompt() {
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const bVals = await openSettingsDialog({
    title: "Bates 編號",
    submitText: "套用",
    fields: [
      { key: "prefix", label: "前綴", type: "text", value: "DOC-" },
      { key: "start", label: "起始號碼", type: "number", value: "1", min: "0", step: "1" },
      { key: "digits", label: "最小位數", type: "number", value: "5", min: "1", step: "1" },
      { key: "range", label: "頁面範圍", type: "text", value: "all", placeholder: "all / 1-3,5" },
      { key: "pos", label: "位置", type: "select", value: "br", options: [
        { value: "tl", label: "左上" }, { value: "tr", label: "右上" },
        { value: "bl", label: "左下" }, { value: "br", label: "右下" },
      ]},
    ],
  });
  if (!bVals) return;
  const prefix = bVals.prefix || "DOC-";
  const start = Number(bVals.start) || 0;
  const digits = Math.max(1, Number(bVals.digits) || 5);
  const bPages = parseAnnotationRangeInput(bVals.range || "all");
  if (!bPages.length) return alert("沒有有效頁面。");
  const pos = bVals.pos || "br";
  bPages.forEach((pNum, i) => {
    const page = state.pdfLib.getPage(pNum - 1);
    const s = page.getSize();
    const label = prefix + String(start + i).padStart(digits, "0");
    const m = 20;
    let x = s.width - m * 4, y = m;
    if (pos === "tl") { x = m; y = s.height - m; }
    else if (pos === "tr") { x = s.width - m * 4; y = s.height - m; }
    else if (pos === "bl") { x = m; y = m; }
    page.drawText(label, { x, y, size: 9 });
  });
  await reloadFromPdfLib();
}

function getRecoveryStore() {
  try { return JSON.parse(localStorage.getItem(RECOVERY_KEY) || "{}"); } catch { return {}; }
}

function persistRecoveryForFile() {
  if (!state.fileName || !state.pdfjs) return;
  try {
    const store = getRecoveryStore();
    store[state.fileName] = {
      fileName: state.fileName,
      annotations: state.annotations,
      customBookmarks: state.customBookmarks,
      pageLabelRules: state.pageLabelRules,
      updatedAt: Date.now(),
    };
    localStorage.setItem(RECOVERY_KEY, JSON.stringify(store));
  } catch { /* quota exceeded or private mode */ }
}

async function maybeRestoreRecoveryForFile(fileName) {
  const store = getRecoveryStore();
  const rec = store[fileName];
  if (!rec) return;
  const ageMinutes = Math.floor((Date.now() - (rec.updatedAt || 0)) / 60000);
  const ok = await openConfirmDialog(
    `找到「${fileName}」的自動備份（${ageMinutes} 分鐘前），是否還原？`,
    "還原備份"
  );
  if (!ok) return;
  if (rec.annotations) state.annotations = rec.annotations;
  if (rec.customBookmarks) state.customBookmarks = rec.customBookmarks;
  if (rec.pageLabelRules) state.pageLabelRules = rec.pageLabelRules;
  redrawAllAnnotationLayers();
  renderBookmarks();
  renderThumbnails();
  updateStatus();
}

function startAutoBackupTimer() {
  setInterval(() => {
    try { persistRecoveryForFile(); } catch { /* ignore */ }
  }, 30000);
}

// ============================================================
// RESTORED MISSING FUNCTIONS
// ============================================================

// --- parseRange (0-indexed array from "1-3,5,odd" style expr) ---
function parseRange(expr, total) {
  const raw = (expr || "").trim().toLowerCase();
  if (!raw || raw === "all") return Array.from({ length: total }, (_, i) => i);
  const result = new Set();
  raw.split(",").map(p => p.trim()).filter(Boolean).forEach(part => {
    if (part === "odd") { for (let i = 0; i < total; i += 2) result.add(i); return; }
    if (part === "even") { for (let i = 1; i < total; i += 2) result.add(i); return; }
    const dash = part.indexOf("-");
    if (dash > 0) {
      const a = parseInt(part.slice(0, dash), 10) - 1;
      const b = parseInt(part.slice(dash + 1), 10) - 1;
      for (let i = Math.max(0, a); i <= Math.min(total - 1, b); i++) result.add(i);
    } else {
      const n = parseInt(part, 10) - 1;
      if (n >= 0 && n < total) result.add(n);
    }
  });
  return [...result].sort((a, b) => a - b);
}

// --- Diagnostics log ---
const _logBuffer = [];
function pushLog(level, msg, data) {
  _logBuffer.push({ t: Date.now(), level, msg, data: data ?? null });
  if (_logBuffer.length > 500) _logBuffer.shift();
  try { localStorage.setItem(LOG_KEY, JSON.stringify(_logBuffer.slice(-200))); } catch { /* quota */ }
}

function bindErrorLogging() {
  window.addEventListener("error", (e) => pushLog("error", e.message || "JS Error", { file: e.filename, line: e.lineno }));
  window.addEventListener("unhandledrejection", (e) => pushLog("error", String(e.reason), {}));
}

function exportDiagnosticsLog() {
  const lines = _logBuffer.map(e => {
    const ts = new Date(e.t).toISOString();
    return "[" + ts + "] [" + e.level + "] " + e.msg + (e.data ? " " + JSON.stringify(e.data) : "");
  });
  const blob = new Blob([lines.join("\n") || "（無日誌）"], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "pdf-studio-log.txt"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function clearDiagnosticsLog() {
  _logBuffer.length = 0;
  try { localStorage.removeItem(LOG_KEY); } catch { /* ok */ }
  alert("日誌已清除。");
}

// --- Recent files ---
function loadRecentFiles() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}

function addToRecent(fileName) {
  if (!fileName) return;
  let list = loadRecentFiles().filter(f => f !== fileName);
  list.unshift(fileName);
  if (list.length > 10) list = list.slice(0, 10);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch { /* quota */ }
}

function renderRecent() {
  const ul = $("recent");
  if (!ul) return;
  const list = loadRecentFiles();
  if (!list.length) {
    ul.innerHTML = "<li style='color:#888'>（無最近開啟）</li>";
    return;
  }
  ul.innerHTML = list.map(f => "<li>" + f + "</li>").join("");
  ul.querySelectorAll("li").forEach((li, i) => {
    if (!list[i]) return;
    li.style.cursor = "pointer";
    li.title = list[i];
    li.addEventListener("click", () => showToast("請直接拖曳或開啟檔案", "info"));
  });
}

// --- Keyboard shortcut helpers ---
function eventToCombo(e) {
  const parts = [];
  if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
  if (e.altKey) parts.push("Alt");
  if (e.shiftKey) parts.push("Shift");
  const key = e.key;
  if (key !== "Control" && key !== "Alt" && key !== "Shift" && key !== "Meta") {
    parts.push(key.length === 1 ? key.toUpperCase() : key);
  }
  return parts.join("+");
}

function normalizeCombo(combo) {
  if (!combo) return "";
  return combo.split("+").map(p => p.trim()).join("+");
}

function runShortcutAction(actionId) {
  onToolbarAction(actionId);
}

// --- Command palette ---
let _commands = [];

function buildCommands() {
  _commands = [];
  Object.entries(TOOLBAR).forEach(([tab, groups]) => {
    groups.forEach(group => {
      group.items.forEach(([id, label]) => {
        _commands.push({ id, label, tab });
      });
    });
  });
}

function openCommandPalette() {
  const dlg = $("cmd");
  if (!dlg) return;
  dlg.classList.add("show");
  const q = $("q");
  if (q) { q.value = ""; q.focus(); }
  renderCommandList();
}

function closeCommandPalette() {
  const dlg = $("cmd");
  if (dlg) dlg.classList.remove("show");
}

function renderCommandList() {
  const ql = $("ql");
  if (!ql) return;
  const query = ($("q")?.value || "").toLowerCase().trim();
  const filtered = query
    ? _commands.filter(c => c.label.toLowerCase().includes(query) || c.id.toLowerCase().includes(query))
    : _commands.slice(0, 20);
  ql.innerHTML = filtered.slice(0, 30).map((c, i) =>
    "<div class=\"qi" + (i === 0 ? " sel" : "") + "\" data-id=\"" + safeAttr(c.id) + "\">" + c.label + " <small>" + c.tab + "</small></div>"
  ).join("");
  ql.querySelectorAll(".qi").forEach(el => {
    el.addEventListener("click", () => {
      closeCommandPalette();
      onToolbarAction(el.dataset.id);
    });
  });
}

function onCommandKeyDown(e) {
  const ql = $("ql");
  if (!ql) return;
  const items = [...ql.querySelectorAll(".qi")];
  const sel = ql.querySelector(".qi.sel");
  const idx = sel ? items.indexOf(sel) : -1;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (sel) sel.classList.remove("sel");
    const next = items[Math.min(items.length - 1, idx + 1)];
    if (next) { next.classList.add("sel"); next.scrollIntoView({ block: "nearest" }); }
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (sel) sel.classList.remove("sel");
    const prev = items[Math.max(0, idx - 1)];
    if (prev) { prev.classList.add("sel"); prev.scrollIntoView({ block: "nearest" }); }
  } else if (e.key === "Enter") {
    e.preventDefault();
    const active = ql.querySelector(".qi.sel");
    if (active) { closeCommandPalette(); onToolbarAction(active.dataset.id); }
  } else if (e.key === "Escape") {
    closeCommandPalette();
  }
}

// --- Stamp preset management ---
function loadStampPresets() {
  try {
    state.stampPresets = JSON.parse(localStorage.getItem(STAMP_PRESET_KEY) || "[]");
  } catch {
    state.stampPresets = [];
  }
  renderStampPresetOptions();
}

function saveStampPresets() {
  try { localStorage.setItem(STAMP_PRESET_KEY, JSON.stringify(state.stampPresets || [])); } catch { /* quota */ }
}

function renderStampPresetOptions() {
  const sel = $("stampPresetSel");
  if (!sel) return;
  sel.innerHTML = (state.stampPresets || []).map((p, i) =>
    "<option value=\"" + i + "\">" + safeAttr(p.name) + "</option>"
  ).join("") || "<option value=\"\">（無預設）</option>";
}

async function saveCurrentStampAsPreset() {
  const vals = await openSettingsDialog({
    title: "儲存印章預設",
    submitText: "儲存",
    fields: [{ key: "name", label: "預設名稱", type: "text", value: "我的印章" }],
  });
  if (!vals || !vals.name.trim()) return;
  const preset = {
    name: vals.name.trim(),
    tool: state.activeTool,
    stampText: state.stampText || "",
    stampImageDataUrl: state.stampImageDataUrl || "",
  };
  state.stampPresets = state.stampPresets || [];
  state.stampPresets.push(preset);
  saveStampPresets();
  renderStampPresetOptions();
  alert("已儲存預設「" + preset.name + "」");
}

function applySelectedStampPreset() {
  const sel = $("stampPresetSel");
  if (!sel) return;
  const idx = parseInt(sel.value, 10);
  const preset = (state.stampPresets || [])[idx];
  if (!preset) return alert("請先選取一個預設。");
  if (preset.stampText) {
    state.stampText = preset.stampText;
    setActiveTool("stampText");
  } else if (preset.stampImageDataUrl) {
    state.stampImageDataUrl = preset.stampImageDataUrl;
    setActiveTool("stampImage");
  } else {
    setActiveTool(preset.tool || "select");
  }
  showToast("已套用預設「" + preset.name + "」");
}

async function deleteSelectedStampPreset() {
  const sel = $("stampPresetSel");
  if (!sel) return;
  const idx = parseInt(sel.value, 10);
  const preset = (state.stampPresets || [])[idx];
  if (!preset) return alert("請先選取一個預設。");
  if (!(await openConfirmDialog("確定刪除預設「" + preset.name + "」？", "刪除"))) return;
  state.stampPresets.splice(idx, 1);
  saveStampPresets();
  renderStampPresetOptions();
}

// --- Flatten annotations to PDF ---
async function flattenAnnotationsToPdf() {
  if (!state.pdfjs || !state.pdfLib) return alert("請先開啟可編輯的 PDF。");
  const total = Object.values(state.annotations).flat().length;
  if (!total) return alert("目前沒有任何註解。");
  const ok = await openConfirmDialog(
    "確定將 " + total + " 個註解扁平化到 PDF？（嵌入後無法以本工具再次編輯）",
    "扁平化"
  );
  if (!ok) return;
  for (const [pageStr, anns] of Object.entries(state.annotations)) {
    if (!anns.length) continue;
    const pNum = Number(pageStr);
    const wrap = $("pages").querySelector(".pw[data-page=\"" + pNum + "\"]");
    if (!wrap) continue;
    const canvas = wrap.querySelector(".pc");
    if (!canvas) continue;
    // Capture the full rendered page (including annotation overlay via canvas merge)
    const merged = document.createElement("canvas");
    merged.width = canvas.width;
    merged.height = canvas.height;
    const mctx = merged.getContext("2d");
    mctx.drawImage(canvas, 0, 0);
    // Draw annotation layer canvas if present
    const annCanvas = wrap.querySelector("canvas.ann-canvas");
    if (annCanvas) mctx.drawImage(annCanvas, 0, 0);
    try {
      const dataUrl = merged.toDataURL("image/png");
      const imgBytes = await (await fetch(dataUrl)).arrayBuffer();
      const page = state.pdfLib.getPage(pNum - 1);
      const s = page.getSize();
      const img = await state.pdfLib.embedPng(imgBytes);
      page.drawImage(img, { x: 0, y: 0, width: s.width, height: s.height });
    } catch (err) {
      pushLog("warn", "flattenAnnotationsToPdf page " + pNum + " failed", { err: err.message });
    }
  }
  state.annotations = {};
  await reloadFromPdfLib();
  alert("扁平化完成。");
}

// --- Apply redaction annotations ---
async function applyRedactionsToPdf() {
  if (!state.pdfLib) return alert("請先開啟可編輯的 PDF。");
  const redacts = Object.entries(state.annotations).flatMap(([p, anns]) =>
    anns.filter(a => a.type === "rd").map(a => ({ ...a, page: Number(p) }))
  );
  if (!redacts.length) return alert("沒有遮蔽（紅色矩形）註解，請先用「遮蔽」工具標記要遮擋的區域。");
  const ok = await openConfirmDialog(
    "確定永久塗黑 " + redacts.length + " 個遮蔽區域？\n\n" +
    "⚠️ 安全限制說明：\n" +
    "本工具的遮蔽為「視覺遮蔽」，以黑色矩形覆蓋畫面，" +
    "但原始文字資料仍保留在 PDF Content Stream 中，" +
    "可透過 pdftotext 等工具提取。\n\n" +
    "如需符合法律/合規標準的安全遮蔽（Content Stream 手術），" +
    "請使用 Adobe Acrobat Pro 的「套用遮蔽」功能。",
    "套用視覺遮蔽"
  );
  if (!ok) return;
  for (const ann of redacts) {
    try {
      const page = state.pdfLib.getPage(ann.page - 1);
      const s = page.getSize();
      // ann coords are canvas pixels; estimate ratio from canvas width
      const wrap = $("pages").querySelector(".pw[data-page=\"" + ann.page + "\"]");
      const cv = wrap?.querySelector(".pc");
      const cw = cv ? cv.width : s.width;
      const ratio = s.width / cw;
      const x = ann.x * ratio;
      const y = s.height - (ann.y + ann.h) * ratio;
      const w = ann.w * ratio;
      const h = ann.h * ratio;
      page.drawRectangle({ x, y, width: w, height: h, color: PDFLib.rgb(0, 0, 0) });
    } catch (err) { pushLog("warn", "applyRedaction failed", { err: err.message }); }
  }
  // Remove the redact annotations from state
  Object.keys(state.annotations).forEach(p => {
    state.annotations[p] = (state.annotations[p] || []).filter(a => a.type !== "rd");
  });
  await reloadFromPdfLib();
  alert("遮蔽已套用完成。");
}

// --- Form data import/export ---
async function importFormDataPrompt() {
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  const input = document.createElement("input");
  input.type = "file"; input.accept = ".json,.csv";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const form = state.pdfLib.getForm();
      if (file.name.endsWith(".json")) {
        const data = JSON.parse(text);
        Object.entries(data).forEach(([k, v]) => {
          try { const f = form.getField(k); if (f.setText) f.setText(String(v)); } catch { /* skip unknown */ }
        });
      } else {
        text.split("\n").forEach(line => {
          const comma = line.indexOf(",");
          if (comma < 1) return;
          const k = line.slice(0, comma).trim();
          const v = line.slice(comma + 1).trim().replace(/^"|"$/g, "");
          try { const f = form.getField(k); if (f.setText) f.setText(v); } catch { /* skip */ }
        });
      }
      await reloadFromPdfLib();
      alert("表單資料已匯入。");
    } catch (err) { alert("匯入失敗：" + err.message); }
  };
  input.click();
}

function exportFormDataJson() {
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  try {
    const form = state.pdfLib.getForm();
    const out = {};
    form.getFields().forEach(f => {
      try { out[f.getName()] = f.getText?.() ?? (f.isChecked?.() ? "true" : "false"); } catch { out[f.getName()] = ""; }
    });
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = baseName(state.fileName) + "-form.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (err) { alert("匯出失敗：" + err.message); }
}

function exportFormDataCsv() {
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  try {
    const form = state.pdfLib.getForm();
    const rows = form.getFields().map(f => {
      let val = "";
      try { val = f.getText?.() ?? (f.isChecked?.() ? "true" : "false"); } catch { /* ok */ }
      return "\"" + f.getName() + "\",\"" + String(val).replace(/"/g, '""') + "\"";
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = baseName(state.fileName) + "-form.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (err) { alert("匯出失敗：" + err.message); }
}

function exportFormDataXfdf() {
  if (!state.pdfLib) return alert("請先開啟 PDF。");
  try {
    const form = state.pdfLib.getForm();
    const fields = form.getFields().map(f => {
      let val = "";
      try { val = f.getText?.() ?? ""; } catch { /* ok */ }
      const esc = val.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      return "<field name=\"" + safeAttr(f.getName()) + "\"><value>" + esc + "</value></field>";
    }).join("\n");
    const xfdf = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<xfdf xmlns=\"http://ns.adobe.com/xfdf/\">\n<fields>\n" + fields + "\n</fields>\n</xfdf>";
    const blob = new Blob([xfdf], { type: "application/vnd.adobe.xfdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = baseName(state.fileName) + "-form.xfdf"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (err) { alert("匯出失敗：" + err.message); }
}

function showXfaInfo() {
  alert("此 PDF 可能包含 XFA 格式表單。XFA 表單需要 Adobe Acrobat 才能完整互動。本工具支援讀取 AcroForm 欄位，不支援動態 XFA 表單渲染。");
}

init();