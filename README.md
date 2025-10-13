# YouTube Blocker (Chrome Extension)

YouTube を開いた瞬間に「今日やること」を表示し、視聴を続けるか・やめるかを自分で選べるようにする Chrome 拡張（Manifest V3）です。Vite + React + TypeScript + crxjs で構築しています。

## 機能
- YouTube ドメインでオーバーレイ UI を表示
- 「見る」: オーバーレイを閉じて視聴を継続
- 「やめる」: バックグラウンドへメッセージを送り、現在タブを閉じる

## 技術スタック
- React 19 + TypeScript
- Vite 7 / `@crxjs/vite-plugin`（MV3 ビルド）
- 型定義: `chrome-types`

## ディレクトリ構成（抜粋）
```
/ (repo root)
├─ src/
│  ├─ App.tsx                # popup 用（開発用の最小ページ）
│  ├─ background.ts          # MV3 Service Worker（メッセージ処理など）
│  └─ content.tsx            # YouTube ページ上にオーバーレイを描画
├─ manifest.json             # 開発用マニフェスト（crxjs が変換）
├─ vite.config.ts            # Vite + crxjs 設定
└─ dist/                     # ビルド成果物（Chrome で読み込む）
```

## セットアップ
- 要件: Node.js 18+ 推奨

```bash
npm i
```

### 型定義（chrome-types）
`chrome-types` を使用しています。`tsconfig.app.json` の `types` に `chrome-types` を指定済みです。

```json
{
  "compilerOptions": {
    "types": ["vite/client", "chrome-types"]
  }
}
```

## ビルドと読み込み
開発中でも CORS 問題を避けるため、拡張はビルドしてから読み込む運用にしています。

```bash
npm run build
```

1. Chrome を開き、`chrome://extensions/` にアクセス
2. 右上「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」→ `dist/` ディレクトリを選択
4. YouTube（`https://www.youtube.com/*`）で動作確認

変更したら再度 `npm run build` → 拡張を「更新」してください。

## 仕組みの概要
- `content.tsx` が YouTube ページにインジェクトされ、React でオーバーレイ UI を描画
- 「やめる」クリックでバックグラウンドにメッセージ送信
- `background.ts` が受信し、該当タブを閉じる

```ts
// content.tsx（一部）
chrome.runtime.sendMessage({ action: 'closeTab' });
```

```ts
// background.ts（一部）
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.action === 'closeTab' && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
  return false; // 非同期応答なし
});
```

## マニフェスト（概略）
```json
{
  "manifest_version": 3,
  "permissions": ["tabs"],
  "host_permissions": ["*://www.youtube.com/*"],
  "background": { "service_worker": "service-worker-loader.js", "type": "module" },
  "content_scripts": [
    {
      "matches": ["*://www.youtube.com/*"],
      "js": ["<content-bundle>"],
      "run_at": "document_end"
    }
  ]
}
```
`dist/manifest.json` は crxjs により自動生成されます。編集はリポジトリ直下の `manifest.json` に対して行ってください。

## よくある問題
- サービスワーカー登録失敗（Status code: 3）/ CORS エラー
  - 開発モードでローカル `http://localhost:5173` を import すると CORS で失敗します。本プロジェクトでは「常に `npm run build` して `dist/` を読み込む」方針です。

## ライセンス
パーソナルユース想定。必要に応じて追記してください。
