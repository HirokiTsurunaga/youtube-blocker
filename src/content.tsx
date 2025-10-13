import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import './content.css';
import { loadTasks, markShownThisSession, wasShownThisSession, loadSettings, getLastShownAt, setLastShownAt, DEFAULT_TASKS } from './utils/storage';
import type { Task } from './types/domain';

// オーバーレイコンポーネント（React でタスクリストも描画）
function BlockerOverlay() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks()
      .then(setTasks)
      .catch(err => {
        console.error('Failed to load tasks:', err);
        setTasks(DEFAULT_TASKS);
      });
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
    <div id="youtube-blocker-overlay" role="dialog" aria-labelledby="blocker-title" aria-modal="true">
      <div className="youtube-blocker-card">
        <h1 id="blocker-title" className="youtube-blocker-title">代わりにやること</h1>
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
function showBlocker(theme?: 'auto' | 'light' | 'dark') {
  // 既に表示済み or このセッションで一度表示しているなら何もしない
  if (document.getElementById('youtube-blocker-root')) return;
  if (wasShownThisSession()) return;

  const container = document.createElement('div');
  container.id = 'youtube-blocker-root';
  // テーマ属性（指定がなければ auto）
  container.setAttribute('data-yb-theme', theme ?? 'auto');
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<BlockerOverlay />);

  // このセッションで表示済みとしてマーク
  markShownThisSession();
  // 最終表示時刻を更新
  setLastShownAt(Date.now());
}

// セッション回数制約を無視して表示（リマインダー用）
function forceShowBlocker(theme?: 'auto' | 'light' | 'dark') {
  if (document.getElementById('youtube-blocker-root')) return;
  const container = document.createElement('div');
  container.id = 'youtube-blocker-root';
  container.setAttribute('data-yb-theme', theme ?? 'auto');
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<BlockerOverlay />);
}

// ページ読み込み時に表示
async function initialize() {
  const settings = await loadSettings();
  // 直ちに初回表示
  showBlocker(settings.theme);

  // リマインダー：last が無ければ「今 + delay」を基準にする
  if (settings.remindAfterMinutes && settings.remindAfterMinutes > 0) {
    const delay = settings.remindAfterMinutes * 60 * 1000;
    const last = await getLastShownAt();
    const base = last ?? Date.now();
    const wait = Math.max(0, base + delay - Date.now());
    setTimeout(() => {
      const container = document.getElementById('youtube-blocker-root');
      if (!container) {
        // セッション制約を無視して再表示（ユーザーが再認識できるように）
        forceShowBlocker(settings.theme);
        setLastShownAt(Date.now());
      }
    }, wait);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}