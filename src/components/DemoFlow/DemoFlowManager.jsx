/**
 * Master demo flow orchestrator and screen router component.
 * Reads the current screen from DemoContext and renders the appropriate
 * page component (LoginScreen, PersonaHome, QueryScreen, ActionScreen,
 * DemoSummary) based on the screen definition. Manages persona handoffs
 * between screens, integrates keyboard navigation via useKeyboardNavigation,
 * and handles the complete 20-screen narrative sequence.
 * @module components/DemoFlow/DemoFlowManager
 */

import { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useDemoFlow } from '../../context/DemoContext';
import { usePersona } from '../../context/PersonaContext';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { KeyboardHint } from '../common/KeyboardHint';
import { LoginScreen } from '../../pages/LoginScreen';
import { PersonaHome } from '../../pages/PersonaHome';
import { QueryScreen } from '../../pages/QueryScreen';
import { ActionScreen } from '../../pages/ActionScreen';
import { DemoSummary } from '../../pages/DemoSummary';
import { TOTAL_SCREENS } from '../../data/screens';

/**
 * Resolves the appropriate page component based on the current screen definition
 * and application state.
 *
 * @param {import('../../data/screens').ScreenDefinition|undefined} currentScreen - The current screen definition
 * @param {string|null} personaId - The currently active persona ID
 * @param {number} currentScreenIndex - The current screen number (1-based)
 * @returns {'login' | 'home' | 'query' | 'response' | 'action' | 'summary'} The resolved screen key
 */
const resolveScreenKey = (currentScreen, personaId, currentScreenIndex) => {
  // If no persona is selected, show login
  if (!personaId) {
    return 'login';
  }

  // If we've gone past the last screen, show summary
  if (currentScreenIndex > TOTAL_SCREENS) {
    return 'summary';
  }

  // If no screen definition found, fallback to login
  if (!currentScreen) {
    return 'login';
  }

  // Map screen types to page keys
  switch (currentScreen.screenType) {
    case 'home':
      return 'home';
    case 'query':
      return 'query';
    case 'response':
      return 'response';
    case 'action':
      return 'action';
    case 'confirmation':
      return 'action';
    default:
      return 'query';
  }
};

/**
 * DemoFlowManager is the master orchestrator for the 20-screen demo flow.
 * It reads the current screen from DemoContext, ensures the correct persona
 * is active, and renders the appropriate page component. It also integrates
 * keyboard navigation and manages persona handoffs between screen groups.
 *
 * @param {Object} props
 * @param {boolean} [props.showKeyboardHint=true] - Whether to show the keyboard shortcut hint overlay
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} The current screen component for the demo flow
 */
export function DemoFlowManager({ showKeyboardHint = true, className }) {
  const {
    currentScreen,
    currentScreenIndex,
    isLastScreen,
  } = useDemoFlow();

  const {
    persona,
    personaId,
    setPersona,
  } = usePersona();

  // Register keyboard navigation shortcuts
  useKeyboardNavigation();

  /**
   * Synchronise the persona context with the current screen's persona.
   * When the demo flow advances to a screen belonging to a different persona,
   * automatically switch the active persona to match.
   */
  useEffect(() => {
    if (!currentScreen) {
      return;
    }

    const screenPersonaId = currentScreen.personaId;

    // If the screen's persona differs from the active persona, switch
    if (screenPersonaId && screenPersonaId !== personaId) {
      setPersona(screenPersonaId);
    }
  }, [currentScreen, personaId, setPersona]);

  /**
   * The resolved screen key determining which page component to render.
   * @type {'login' | 'home' | 'query' | 'response' | 'action' | 'summary'}
   */
  const screenKey = useMemo(
    () => resolveScreenKey(currentScreen, personaId, currentScreenIndex),
    [currentScreen, personaId, currentScreenIndex],
  );

  /**
   * Renders the appropriate page component based on the resolved screen key.
   * @returns {JSX.Element} The page component for the current screen
   */
  const renderScreen = useCallback(() => {
    switch (screenKey) {
      case 'login':
        return <LoginScreen />;

      case 'home':
        return <PersonaHome />;

      case 'query':
      case 'response':
        return <QueryScreen />;

      case 'action':
        return <ActionScreen />;

      case 'summary':
        return <DemoSummary />;

      default:
        return <LoginScreen />;
    }
  }, [screenKey]);

  return (
    <div className={className || ''}>
      {/* Current screen */}
      {renderScreen()}

      {/* Keyboard shortcut hint overlay */}
      {showKeyboardHint && personaId && (
        <KeyboardHint defaultVisible={false} />
      )}
    </div>
  );
}

DemoFlowManager.propTypes = {
  showKeyboardHint: PropTypes.bool,
  className: PropTypes.string,
};

export default DemoFlowManager;