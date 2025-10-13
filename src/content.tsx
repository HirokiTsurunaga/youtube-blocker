import { createRoot } from 'react-dom/client';
// import './content.css';

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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      zIndex: 999999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '40px',
        borderRadius: '10px',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
          今日やること
        </h1>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          marginBottom: '30px',
          fontSize: '18px'
        }}>
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
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={handleWatch}
            style={{ 
              flex: 1, 
              padding: '15px',
              fontSize: '18px',
              cursor: 'pointer',
              backgroundColor: '#333',
              color: 'white',
              border: '2px solid white',
              borderRadius: '5px'
            }}
          >
            見る
          </button>
          <button 
            onClick={handleCancel}
            style={{ 
              flex: 1, 
              padding: '15px',
              fontSize: '18px',
              cursor: 'pointer',
              backgroundColor: '#FF0000',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            やめる
          </button>
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