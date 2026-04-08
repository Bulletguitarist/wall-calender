'use client';

import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { MONTHS, WEEKDAYS, INDIAN_HOLIDAYS } from '../utils/themes';
import { toKey, fromKey, buildCalendarDays } from '../utils/dates';
import styles from './CalendarGrid.module.css';

export default function CalendarGrid({
  year, month, rangeStart, rangeEnd,
  onDateClick, onDragSelect, onNavigate,
  notes, accent, accentLight,
}) {
  const today = new Date();
  const [displayYear,  setDisplayYear]  = useState(year);
  const [displayMonth, setDisplayMonth] = useState(month);
  const [phase, setPhase] = useState('idle'); // idle | out | in
  const isDragging    = useRef(false);
  const dragStartKey  = useRef(null);
  const animating     = useRef(false);

  const days = useMemo(
    () => buildCalendarDays(displayYear, displayMonth),
    [displayYear, displayMonth]
  );

  useEffect(() => {
    if (year === displayYear && month === displayMonth) return;
    if (animating.current) return;
    animating.current = true;

    setPhase('out');
    setTimeout(() => {
      setDisplayYear(year);
      setDisplayMonth(month);
      setPhase('in');
      setTimeout(() => {
        setPhase('idle');
        animating.current = false;
      }, 280);
    }, 280);
  }, [year, month]);

  const flipStyle = (() => {
    const base = {
      transformStyle: 'preserve-3d',
      transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1), opacity 280ms ease',
      transformOrigin: 'center top',
      willChange: 'transform, opacity',
    };
    if (phase === 'out') return { ...base, transform: 'perspective(600px) rotateX(-90deg)', opacity: 0 };
    if (phase === 'in')  return { ...base, transform: 'perspective(600px) rotateX(0deg)',   opacity: 1, transition: 'transform 280ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease' };
    return { ...base, transform: 'perspective(600px) rotateX(0deg)', opacity: 1 };
  })();

  const startDate = rangeStart ? fromKey(rangeStart) : null;
  const endDate   = rangeEnd   ? fromKey(rangeEnd)   : null;
  const holidayKey = (m, d) => `${m + 1}-${d}`;

  const getCellStyle = (cell) => {
    if (!cell.current) return {};
    const cellDate = new Date(displayYear, displayMonth, cell.date);
    const isStart  = startDate && cellDate.toDateString() === startDate.toDateString();
    const isEnd    = endDate   && cellDate.toDateString() === endDate.toDateString();
    if (isStart || isEnd) return { background: accent, color: '#fff', borderRadius: '8px' };
    if (startDate && endDate && cellDate > startDate && cellDate < endDate)
      return { background: accentLight, borderRadius: '0' };
    if (cell.weekend) return { color: accent };
    if (today.getFullYear() === displayYear && today.getMonth() === displayMonth && today.getDate() === cell.date)
      return { color: accent, fontWeight: '700' };
    return {};
  };

  const getCls = (cell) => {
    if (!cell.current) return styles.ghost;
    const hk      = holidayKey(displayMonth, cell.date);
    const cellDate = new Date(displayYear, displayMonth, cell.date);
    const inRange  = startDate && endDate && cellDate > startDate && cellDate < endDate;
    const cls = [styles.day];
    if (inRange) cls.push(styles.inRange);
    if (INDIAN_HOLIDAYS[hk]) cls.push(styles.holiday);
    if (notes[toKey(displayYear, displayMonth, cell.date)]) cls.push(styles.hasNote);
    return cls.join(' ');
  };

  const onMouseDown = useCallback((y, m, d) => {
    isDragging.current   = true;
    dragStartKey.current = toKey(y, m, d);
    onDateClick(y, m, d);
  }, [onDateClick]);

  const onMouseEnter = useCallback((y, m, d) => {
    if (!isDragging.current || !dragStartKey.current) return;
    const startD = fromKey(dragStartKey.current);
    const hoverD = new Date(y, m, d);
    if (hoverD >= startD) onDragSelect(dragStartKey.current, toKey(y, m, d));
    else                  onDragSelect(toKey(y, m, d), dragStartKey.current);
  }, [onDragSelect]);

  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const selDays = startDate && endDate
    ? Math.round((endDate - startDate) / 86400000) + 1
    : null;

  return (
    <div className={styles.panel} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
      <div className={styles.nav}>
        <button
          className={styles.navBtn}
          onClick={() => { if (!animating.current) { const d = new Date(year, month - 1, 1); onNavigate({ year: d.getFullYear(), month: d.getMonth() }); }}}
          aria-label="Previous month"
        >&#8249;</button>
        <span className={styles.navLabel}>{MONTHS[displayMonth]} {displayYear}</span>
        <button
          className={styles.navBtn}
          onClick={() => { if (!animating.current) { const d = new Date(year, month + 1, 1); onNavigate({ year: d.getFullYear(), month: d.getMonth() }); }}}
          aria-label="Next month"
        >&#8250;</button>
      </div>

      <div className={styles.dowRow}>
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={styles.dow} style={{ color: i >= 5 ? accent : '#bbb' }}>{w}</div>
        ))}
      </div>

      <div style={flipStyle}>
        <div className={styles.daysGrid}>
          {days.map((cell, i) => {
            const hk          = cell.current ? holidayKey(displayMonth, cell.date) : null;
            const holidayName = hk ? INDIAN_HOLIDAYS[hk] : null;
            return (
              <div
                key={i}
                className={getCls(cell)}
                style={getCellStyle(cell)}
                onMouseDown={cell.current ? () => onMouseDown(displayYear, displayMonth, cell.date) : undefined}
                onMouseEnter={cell.current ? () => onMouseEnter(displayYear, displayMonth, cell.date) : undefined}
                role={cell.current ? 'button' : undefined}
                tabIndex={cell.current ? 0 : undefined}
                onKeyDown={e => e.key === 'Enter' && cell.current && onDateClick(displayYear, displayMonth, cell.date)}
                aria-label={cell.current ? `${MONTHS[displayMonth]} ${cell.date}${holidayName ? `, ${holidayName}` : ''}` : undefined}
              >
                {cell.date}
                {holidayName && (
                  <span className={styles.tooltip}>{holidayName}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.legendRow}>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#FF6B6B' }} /> Holiday
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: accent }} /> Note
          </span>
        </div>
        <div className={styles.selInfo}>
          {selDays
            ? `${selDays} day${selDays > 1 ? 's' : ''} selected`
            : rangeStart && !rangeEnd
            ? 'Click or drag to extend'
            : 'Click a date to start'}
        </div>
      </div>
    </div>
  );
}
