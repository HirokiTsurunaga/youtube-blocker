import './App.css'
import { useEffect, useState } from 'react'
import type { Task } from './types/messages'
import { loadTasks, saveTasks, loadSettings, saveSettings } from './utils/storage'
import type { Settings } from './types/messages'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [settings, setSettings] = useState<Settings>({ showOn: 'once_per_session', remindAfterMinutes: undefined })

  useEffect(() => {
    loadTasks().then(setTasks)
    loadSettings().then(setSettings)
  }, [])

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
    <div style={{ width: '420px', padding: '20px' }}>
      <h1 style={{ marginBottom: '12px' }}>代わりにやること（編集）</h1>
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
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button onClick={addTask}>追加</button>
        <button onClick={save} style={{ marginLeft: 'auto' }}>保存</button>
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
    </div>
  )
}

export default App