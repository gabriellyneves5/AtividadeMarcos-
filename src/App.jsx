import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import { useDebounce } from './hooks/useDebounce.js';
import { sortTasks } from './utils.js';
import TaskItem from './components/TaskItem.jsx';
import TaskModal from './components/TaskModal.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [totals, setTotals] = useState({ total: 0, completed: 0 });
  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 400);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | { task: null | Task }

  const load = useCallback(async () => {
    try {
      const data = await api.list(search.trim());
      setTasks(sortTasks(data.tasks));
      setTotals({ total: data.total, completed: data.completed });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Dispara só quando o valor "debounced" muda
  useEffect(() => { load(); }, [load]);

  async function run(action) {
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const handleToggle = (task) => run(() => api.update(task.id, { completed: !task.completed }));
  const handleDelete = (task) => {
    if (window.confirm(`Excluir a tarefa "${task.title}"?`)) run(() => api.remove(task.id));
  };

  async function handleSave({ title, dueDate }) {
    if (modal.task) await api.update(modal.task.id, { title, dueDate });
    else await api.create(title, dueDate);
    setModal(null);
    await load();
  }

  const closeModal = useCallback(() => setModal(null), []);
  const searching = search.trim() !== '';

  return (
    <div className="page">
      <main className="panel">
        <header className="panel-head">
          <h1>Minhas tarefas</h1>
          <p className="counters" aria-live="polite">
            <span><strong>{totals.total}</strong> total</span>
            <span><strong>{totals.completed}</strong> concluídas</span>
          </p>
        </header>

        <div className="search">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={searchInput}
            placeholder="Buscar tarefas"
            aria-label="Buscar tarefas"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {error && <p className="banner" role="alert">{error}</p>}

        {loading ? (
          <p className="empty">Carregando…</p>
        ) : tasks.length === 0 ? (
          <div className="empty">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <rect x="12" y="8" width="40" height="48" rx="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <path d="M22 24h20M22 34h20M22 44h11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p>{searching ? 'No tasks match your search.' : 'You have no pending tasks.'}</p>
          </div>
        ) : (
          <ul className="list">
            {tasks.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={handleToggle}
                onEdit={(task) => setModal({ task })}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>

      <button type="button" className="fab" aria-label="Create Task" onClick={() => setModal({ task: null })}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </button>

      {modal && <TaskModal task={modal.task} onClose={closeModal} onSave={handleSave} />}
    </div>
  );
}
