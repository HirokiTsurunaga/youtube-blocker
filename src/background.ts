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

// メッセージを受け取る
import type { ExtensionMessage } from './types/messages';

chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender: chrome.runtime.MessageSender) => {
  if (message.action === 'closeTab' && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
  // 非同期応答をしないので false（または undefined）を返す
  return false;
});