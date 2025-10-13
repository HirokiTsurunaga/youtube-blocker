// Minimal MV3 service worker for development/production build
chrome.runtime.onInstalled.addListener(() => {
  // no-op: placeholder to ensure background entry exists
});

chrome.action.onClicked.addListener(() => {
  // keep-alive noop to avoid immediate SW termination during dev
});

chrome.tabs.onUpdated.addListener((...args: any[]) => {
  const changeInfo = args[1] as { url?: string };
  if (changeInfo?.url && changeInfo.url.includes('youtube.com')) {
    console.log('YouTube opened!');
    // 将来的にここでポップアップを自動表示
  }
});