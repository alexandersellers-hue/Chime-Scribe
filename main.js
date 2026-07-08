const { app, BrowserWindow, session, shell } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 720,
    minHeight: 560,
    backgroundColor: "#DCE2E4",
    title: "Chime Scribe",
    icon: path.join(__dirname, "icon-512.png"),
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });

  win.setMenuBarVisibility(false);
  win.loadFile("index.html");

  // Open external links (e.g. "Open my Google Doc") in the real browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) { shell.openExternal(url); return { action: "deny" }; }
    return { action: "allow" };
  });
}

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
