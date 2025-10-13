import { test, expect, chromium } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// NOTE: 公開サイトへアクセスするため、ネットワークに依存します。
// 実運用ではモックされた簡易ページに差し替えるのが望ましいです。

test.describe('YouTube Blocker overlay', () => {
  test('shows overlay once and closes with ESC', async () => {
    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yb-e2e-'));
    const extensionPath = path.resolve('dist');

    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });

    const page = await context.newPage();
    await page.goto('https://www.youtube.com/');

    // オーバーレイが出る（タイトル文言を確認）
    const heading = page.locator('#youtube-blocker-overlay .youtube-blocker-title');
    await expect(heading).toHaveText(/代わりにやること/, { timeout: 15000 });

    // ESCで閉じる
    await page.keyboard.press('Escape');
    await expect(page.locator('#youtube-blocker-overlay')).toHaveCount(0);

    // 再読み込みしても同セッションでは表示されない
    await page.reload();
    await expect(page.locator('#youtube-blocker-overlay')).toHaveCount(0);

    await context.close();
  });
});


