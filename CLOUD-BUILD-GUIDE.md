# Get your installer from a free GitHub cloud build

This makes GitHub's servers compile the Mac (.dmg) and Windows (.exe) apps for
you. You don't install anything or use a terminal — you upload the files once in
your browser, wait a few minutes, and download the finished installer.

Everything is done on github.com in your web browser.

---

## Step 1 — Make a free GitHub account
Go to https://github.com and sign up (free). Verify your email.

## Step 2 — Create an empty repository
1. Click the **+** (top-right) → **New repository**.
2. Repository name: `chime-scribe`.
3. Choose **Public**  ← important: public repos get free, unlimited build minutes.
   (Your Deepgram key is NOT in these files — you type it into the app later —
   so nothing secret is being made public.)
4. Leave everything else unchecked. Click **Create repository**.

## Step 3 — Upload the app files
1. On the new repo page, click the link **“uploading an existing file.”**
2. Drag in **all the files from this project** (index.html, main.js,
   package.json, sw.js, manifest.webmanifest, all the icon files, and
   chime-scribe-sync.gs). 
3. Scroll down and click **Commit changes**.

## Step 4 — Add the build instructions file
The build needs one file kept in a special folder. Easiest way in the browser:
1. Click **Add file → Create new file**.
2. In the filename box type exactly (the slashes create the folders automatically):
   ```
   .github/workflows/build.yml
   ```
3. Open the provided `build.yml`, copy everything, and paste it into the big text box.
4. Click **Commit changes**.

## Step 5 — Let it build
- Committing that file kicks off the build automatically. Click the **Actions**
  tab at the top. You'll see a run called **“Build Chime Scribe”** with a spinning
  dot. It takes about **5–10 minutes** (Mac + Windows build in parallel).
- If it doesn't start on its own: open the **Actions** tab → click **Build Chime
  Scribe** on the left → **Run workflow** button → **Run workflow**.

## Step 6 — Download your app
When the run finishes (green check), you have two ways to get the installer:

**Easiest — the Releases page:**
Go to your repo's main page → click **Releases** (right side) → open
**“Latest build.”** Download the file for your computer:
- **Mac:** the file ending in **.dmg** — open it, drag Chime Scribe to Applications.
- **Windows:** the file ending in **.exe** — run it to install.

**Or — from the run itself:**
Actions tab → open the finished run → scroll to **Artifacts** → download
`chime-scribe-macos-latest` or `chime-scribe-windows-latest` (these come as a zip;
unzip to get the installer).

---

## First launch (because the app isn't code-signed)
- **Mac:** right-click the app → **Open** → **Open**. (Only needed the first time.)
- **Windows:** on the blue “Windows protected your PC” screen, click
  **More info → Run anyway**. (Only the first time.)

Code-signing removes these prompts but needs a paid Apple/Microsoft certificate —
not required for the app to work.

---

## After it's installed
1. Open Chime Scribe. Click **Settings** (bottom-left), paste your **Deepgram API
   key** (free key from console.deepgram.com), Save.
2. Press **Dictate** and talk: “Note the following…”, “log entry”, “erase previous
   note”, “complete note”.
3. For live Google Docs sync, use the **Live Google Doc** panel and follow steps 1–3.

## Updating later
Change any file in the repo (or click **Run workflow** again). A fresh installer
appears on the Releases page automatically.
