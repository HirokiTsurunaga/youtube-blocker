import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import './content.css';
import { loadTasks, markShownThisSession, wasShownThisSession, loadSettings, getLastShownAt, setLastShownAt, getDefaultTasks } from './utils/storage';
import type { Task, Settings } from './types/domain';
import { getTranslations } from './i18n/translations';

// オーバーレイコンポーネント（React でタスクリストも描画）
function BlockerOverlay({ language }: { language: 'ja' | 'en' }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const t = getTranslations(language).overlay;

  useEffect(() => {
    loadTasks()
      .then(setTasks)
      .catch(err => {
        console.error('Failed to load tasks:', err);
        setTasks(getDefaultTasks(language));
      });
  }, [language]);

  // dialog をモーダルで開き、閉じたらクリーンアップ
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const onClose = () => {
      const container = document.getElementById('youtube-blocker-root');
      if (container) container.remove();
    };
    dialog?.addEventListener('close', onClose);
    return () => dialog?.removeEventListener('close', onClose);
  }, []);

  const handleWatch = () => {
    dialogRef.current?.close();
  };

  const handleCancel = () => {
    chrome.runtime.sendMessage({ action: 'closeTab' });
  };

  return (
    <dialog ref={dialogRef} id="youtube-blocker-overlay" aria-labelledby="blocker-title">
      <div className="youtube-blocker-card">
        <h1 id="blocker-title" className="youtube-blocker-title">{t.title}</h1>
        <ul className="youtube-blocker-list">
          {tasks.map(task => (
            <li key={task.id}>・{task.text}</li>
          ))}
        </ul>
        <p style={{ 
          fontSize: '18px', 
          fontWeight: '500', 
          marginBottom: '24px', 
          textAlign: 'center',
          opacity: 0.9
        }}>
          {t.prompt}
        </p>
        <div className="youtube-blocker-actions">
          <button onClick={handleWatch} className="youtube-blocker-btn watch">{t.watchButton}</button>
          <button onClick={handleCancel} className="youtube-blocker-btn cancel">{t.cancelButton}</button>
        </div>
      </div>
    </dialog>
  );
}

// オーバーレイを表示
function showBlocker(settings: Settings) {
  // 既に表示済み or このセッションで一度表示しているなら何もしない
  if (document.getElementById('youtube-blocker-root')) return;
  if (wasShownThisSession()) return;

  const container = document.createElement('div');
  container.id = 'youtube-blocker-root';
  // テーマ属性（指定がなければ auto）
  container.setAttribute('data-yb-theme', settings.theme ?? 'auto');
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<BlockerOverlay language={settings.language} />);

  // このセッションで表示済みとしてマーク
  markShownThisSession();
  // 最終表示時刻を更新
  setLastShownAt(Date.now());
}

// セッション回数制約を無視して表示（リマインダー用）
function forceShowBlocker(settings: Settings) {
  if (document.getElementById('youtube-blocker-root')) return;
  const container = document.createElement('div');
  container.id = 'youtube-blocker-root';
  container.setAttribute('data-yb-theme', settings.theme ?? 'auto');
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<BlockerOverlay language={settings.language} />);
}

// ページ読み込み時に表示
async function initialize() {
  const settings = await loadSettings();
  // 直ちに初回表示
  showBlocker(settings);

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
        forceShowBlocker(settings);
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