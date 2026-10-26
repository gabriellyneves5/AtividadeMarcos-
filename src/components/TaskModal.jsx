import { useEffect, useRef, useState } from 'react';
import { normalizeDate } from '../utils.js';

// task = null  -> modal "Create Task"; task = {...} -> modal "Edit Task"
export default function TaskModal({ task, onClose, onSave }) {
  const isEdit = !!task;
  const [title, setTitle] = useState(task?.title ?? '');
  const [dueDate, setDueDate] = useState(normalizeDate(task?.due_date));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Digite o nome da tarefa.');
      inputRef.current?.focus();
      return;
    }
    setSaving(true);
    try {
      await onSave({ title: title.trim(), dueDate: dueDate || null });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onSubmit={handleSubmit}>
        <h2 id="modal-title">{isEdit ? 'Edit Task' : 'Create Task'}</h2>

        <label className="field">
          <span>Nome da tarefa</span>
          <input
            ref={inputRef}
            type="text"
            value={title}
            maxLength={255}
            placeholder="O que precisa ser feito?"
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
          />
        </label>

        <label className="field">
          <span>Data limite (opcional)</span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar tarefa'}
          </button>
        </div>
      </form>
    </div>
  );
}
