/**
 * React Context provider for session and query history management.
 * Exports SessionProvider (wraps app, hydrates from localStorage),
 * useSession hook (returns session state, queryHistory, addQuery, clearSession).
 * Syncs to localStorage on every state change via useEffect.
 * @module context/SessionContext
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import {
  clearSession as clearPersistedSession,
  getQueryHistory,
  addQueryHistory,
  getSession,
  setSession as persistSession,
  getDemoScreenIndex,
  setDemoScreenIndex,
} from '../utils/storage';

/**
 * @typedef {Object} SessionState
 * @property {boolean} darkMode - Whether dark mode is enabled
 * @property {number} currentScreen - Current demo screen index (1-based)
 * @property {string|null} selectedPersona - Currently selected persona ID
 * @property {Object|null} preferences - User preferences object
 * @property {Object|null} timelineState - Timeline state object
 */

/**
 * @typedef {Object} QueryHistoryEntry
 * @property {string} query - The query text
 * @property {string} personaId - The persona who made the query
 * @property {string} timestamp - ISO 8601 timestamp
 */

/**
 * @typedef {Object} SessionContextValue
 * @property {SessionState} session - The current session state
 * @property {QueryHistoryEntry[]} queryHistory - Array of query history entries
 * @property {(entry: {query: string, personaId: string, timestamp?: string}) => void} addQuery - Adds a query to history
 * @property {() => void} clearSession - Clears session and query history
 * @property {(screen: number) => void} setCurrentScreen - Sets the current demo screen
 * @property {(darkMode: boolean) => void} setDarkMode - Sets dark mode preference
 * @property {(updates: Partial<SessionState>) => void} updateSession - Partially updates session state
 */

/** @type {React.Context<SessionContextValue|undefined>} */
const SessionContext = createContext(undefined);

/**
 * Default session state used when no persisted session is found.
 * @type {SessionState}
 */
const DEFAULT_SESSION = {
  darkMode: false,
  currentScreen: 1,
  selectedPersona: null,
  preferences: null,
  timelineState: null,
};

/**
 * Hydrates session state from localStorage, falling back to defaults.
 * @returns {SessionState} The hydrated session state
 */
const hydrateSession = () => {
  const stored = getSession();
  if (!stored) {
    return { ...DEFAULT_SESSION };
  }

  return {
    darkMode: typeof stored.darkMode === 'boolean' ? stored.darkMode : DEFAULT_SESSION.darkMode,
    currentScreen: typeof stored.currentScreen === 'number' && stored.currentScreen >= 1
      ? stored.currentScreen
      : getDemoScreenIndex(),
    selectedPersona: typeof stored.selectedPersona === 'string' && stored.selectedPersona.length > 0
      ? stored.selectedPersona
      : DEFAULT_SESSION.selectedPersona,
    preferences: stored.preferences || DEFAULT_SESSION.preferences,
    timelineState: stored.timelineState || DEFAULT_SESSION.timelineState,
  };
};

/**
 * SessionProvider wraps the application and provides session and query history management.
 * Hydrates state from localStorage on mount and syncs changes back on every update.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The context provider wrapper
 */
export function SessionProvider({ children }) {
  const [session, setSession] = useState(hydrateSession);
  const [queryHistory, setQueryHistory] = useState(() => getQueryHistory());

  // Sync session state to localStorage whenever it changes
  useEffect(() => {
    persistSession({
      darkMode: session.darkMode,
      currentScreen: session.currentScreen,
      selectedPersona: session.selectedPersona,
      preferences: session.preferences,
      timelineState: session.timelineState,
    });
  }, [session]);

  // Sync dark mode class on document element
  useEffect(() => {
    if (session.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [session.darkMode]);

  /**
   * Adds a query entry to the history and persists it.
   * @param {Object} entry - The query history entry
   * @param {string} entry.query - The query text
   * @param {string} entry.personaId - The persona who made the query
   * @param {string} [entry.timestamp] - ISO 8601 timestamp (defaults to now)
   */
  const addQuery = useCallback((entry) => {
    if (!entry || typeof entry !== 'object' || !entry.query || !entry.personaId) {
      console.error('[SessionContext] addQuery called with invalid entry:', entry);
      return;
    }

    const newEntry = {
      query: entry.query,
      personaId: entry.personaId,
      timestamp: entry.timestamp || new Date().toISOString(),
    };

    addQueryHistory(newEntry);

    setQueryHistory((prev) => {
      const updated = [newEntry, ...prev];
      return updated.slice(0, 50);
    });
  }, []);

  /**
   * Clears the session state and query history, resetting to defaults.
   */
  const clearSession = useCallback(() => {
    clearPersistedSession();
    setSession({ ...DEFAULT_SESSION });
    setQueryHistory([]);
  }, []);

  /**
   * Sets the current demo screen index.
   * @param {number} screen - The screen index (1-based)
   */
  const setCurrentScreen = useCallback((screen) => {
    if (typeof screen !== 'number' || screen < 1) {
      console.error('[SessionContext] setCurrentScreen called with invalid screen:', screen);
      return;
    }

    setDemoScreenIndex(screen);
    setSession((prev) => ({
      ...prev,
      currentScreen: screen,
    }));
  }, []);

  /**
   * Sets the dark mode preference.
   * @param {boolean} darkMode - Whether dark mode should be enabled
   */
  const setDarkMode = useCallback((darkMode) => {
    if (typeof darkMode !== 'boolean') {
      console.error('[SessionContext] setDarkMode called with invalid value:', darkMode);
      return;
    }

    setSession((prev) => ({
      ...prev,
      darkMode,
    }));
  }, []);

  /**
   * Partially updates the session state.
   * @param {Partial<SessionState>} updates - The session fields to update
   */
  const updateSession = useCallback((updates) => {
    if (!updates || typeof updates !== 'object') {
      console.error('[SessionContext] updateSession called with invalid updates:', updates);
      return;
    }

    setSession((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.key === 'ask-dreeso-current-screen' ||
        event.key === 'ask-dreeso-dark-mode' ||
        event.key === 'ask-dreeso-selected-persona' ||
        event.key === 'ask-dreeso-user-preferences' ||
        event.key === 'ask-dreeso-timeline-state'
      ) {
        const hydrated = hydrateSession();
        setSession(hydrated);
      }

      if (event.key === 'ask-dreeso-query-history') {
        setQueryHistory(getQueryHistory());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      queryHistory,
      addQuery,
      clearSession,
      setCurrentScreen,
      setDarkMode,
      updateSession,
    }),
    [session, queryHistory, addQuery, clearSession, setCurrentScreen, setDarkMode, updateSession],
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the session context.
 * Must be used within a SessionProvider.
 * @returns {SessionContextValue} The session context value
 */
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export default SessionContext;