// ─── Content Script ───────────────────────────────────────────────────────────
// This script is injected into every webpage the user visits (see manifest.json).
// It can read and modify the DOM of any page.
// It CANNOT access chrome.storage directly — it must message the background script.

// ─── State ────────────────────────────────────────────────────────────────────
let featureEnabled = false;

// ─── Initialize: check saved settings ────────────────────────────────────────
(async () => {
  const data = await chrome.storage.sync.get('featureEnabled');
  featureEnabled = data.featureEnabled ?? false;

  if (featureEnabled) {
    activateFeature();
  }
})();

// ─── Listen for messages from popup ──────────────────────────────────────────
// When the user flips the toggle in the popup, this receives the update immediately.
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE_FEATURE') {
    featureEnabled = message.enabled;

    if (featureEnabled) {
      activateFeature();
    } else {
      deactivateFeature();
    }
  }
});

// ─── Feature logic ────────────────────────────────────────────────────────────
// Replace these functions with your actual extension behavior.

function activateFeature() {
  console.log('[Content] Feature activated on:', window.location.href);

  // Example: add a subtle indicator badge to the page
  if (!document.getElementById('ext-badge')) {
    const badge = document.createElement('div');
    badge.id = 'ext-badge';
    badge.textContent = 'Extension Active';
    badge.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      background: #6366f1;
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-family: sans-serif;
      font-weight: 500;
      z-index: 999999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      pointer-events: none;
    `;
    document.body.appendChild(badge);
  }
}

function deactivateFeature() {
  console.log('[Content] Feature deactivated.');

  const badge = document.getElementById('ext-badge');
  if (badge) badge.remove();
}

// ─── Utility: safely query a DOM element ──────────────────────────────────────
// Avoids errors if the element doesn't exist on a particular page.
function safeQuery(selector) {
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}
