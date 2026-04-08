export function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function fromKey(key) {
  const [y, m, d] = key.split('-');
  return new Date(+y, +m - 1, +d);
}

export function buildCalendarDays(year, month) {
  const firstDay    = new Date(year, month, 1).getDay();
  const offset      = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays    = new Date(year, month, 0).getDate();
  const cells       = [];

  for (let i = 0; i < offset; i++) {
    const dow = i % 7;
    cells.push({ date: prevDays - offset + i + 1, current: false, weekend: dow >= 5 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = (offset + d - 1) % 7;
    cells.push({ date: d, current: true, weekend: dow >= 5 });
  }
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    const dow = cells.length % 7;
    cells.push({ date: i, current: false, weekend: dow >= 5 });
  }
  return cells;
}
