export type Language = 'ja' | 'en' | 'es' | 'pt' | 'hi' | 'zh-CN' | 'fr' | 'de' | 'ko' | 'ru';

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
  es: {
    popup: {
      title: 'Haz Esto En Su Lugar',
      subtitle: 'Configuración',
      taskPlaceholder: 'ej., Caminar (30 min)',
      addButton: 'Agregar',
      saveButton: 'Guardar',
      deleteButton: 'Eliminar',
      reminderLabel: 'Recordatorio (minutos, dejar vacío para desactivar)',
      reminderPlaceholder: 'ej., 30',
      themeLabel: 'Tema',
      themeAuto: 'Automático (Seguir sistema)',
      themeLight: 'Claro',
      themeDark: 'Oscuro',
      languageLabel: 'Idioma',
    },
    overlay: {
      title: 'Haz Esto En Su Lugar',
      prompt: '¿Ver de todos modos?',
      watchButton: 'Ver',
      cancelButton: 'Cerrar',
    },
    defaultTasks: [
      'Caminar (30 min)',
      'Leer (1 capítulo)',
      'Estirar (10 min)',
    ],
  },
  pt: {
    popup: {
      title: 'Faça Isto Em Vez Disso',
      subtitle: 'Configurações',
      taskPlaceholder: 'ex., Caminhar (30 min)',
      addButton: 'Adicionar',
      saveButton: 'Salvar',
      deleteButton: 'Excluir',
      reminderLabel: 'Lembrete (minutos, deixe vazio para desativar)',
      reminderPlaceholder: 'ex., 30',
      themeLabel: 'Tema',
      themeAuto: 'Automático (Seguir sistema)',
      themeLight: 'Claro',
      themeDark: 'Escuro',
      languageLabel: 'Idioma',
    },
    overlay: {
      title: 'Faça Isto Em Vez Disso',
      prompt: 'Assistir mesmo assim?',
      watchButton: 'Assistir',
      cancelButton: 'Fechar',
    },
    defaultTasks: [
      'Caminhar (30 min)',
      'Ler (1 capítulo)',
      'Alongar (10 min)',
    ],
  },
  hi: {
    popup: {
      title: 'इसके बजाय यह करें',
      subtitle: 'सेटिंग्स',
      taskPlaceholder: 'उदा., टहलना (30 मिनट)',
      addButton: 'जोड़ें',
      saveButton: 'सहेजें',
      deleteButton: 'हटाएं',
      reminderLabel: 'रिमाइंडर (मिनट, बंद करने के लिए खाली छोड़ें)',
      reminderPlaceholder: 'उदा., 30',
      themeLabel: 'थीम',
      themeAuto: 'स्वचालित (सिस्टम का पालन करें)',
      themeLight: 'लाइट',
      themeDark: 'डार्क',
      languageLabel: 'भाषा',
    },
    overlay: {
      title: 'इसके बजाय यह करें',
      prompt: 'फिर भी देखें?',
      watchButton: 'देखें',
      cancelButton: 'बंद करें',
    },
    defaultTasks: [
      'टहलना (30 मिनट)',
      'पढ़ना (1 अध्याय)',
      'स्ट्रेचिंग (10 मिनट)',
    ],
  },
  'zh-CN': {
    popup: {
      title: '做这个来代替',
      subtitle: '设置',
      taskPlaceholder: '例如：散步（30分钟）',
      addButton: '添加',
      saveButton: '保存',
      deleteButton: '删除',
      reminderLabel: '提醒（分钟，留空以禁用）',
      reminderPlaceholder: '例如：30',
      themeLabel: '主题',
      themeAuto: '自动（跟随系统）',
      themeLight: '浅色',
      themeDark: '深色',
      languageLabel: '语言',
    },
    overlay: {
      title: '做这个来代替',
      prompt: '还是要看吗？',
      watchButton: '观看',
      cancelButton: '关闭',
    },
    defaultTasks: [
      '散步（30分钟）',
      '阅读（1章）',
      '拉伸（10分钟）',
    ],
  },
  fr: {
    popup: {
      title: 'Faites Ceci À La Place',
      subtitle: 'Paramètres',
      taskPlaceholder: 'ex., Marcher (30 min)',
      addButton: 'Ajouter',
      saveButton: 'Enregistrer',
      deleteButton: 'Supprimer',
      reminderLabel: 'Rappel (minutes, laisser vide pour désactiver)',
      reminderPlaceholder: 'ex., 30',
      themeLabel: 'Thème',
      themeAuto: 'Automatique (Suivre le système)',
      themeLight: 'Clair',
      themeDark: 'Sombre',
      languageLabel: 'Langue',
    },
    overlay: {
      title: 'Faites Ceci À La Place',
      prompt: 'Regarder quand même?',
      watchButton: 'Regarder',
      cancelButton: 'Fermer',
    },
    defaultTasks: [
      'Marcher (30 min)',
      'Lire (1 chapitre)',
      'Étirer (10 min)',
    ],
  },
  de: {
    popup: {
      title: 'Mach Stattdessen Das',
      subtitle: 'Einstellungen',
      taskPlaceholder: 'z.B., Spazieren (30 Min)',
      addButton: 'Hinzufügen',
      saveButton: 'Speichern',
      deleteButton: 'Löschen',
      reminderLabel: 'Erinnerung (Minuten, leer lassen zum Deaktivieren)',
      reminderPlaceholder: 'z.B., 30',
      themeLabel: 'Design',
      themeAuto: 'Automatisch (System folgen)',
      themeLight: 'Hell',
      themeDark: 'Dunkel',
      languageLabel: 'Sprache',
    },
    overlay: {
      title: 'Mach Stattdessen Das',
      prompt: 'Trotzdem ansehen?',
      watchButton: 'Ansehen',
      cancelButton: 'Schließen',
    },
    defaultTasks: [
      'Spazieren (30 Min)',
      'Lesen (1 Kapitel)',
      'Dehnen (10 Min)',
    ],
  },
  ko: {
    popup: {
      title: '대신 이것을 하세요',
      subtitle: '설정',
      taskPlaceholder: '예: 산책 (30분)',
      addButton: '추가',
      saveButton: '저장',
      deleteButton: '삭제',
      reminderLabel: '리마인더 (분, 비활성화하려면 비워두세요)',
      reminderPlaceholder: '예: 30',
      themeLabel: '테마',
      themeAuto: '자동 (시스템 따르기)',
      themeLight: '라이트',
      themeDark: '다크',
      languageLabel: '언어',
    },
    overlay: {
      title: '대신 이것을 하세요',
      prompt: '그래도 볼까요?',
      watchButton: '보기',
      cancelButton: '닫기',
    },
    defaultTasks: [
      '산책 (30분)',
      '독서 (1장)',
      '스트레칭 (10분)',
    ],
  },
  ru: {
    popup: {
      title: 'Сделай Это Вместо Этого',
      subtitle: 'Настройки',
      taskPlaceholder: 'напр., Прогулка (30 мин)',
      addButton: 'Добавить',
      saveButton: 'Сохранить',
      deleteButton: 'Удалить',
      reminderLabel: 'Напоминание (минуты, оставьте пустым для отключения)',
      reminderPlaceholder: 'напр., 30',
      themeLabel: 'Тема',
      themeAuto: 'Авто (Следовать системе)',
      themeLight: 'Светлая',
      themeDark: 'Тёмная',
      languageLabel: 'Язык',
    },
    overlay: {
      title: 'Сделай Это Вместо Этого',
      prompt: 'Всё равно смотреть?',
      watchButton: 'Смотреть',
      cancelButton: 'Закрыть',
    },
    defaultTasks: [
      'Прогулка (30 мин)',
      'Чтение (1 глава)',
      'Растяжка (10 мин)',
    ],
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language.toLowerCase();
  
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('pt')) return 'pt';
  if (lang.startsWith('hi')) return 'hi';
  if (lang.startsWith('zh-cn') || lang.startsWith('zh_cn')) return 'zh-CN';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('ru')) return 'ru';
  
  return 'en';
}

