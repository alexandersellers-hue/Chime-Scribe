const { app, BrowserWindow, session, shell, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 720,
    minHeight: 560,
    backgroundColor: "#DCE2E4",
    title: "Smart Scribe",
    icon: path.join(__dirname, "icon-512.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile("index.html");

  // Open external links (e.g. "Open my Google Doc") in the real browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) { shell.openExternal(url); return { action: "deny" }; }
    return { action: "allow" };
  });
}

// Download a file (following GitHub's redirects), reporting progress, then launch it.
function downloadFile(url, dest, win) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = (u) => {
      https.get(u, { headers: { "User-Agent": "SmartScribe-Updater" } }, (res) => {
        // GitHub asset URLs 302-redirect to a CDN; follow them.
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) {
          reject(new Error("HTTP " + res.statusCode));
          return;
        }
        const total = parseInt(res.headers["content-length"] || "0", 10);
        let done = 0;
        res.on("data", (chunk) => {
          done += chunk.length;
          if (total && win && !win.isDestroyed()) {
            win.webContents.send("sm-update-progress", Math.round((done / total) * 100));
          }
        });
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(dest)));
      }).on("error", (err) => {
        try { fs.unlinkSync(dest); } catch (_) {}
        reject(err);
      });
    };
    get(url);
  });
}

ipcMain.handle("sm-download-run", async (evt, url) => {
  try {
    const win = BrowserWindow.getAllWindows()[0];
    const ext = /\.dmg($|\?)/i.test(url) ? ".dmg" : ".exe";
    const dest = path.join(app.getPath("temp"), "SmartScribe-Update-" + Date.now() + ext);
    await downloadFile(url, dest, win);
    // Launch the installer, then quit so it can replace the app.
    await shell.openPath(dest);
    setTimeout(() => app.quit(), 1500);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
});

app.whenReady().then(() => {
  // Auto-grant the microphone so the app never prompts.
  session.defaultSession.setPermissionRequestHandler((wc, permission, callback) => {
    callback(permission === "media" || permission === "microphone" || permission === "audioCapture");
  });
  session.defaultSession.setPermissionCheckHandler((wc, permission) => {
    return permission === "media" || permission === "microphone" || permission === "audioCapture";
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
