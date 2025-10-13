import type { Task, Settings } from '../types/domain'

const DEFAULT_TASKS: Task[] = [
	{ id: 'default-1', text: 'ウォーキング(30分)' },
	{ id: 'default-2', text: 'ジムに行く(1時間)' },
	{ id: 'default-3', text: '本を読む(1時間)' },
	{ id: 'default-4', text: 'コードを書く(30分)' },
]

export async function loadTasks(): Promise<Task[]> {
	try {
		// chrome が使える場合（拡張の popup / content script）
		// optional chaining で環境依存エラーを回避
		if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
			return await new Promise<Task[]>((resolve) => {
				chrome.storage.sync.get(['tasks'], (data: { tasks?: Task[] }) => {
					resolve(data?.tasks && Array.isArray(data.tasks) && data.tasks.length > 0 ? data.tasks : DEFAULT_TASKS)
				})
			})
		}
	} catch (_) {
		// fallthrough to localStorage
	}

	// ブラウザ直開きなど拡張外のときは localStorage を使う
	try {
		const raw = localStorage.getItem('tasks')
		if (!raw) return DEFAULT_TASKS
		const parsed = JSON.parse(raw) as Task[]
		return parsed.length > 0 ? parsed : DEFAULT_TASKS
	} catch {
		return DEFAULT_TASKS
	}
}

export async function saveTasks(tasks: Task[]): Promise<void> {
	try {
		if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
			await new Promise<void>((resolve) => {
				chrome.storage.sync.set({ tasks }, () => resolve())
			})
			return
		}
	} catch (_) {
		// fallthrough to localStorage
	}

	try {
		localStorage.setItem('tasks', JSON.stringify(tasks))
	} catch {
		// ignore
	}
}

export { DEFAULT_TASKS }

// 1セッション1回の表示制御（最小実装）
export function markShownThisSession(): void {
	try { sessionStorage.setItem('yb_shown', '1'); } catch {}
}

export function wasShownThisSession(): boolean {
	try { return sessionStorage.getItem('yb_shown') === '1'; } catch { return false; }
}

// 設定の読み書き（リマインダー等）
export async function loadSettings(): Promise<Settings> {
	const defaults: Settings = { showOn: 'once_per_session', remindAfterMinutes: undefined, theme: 'auto' };
	try {
		if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
			return await new Promise<Settings>((resolve) => {
				chrome.storage.sync.get(['settings'], (data: { settings?: Settings }) => {
					resolve({ ...defaults, ...(data?.settings ?? {}) })
				})
			})
		}
	} catch {}
	try {
		const raw = localStorage.getItem('settings');
		return raw ? { ...defaults, ...(JSON.parse(raw) as Settings) } : defaults;
	} catch {
		return defaults;
	}
}

export async function saveSettings(settings: Settings): Promise<void> {
	try {
		if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
			await new Promise<void>((resolve) => {
				chrome.storage.sync.set({ settings }, () => resolve())
			})
			return
		}
	} catch {}
	try { localStorage.setItem('settings', JSON.stringify(settings)) } catch {}
}

// 直近表示時刻（過剰再表示の抑止）
export async function getLastShownAt(): Promise<number | null> {
	try {
		if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
			return await new Promise<number | null>((resolve) => {
				chrome.storage.local.get(['lastShownAt'], (d: { lastShownAt?: number }) => resolve(d?.lastShownAt ?? null))
			})
		}
	} catch {}
	try {
		const raw = localStorage.getItem('lastShownAt');
		return raw ? Number(raw) : null;
	} catch { return null }
}

export async function setLastShownAt(ts: number): Promise<void> {
	try {
		if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
			await new Promise<void>((resolve) => {
				chrome.storage.local.set({ lastShownAt: ts }, () => resolve())
			})
			return
		}
	} catch {}
	try { localStorage.setItem('lastShownAt', String(ts)) } catch {}
}


