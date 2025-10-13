import { createRoot } from 'react-dom/client';
import './content.css';
import { DEFAULT_TASKS, loadTasks } from './utils/storage';

// オーバーレイコンポーネント
function BlockerOverlay() {
  const handleWatch = () => {
    // オーバーレイを削除
    const overlay = document.getElementById('youtube-blocker-overlay');
    if (overlay) {
      overlay.remove();
    }
  };

  const handleCancel = () => {
    // background scriptにメッセージを送る
    chrome.runtime.sendMessage({ action: 'closeTab' });
  };

  return (
    <div id="youtube-blocker-overlay">
      <div className="youtube-blocker-card">
        <h1 className="youtube-blocker-title">代わりにやること</h1>
        <ul className="youtube-blocker-list" id="youtube-blocker-list"></ul>
        <p style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
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
  // 既に表示されていたら何もしない
  if (document.getElementById('youtube-blocker-overlay')) {
    return;
  }

  // オーバーレイ用のdivを作成
  const overlayDiv = document.createElement('div');
  overlayDiv.id = 'youtube-blocker-overlay';
  document.body.appendChild(overlayDiv);

  // Reactでレンダリング
  const root = createRoot(overlayDiv);
  root.render(<BlockerOverlay />);

  // タスクを storage から読み込み描画（拡張外でも動作）
  loadTasks().then((tasks = DEFAULT_TASKS) => {
    const ul = document.getElementById('youtube-blocker-list');
    if (!ul) return;
    ul.innerHTML = '';
    for (const t of tasks) {
      const li = document.createElement('li');
      li.style.padding = '12px 0';
      li.textContent = `・${t.text}`;
      ul.appendChild(li);
    }
  });
}

// ページ読み込み時に表示
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showBlocker);
} else {
  showBlocker();
}