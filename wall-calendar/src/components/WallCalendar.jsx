'use client';

import { useState, useEffect } from 'react';
import CalendarGrid from './CalendarGrid';
import HeroPanel from './HeroPanel';
import NotesPanel from './NotesPanel';
import ThemeBar from './ThemeBar';
import Spiral from './Spiral';
import { useCalendarStore } from '../hooks/useCalendarStore';
import { THEMES } from '../utils/themes';
import styles from './WallCalendar.module.css';

export default function WallCalendar() {
  const store = useCalendarStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const t = THEMES[store.theme];

  return (
    <div
      className={styles.wrapper}
      style={{
        '--accent': t.accent,
        '--accent-light': t.accentLight,
        '--grad-from': t.gradientFrom,
        '--grad-to': t.gradientTo,
      }}
    >
      <div className={styles.calendar}>
        <Spiral />
        <HeroPanel
          month={store.currentDate.month}
          year={store.currentDate.year}
          theme={store.theme}
          heroImage={store.heroImage}
          onImageUpload={store.setHeroImage}
        />
        <div className={styles.body}>
          <NotesPanel
            year={store.currentDate.year}
            month={store.currentDate.month}
            rangeStart={store.rangeStart}
            rangeEnd={store.rangeEnd}
            notes={store.notes}
            setNote={store.setNote}
            rangeNotes={store.rangeNotes}
            setRangeNote={store.setRangeNote}
            accent={t.accent}
          />
          <CalendarGrid
            year={store.currentDate.year}
            month={store.currentDate.month}
            rangeStart={store.rangeStart}
            rangeEnd={store.rangeEnd}
            onDateClick={store.selectDate}
            onDragSelect={store.dragSelect}
            onNavigate={store.setCurrentDate}
            notes={store.notes}
            accent={t.accent}
            accentLight={t.accentLight}
          />
        </div>
        <ThemeBar currentTheme={store.theme} onThemeChange={store.setTheme} />
      </div>
    </div>
  );
}
