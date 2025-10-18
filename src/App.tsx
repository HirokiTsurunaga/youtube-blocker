import './App.css'
import './content.css'
import { useEffect, useState } from 'react'
import type { Task } from './types/domain'
import { loadTasks, saveTasks, loadSettings, saveSettings } from './utils/storage'
import type { Settings } from './types/domain'
import { getTranslations } from './i18n/translations'

function IconButton({ onClick, label, title, children, variant = 'default' }: { onClick: () => void; label: string; title?: string; children: React.ReactNode; variant?: 'default' | 'primary' }) {
  const isPrimary = variant === 'primary'
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={title ?? label}
      style={{
        minWidth: 44,
        height: 44,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        border: isPrimary ? 'none' : '1px solid rgba(128, 128, 128, 0.3)',
        background: isPrimary ? '#007AFF' : 'transparent',
        color: isPrimary ? 'white' : 'var(--yb-text)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isPrimary ? '#0051D5' : 'rgba(128, 128, 128, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isPrimary ? '#007AFF' : 'transparent'
      }}
    >
      {children}
    </button>
  )
}

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [settings, setSettings] = useState<Settings>({ showOn: 'once_per_session', remindAfterMinutes: undefined, theme: 'auto', language: 'en' })
  
  const t = getTranslations(settings.language).popup

  useEffect(() => {
    loadTasks().then(setTasks)
    loadSettings().then(setSettings)
  }, [])

  // テーマ即時反映（ポップアップ内でのプレビュー）
  useEffect(() => {
    const theme = settings.theme ?? 'auto'
    document.documentElement.setAttribute('data-yb-theme', theme)
    return () => {
      // 破棄時に元へ戻す必要はないが、念のため削除
      document.documentElement.removeAttribute('data-yb-theme')
    }
  }, [settings.theme])

  const addTask = () => {
    setTasks([...tasks, { id: crypto.randomUUID(), text: '' }])
  }

  const updateTask = (id: string, text: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, text } : t))
  }

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const save = () => {
    const sanitized = tasks
      .map(t => ({ ...t, text: t.text.trim() }))
      .filter(t => t.text.length > 0)
      .slice(0, 10)
    Promise.all([
      saveTasks(sanitized),
      saveSettings(settings),
    ]).then(() => window.close())
  }

  const inputStyle = {
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid rgba(128, 128, 128, 0.3)',
    background: 'var(--yb-bg)',
    color: 'var(--yb-text)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '500' as const,
    color: 'var(--yb-text)',
    opacity: 0.8,
  }

  return (
    <div style={{ width: '420px', padding: '20px', backgroundColor: 'var(--yb-bg)', color: 'var(--yb-text)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <h1 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
        {t.title}
        <div style={{ fontSize: '12px', fontWeight: '400', opacity: 0.6, marginTop: '2px' }}>{t.subtitle}</div>
      </h1>
      
      {tasks.map(task => (
        <div key={task.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            value={task.text}
            onChange={(e) => updateTask(task.id, e.target.value)}
            placeholder={t.taskPlaceholder}
            style={{ ...inputStyle, flex: 1 }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#007AFF'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(128, 128, 128, 0.3)'}
          />
          <button 
            onClick={() => removeTask(task.id)} 
            aria-label={t.deleteButton}
            style={{
              minWidth: 38,
              height: 38,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              border: '1px solid rgba(128, 128, 128, 0.3)',
              background: 'transparent',
              color: 'var(--yb-text)',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(255, 59, 48, 0.5)'
              e.currentTarget.style.color = '#FF3B30'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(128, 128, 128, 0.3)'
              e.currentTarget.style.color = 'var(--yb-text)'
            }}
          >
            ✕
          </button>
        </div>
      ))}
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
        <IconButton onClick={addTask} label={t.addButton} title={t.addButton}>
          <PlusIcon />
        </IconButton>
        <div style={{ marginLeft: 'auto' }} />
        <IconButton onClick={save} label={t.saveButton} title={t.saveButton} variant="primary">
          <CheckIcon />
        </IconButton>
      </div>

      <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid rgba(128, 128, 128, 0.2)' }} />
      
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{t.reminderLabel}</label>
        <input
          type="number"
          min={1}
          placeholder={t.reminderPlaceholder}
          value={settings.remindAfterMinutes ?? ''}
          onChange={e => setSettings({ ...settings, remindAfterMinutes: e.target.value ? Number(e.target.value) : undefined })}
          style={{ ...inputStyle, width: '120px' }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#007AFF'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(128, 128, 128, 0.3)'}
        />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{t.themeLabel}</label>
        <select
          value={settings.theme ?? 'auto'}
          onChange={e => setSettings({ ...settings, theme: e.target.value as Settings['theme'] })}
          style={{
            ...inputStyle,
            width: '100%',
            cursor: 'pointer',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#007AFF'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(128, 128, 128, 0.3)'}
        >
          <option value="auto">{t.themeAuto}</option>
          <option value="light">{t.themeLight}</option>
          <option value="dark">{t.themeDark}</option>
        </select>
      </div>

      <div>
        <label style={labelStyle}>{t.languageLabel}</label>
        <select
          value={settings.language}
          onChange={e => setSettings({ ...settings, language: e.target.value as Settings['language'] })}
          style={{
            ...inputStyle,
            width: '100%',
            cursor: 'pointer',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#007AFF'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(128, 128, 128, 0.3)'}
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  )
}

export default App