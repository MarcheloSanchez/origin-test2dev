// toggle-focus-advanced.mjs
// Usage:
// - No params (just toggle): works out of the box.
// - With params via QuickAdd "Arguments (JSON)":
//   {"mode":"on","sidebars":"both","hideUI":true,"readable":true,"width":880,"view":"keep"}
//   {"mode":"off"} (forces OFF)

module.exports = async (params = {}) => {
  const { app, Notice } = window;
  const body = document.body;

  // -------- Defaults & Params --------
  const mode = params.mode || "toggle";            // "on" | "off" | "toggle"
  const sidebars = params.sidebars || "both";      // "both" | "left" | "right" | "none"
  const hideUI = params.hideUI ?? true;            // hides ribbon/status, etc.
  const readable = params.readable ?? true;        // force readable line length ON in focus
  const width = params.width || 820;               // max editor width in px during focus
  const viewPref = params.view || "keep";          // "keep" | "reading" | "source"

  const FOCUS_CLASS = "focus-mode";
  const HIDE_CLASS  = "focus-hide-ui";
  const STYLE_ID    = "focus-style-block";
  const KEY_READABLE = "focus-prev-readable";
  const KEY_FONT     = "focus-prev-font"; // Optional, only if you decide to tweak font size later

  // -------- Helpers --------
  const ensureStyle = () => {
    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = `
/* Focus Mode injected CSS */
body.${FOCUS_CLASS} .workspace-ribbon,
body.${FOCUS_CLASS} .status-bar,
body.${FOCUS_CLASS} .workspace-tab-header-container,
body.${FOCUS_CLASS} .workspace-leaf .view-header {
  display: ${hideUI ? "none" : "revert"} !important;
}

body.${FOCUS_CLASS} .mod-root .workspace-leaf-content .markdown-source-view,
body.${FOCUS_CLASS} .mod-root .workspace-leaf-content .markdown-reading-view {
  max-width: ${width}px;
  margin: 0 auto !important;
  padding: 0 2rem !important;
}

/* Softer scrollbars */
body.${FOCUS_CLASS} ::-webkit-scrollbar { width: 8px; }
body.${FOCUS_CLASS} ::-webkit-scrollbar-thumb { border-radius: 8px; }
`;
  };

  const collapse = (which) => {
    try {
      const left = app.workspace.leftSplit;
      const right = app.workspace.rightSplit;
      if (which === "both" || which === "left") if (left && !left.collapsed) left.collapse();
      if (which === "both" || which === "right") if (right && !right.collapsed) right.collapse();
      // "none" = do nothing
    } catch (e) {}
  };

  const setViewModeIfRequested = () => {
    try {
      const leaf = app.workspace.getMostRecentLeaf();
      const view = leaf?.view;
      if (!view || typeof view.getMode !== "function" || typeof view.setMode !== "function") return;
      if (viewPref === "reading" && view.getMode() !== "preview") view.setMode("preview");
      if (viewPref === "source" && view.getMode() !== "source") view.setMode("source");
    } catch (e) {}
  };

  const enableFocus = () => {
    ensureStyle();
    collapse(sidebars);
    body.classList.add(FOCUS_CLASS);
    if (hideUI) body.classList.add(HIDE_CLASS);

    // Remember & set readable line length
    try {
      localStorage.setItem(KEY_READABLE, JSON.stringify(app.vault.getConfig("readableLineLength")));
      if (readable) app.vault.setConfig("readableLineLength", true);
    } catch (e) {}

    setViewModeIfRequested();
    new Notice("🧘 Focus mode ON");
  };

  const disableFocus = () => {
    body.classList.remove(FOCUS_CLASS, HIDE_CLASS);

    // Restore readable line length
    try {
      const prev = localStorage.getItem(KEY_READABLE);
      if (prev !== null) app.vault.setConfig("readableLineLength", JSON.parse(prev));
    } catch (e) {}

    new Notice("🧘 Focus mode OFF");
  };

  // -------- Main --------
  const currentlyOn = body.classList.contains(FOCUS_CLASS);
  if (mode === "on" || (mode === "toggle" && !currentlyOn)) return enableFocus();
  if (mode === "off" || (mode === "toggle" && currentlyOn)) return disableFocus();
};
