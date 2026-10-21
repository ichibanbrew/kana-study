import { getBasicRowIds } from './data/hiragana.js';

const STORAGE_KEY = 'hiragana_study_state_v1';

/**
 * Get initial default state
 */
export function getDefaultState() {
  const basicRows = getBasicRowIds();
  return {
    script: 'hiragana', // 'hiragana' | 'katakana'
    selectedRowIds: [...basicRows],
    selectedRowsByScript: {
      hiragana: [...basicRows],
      katakana: [...basicRows]
    },
    stats: {
      answered: 0,
      correct: 0,
      currentStreak: 0,
      bestStreak: 0
    },
    mistakes: {}, // kana -> { kana, romaji, rowName, count }
    settings: {
      autoAdvance: true,
      soundEnabled: true,
      voiceEnabled: true,
      theme: 'dark', // 'dark' | 'light'
      showRowHint: false
    }
  };
}

export class StateManager {
  constructor() {
    this.state = this.load();
    this.listeners = [];
  }

  load() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const defaults = getDefaultState();
          const script = parsed.script === 'katakana' ? 'katakana' : 'hiragana';
          const selectedRowsByScript = {
            hiragana: parsed.selectedRowsByScript?.hiragana || parsed.selectedRowIds || defaults.selectedRowsByScript.hiragana,
            katakana: parsed.selectedRowsByScript?.katakana || defaults.selectedRowsByScript.katakana
          };
          return {
            ...defaults,
            ...parsed,
            script,
            selectedRowsByScript,
            selectedRowIds: selectedRowsByScript[script],
            settings: { ...defaults.settings, ...parsed.settings },
            stats: { ...defaults.stats, ...parsed.stats },
            mistakes: parsed.mistakes || {}
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return getDefaultState();
  }

  save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // Script selection methods ('hiragana' | 'katakana')
  getScript() {
    return this.state.script || 'hiragana';
  }

  setScript(script) {
    if (script !== 'hiragana' && script !== 'katakana') return;
    this.state.script = script;
    if (!this.state.selectedRowsByScript) {
      this.state.selectedRowsByScript = {
        hiragana: getBasicRowIds(),
        katakana: getBasicRowIds()
      };
    }
    this.state.selectedRowIds = this.state.selectedRowsByScript[script];
    this.save();
  }

  // Row selection methods
  getSelectedRowIds() {
    const script = this.getScript();
    if (this.state.selectedRowsByScript && this.state.selectedRowsByScript[script]) {
      return this.state.selectedRowsByScript[script];
    }
    return this.state.selectedRowIds;
  }

  setSelectedRowIds(rowIds) {
    const uniqueIds = Array.from(new Set(rowIds));
    const script = this.getScript();
    if (!this.state.selectedRowsByScript) {
      this.state.selectedRowsByScript = {
        hiragana: getBasicRowIds(),
        katakana: getBasicRowIds()
      };
    }
    this.state.selectedRowsByScript[script] = uniqueIds;
    this.state.selectedRowIds = uniqueIds;
    this.save();
  }

  toggleRow(rowId) {
    const current = new Set(this.getSelectedRowIds());
    if (current.has(rowId)) {
      current.delete(rowId);
    } else {
      current.add(rowId);
    }
    this.setSelectedRowIds(Array.from(current));
  }

  // Stats methods
  recordResult(target, isCorrect) {
    this.state.stats.answered += 1;

    if (isCorrect) {
      this.state.stats.correct += 1;
      this.state.stats.currentStreak += 1;
      if (this.state.stats.currentStreak > this.state.stats.bestStreak) {
        this.state.stats.bestStreak = this.state.stats.currentStreak;
      }
    } else {
      this.state.stats.currentStreak = 0;
      // Record mistake
      const existing = this.state.mistakes[target.kana] || {
        kana: target.kana,
        romaji: target.romaji,
        rowName: target.rowName,
        count: 0
      };
      existing.count += 1;
      this.state.mistakes[target.kana] = existing;
    }

    this.save();
  }

  resetStats() {
    this.state.stats = {
      answered: 0,
      correct: 0,
      currentStreak: 0,
      bestStreak: 0
    };
    this.state.mistakes = {};
    this.save();
  }

  // Settings
  updateSettings(partial) {
    this.state.settings = { ...this.state.settings, ...partial };
    this.save();
  }
}

export const stateManager = new StateManager();
