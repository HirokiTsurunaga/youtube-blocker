// Minimal MV3 service worker for development/production build
chrome.runtime.onInstalled.addListener(() => {
  // no-op: placeholder to ensure background entry exists
});

chrome.action.onClicked.addListener(() => {
  // keep-alive noop to avoid immediate SW termination during dev
});


