const { contextBridge, ipcRenderer } = require("electron");

// Safe, minimal bridge the web page can use to trigger a download+install.
contextBridge.exposeInMainWorld("smartScribe", {
  isDesktop: true,
  // Download the installer at `url`, then launch it. Resolves { ok, error? }.
  downloadAndRun: (url) => ipcRenderer.invoke("sm-download-run", url),
  // Register a progress callback (0-100).
  onUpdateProgress: (cb) => {
    ipcRenderer.removeAllListeners("sm-update-progress");
    ipcRenderer.on("sm-update-progress", (_e, pct) => { try { cb(pct); } catch (_) {} });
  }
});
