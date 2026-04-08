'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'wc-v2-state';

function load() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function save(s) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export function useCalendarStore() {
  const now = new Date();
  const [currentDate, _setCurrentDate] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd,   setRangeEnd]   = useState(null);
  const [selecting,  setSelecting]  = useState(false);
  const [notes,      setNotes]      = useState({});
  const [rangeNotes, setRangeNotes] = useState({});
  const [theme,      setThemeState] = useState('sunset');
  const [heroImage,  setHeroImageState] = useState(null);
  const [hydrated,   setHydrated]   = useState(false);

  useEffect(() => {
    const saved = load();
    if (saved) {
      if (saved.notes)      setNotes(saved.notes);
      if (saved.rangeNotes) setRangeNotes(saved.rangeNotes);
      if (saved.theme)      setThemeState(saved.theme);
      if (saved.heroImage)  setHeroImageState(saved.heroImage);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    save({ notes, rangeNotes, theme, heroImage });
  }, [notes, rangeNotes, theme, heroImage, hydrated]);

  const setCurrentDate = useCallback((d) => {
    _setCurrentDate(d);
    setRangeStart(null);
    setRangeEnd(null);
    setSelecting(false);
  }, []);

  const toKey = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const fromKey = (k) => {
    const [y, m, d] = k.split('-');
    return new Date(+y, +m - 1, +d);
  };

  const selectDate = useCallback((year, month, day) => {
    const key = toKey(year, month, day);
    if (!selecting || !rangeStart) {
      setRangeStart(key);
      setRangeEnd(null);
      setSelecting(true);
    } else {
      const s = fromKey(rangeStart);
      const e = new Date(year, month, day);
      if (e < s) { setRangeStart(key); setRangeEnd(null); }
      else        { setRangeEnd(key); setSelecting(false); }
    }
  }, [selecting, rangeStart]);

  const dragSelect = useCallback((startKey, endKey) => {
    setRangeStart(startKey);
    setRangeEnd(endKey);
    setSelecting(false);
  }, []);

  const setNote      = useCallback((k, v) => setNotes(p      => ({ ...p, [k]: v })), []);
  const setRangeNote = useCallback((k, v) => setRangeNotes(p => ({ ...p, [k]: v })), []);
  const setTheme     = useCallback((t) => setThemeState(t), []);
  const setHeroImage = useCallback((img) => setHeroImageState(img), []);

  return {
    currentDate, setCurrentDate,
    rangeStart, rangeEnd,
    selectDate, dragSelect,
    notes, setNote,
    rangeNotes, setRangeNote,
    theme, setTheme,
    heroImage, setHeroImage,
  };
}
