export type Language = 'ja' | 'en';

export type Translations = {
  popup: {
    title: string;
    subtitle: string;
    taskPlaceholder: string;
    addButton: string;
    saveButton: string;
    deleteButton: string;
    reminderLabel: string;
    reminderPlaceholder: string;
    themeLabel: string;
    themeAuto: string;
    themeLight: string;
    themeDark: string;
    languageLabel: string;
  };
  overlay: {
    title: string;
    prompt: string;
    watchButton: string;
    cancelButton: string;
  };
  defaultTasks: string[];
};

export const translations: Record<Language, Translations> = {
  ja: {
    popup: {
      title: '代わりにやること',
      subtitle: '設定',
      taskPlaceholder: '例: ウォーキング(30分)',
      addButton: '追加',
      saveButton: '保存',
      deleteButton: '削除',
      reminderLabel: 'リマインダー（分・未設定でOFF）',
      reminderPlaceholder: '例: 30',
      themeLabel: 'テーマ',
      themeAuto: '自動（OS設定に追従）',
      themeLight: 'ライト',
      themeDark: 'ダーク',
      languageLabel: '言語',
    },
    overlay: {
      title: '代わりにやること',
      prompt: 'それでも見る？',
      watchButton: '見る',
      cancelButton: 'やめる',
    },
    defaultTasks: [
      'ウォーキング(30分)',
      '読書(1章)',
      'ストレッチ(10分)',
    ],
  },
  en: {
    popup: {
      title: 'Do This Instead',
      subtitle: 'Settings',
      taskPlaceholder: 'e.g., Walk (30 min)',
      addButton: 'Add',
      saveButton: 'Save',
      deleteButton: 'Delete',
      reminderLabel: 'Reminder (minutes, leave empty to disable)',
      reminderPlaceholder: 'e.g., 30',
      themeLabel: 'Theme',
      themeAuto: 'Auto (Follow system)',
      themeLight: 'Light',
      themeDark: 'Dark',
      languageLabel: 'Language',
    },
    overlay: {
      title: 'Do This Instead',
      prompt: 'Watch anyway?',
      watchButton: 'Watch',
      cancelButton: 'Close',
    },
    defaultTasks: [
      'Walk (30 min)',
      'Read (1 chapter)',
      'Stretch (10 min)',
    ],
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.ja;
}

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'ja';
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('en')) return 'en';
  return 'ja';
}

