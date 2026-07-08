# Chime Scribe — desktop app

A hands-free R&D note logger with live Google Docs sync, packaged as a real
desktop app. Because a packaged app can't use Chrome's built-in speech engine,
voice dictation runs through **Deepgram** (a cloud transcription service with a
free tier). You paste a Deepgram key once, in Settings.

The same `index.html` also still runs as a normal web page in Chrome (where it
uses Chrome's free built-in voice) — so you have both.

---

## A. Build the single downloadable app (one command)

Do this once, on the same kind of computer you'll run it on
(build the Mac app on a Mac, the Windows app on Windows).

1. Install **Node.js** (LTS) from https://nodejs.org — this gives you `npm`.
2. Put all the files in this folder together, open a terminal **in this folder**, and run:

       npm install
       npm run dist

3. When it finishes, look in the new **dist/** folder:
   - Mac:     `Chime Scribe-1.0.0.dmg`  — open it, drag the app to Applications.
   - Windows: `Chime Scribe Setup 1.0.0.exe`  — run it to install.
   - Linux:   `Chime Scribe-1.0.0.AppImage`  — mark executable and run.

That installer is your one downloadable app, with its own icon. The microphone
is auto-granted inside the app, so it never prompts.

### Just want to try it without building?
Run `npm install` then `npm start`. The app window opens immediately.

---

## B. Turn on voice (one time)

1. Get a free key: go to **console.deepgram.com**, sign up, create an API key.
   (Deepgram includes free credits; a personal dictation workload is small.)
2. In Chime Scribe, click **Settings** (bottom-left), paste the key into
   **Deepgram API key**, and Save. Leave "Voice engine" on Automatic.
3. Press **Dictate** and speak. Say "Note the following…", then "log entry"
   to save. The mic stays on continuously until you press Stop.

The key is stored only on your device.

---

## C. Turn on live Google Docs sync (one time)

Open the app -> **Live Google Doc** panel -> follow steps 1-3. It walks you
through pasting the connector (`chime-scribe-sync.gs`) into script.google.com,
publishing it, and linking your Doc.

### If erase isn't removing entries from your Doc
Update the connector once and REDEPLOY it as a new version:
1. Open your project at script.google.com.
2. Replace the code with `chime-scribe-sync.gs` (or "Copy the code" in the app), Save.
3. **Deploy -> Manage deployments -> pencil (Edit) -> Version: New version -> Deploy.**
   Choosing *New version* is essential — otherwise Google keeps running old code.

Your Web app URL stays the same. Entries logged before the update can't be
auto-removed from the Doc (they predate the hidden marker); ones after it erase cleanly.

---

## Files
- `index.html` — the app
- `main.js`, `package.json` — the desktop wrapper + build config
- `manifest.webmanifest`, `sw.js`, `icon-*.png`, `icon.ico`, `icon.icns` — assets/icons
- `chime-scribe-sync.gs` — the Google Docs connector (setup is inside the app)

## Notes / limits (honest)
- The installer is unsigned. First launch may need: Mac — right-click the app ->
  Open -> Open; Windows — "More info -> Run anyway" on the SmartScreen prompt.
  (Code-signing needs a paid Apple/Microsoft certificate; not required to use it.)
- Voice in the desktop app needs internet + a Deepgram key (the trade-off for a
  packaged app; Chrome's built-in engine isn't available outside Chrome).
- Google Docs writing must go through the one-time Apps Script connector — nothing
  can write to your Doc without Google's authorization.
