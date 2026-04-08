'use client';

import { MONTHS } from '../utils/themes';
import styles from './NotesPanel.module.css';

export default function NotesPanel({
  year, month, rangeStart, rangeEnd,
  notes, setNote, rangeNotes, setRangeNote, accent,
}) {
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  const rangeKey = rangeStart && rangeEnd
    ? `${rangeStart}__${rangeEnd}`
    : rangeStart || null;

  const formatLabel = () => {
    if (rangeStart && rangeEnd) {
      const [,,sd] = rangeStart.split('-');
      const [,,ed] = rangeEnd.split('-');
      return `${sd} – ${ed} ${MONTHS[month].slice(0, 3)}`;
    }
    if (rangeStart) {
      const [,,d] = rangeStart.split('-');
      return `${d} ${MONTHS[month].slice(0, 3)}`;
    }
    return null;
  };

  const rangeLabel = formatLabel();

  return (
    <div className={styles.panel}>
      <p className={styles.heading}>Notes</p>
      <div className={styles.linesWrap}>
        {[...Array(5)].map((_, i) => <div key={i} className={styles.line} />)}
        <textarea
          className={styles.ta}
          value={notes[monthKey] || ''}
          onChange={e => setNote(monthKey, e.target.value)}
          placeholder={`${MONTHS[month]}…`}
          aria-label="Monthly notes"
        />
      </div>

      {rangeKey && (
        <div className={styles.rangeBox} style={{ borderColor: accent }}>
          <p className={styles.rangeLabel} style={{ color: accent }}>{rangeLabel}</p>
          <input
            className={styles.rangeInput}
            value={(rangeStart && rangeEnd ? rangeNotes[rangeKey] : notes[rangeKey]) || ''}
            onChange={e => {
              if (rangeStart && rangeEnd) setRangeNote(rangeKey, e.target.value);
              else setNote(rangeKey, e.target.value);
            }}
            placeholder="Add a note…"
            aria-label="Date note"
          />
        </div>
      )}

      <div className={styles.watermark}>{MONTHS[month].toUpperCase()}</div>
    </div>
  );
}
