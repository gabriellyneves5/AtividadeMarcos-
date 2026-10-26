import { formatDate, isOverdue, normalizeDate } from '../utils.js';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);
  const due = normalizeDate(task.due_date);

  return (
    <li className={`task ${task.completed ? 'is-done' : ''} ${overdue ? 'is-overdue' : ''}`}>
      <button
        type="button"
        className="check"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
        onClick={() => onToggle(task)}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="task-body">
        <span className="task-title">{task.title}</span>
        {(due || overdue) && (
          <span className="task-meta">
            {due && <span className="task-date">{formatDate(due)}</span>}
            {overdue && <span className="badge">Em atraso</span>}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button type="button" className="icon-btn" aria-label={`Editar "${task.title}"`} onClick={() => onEdit(task)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M13.5 3.5l3 3L7 16l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="icon-btn danger" aria-label={`Excluir "${task.title}"`} onClick={() => onDelete(task)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 6h12M8 6V4h4v2M6 6l.7 10h6.6L14 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
  );
}
