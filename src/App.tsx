import './App.css'

function App() {
  // ボタンの動作もここ
  const handleWatch = () => {
    window.close();
  };

  const handleCancel = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      if (tabs[0]?.id) {
        chrome.tabs.remove(tabs[0].id);
      }
    });
  };

  // UIもここ
  return (
    <div style={{ width: '400px', padding: '30px' }}>
      <h1>今日やること</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>・ウォーキング(30分)</li>
        <li>・ジムに行く(1時間)</li>
        <li>・本を読む(1時間)</li>
        <li>・コードを書く(30分)</li>
      </ul>
      <p>それでも見る？</p>
      <button onClick={handleWatch}>見る</button>
      <button onClick={handleCancel}>やめる</button>
    </div>
  )
}

export default App