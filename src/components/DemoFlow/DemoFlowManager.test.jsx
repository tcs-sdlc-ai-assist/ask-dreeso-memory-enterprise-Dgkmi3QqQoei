import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { DemoFlowManager } from './DemoFlowManager';
import { SessionProvider } from '../../context/SessionContext';
import { PersonaProvider } from '../../context/PersonaContext';
import { DemoProvider } from '../../context/DemoContext';
import { PERSONAS } from '../../data/personas';
import { TOTAL_SCREENS } from '../../data/screens';

/**
 * Helper to render DemoFlowManager wrapped in all required context providers.
 * @param {Object} [props] - Props to pass to DemoFlowManager
 * @returns {Object} The render result
 */
const renderDemoFlowManager = (props = {}) => {
  return render(
    <BrowserRouter>
      <SessionProvider>
        <PersonaProvider>
          <DemoProvider>
            <DemoFlowManager {...props} />
          </DemoProvider>
        </PersonaProvider>
      </SessionProvider>
    </BrowserRouter>,
  );
};

/**
 * Helper to render DemoFlowManager with a pre-selected persona and screen.
 * @param {string} personaId - The persona ID to pre-select
 * @param {number} screenIndex - The screen index to set
 * @param {Object} [props] - Props to pass to DemoFlowManager
 * @returns {Object} The render result
 */
const renderWithPersonaAndScreen = (personaId, screenIndex, props = {}) => {
  localStorage.setItem('ask-dreeso-selected-persona', JSON.stringify(personaId));
  localStorage.setItem('ask-dreeso-current-screen', JSON.stringify(screenIndex));
  return render(
    <BrowserRouter>
      <SessionProvider>
        <PersonaProvider>
          <DemoProvider>
            <DemoFlowManager {...props} />
          </DemoProvider>
        </PersonaProvider>
      </SessionProvider>
    </BrowserRouter>,
  );
};

