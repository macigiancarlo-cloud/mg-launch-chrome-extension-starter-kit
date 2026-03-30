// ─── Popup Script ────────────────────────────────────────────────────────────
// This runs every time the user opens the extension popup.
// It reads saved settings, updates the UI, and handles user interactions.

// ─── Get DOM elements ─────────────────────────────────────────────────────────
const statusDot    = document.getElementById('statusDot');
const statusText   = document.getElementById('statusText');
const featureToggle = document.getElementById('featureToggle');
const customInput  = document.getElementById('customInput');
const actionBtn    = document.getElementById('actionBtn');
const clearBtn     = document.getElementById('clearBtn');

// ─── Load saved settings on popup open ───────────────────────────────────────
// chrome.storage.sync saves data to the user's Google account (synced across devices).
// chrome.storage.local saves only on this machine.
document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.sync.get(['featureEnabled', 'customValue']);

  featureToggle.checked = data.featureEnabled ?? false;
  customInput.value     = data.customValue    ?? '';

  updateStatus(data.featureEnabled);
});

// ─── Save settings when toggle changes ───────────────────────────────────────
featureToggle.addEventListener('change', async () => {
  const enabled = featureToggle.checked;

  await chrome.storage.sync.set({ featureEnabled: enabled });
  updateStatus(enabled);

  // Send a message to the content script (running on the current tab page)
  // so it can react immediately without a page reload.
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'TOGGLE_FEATURE',
      enabled,
    }).catch(() => {
      // Content script might not be injected yet on some pages — that's fine.
    });
  }
});

// ─── Save custom input on blur ────────────────────────────────────────────────
customInput.addEventListener('blur', async () => {
  await chrome.storage.sync.set({ customValue: customInput.value });
});

// ─── Action button ─────────────────────────────────────────────────────────────
// This sends a message to the background service worker to do something.
actionBtn.addEventListener('click', async () => {
  actionBtn.textContent = 'Running...';
  actionBtn.disabled = true;

  // Example: ask the background script to do heavy work
  const response = await chrome.runtime.sendMessage({ type: 'RUN_ACTION' });

  actionBtn.textContent = response?.success ? 'Done!' : 'Error';
  setTimeout(() => {
    actionBtn.textContent = 'Run action';
    actionBtn.disabled = false;
  }, 1500);
});

// ─── Clear all settings ────────────────────────────────────────────────────────
clearBtn.addEventListener('click', async () => {
  await chrome.storage.sync.clear();
  featureToggle.checked = false;
  customInput.value = '';
  updateStatus(false);
});

// ─── Helper: update the status indicator ──────────────────────────────────────
function updateStatus(enabled) {
  if (enabled) {
    statusDot.className  = 'status-dot active';
    statusText.textContent = 'Extension active';
  } else {
    statusDot.className  = 'status-dot';
    statusText.textContent = 'Extension inactive';
  }
}
