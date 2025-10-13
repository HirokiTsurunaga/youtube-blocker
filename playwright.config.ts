import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    headless: false, // 拡張の読み込みは headful が必要
    viewport: { width: 1280, height: 800 },
  },
  reporter: [['list']],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});


