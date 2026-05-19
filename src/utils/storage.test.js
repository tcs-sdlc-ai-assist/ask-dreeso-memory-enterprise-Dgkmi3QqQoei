import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  getSession,
  setSession,
  clearSession,
  getQueryHistory,
  addQueryHistory,
  getDemoScreenIndex,
  setDemoScreenIndex,
  getPersona,
  setPersona,
} from './storage';
import { LOCALSTORAGE_KEYS } from '../constants';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // getSession
  // -------------------------------------------------------------------------

  describe('getSession', () => {
    it('returns null when no session data is stored', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns session object when data is stored', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.DARK_MODE, JSON.stringify(true));
      localStorage.setItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN, JSON.stringify(5));
      localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, JSON.stringify('lukas-muller'));

      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.darkMode).toBe(true);
      expect(session.currentScreen).toBe(5);
      expect(session.selectedPersona).toBe('lukas-muller');
    });

    it('returns session with null fields for missing keys', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.DARK_MODE, JSON.stringify(false));

      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.darkMode).toBe(false);
      expect(session.currentScreen).toBeNull();
      expect(session.selectedPersona).toBeNull();
      expect(session.preferences).toBeNull();
      expect(session.timelineState).toBeNull();
    });

    it('returns session with preferences when stored', () => {
      const prefs = { theme: 'dark', fontSize: 14 };
      localStorage.setItem(LOCALSTORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));

      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.preferences).toEqual(prefs);
    });

    it('returns session with timelineState when stored', () => {
      const timeline = { position: 3, expanded: true };
      localStorage.setItem(LOCALSTORAGE_KEYS.TIMELINE_STATE, JSON.stringify(timeline));

      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.timelineState).toEqual(timeline);
    });

    it('handles corrupted JSON gracefully', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.DARK_MODE, 'not-valid-json{{{');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const session = getSession();

      // Should still return a session (with null for the corrupted key)
      // or null if all keys fail
      // The getItem helper returns null on parse error
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------------------------
  // setSession
  // -------------------------------------------------------------------------

  describe('setSession', () => {
    it('persists darkMode to localStorage', () => {
      const result = setSession({ darkMode: true });
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.DARK_MODE));
      expect(stored).toBe(true);
    });

    it('persists currentScreen to localStorage', () => {
      const result = setSession({ currentScreen: 7 });
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN));
      expect(stored).toBe(7);
    });

    it('persists selectedPersona to localStorage', () => {
      const result = setSession({ selectedPersona: 'elena-rossi' });
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA));
      expect(stored).toBe('elena-rossi');
    });

    it('persists preferences to localStorage', () => {
      const prefs = { theme: 'light' };
      const result = setSession({ preferences: prefs });
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.USER_PREFERENCES));
      expect(stored).toEqual(prefs);
    });

    it('persists timelineState to localStorage', () => {
      const timeline = { position: 10 };
      const result = setSession({ timelineState: timeline });
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.TIMELINE_STATE));
      expect(stored).toEqual(timeline);
    });

    it('persists multiple fields at once', () => {
      const result = setSession({
        darkMode: false,
        currentScreen: 3,
        selectedPersona: 'sophie-dubois',
      });
      expect(result).toBe(true);

      expect(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.DARK_MODE))).toBe(false);
      expect(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN))).toBe(3);
      expect(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA))).toBe('sophie-dubois');
    });

    it('does not overwrite keys not included in the session object', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.DARK_MODE, JSON.stringify(true));

      setSession({ currentScreen: 5 });

      // darkMode should remain unchanged
      expect(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.DARK_MODE))).toBe(true);
      expect(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN))).toBe(5);
    });

    it('returns false for invalid argument (null)', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = setSession(null);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false for invalid argument (string)', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = setSession('invalid');
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('can persist null selectedPersona', () => {
      setSession({ selectedPersona: 'lukas-muller' });
      expect(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA))).toBe('lukas-muller');

      setSession({ selectedPersona: null });
      expect(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA))).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // clearSession
  // -------------------------------------------------------------------------

  describe('clearSession', () => {
    it('removes all session keys from localStorage', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.DARK_MODE, JSON.stringify(true));
      localStorage.setItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN, JSON.stringify(5));
      localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, JSON.stringify('lukas-muller'));
      localStorage.setItem(LOCALSTORAGE_KEYS.USER_PREFERENCES, JSON.stringify({ theme: 'dark' }));
      localStorage.setItem(LOCALSTORAGE_KEYS.TIMELINE_STATE, JSON.stringify({ position: 3 }));

      const result = clearSession();
      expect(result).toBe(true);

      expect(localStorage.getItem(LOCALSTORAGE_KEYS.DARK_MODE)).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN)).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA)).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEYS.USER_PREFERENCES)).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEYS.TIMELINE_STATE)).toBeNull();
    });

    it('returns true even when no session data exists', () => {
      const result = clearSession();
      expect(result).toBe(true);
    });

    it('does not remove non-session keys', () => {
      localStorage.setItem('some-other-key', 'some-value');
      localStorage.setItem(LOCALSTORAGE_KEYS.DARK_MODE, JSON.stringify(true));

      clearSession();

      expect(localStorage.getItem('some-other-key')).toBe('some-value');
    });
  });

  // -------------------------------------------------------------------------
  // getQueryHistory
  // -------------------------------------------------------------------------

  describe('getQueryHistory', () => {
    it('returns an empty array when no history exists', () => {
      const history = getQueryHistory();
      expect(history).toEqual([]);
    });

    it('returns stored query history array', () => {
      const entries = [
        { query: 'What is the budget?', personaId: 'lukas-muller', timestamp: '2026-04-30T09:00:00Z' },
        { query: 'Show risks', personaId: 'lukas-muller', timestamp: '2026-04-30T09:05:00Z' },
      ];
      localStorage.setItem('ask-dreeso-query-history', JSON.stringify(entries));

      const history = getQueryHistory();
      expect(history).toEqual(entries);
      expect(history).toHaveLength(2);
    });

    it('returns an empty array when stored value is not an array', () => {
      localStorage.setItem('ask-dreeso-query-history', JSON.stringify('not-an-array'));

      const history = getQueryHistory();
      expect(history).toEqual([]);
    });

    it('returns an empty array when stored value is corrupted JSON', () => {
      localStorage.setItem('ask-dreeso-query-history', '{invalid-json');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const history = getQueryHistory();
      expect(history).toEqual([]);
      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------------------------
  // addQueryHistory
  // -------------------------------------------------------------------------

  describe('addQueryHistory', () => {
    it('adds a query entry to empty history', () => {
      const entry = { query: 'What is the budget?', personaId: 'lukas-muller' };
      const result = addQueryHistory(entry);
      expect(result).toBe(true);

      const history = getQueryHistory();
      expect(history).toHaveLength(1);
      expect(history[0].query).toBe('What is the budget?');
      expect(history[0].personaId).toBe('lukas-muller');
      expect(history[0].timestamp).toBeDefined();
    });

    it('prepends new entries (most recent first)', () => {
      addQueryHistory({ query: 'First query', personaId: 'lukas-muller', timestamp: '2026-04-30T09:00:00Z' });
      addQueryHistory({ query: 'Second query', personaId: 'elena-rossi', timestamp: '2026-04-30T09:05:00Z' });

      const history = getQueryHistory();
      expect(history).toHaveLength(2);
      expect(history[0].query).toBe('Second query');
      expect(history[1].query).toBe('First query');
    });

    it('uses provided timestamp when given', () => {
      const timestamp = '2026-04-30T10:00:00Z';
      addQueryHistory({ query: 'Test', personaId: 'lukas-muller', timestamp });

      const history = getQueryHistory();
      expect(history[0].timestamp).toBe(timestamp);
    });

    it('generates a timestamp when not provided', () => {
      addQueryHistory({ query: 'Test', personaId: 'lukas-muller' });

      const history = getQueryHistory();
      expect(history[0].timestamp).toBeDefined();
      // Should be a valid ISO string
      expect(new Date(history[0].timestamp).toISOString()).toBe(history[0].timestamp);
    });

    it('caps history at 50 entries', () => {
      // Add 55 entries
      for (let i = 0; i < 55; i++) {
        addQueryHistory({
          query: `Query ${i}`,
          personaId: 'lukas-muller',
          timestamp: `2026-04-30T09:${String(i).padStart(2, '0')}:00Z`,
        });
      }

      const history = getQueryHistory();
      expect(history).toHaveLength(50);
      // Most recent should be first
      expect(history[0].query).toBe('Query 54');
    });

    it('returns false for null entry', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = addQueryHistory(null);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false for entry without query', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = addQueryHistory({ personaId: 'lukas-muller' });
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false for entry without personaId', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = addQueryHistory({ query: 'Test' });
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false for non-object entry', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = addQueryHistory('invalid');
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------------------------
  // getDemoScreenIndex
  // -------------------------------------------------------------------------

  describe('getDemoScreenIndex', () => {
    it('returns 1 when no screen index is stored', () => {
      const index = getDemoScreenIndex();
      expect(index).toBe(1);
    });

    it('returns the stored screen index', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN, JSON.stringify(10));

      const index = getDemoScreenIndex();
      expect(index).toBe(10);
    });

    it('returns 1 when stored value is not a number', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN, JSON.stringify('not-a-number'));

      const index = getDemoScreenIndex();
      expect(index).toBe(1);
    });

    it('returns 1 when stored value is less than 1', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN, JSON.stringify(0));

      const index = getDemoScreenIndex();
      expect(index).toBe(1);
    });

    it('returns 1 when stored value is negative', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN, JSON.stringify(-5));

      const index = getDemoScreenIndex();
      expect(index).toBe(1);
    });

    it('returns the stored value for valid screen index 20', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN, JSON.stringify(20));

      const index = getDemoScreenIndex();
      expect(index).toBe(20);
    });

    it('returns 1 when stored value is corrupted JSON', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN, 'corrupted{');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const index = getDemoScreenIndex();
      expect(index).toBe(1);
      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------------------------
  // setDemoScreenIndex
  // -------------------------------------------------------------------------

  describe('setDemoScreenIndex', () => {
    it('persists a valid screen index', () => {
      const result = setDemoScreenIndex(5);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN));
      expect(stored).toBe(5);
    });

    it('persists screen index 1', () => {
      const result = setDemoScreenIndex(1);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN));
      expect(stored).toBe(1);
    });

    it('persists screen index 20', () => {
      const result = setDemoScreenIndex(20);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN));
      expect(stored).toBe(20);
    });

    it('returns false for index less than 1', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = setDemoScreenIndex(0);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false for negative index', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = setDemoScreenIndex(-3);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false for non-number argument', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = setDemoScreenIndex('five');
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false for null argument', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = setDemoScreenIndex(null);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('overwrites previously stored screen index', () => {
      setDemoScreenIndex(3);
      expect(getDemoScreenIndex()).toBe(3);

      setDemoScreenIndex(15);
      expect(getDemoScreenIndex()).toBe(15);
    });
  });

  // -------------------------------------------------------------------------
  // getPersona
  // -------------------------------------------------------------------------

  describe('getPersona', () => {
    it('returns null when no persona is stored', () => {
      const persona = getPersona();
      expect(persona).toBeNull();
    });

    it('returns the stored persona ID', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, JSON.stringify('lukas-muller'));

      const persona = getPersona();
      expect(persona).toBe('lukas-muller');
    });

    it('returns null when stored value is an empty string', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, JSON.stringify(''));

      const persona = getPersona();
      expect(persona).toBeNull();
    });

    it('returns null when stored value is not a string', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, JSON.stringify(42));

      const persona = getPersona();
      expect(persona).toBeNull();
    });

    it('returns null when stored value is null', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, JSON.stringify(null));

      const persona = getPersona();
      expect(persona).toBeNull();
    });

    it('returns null when stored value is corrupted JSON', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, 'corrupted{{{');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const persona = getPersona();
      expect(persona).toBeNull();
      consoleSpy.mockRestore();
    });

    it('returns the correct persona ID for elena-rossi', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, JSON.stringify('elena-rossi'));

      const persona = getPersona();
      expect(persona).toBe('elena-rossi');
    });

    it('returns the correct persona ID for sophie-dubois', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, JSON.stringify('sophie-dubois'));

      const persona = getPersona();
      expect(persona).toBe('sophie-dubois');
    });

    it('returns the correct persona ID for james-carter', () => {
      localStorage.setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, JSON.stringify('james-carter'));

      const persona = getPersona();
      expect(persona).toBe('james-carter');
    });
  });

  // -------------------------------------------------------------------------
  // setPersona
  // -------------------------------------------------------------------------

  describe('setPersona', () => {
    it('persists a valid persona ID', () => {
      const result = setPersona('lukas-muller');
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA));
      expect(stored).toBe('lukas-muller');
    });

    it('persists elena-rossi persona ID', () => {
      const result = setPersona('elena-rossi');
      expect(result).toBe(true);

      expect(getPersona()).toBe('elena-rossi');
    });

    it('persists sophie-dubois persona ID', () => {
      const result = setPersona('sophie-dubois');
      expect(result).toBe(true);

      expect(getPersona()).toBe('sophie-dubois');
    });

    it('persists james-carter persona ID', () => {
      const result = setPersona('james-carter');
      expect(result).toBe(true);

      expect(getPersona()).toBe('james-carter');
    });

    it('returns false for empty string', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = setPersona('');
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false for non-string argument', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = setPersona(42);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false for null argument', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = setPersona(null);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns false for undefined argument', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = setPersona(undefined);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('overwrites previously stored persona ID', () => {
      setPersona('lukas-muller');
      expect(getPersona()).toBe('lukas-muller');

      setPersona('elena-rossi');
      expect(getPersona()).toBe('elena-rossi');
    });
  });

  // -------------------------------------------------------------------------
  // Integration: round-trip tests
  // -------------------------------------------------------------------------

  describe('round-trip integration', () => {
    it('setSession and getSession round-trip correctly', () => {
      setSession({
        darkMode: true,
        currentScreen: 12,
        selectedPersona: 'sophie-dubois',
        preferences: { fontSize: 16 },
        timelineState: { expanded: true },
      });

      const session = getSession();
      expect(session.darkMode).toBe(true);
      expect(session.currentScreen).toBe(12);
      expect(session.selectedPersona).toBe('sophie-dubois');
      expect(session.preferences).toEqual({ fontSize: 16 });
      expect(session.timelineState).toEqual({ expanded: true });
    });

    it('setDemoScreenIndex and getDemoScreenIndex round-trip correctly', () => {
      setDemoScreenIndex(17);
      expect(getDemoScreenIndex()).toBe(17);
    });

    it('setPersona and getPersona round-trip correctly', () => {
      setPersona('james-carter');
      expect(getPersona()).toBe('james-carter');
    });

    it('clearSession resets getSession to null', () => {
      setSession({
        darkMode: true,
        currentScreen: 5,
        selectedPersona: 'lukas-muller',
      });

      expect(getSession()).not.toBeNull();

      clearSession();

      expect(getSession()).toBeNull();
    });

    it('clearSession resets getDemoScreenIndex to default 1', () => {
      setDemoScreenIndex(10);
      expect(getDemoScreenIndex()).toBe(10);

      clearSession();

      expect(getDemoScreenIndex()).toBe(1);
    });

    it('clearSession resets getPersona to null', () => {
      setPersona('elena-rossi');
      expect(getPersona()).toBe('elena-rossi');

      clearSession();

      expect(getPersona()).toBeNull();
    });

    it('addQueryHistory and getQueryHistory round-trip correctly', () => {
      addQueryHistory({ query: 'Test query 1', personaId: 'lukas-muller', timestamp: '2026-04-30T09:00:00Z' });
      addQueryHistory({ query: 'Test query 2', personaId: 'elena-rossi', timestamp: '2026-04-30T09:05:00Z' });

      const history = getQueryHistory();
      expect(history).toHaveLength(2);
      expect(history[0].query).toBe('Test query 2');
      expect(history[0].personaId).toBe('elena-rossi');
      expect(history[1].query).toBe('Test query 1');
      expect(history[1].personaId).toBe('lukas-muller');
    });
  });

  // -------------------------------------------------------------------------
  // localStorage error handling
  // -------------------------------------------------------------------------

  describe('localStorage error handling', () => {
    it('handles localStorage.setItem throwing an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const result = setDemoScreenIndex(5);
      expect(result).toBe(false);

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('handles localStorage.getItem throwing an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const index = getDemoScreenIndex();
      expect(index).toBe(1);

      getItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('handles localStorage.removeItem throwing an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const result = clearSession();
      expect(result).toBe(false);

      removeItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('getPersona returns null when localStorage throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const persona = getPersona();
      expect(persona).toBeNull();

      getItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('setPersona returns false when localStorage throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const result = setPersona('lukas-muller');
      expect(result).toBe(false);

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('getQueryHistory returns empty array when localStorage throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const history = getQueryHistory();
      expect(history).toEqual([]);

      getItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('addQueryHistory returns false when localStorage setItem throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Allow getItem to work but setItem to fail
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const result = addQueryHistory({ query: 'Test', personaId: 'lukas-muller' });
      expect(result).toBe(false);

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });
});