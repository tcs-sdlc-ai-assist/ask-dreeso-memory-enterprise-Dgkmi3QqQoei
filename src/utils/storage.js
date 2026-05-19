/**
 * LocalStorage persistence utility module.
 * Provides safe JSON serialization/deserialization with error handling
 * for session state, query history, demo screen index, and persona selection.
 * @module utils/storage
 */

import { LOCALSTORAGE_KEYS } from '../constants';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Safely retrieves and parses a JSON value from localStorage.
 * @param {string} key - The localStorage key
 * @returns {*} The parsed value, or null if not found or on error
 */
const getItem = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return null;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[storage] Failed to read key "${key}" from localStorage:`, err);
    return null;
  }
};

/**
 * Safely serializes and stores a value in localStorage.
 * @param {string} key - The localStorage key
 * @param {*} value - The value to store (will be JSON-serialized)
 * @returns {boolean} True if the write succeeded, false otherwise
 */
const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storage] Failed to write key "${key}" to localStorage:`, err);
    return false;
  }
};

/**
 * Safely removes a key from localStorage.
 * @param {string} key - The localStorage key to remove
 * @returns {boolean} True if the removal succeeded, false otherwise
 */
const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`[storage] Failed to remove key "${key}" from localStorage:`, err);
    return false;
  }
};

// ---------------------------------------------------------------------------
// Session management
// ---------------------------------------------------------------------------

/**
 * Retrieves the current session object from localStorage.
 * The session object may contain user preferences, timeline state,
 * and other transient application state.
 * @returns {Object|null} The session object, or null if not found
 */
export const getSession = () => {
  const preferences = getItem(LOCALSTORAGE_KEYS.USER_PREFERENCES);
  const timelineState = getItem(LOCALSTORAGE_KEYS.TIMELINE_STATE);
  const darkMode = getItem(LOCALSTORAGE_KEYS.DARK_MODE);
  const currentScreen = getItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN);
  const selectedPersona = getItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA);

  if (
    preferences === null &&
    timelineState === null &&
    darkMode === null &&
    currentScreen === null &&
    selectedPersona === null
  ) {
    return null;
  }

  return {
    preferences,
    timelineState,
    darkMode,
    currentScreen,
    selectedPersona,
  };
};

/**
 * Persists a session object to localStorage.
 * Accepts a partial session — only provided keys will be updated.
 * @param {Object} session - The session data to persist
 * @param {Object} [session.preferences] - User preferences
 * @param {Object} [session.timelineState] - Timeline state
 * @param {boolean} [session.darkMode] - Dark mode flag
 * @param {number} [session.currentScreen] - Current screen index
 * @param {string} [session.selectedPersona] - Selected persona ID
 * @returns {boolean} True if all writes succeeded
 */
export const setSession = (session) => {
  if (!session || typeof session !== 'object') {
    console.error('[storage] setSession called with invalid argument');
    return false;
  }

  let success = true;

  if (session.preferences !== undefined) {
    success = setItem(LOCALSTORAGE_KEYS.USER_PREFERENCES, session.preferences) && success;
  }
  if (session.timelineState !== undefined) {
    success = setItem(LOCALSTORAGE_KEYS.TIMELINE_STATE, session.timelineState) && success;
  }
  if (session.darkMode !== undefined) {
    success = setItem(LOCALSTORAGE_KEYS.DARK_MODE, session.darkMode) && success;
  }
  if (session.currentScreen !== undefined) {
    success = setItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN, session.currentScreen) && success;
  }
  if (session.selectedPersona !== undefined) {
    success = setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, session.selectedPersona) && success;
  }

  return success;
};

/**
 * Clears all session-related keys from localStorage.
 * @returns {boolean} True if all removals succeeded
 */
export const clearSession = () => {
  let success = true;

  success = removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCES) && success;
  success = removeItem(LOCALSTORAGE_KEYS.TIMELINE_STATE) && success;
  success = removeItem(LOCALSTORAGE_KEYS.DARK_MODE) && success;
  success = removeItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN) && success;
  success = removeItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA) && success;

  return success;
};

// ---------------------------------------------------------------------------
// Query history
// ---------------------------------------------------------------------------

/** @type {string} */
const QUERY_HISTORY_KEY = 'ask-dreeso-query-history';

/**
 * Retrieves the query history array from localStorage.
 * @returns {Array<{query: string, personaId: string, timestamp: string}>} The query history array, or an empty array
 */
export const getQueryHistory = () => {
  const history = getItem(QUERY_HISTORY_KEY);
  if (Array.isArray(history)) {
    return history;
  }
  return [];
};

/**
 * Adds a query entry to the persisted query history.
 * The entry is prepended (most recent first). History is capped at 50 entries.
 * @param {Object} entry - The query history entry
 * @param {string} entry.query - The query text
 * @param {string} entry.personaId - The persona who made the query
 * @param {string} [entry.timestamp] - ISO 8601 timestamp (defaults to now)
 * @returns {boolean} True if the write succeeded
 */
export const addQueryHistory = (entry) => {
  if (!entry || typeof entry !== 'object' || !entry.query || !entry.personaId) {
    console.error('[storage] addQueryHistory called with invalid entry');
    return false;
  }

  const history = getQueryHistory();

  const newEntry = {
    query: entry.query,
    personaId: entry.personaId,
    timestamp: entry.timestamp || new Date().toISOString(),
  };

  history.unshift(newEntry);

  // Cap at 50 entries
  const capped = history.slice(0, 50);

  return setItem(QUERY_HISTORY_KEY, capped);
};

// ---------------------------------------------------------------------------
// Demo screen index
// ---------------------------------------------------------------------------

/**
 * Retrieves the current demo screen index from localStorage.
 * @returns {number} The screen index (1-based), or 1 if not found
 */
export const getDemoScreenIndex = () => {
  const index = getItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN);
  if (typeof index === 'number' && index >= 1) {
    return index;
  }
  return 1;
};

/**
 * Persists the current demo screen index to localStorage.
 * @param {number} index - The screen index (1-based)
 * @returns {boolean} True if the write succeeded
 */
export const setDemoScreenIndex = (index) => {
  if (typeof index !== 'number' || index < 1) {
    console.error('[storage] setDemoScreenIndex called with invalid index:', index);
    return false;
  }
  return setItem(LOCALSTORAGE_KEYS.CURRENT_SCREEN, index);
};

// ---------------------------------------------------------------------------
// Persona selection
// ---------------------------------------------------------------------------

/**
 * Retrieves the currently selected persona ID from localStorage.
 * @returns {string|null} The persona ID, or null if not set
 */
export const getPersona = () => {
  const personaId = getItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA);
  if (typeof personaId === 'string' && personaId.length > 0) {
    return personaId;
  }
  return null;
};

/**
 * Persists the selected persona ID to localStorage.
 * @param {string} personaId - The persona identifier to store
 * @returns {boolean} True if the write succeeded
 */
export const setPersona = (personaId) => {
  if (typeof personaId !== 'string' || personaId.length === 0) {
    console.error('[storage] setPersona called with invalid personaId:', personaId);
    return false;
  }
  return setItem(LOCALSTORAGE_KEYS.SELECTED_PERSONA, personaId);
};