MG Launch — Chrome Extension Starter Kit
> Ship your Chrome Extension in minutes, not days.
A clean, professional boilerplate for building Chrome Extensions with Manifest V3.
Stop wasting time on setup — start building your actual feature in minutes.
⬇️ Download the full kit on Gumroad
---
What's included
File	Purpose
`manifest.json`	Extension config (permissions, icons, scripts)
`popup/`	The UI that appears when the user clicks your icon
`background/`	Service worker (runs in background, handles alarms & fetch)
`content/`	Script injected into webpages
`utils/`	Shared helpers (storage, messaging, DOM)
---
Features
✅ Manifest V3 ready
✅ Popup UI with dark mode
✅ Background service worker (alarms, fetch, heavy logic)
✅ Content script injected into webpages
✅ Storage + messaging wired together
✅ Fully commented code
✅ No dependencies, no build step
✅ Works on Chrome and Edge
---
How to install & run (2 steps)
Step 1 — Open Chrome and go to:
```
chrome://extensions
```
Step 2 — Enable Developer mode (top right toggle), then click "Load unpacked" and select this folder.
That's it. Your extension is running.
---
Storage: sync vs local
	`chrome.storage.sync`	`chrome.storage.local`
Limit per key	8 KB	5 MB
Synced across devices	Yes	No
When to use	Light settings (toggles, short values)	Heavy data (long text, arrays, cache)
This kit uses `sync` by default. If you save heavy data, replace `.sync` with `.local`.
---
How to customize it
Change the extension name
Open `manifest.json` and edit the `"name"` field.
Change what the popup looks like
Edit `popup/popup.html` and `popup/popup.css`.
Change what happens when the user clicks the button
Open `popup/popup.js` and find the `actionBtn` event listener. Replace the contents with your logic.
Run code on every webpage
Open `content/content.js` and edit `activateFeature()`. This function runs on every page the user visits when the extension is enabled.
Run background tasks (fetch, alarms, heavy logic)
Open `background/background.js` and edit `handleAction()`. This is where you put API calls and anything that should run even when the popup is closed.
---
Project structure
```
chrome-extension-kit/
├── manifest.json          ← Start here
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── popup/
│   ├── popup.html         ← UI layout
│   ├── popup.css          ← Styles (dark mode included)
│   └── popup.js           ← UI logic + storage
├── background/
│   └── background.js      ← Service worker
├── content/
│   └── content.js         ← Injected into webpages
└── utils/
    └── utils.js           ← Shared helpers
```
---
How Chrome extensions work (quick mental model)
```
\[Webpage]  ←→  content.js   (reads/modifies the page)
                    ↕
\[Popup UI] ←→  popup.js     (what the user sees \& clicks)
                    ↕
            background.js   (heavy work, API calls, alarms)
```
The three parts communicate by sending messages to each other.
All data is saved with `chrome.storage` — never in variables (service workers reset).
---
Publish to the Chrome Web Store
Zip this entire folder
Go to Chrome Web Store Developer Dashboard
Pay the one-time $5 developer fee
Upload your zip and fill in the store listing
Wait 1–3 days for review
---
FAQ
Can I use this for a paid extension?
Yes. This kit has no license restrictions — use it for any project, personal or commercial.
Does it work with Firefox?
Mostly yes. Firefox supports Manifest V3 with minor differences. The main incompatibility is `chrome.scripting` — use a polyfill if needed.
Where do I add my API key?
Never hardcode API keys in extension code — they're visible to anyone who installs it. Use a backend proxy instead, or store them in `chrome.storage` after the user enters them.
The extension doesn't load — what's wrong?
Check `chrome://extensions` for error messages. Most common issues: missing icon files, syntax error in manifest.json, or a JS error in background.js.
---
Download
⬇️ Get the full kit on Gumroad — free right now.
---
Built by Giancarlo Maci · Manifest V3 · Works on Chrome and Edge
