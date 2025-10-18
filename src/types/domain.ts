export type CloseTabMessage = { action: 'closeTab' };
export type ExtensionMessage = CloseTabMessage; // 拡張しやすいように集約

export type Task = { id: string; text: string; done?: boolean };
export type Settings = {
  showOn: 'every_visit' | 'once_per_session';
  remindAfterMinutes?: number; // 例: 15/30/60, undefinedならOFF
  theme: 'auto' | 'light' | 'dark';
  language: 'ja' | 'en';
};
export type StorageShape = { tasks: Task[]; settings: Settings };


