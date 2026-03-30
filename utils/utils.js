// ─── Shared Utilities ─────────────────────────────────────────────────────────
// Import these functions in any script with:
//   importScripts('../utils/utils.js')  ← in background.js
// Or include via <script src="../utils/utils.js"> in HTML files.

// ─── Storage helpers ──────────────────────────────────────────────────────────

/** Get one or more values from chrome.storage.sync */
async function storageGet(keys) {
  return chrome.storage.sync.get(keys);
}

/** Save one or more values to chrome.storage.sync */
async function storageSet(data) {
  return chrome.storage.sync.set(data);
}

/** Clear all saved data */
async function storageClear() {
  return chrome.storage.sync.clear();
}

// ─── Messaging helpers ────────────────────────────────────────────────────────

/** Send a message to the background service worker */
async function sendToBackground(message) {
  return chrome.runtime.sendMessage(message);
}

/** Send a message to the active tab's content script */
async function sendToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return null;
  return chrome.tabs.sendMessage(tab.id, message).catch(() => null);
}

// ─── DOM helpers ──────────────────────────────────────────────────────────────

/** Wait for an element to appear in the DOM (useful in content scripts) */
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); reject(new Error('Timeout')); }, timeout);
  });
}

/** Create a DOM element with attributes and children */
function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else el.appendChild(child);
  });
  return el;
}

// ─── General utilities ────────────────────────────────────────────────────────

/** Simple debounce — prevents a function from firing too often */
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Format a date as "Jan 12, 2026" */
function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Sleep for N milliseconds (use with await) */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
