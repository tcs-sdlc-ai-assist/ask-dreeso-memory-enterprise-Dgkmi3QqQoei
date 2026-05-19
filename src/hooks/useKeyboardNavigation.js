/**
 * Custom React hook for demo keyboard shortcuts.
 * Listens for keydown events and maps them to demo navigation actions.
 * Includes guard to prevent firing when input/textarea/select is focused.
 *
 * Key mappings:
 * - F: advance to next screen
 * - Space: advance to next screen (render query response)
 * - N: switch to next persona
 * - R: restart demo
 * - L: logout (clear session and persona)
 * - ArrowRight: advance to next screen
 * - ArrowLeft: go to previous screen
 *
 * @module hooks/useKeyboardNavigation
 */

import { useCallback, useEffect } from 'react';

import { useDemoFlow } from '../context/DemoContext';
import { usePersona } from '../context/PersonaContext';
import { useSession } from '../context/SessionContext';
import { PERSONAS } from '../data/personas';

/**
 * Checks whether the currently focused element is an interactive input
 * that should suppress keyboard shortcut handling.
 * @returns {boolean} True if an input-like element is focused
 */
const isInputFocused = () => {
  const { activeElement } = document;
  if (!activeElement) {
    return false;
  }
  const tagName = activeElement.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    return true;
  }
  if (activeElement.getAttribute('contenteditable') === 'true') {
    return true;
  }
  return false;
};

/**
 * Custom React hook that registers global keydown listeners for demo navigation.
 * Must be used within DemoProvider, PersonaProvider, and SessionProvider.
 *
 * Key mappings:
 * - `f` / `ArrowRight`: Advance to next screen
 * - `Space`: Advance to next screen (render query response)
 * - `ArrowLeft`: Go to previous screen
 * - `n`: Switch to next persona
 * - `r`: Restart demo
 * - `l`: Logout (clear session and persona)
 *
 * All shortcuts are suppressed when an input, textarea, select, or
 * contenteditable element is focused.
 */
export function useKeyboardNavigation() {
  const { advanceScreen, previousScreen, restartDemo, goToScreen, currentScreenIndex } = useDemoFlow();
  const { personaId, setPersona, clearPersona, personas } = usePersona();
  const { clearSession } = useSession();

  /**
   * Switches to the next persona in the ordered persona list.
   * Wraps around to the first persona after the last.
   * Also navigates to the first screen of the new persona group.
   */
  const switchToNextPersona = useCallback(() => {
    const currentIndex = personas.findIndex((p) => p.id === personaId);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % personas.length : 0;
    const nextPersona = personas[nextIndex];

    if (nextPersona) {
      setPersona(nextPersona.id);
      // Navigate to the first screen of the next persona group
      // Each persona has 5 screens: persona 0 → screens 1-5, persona 1 → screens 6-10, etc.
      const firstScreen = nextIndex * 5 + 1;
      goToScreen(firstScreen);
    }
  }, [personaId, personas, setPersona, goToScreen]);

  /**
   * Handles logout by clearing persona and session state.
   */
  const handleLogout = useCallback(() => {
    clearPersona();
    clearSession();
  }, [clearPersona, clearSession]);

  /**
   * Keydown event handler that maps keys to demo navigation actions.
   * @param {KeyboardEvent} event - The keyboard event
   */
  const handleKeyDown = useCallback(
    (event) => {
      // Guard: do not fire shortcuts when input is focused
      if (isInputFocused()) {
        return;
      }

      // Ignore events with modifier keys (except for specific combos)
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const key = event.key;

      switch (key) {
        case 'f':
        case 'F':
          event.preventDefault();
          advanceScreen();
          break;

        case ' ':
          event.preventDefault();
          advanceScreen();
          break;

        case 'ArrowRight':
          event.preventDefault();
          advanceScreen();
          break;

        case 'ArrowLeft':
          event.preventDefault();
          previousScreen();
          break;

        case 'n':
        case 'N':
          event.preventDefault();
          switchToNextPersona();
          break;

        case 'r':
        case 'R':
          event.preventDefault();
          restartDemo();
          break;

        case 'l':
        case 'L':
          event.preventDefault();
          handleLogout();
          break;

        default:
          break;
      }
    },
    [advanceScreen, previousScreen, switchToNextPersona, restartDemo, handleLogout],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

export default useKeyboardNavigation;