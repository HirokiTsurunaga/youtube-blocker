# YouTube Blocker (Chrome Extension)

YouTube を開いた瞬間に「代わりにやること」を表示し、視聴を続けるか・やめるかを自分で選べるようにする Chrome 拡張（Manifest V3）です。Vite + React + TypeScript + crxjs で構築しています。

## 機能
- YouTube ドメインでオーバーレイ UI を表示
- 「見る」: オーバーレイを閉じて視聴を継続
- 「やめる」: バックグラウンドへメッセージを送り、現在タブを閉じる
- リマインダー（任意）: 指定した分後に再度オーバーレイを表示
- **タスク編集**: ポップアップから「代わりにやること」のリストを編集・保存
- **同期保存**: `chrome.storage.sync` に格納（利用不可の環境では `localStorage` に自動フォールバック）

## 技術スタック
- React 19 + TypeScript
- Vite 7 / `@crxjs/vite-plugin`（MV3 ビルド）
- 型定義: `chrome-types`

## ディレクトリ構成（抜粋）
```
/ (repo root)
├─ src/
│  ├─ App.tsx                # popup（タスク編集UI）
│  ├─ background.ts          # MV3 Service Worker（メッセージ処理など）
│  ├─ content.tsx            # YouTube ページ上にオーバーレイを描画
│  ├─ content.css            # オーバーレイのスタイル
│  ├─ utils/
│  │  └─ storage.ts          # chrome.storage/localStorage ラッパ
│  └─ types/
│     └─ domain.ts           # ドメイン型（Task/Settings, メッセージ型）
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

## E2E テスト（Playwright）
インストール済みです。ネットワークに依存するため、安定性が必要ならモックページに差し替えてください。

```bash
npm run test:e2e
```

テスト内容:
- YouTube でオーバーレイが表示される
- ESC で閉じられる
- 同セッションのリロードでは再表示されない

## 仕組みの概要
- `content.tsx` が YouTube ページにインジェクトされ、React でオーバーレイ UI を描画
- タスクリストは `utils/storage.ts` 経由で読み込み（`chrome.storage.sync` → フォールバック）
- ポップアップ（`App.tsx`）でタスクを編集・保存
- 「やめる」クリックでバックグラウンドにメッセージ送信、`background.ts` が現在タブを閉じる

```ts
// content.tsx（一部）
import type { ExtensionMessage } from './types/domain';
const msg: ExtensionMessage = { action: 'closeTab' };
chrome.runtime.sendMessage(msg);
```

```ts
// background.ts（一部）
import type { ExtensionMessage } from './types/domain';
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender) => {
  if (message.action === 'closeTab' && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
  return false; // 非同期応答なし
});
```

## マニフェスト（概略）
```json
{
  "manifest_version": 3,
  "permissions": ["tabs", "storage"],
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

## カスタマイズ
- **タスク文言の変更（推奨）**: ポップアップから編集して「保存」
- **見た目の調整**: `src/content.css` を編集
- **メッセージの拡張**: `src/types/domain.ts` に型を追加し、`background.ts`/`content.tsx` の送受信を対応させる

### テーマ（ライト/ダーク/自動）
- 設定場所: ポップアップの「テーマ」セレクトで選択
- 仕組み: `#youtube-blocker-root[data-yb-theme="..."]` に応じて CSS 変数を切替（`src/content.css`）。
  - `auto` は OS の `prefers-color-scheme` を用いたダーク優先に対応
  - ポップアップは選択直後に即時プレビューされます（保存有無に関わらず）

### 表示頻度
- 1セッションにつき1回のみ表示（`sessionStorage` にマーク）
- 毎回表示したい場合は実装を調整してください（`utils/storage.ts` の `wasShownThisSession` を参照）

### リマインダー
- 設定場所: ポップアップの「リマインダー（分）」入力欄。空欄なら OFF。
- 仕組み: 最終表示時刻（`lastShownAt`）と設定分数から、次回表示までの待機時間を算出して再度オーバーレイを表示します。
  - `chrome.storage.local` に `lastShownAt` を保存（利用不可環境では `localStorage`）。
  - セッション1回制限とは独立して動作し、同一タブ内でも指定時間後に再表示されます。

## よくある問題
- サービスワーカー登録失敗（Status code: 3）/ CORS エラー
  - 開発モードでローカル `http://localhost:5173` を import すると CORS で失敗します。本プロジェクトでは「常に `npm run build` して `dist/` を読み込む」方針です。

## ライセンス
パーソナルユース想定。必要に応じて追記してください。

## プライバシー
本拡張のプライバシーポリシーは `PRIVACY.md` をご覧ください。
