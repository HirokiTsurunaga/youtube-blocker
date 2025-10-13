import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import './content.css';
import { loadTasks, markShownThisSession, wasShownThisSession, loadSettings, getLastShownAt, setLastShownAt } from './utils/storage';
import type { Task } from './types/messages';

// オーバーレイコンポーネント（React でタスクリストも描画）
function BlockerOverlay() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks().then(setTasks);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const container = document.getElementById('youtube-blocker-root');
        if (container) container.remove();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleWatch = () => {
    const container = document.getElementById('youtube-blocker-root');
    if (container) container.remove();
  };

  const handleCancel = () => {
    chrome.runtime.sendMessage({ action: 'closeTab' });
  };

  return (
    <div id="youtube-blocker-overlay">
      <div className="youtube-blocker-card">
        <h1 className="youtube-blocker-title">代わりにやること</h1>
        <ul className="youtube-blocker-list">
          {tasks.map(task => (
            <li key={task.id} style={{ padding: '12px 0' }}>・{task.text}</li>
          ))}
        </ul>
        <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>
          それでも見る？
        </p>
        <div className="youtube-blocker-actions">
          <button onClick={handleWatch} className="youtube-blocker-btn watch">見る</button>
          <button onClick={handleCancel} className="youtube-blocker-btn cancel">やめる</button>
        </div>
      </div>
    </div>
  );
}

// オーバーレイを表示
function showBlocker() {
  // 既に表示済み or このセッションで一度表示しているなら何もしない
  if (document.getElementById('youtube-blocker-root')) return;
  if (wasShownThisSession()) return;

  const container = document.createElement('div');
  container.id = 'youtube-blocker-root';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<BlockerOverlay />);

  // このセッションで表示済みとしてマーク
  markShownThisSession();
  // 最終表示時刻を更新
  setLastShownAt(Date.now());
}

// ページ読み込み時に表示
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    const settings = await loadSettings();
    // 直ちに表示
    showBlocker();
    // リマインダー
    if (settings.remindAfterMinutes && settings.remindAfterMinutes > 0) {
      const delay = settings.remindAfterMinutes * 60 * 1000;
      const last = await getLastShownAt();
      const nextAt = (last ?? 0) + delay;
      const wait = Math.max(0, nextAt - Date.now());
      setTimeout(() => {
        // セッションの1回制約より優先して、再度表示（セッション中でも再表示OK）
        // セッションマークは更新しない
        const container = document.getElementById('youtube-blocker-root');
        if (!container) showBlocker();
      }, wait);
    }
  });
} else {
  (async () => {
    const settings = await loadSettings();
    showBlocker();
    if (settings.remindAfterMinutes && settings.remindAfterMinutes > 0) {
      const delay = settings.remindAfterMinutes * 60 * 1000;
      const last = await getLastShownAt();
      const nextAt = (last ?? 0) + delay;
      const wait = Math.max(0, nextAt - Date.now());
      setTimeout(() => {
        const container = document.getElementById('youtube-blocker-root');
        if (!container) showBlocker();
      }, wait);
    }
  })();
}