'use client';

import { useRef, useEffect } from 'react';
import { MONTHS } from '../utils/themes';
import styles from './HeroPanel.module.css';

export default function HeroPanel({ month, year, theme, heroImage, onImageUpload }) {
  const canvasRef = useRef(null);
  const fileRef   = useRef(null);

  const GRADIENTS = {
    sunset: ['#FF6B6B', '#FFD93D'],
    ocean:  ['#4D96FF', '#6BCB77'],
    forest: ['#2d6a4f', '#6BCB77'],
    candy:  ['#C77DFF', '#FF6B6B'],
    gold:   ['#FFD93D', '#FF6B6B'],
  };

  const ACCENTS = {
    sunset: '#FF6B6B', ocean: '#4D96FF',
    forest: '#6BCB77', candy: '#C77DFF', gold: '#FFD93D',
  };

  useEffect(() => {
    if (heroImage || !canvasRef.current) return;
    const c   = canvasRef.current;
    const ctx = c.getContext('2d');
    c.width   = c.offsetWidth  || 880;
    c.height  = c.offsetHeight || 210;
    const [from, to] = GRADIENTS[theme] || GRADIENTS.sunset;
    const g = ctx.createLinearGradient(0, 0, c.width, c.height);
    g.addColorStop(0, from);
    g.addColorStop(1, to);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(i * 150 + 60, 100 + Math.sin(i * 1.2) * 35, 55 + i * 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [theme, heroImage]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onImageUpload(ev.target.result);
    reader.readAsDataURL(file);
  };

  const accent = ACCENTS[theme] || '#FF6B6B';

  return (
    <div className={styles.hero} onClick={() => fileRef.current?.click()}>
      {heroImage ? (
        <img src={heroImage} alt="Hero" className={styles.heroImg} />
      ) : (
        <canvas ref={canvasRef} className={styles.canvas} />
      )}

      <div className={styles.uploadOverlay}>
        <div className={styles.uploadHint}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v9M4 6l4-4 4 4M2 13h12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Upload photo
        </div>
      </div>

      <svg className={styles.wave} viewBox="0 0 880 54" preserveAspectRatio="none">
        <polygon points="0,54 0,28 160,50 380,16 600,46 880,12 880,54" fill="#ffffff" />
      </svg>

      <div className={styles.badge}>
        <span className={styles.badgeYear}>{year}</span>
        <span className={styles.badgeMonth} style={{ color: '#fff' }}>
          {MONTHS[month].toUpperCase()}
        </span>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className={styles.fileInput} onChange={handleFile} />
    </div>
  );
}
