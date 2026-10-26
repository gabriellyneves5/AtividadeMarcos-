// Data local de hoje no formato YYYY-MM-DD (evita problemas de fuso do toISOString)
export function todayStr() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// Aceita 'YYYY-MM-DD' (ou com hora) e devolve só a parte da data
export function normalizeDate(value) {
  return value ? String(value).slice(0, 10) : '';
}

export function isOverdue(task) {
  const due = normalizeDate(task.due_date);
  return !task.completed && !!due && due < todayStr();
}

export function formatDate(value) {
  const [y, m, d] = normalizeDate(value).split('-');
  return `${d}/${m}/${y}`;
}

// Data mais próxima primeiro; sem data por último
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const da = normalizeDate(a.due_date);
    const db = normalizeDate(b.due_date);
    if (da && !db) return -1;
    if (!da && db) return 1;
    if (da !== db) return da < db ? -1 : 1;
    return String(b.created_at).localeCompare(String(a.created_at));
  });
}