describe('DemoFlowManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Rendering correct screen based on demo index
  // -------------------------------------------------------------------------

  it('renders the login screen when no persona is selected', () => {
    renderDemoFlowManager();

    expect(screen.getByText('Ask Dreeso Memory')).toBeInTheDocument();
    expect(screen.getByText('Dreeso & Sommers Intelligence Platform')).toBeInTheDocument();
  });

  it('renders the persona home screen for Lukas Müller at screen 1', () => {
    renderWithPersonaAndScreen('lukas-muller', 1);

    // PersonaHome shows greeting and intelligence clusters
    expect(screen.getByText(/Lukas/)).toBeInTheDocument();
    expect(screen.getByText('Intelligence Clusters')).toBeInTheDocument();
  });

  it('renders the query screen for Lukas Müller at screen 2', async () => {
    renderWithPersonaAndScreen('lukas-muller', 2);

    // QueryScreen shows the query text for screen 2
    await waitFor(() => {
      expect(screen.getByText('Show me the critical path schedule')).toBeInTheDocument();
    });
  });

  it('renders the persona home screen for Elena Rossi at screen 6', () => {
    renderWithPersonaAndScreen('elena-rossi', 6);

    // Screen 6 is the first screen for Elena (home screen type)
    expect(screen.getByText(/Elena/)).toBeInTheDocument();
  });

  it('renders the persona home screen for Sophie Dubois at screen 11', () => {
    renderWithPersonaAndScreen('sophie-dubois', 11);

    expect(screen.getByText(/Sophie/)).toBeInTheDocument();
  });

  it('renders the persona home screen for James Carter at screen 16', () => {
    renderWithPersonaAndScreen('james-carter', 16);

    expect(screen.getByText(/James/)).toBeInTheDocument();
  });

  it('renders the action screen for Lukas Müller at screen 5', async () => {
    renderWithPersonaAndScreen('lukas-muller', 5);

    // Screen 5 is an action screen for Lukas
    await waitFor(() => {
      expect(screen.getByText('Action Confirmation')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Keyboard navigation — advance screen
  // -------------------------------------------------------------------------

  it('advances to the next screen on ArrowRight key press', async () => {
    renderWithPersonaAndScreen('lukas-muller', 1);
    const user = userEvent.setup();

    // Verify we start on the home screen
    expect(screen.getByText('Intelligence Clusters')).toBeInTheDocument();

    // Press ArrowRight to advance
    await user.keyboard('{ArrowRight}');

    // Screen 2 should now be active — it's a query screen
    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(2);
  });

  it('advances to the next screen on f key press', async () => {
    renderWithPersonaAndScreen('lukas-muller', 1);
    const user = userEvent.setup();

    await user.keyboard('f');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(2);
  });

  it('advances to the next screen on Space key press', async () => {
    renderWithPersonaAndScreen('lukas-muller', 1);
    const user = userEvent.setup();

    await user.keyboard(' ');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(2);
  });

  it('goes to the previous screen on ArrowLeft key press', async () => {
    renderWithPersonaAndScreen('lukas-muller', 3);
    const user = userEvent.setup();

    await user.keyboard('{ArrowLeft}');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(2);
  });

  it('does not go below screen 1 on ArrowLeft', async () => {
    renderWithPersonaAndScreen('lukas-muller', 1);
    const user = userEvent.setup();

    await user.keyboard('{ArrowLeft}');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(1);
  });

  it('does not go above the last screen on ArrowRight', async () => {
    renderWithPersonaAndScreen('james-carter', TOTAL_SCREENS);
    const user = userEvent.setup();

    await user.keyboard('{ArrowRight}');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(TOTAL_SCREENS);
  });

  // -------------------------------------------------------------------------
  // Persona switching
  // -------------------------------------------------------------------------

  it('switches to the next persona on N key press', async () => {
    renderWithPersonaAndScreen('lukas-muller', 1);
    const user = userEvent.setup();

    await user.keyboard('n');

    // Should switch to Elena Rossi (next persona)
    const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
    expect(storedPersona).toBe('elena-rossi');

    // Should navigate to Elena's first screen (screen 6)
    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(6);
  });

  it('wraps around to the first persona after the last', async () => {
    renderWithPersonaAndScreen('james-carter', 16);
    const user = userEvent.setup();

    await user.keyboard('n');

    const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
    expect(storedPersona).toBe('lukas-muller');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(1);
  });

  it('switches from Elena to Sophie on N key press', async () => {
    renderWithPersonaAndScreen('elena-rossi', 6);
    const user = userEvent.setup();

    await user.keyboard('N');

    const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
    expect(storedPersona).toBe('sophie-dubois');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(11);
  });

  // -------------------------------------------------------------------------
  // Restart demo
  // -------------------------------------------------------------------------

  it('restarts the demo on R key press', async () => {
    renderWithPersonaAndScreen('elena-rossi', 8);
    const user = userEvent.setup();

    await user.keyboard('r');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(1);
  });

  it('restarts the demo on uppercase R key press', async () => {
    renderWithPersonaAndScreen('sophie-dubois', 13);
    const user = userEvent.setup();

    await user.keyboard('R');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(1);
  });

  // -------------------------------------------------------------------------
  // Logout flow
  // -------------------------------------------------------------------------

  it('logs out and shows login screen on L key press', async () => {
    renderWithPersonaAndScreen('lukas-muller', 3);
    const user = userEvent.setup();

    await user.keyboard('l');

    // After logout, persona should be cleared
    await waitFor(() => {
      expect(screen.getByText('Ask Dreeso Memory')).toBeInTheDocument();
      expect(screen.getByText('Dreeso & Sommers Intelligence Platform')).toBeInTheDocument();
    });
  });

  it('logs out on uppercase L key press', async () => {
    renderWithPersonaAndScreen('james-carter', 18);
    const user = userEvent.setup();

    await user.keyboard('L');

    await waitFor(() => {
      expect(screen.getByText('Ask Dreeso Memory')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Keyboard shortcuts suppressed when input is focused
  // -------------------------------------------------------------------------

  it('does not advance screen when typing in an input field', async () => {
    renderWithPersonaAndScreen('lukas-muller', 1);
    const user = userEvent.setup();

    // The PersonaHome has a query bar with an input
    const input = screen.getByLabelText('Query input');
    await user.click(input);
    await user.keyboard('f');

    // Screen should NOT have advanced because input is focused
    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(1);
  });

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  it('applies additional className when provided', () => {
    const { container } = renderDemoFlowManager({ className: 'custom-test-class' });

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-test-class');
  });

  it('shows keyboard hint when showKeyboardHint is true and persona is selected', () => {
    renderWithPersonaAndScreen('lukas-muller', 1, { showKeyboardHint: true });

    // The keyboard hint toggle button should be present
    const hintButton = screen.getByLabelText('Show keyboard shortcuts');
    expect(hintButton).toBeInTheDocument();
  });

  it('does not show keyboard hint when no persona is selected', () => {
    renderDemoFlowManager({ showKeyboardHint: true });

    const hintButton = screen.queryByLabelText('Show keyboard shortcuts');
    expect(hintButton).not.toBeInTheDocument();
  });

  it('does not show keyboard hint when showKeyboardHint is false', () => {
    renderWithPersonaAndScreen('lukas-muller', 1, { showKeyboardHint: false });

    const hintButton = screen.queryByLabelText('Show keyboard shortcuts');
    expect(hintButton).not.toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Persona synchronisation with screen
  // -------------------------------------------------------------------------

  it('synchronises persona when navigating to a screen belonging to a different persona', async () => {
    // Start as Lukas on screen 5 (last Lukas screen)
    renderWithPersonaAndScreen('lukas-muller', 5);
    const user = userEvent.setup();

    // Advance past Lukas's last screen to Elena's first screen (screen 6)
    await user.keyboard('{ArrowRight}');

    await waitFor(() => {
      const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
      expect(storedScreen).toBe(6);
    });

    // Persona should have been switched to Elena
    await waitFor(() => {
      const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
      expect(storedPersona).toBe('elena-rossi');
    });
  });

  // -------------------------------------------------------------------------
  // Multiple rapid key presses
  // -------------------------------------------------------------------------

  it('handles multiple rapid ArrowRight presses', async () => {
    renderWithPersonaAndScreen('lukas-muller', 1);
    const user = userEvent.setup();

    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowRight}');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(4);
  });

  // -------------------------------------------------------------------------
  // Login screen persona selection navigates to correct screen
  // -------------------------------------------------------------------------

  it('renders login screen with all four persona quick-login buttons when no persona is set', () => {
    renderDemoFlowManager();

    PERSONAS.forEach((persona) => {
      const button = screen.getByLabelText(`Quick login as ${persona.name}`);
      expect(button).toBeInTheDocument();
    });
  });

  it('navigates to persona home after quick-login selection', async () => {
    renderDemoFlowManager();
    const user = userEvent.setup();

    const lukasButton = screen.getByLabelText('Quick login as Lukas Müller');
    await user.click(lukasButton);

    await waitFor(() => {
      const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
      expect(storedPersona).toBe('lukas-muller');
    });

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(1);
  });

  // -------------------------------------------------------------------------
  // Modifier keys should not trigger shortcuts
  // -------------------------------------------------------------------------

  it('does not trigger shortcuts when Ctrl key is held', async () => {
    renderWithPersonaAndScreen('lukas-muller', 1);
    const user = userEvent.setup();

    // Ctrl+F should not advance screen
    await user.keyboard('{Control>}f{/Control}');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(1);
  });

  it('does not trigger shortcuts when Meta key is held', async () => {
    renderWithPersonaAndScreen('lukas-muller', 1);
    const user = userEvent.setup();

    await user.keyboard('{Meta>}f{/Meta}');

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(1);
  });
});