import { createRoot } from 'react-dom/client';
import './content.css';
import type { ExtensionMessage } from './types/messages';

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
    const msg: ExtensionMessage = { action: 'closeTab' };
    chrome.runtime.sendMessage(msg);
  };

  return (
    <div id="youtube-blocker-overlay">
      <div className="youtube-blocker-card">
        <h1 className="youtube-blocker-title">今日やること</h1>
        <ul className="youtube-blocker-list">
          <li style={{ padding: '12px 0' }}>・ウォーキング(30分)</li>
          <li style={{ padding: '12px 0' }}>・ジムに行く(1時間)</li>
          <li style={{ padding: '12px 0' }}>・本を読む(1時間)</li>
          <li style={{ padding: '12px 0' }}>・コードを書く(30分)</li>
        </ul>
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
}

// ページ読み込み時に表示
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showBlocker);
} else {
  showBlocker();
}