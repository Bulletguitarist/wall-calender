'use client';
import { THEMES } from '../utils/themes';
import styles from './ThemeBar.module.css';

export default function ThemeBar({ currentTheme, onThemeChange }) {
  return (
    <div className={styles.bar}>
      <span className={styles.label}>Vibe</span>
      {Object.entries(THEMES).map(([key, t]) => (
        <button
          key={key}
          className={`${styles.pill} ${currentTheme === key ? styles.active : ''}`}
          style={currentTheme === key
            ? { background: t.accent, borderColor: t.accent, color: '#fff' }
            : {}}
          onClick={() => onThemeChange(key)}
          aria-pressed={currentTheme === key}
        >
          <span className={styles.dot} style={{ background: t.dot }} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
