// ─── Load shared utilities ────────────────────────────────────────────────────
importScripts('../utils/utils.js');

// ─── Background Service Worker ────────────────────────────────────────────────
// This script runs in the background, even when the popup is closed.
// Use it for: alarms, fetch requests, heavy logic, listening to browser events.
// Important: service workers can be stopped by Chrome at any time to save memory.
// Never store data in variables here — always use chrome.storage.

// ─── Extension installed / updated ───────────────────────────────────────────
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Background] Extension installed for the first time.');

    // Set default settings on first install
    chrome.storage.sync.set({
      featureEnabled: false,
      customValue: '',
    });
  }

  if (details.reason === 'update') {
    console.log('[Background] Extension updated to', chrome.runtime.getManifest().version);
  }
});

// ─── Listen for messages from popup or content scripts ────────────────────────
// Any part of the extension can send a message here with chrome.runtime.sendMessage().
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === 'RUN_ACTION') {
    // Do your heavy work here (fetch, processing, etc.)
    handleAction()
      .then(result => sendResponse({ success: true, data: result }))
      .catch(err  => sendResponse({ success: false, error: err.message }));

    // Return true to tell Chrome this is an async response.
    // Without this, the message channel closes before sendResponse() is called.
    return true;
  }

  if (message.type === 'GET_DATA') {
    chrome.storage.sync.get(null, (data) => {
      sendResponse({ data });
    });
    return true;
  }
});

// ─── Example: run something every hour with an alarm ─────────────────────────
// Alarms survive service worker restarts — unlike setTimeout().
chrome.alarms.create('hourlyCheck', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'hourlyCheck') {
    console.log('[Background] Hourly check fired.');
    // Add your scheduled logic here
  }
});

// ─── Helper function ──────────────────────────────────────────────────────────
async function handleAction() {
  // Replace this with your actual logic.
  // Example: fetch data from an API
  // const res = await fetch('https://api.example.com/data');
  // return await res.json();

  // Simulated delay for demo purposes
  await new Promise(resolve => setTimeout(resolve, 800));
  return { message: 'Action completed successfully.' };
}
