/**
 * React Context provider for persona state management.
 * Exports PersonaProvider (wraps app, initializes from localStorage),
 * usePersona hook (returns current persona, setPersona, clearPersona).
 * On persona change, updates localStorage and resets relevant UI state.
 * @module context/PersonaContext
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { getPersona, setPersona as persistPersona, setSession } from '../utils/storage';
import { PERSONA_BY_ID } from '../data/personas';
import { PERSONAS } from '../data/personas';

/**
 * @typedef {Object} PersonaContextValue
 * @property {import('../data/personas').Persona|null} persona - The currently active persona object
 * @property {string|null} personaId - The currently active persona ID
 * @property {(id: string) => void} setPersona - Sets the active persona by ID
 * @property {() => void} clearPersona - Clears the active persona and related session state
 * @property {import('../data/personas').Persona[]} personas - Complete list of available personas
 */

/** @type {React.Context<PersonaContextValue|undefined>} */
const PersonaContext = createContext(undefined);

/**
 * PersonaProvider wraps the application and provides persona state management.
 * Initializes the active persona from localStorage on mount.
 * On persona change, persists to localStorage and resets relevant UI state.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The context provider wrapper
 */
export function PersonaProvider({ children }) {
  const [personaId, setPersonaId] = useState(() => {
    const stored = getPersona();
    if (stored && PERSONA_BY_ID[stored]) {
      return stored;
    }
    return null;
  });

  const persona = personaId ? PERSONA_BY_ID[personaId] || null : null;

  /**
   * Sets the active persona by ID.
   * Persists the selection to localStorage and resets relevant session state.
   * @param {string} id - The persona identifier to activate
   */
  const handleSetPersona = useCallback((id) => {
    if (!id || typeof id !== 'string') {
      console.error('[PersonaContext] setPersona called with invalid id:', id);
      return;
    }

    if (!PERSONA_BY_ID[id]) {
      console.error('[PersonaContext] setPersona called with unknown persona id:', id);
      return;
    }

    persistPersona(id);
    setSession({
      selectedPersona: id,
      currentScreen: 1,
    });
    setPersonaId(id);
  }, []);

  /**
   * Clears the active persona and resets related session state.
   */
  const handleClearPersona = useCallback(() => {
    setSession({
      selectedPersona: null,
      currentScreen: 1,
    });
    setPersonaId(null);
  }, []);

  // Sync persona state if localStorage changes externally (e.g. another tab)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'ask-dreeso-selected-persona') {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null;
        if (newValue && PERSONA_BY_ID[newValue]) {
          setPersonaId(newValue);
        } else {
          setPersonaId(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      persona,
      personaId,
      setPersona: handleSetPersona,
      clearPersona: handleClearPersona,
      personas: PERSONAS,
    }),
    [persona, personaId, handleSetPersona, handleClearPersona],
  );

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
}

PersonaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the persona context.
 * Must be used within a PersonaProvider.
 * @returns {PersonaContextValue} The persona context value
 */
export function usePersona() {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}

export default PersonaContext;