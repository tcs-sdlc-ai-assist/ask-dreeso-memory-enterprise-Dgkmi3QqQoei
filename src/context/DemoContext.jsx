/**
 * React Context provider for demo flow navigation state.
 * Exports DemoProvider (wraps app, initializes screen index from localStorage),
 * useDemoFlow hook (returns currentScreenIndex, currentScreen, advanceScreen,
 * previousScreen, goToScreen, restartDemo).
 * Manages the 20-screen sequence and syncs index to localStorage.
 * @module context/DemoContext
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { getDemoScreenIndex, setDemoScreenIndex } from '../utils/storage';
import { SCREENS, TOTAL_SCREENS, getScreenByNumber } from '../data/screens';

/**
 * @typedef {Object} DemoContextValue
 * @property {number} currentScreenIndex - The current screen number (1-based)
 * @property {import('../data/screens').ScreenDefinition|undefined} currentScreen - The current screen definition
 * @property {() => void} advanceScreen - Advances to the next screen
 * @property {() => void} previousScreen - Goes back to the previous screen
 * @property {(screen: number) => void} goToScreen - Navigates to a specific screen number
 * @property {() => void} restartDemo - Resets the demo to screen 1
 * @property {number} totalScreens - Total number of screens in the demo
 * @property {boolean} isFirstScreen - Whether the current screen is the first
 * @property {boolean} isLastScreen - Whether the current screen is the last
 * @property {import('../data/screens').ScreenDefinition[]} screens - Complete list of screen definitions
 */

/** @type {React.Context<DemoContextValue|undefined>} */
const DemoContext = createContext(undefined);

/**
 * DemoProvider wraps the application and provides demo flow navigation state.
 * Initializes the screen index from localStorage on mount.
 * Syncs the screen index to localStorage on every change.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The context provider wrapper
 */
export function DemoProvider({ children }) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(() => {
    const stored = getDemoScreenIndex();
    if (stored >= 1 && stored <= TOTAL_SCREENS) {
      return stored;
    }
    return 1;
  });

  const currentScreen = useMemo(
    () => getScreenByNumber(currentScreenIndex),
    [currentScreenIndex],
  );

  // Sync screen index to localStorage whenever it changes
  useEffect(() => {
    setDemoScreenIndex(currentScreenIndex);
  }, [currentScreenIndex]);

  /**
   * Advances to the next screen in the demo flow.
   * Does nothing if already on the last screen.
   */
  const advanceScreen = useCallback(() => {
    setCurrentScreenIndex((prev) => {
      if (prev >= TOTAL_SCREENS) {
        return prev;
      }
      return prev + 1;
    });
  }, []);

  /**
   * Goes back to the previous screen in the demo flow.
   * Does nothing if already on the first screen.
   */
  const previousScreen = useCallback(() => {
    setCurrentScreenIndex((prev) => {
      if (prev <= 1) {
        return prev;
      }
      return prev - 1;
    });
  }, []);

  /**
   * Navigates to a specific screen number.
   * @param {number} screen - The screen number (1-based, 1 to TOTAL_SCREENS)
   */
  const goToScreen = useCallback((screen) => {
    if (typeof screen !== 'number' || screen < 1 || screen > TOTAL_SCREENS) {
      console.error('[DemoContext] goToScreen called with invalid screen:', screen);
      return;
    }
    setCurrentScreenIndex(screen);
  }, []);

  /**
   * Resets the demo to the first screen.
   */
  const restartDemo = useCallback(() => {
    setCurrentScreenIndex(1);
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'ask-dreeso-current-screen') {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null;
        if (typeof newValue === 'number' && newValue >= 1 && newValue <= TOTAL_SCREENS) {
          setCurrentScreenIndex(newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isFirstScreen = currentScreenIndex === 1;
  const isLastScreen = currentScreenIndex === TOTAL_SCREENS;

  const value = useMemo(
    () => ({
      currentScreenIndex,
      currentScreen,
      advanceScreen,
      previousScreen,
      goToScreen,
      restartDemo,
      totalScreens: TOTAL_SCREENS,
      isFirstScreen,
      isLastScreen,
      screens: SCREENS,
    }),
    [
      currentScreenIndex,
      currentScreen,
      advanceScreen,
      previousScreen,
      goToScreen,
      restartDemo,
      isFirstScreen,
      isLastScreen,
    ],
  );

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}

DemoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the demo flow context.
 * Must be used within a DemoProvider.
 * @returns {DemoContextValue} The demo flow context value
 */
export function useDemoFlow() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoFlow must be used within a DemoProvider');
  }
  return context;
}

export default DemoContext;