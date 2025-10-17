import './App.css'
import './content.css'
import { useEffect, useState } from 'react'
import type { Task } from './types/domain'
import { loadTasks, saveTasks, loadSettings, saveSettings } from './utils/storage'
import type { Settings } from './types/domain'

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
  const [settings, setSettings] = useState<Settings>({ showOn: 'once_per_session', remindAfterMinutes: undefined, theme: 'auto' })

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

  return (
    <div style={{ width: '420px', padding: '20px', backgroundColor: 'var(--yb-bg)', color: 'var(--yb-text)' }}>
      <h1 style={{ marginBottom: '12px' }}>代わりにやること<br /><small>（設定）</small></h1>
      {tasks.map(task => (
        <div key={task.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            value={task.text}
            onChange={(e) => updateTask(task.id, e.target.value)}
            placeholder="例: ウォーキング(30分)"
            style={{ flex: 1, padding: '8px' }}
          />
          <button onClick={() => removeTask(task.id)} aria-label="削除">✕</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
        <IconButton onClick={addTask} label="追加" title="追加">
          <PlusIcon />
        </IconButton>
        <div style={{ marginLeft: 'auto' }} />
        <IconButton onClick={save} label="保存" title="保存" variant="primary">
          <CheckIcon />
        </IconButton>
      </div>

      <hr style={{ margin: '16px 0' }} />
      <div>
        <label style={{ display: 'block', marginBottom: '8px' }}>リマインダー（分・未設定でOFF）</label>
        <input
          type="number"
          min={1}
          placeholder="例: 30"
          value={settings.remindAfterMinutes ?? ''}
          onChange={e => setSettings({ ...settings, remindAfterMinutes: e.target.value ? Number(e.target.value) : undefined })}
          style={{ width: '120px', padding: '6px' }}
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>テーマ</label>
        <select
          value={settings.theme ?? 'auto'}
          onChange={e => setSettings({ ...settings, theme: e.target.value as Settings['theme'] })}
          style={{ padding: '6px' }}
        >
          <option value="auto">自動（OS設定に追従）</option>
          <option value="light">ライト</option>
          <option value="dark">ダーク</option>
        </select>
      </div>
    </div>
  )
}

export default App