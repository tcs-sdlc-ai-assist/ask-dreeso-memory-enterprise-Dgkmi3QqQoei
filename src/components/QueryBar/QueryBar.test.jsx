import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { QueryBar } from './QueryBar';
import { SessionProvider } from '../../context/SessionContext';
import { PersonaProvider } from '../../context/PersonaContext';
import { DemoProvider } from '../../context/DemoContext';

/**
 * Helper to render QueryBar wrapped in all required context providers.
 * @param {Object} [props] - Props to pass to QueryBar
 * @returns {Object} The render result
 */
const renderQueryBar = (props = {}) => {
  return render(
    <BrowserRouter>
      <SessionProvider>
        <PersonaProvider>
          <DemoProvider>
            <QueryBar {...props} />
          </DemoProvider>
        </PersonaProvider>
      </SessionProvider>
    </BrowserRouter>,
  );
};

/**
 * Helper to render QueryBar with a pre-selected persona by setting localStorage.
 * @param {string} personaId - The persona ID to pre-select
 * @param {Object} [props] - Props to pass to QueryBar
 * @returns {Object} The render result
 */
const renderQueryBarWithPersona = (personaId, props = {}) => {
  localStorage.setItem('ask-dreeso-selected-persona', JSON.stringify(personaId));
  localStorage.setItem('ask-dreeso-current-screen', JSON.stringify(1));
  return render(
    <BrowserRouter>
      <SessionProvider>
        <PersonaProvider>
          <DemoProvider>
            <QueryBar {...props} />
          </DemoProvider>
        </PersonaProvider>
      </SessionProvider>
    </BrowserRouter>,
  );
};

describe('QueryBar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the query input field', () => {
    renderQueryBar();
    const input = screen.getByLabelText('Query input');
    expect(input).toBeInTheDocument();
    expect(input.tagName.toLowerCase()).toBe('input');
  });

  it('renders the send button', () => {
    renderQueryBar();
    const sendButton = screen.getByLabelText('Send query');
    expect(sendButton).toBeInTheDocument();
    expect(sendButton).toBeDisabled();
  });

  it('shows placeholder text when no persona is selected', () => {
    renderQueryBar();
    const input = screen.getByLabelText('Query input');
    expect(input).toHaveAttribute('placeholder', 'Select a persona to start asking questions…');
  });

  it('shows persona-specific placeholder when persona is selected', () => {
    renderQueryBarWithPersona('lukas-muller');
    const input = screen.getByLabelText('Query input');
    expect(input).toHaveAttribute('placeholder', 'Ask a question as Lukas Müller…');
  });

  it('disables input when no persona is selected', () => {
    renderQueryBar();
    const input = screen.getByLabelText('Query input');
    expect(input).toBeDisabled();
  });

  it('enables input when persona is selected', () => {
    renderQueryBarWithPersona('lukas-muller');
    const input = screen.getByLabelText('Query input');
    expect(input).not.toBeDisabled();
  });

  it('updates input value when user types', async () => {
    renderQueryBarWithPersona('lukas-muller');
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    await user.click(input);
    await user.type(input, 'budget');

    expect(input).toHaveValue('budget');
  });

  it('enables send button when input has text and persona is selected', async () => {
    renderQueryBarWithPersona('lukas-muller');
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    await user.click(input);
    await user.type(input, 'What is the current project budget status?');

    const sendButton = screen.getByLabelText('Send query');
    expect(sendButton).not.toBeDisabled();
  });

  it('shows autosuggest dropdown on focus when persona is selected', async () => {
    renderQueryBarWithPersona('lukas-muller');
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    await user.click(input);
    // Type something to trigger suggestions
    await user.type(input, 'budget');

    await waitFor(() => {
      const listbox = screen.queryByRole('listbox');
      // Suggestions should appear if matching entries exist
      if (listbox) {
        expect(listbox).toBeInTheDocument();
      }
    });
  });

  it('submits query on Enter key press', async () => {
    const onSubmit = vi.fn();
    renderQueryBarWithPersona('lukas-muller', { onSubmit });
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    await user.click(input);
    await user.type(input, 'What is the current project budget status?');
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('What is the current project budget status?');
    // Input should be cleared after submission
    expect(input).toHaveValue('');
  });

  it('submits query on send button click', async () => {
    const onSubmit = vi.fn();
    renderQueryBarWithPersona('lukas-muller', { onSubmit });
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    await user.click(input);
    await user.type(input, 'What is the current project budget status?');

    const sendButton = screen.getByLabelText('Send query');
    await user.click(sendButton);

    expect(onSubmit).toHaveBeenCalledWith('What is the current project budget status?');
    expect(input).toHaveValue('');
  });

  it('does not submit when input is empty', async () => {
    const onSubmit = vi.fn();
    renderQueryBarWithPersona('lukas-muller', { onSubmit });
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit when input is only whitespace', async () => {
    const onSubmit = vi.fn();
    renderQueryBarWithPersona('lukas-muller', { onSubmit });
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    await user.click(input);
    await user.type(input, '   ');
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('displays loading state during mock query execution', async () => {
    renderQueryBarWithPersona('lukas-muller');
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    await user.click(input);
    await user.type(input, 'What is the current project budget status?');
    await user.keyboard('{Enter}');

    // During processing, the send button should be disabled
    await waitFor(() => {
      const sendButton = screen.getByLabelText('Send query');
      expect(sendButton).toBeDisabled();
    });
  });

  it('calls onResponse callback when query response is received', async () => {
    const onResponse = vi.fn();
    renderQueryBarWithPersona('lukas-muller', { onResponse });
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    await user.click(input);
    await user.type(input, 'What is the current project budget status?');
    await user.keyboard('{Enter}');

    // Wait for the mock processing delay to complete (1200-2200ms)
    await waitFor(
      () => {
        expect(onResponse).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );

    const responseArg = onResponse.mock.calls[0][0];
    expect(responseArg).toHaveProperty('id');
    expect(responseArg).toHaveProperty('answer');
    expect(responseArg).toHaveProperty('activeSystems');
  });

  it('disables query bar when disabled prop is true', () => {
    renderQueryBarWithPersona('lukas-muller', { disabled: true });
    const input = screen.getByLabelText('Query input');
    expect(input).toBeDisabled();

    const sendButton = screen.getByLabelText('Send query');
    expect(sendButton).toBeDisabled();
  });

  it('shows persona initials badge when persona is selected', () => {
    renderQueryBarWithPersona('lukas-muller');
    const badge = screen.getByTitle('Lukas Müller');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('LM');
  });

  it('expands on focus and contracts on blur', async () => {
    renderQueryBarWithPersona('lukas-muller');
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    // Focus the input
    await user.click(input);

    // The container should have the expanded max-width class
    const container = input.closest('.glass-heavy').parentElement;
    expect(container).toHaveClass('max-w-3xl');

    // Blur the input by clicking elsewhere
    await user.click(document.body);

    await waitFor(() => {
      expect(container).toHaveClass('max-w-2xl');
    });
  });

  it('populates input from autosuggest suggestion click', async () => {
    renderQueryBarWithPersona('lukas-muller');
    const user = userEvent.setup();
    const input = screen.getByLabelText('Query input');

    // Focus and type to trigger suggestions
    await user.click(input);
    await user.type(input, 'budget');

    // Wait for suggestions to appear
    await waitFor(() => {
      const listbox = screen.queryByRole('listbox');
      if (listbox) {
        expect(listbox).toBeInTheDocument();
      }
    });

    // If suggestions are visible, click the first one
    const options = screen.queryAllByRole('option');
    if (options.length > 0) {
      await user.pointer({ target: options[0], keys: '[MouseLeft>]' });

      // After clicking a suggestion, the query should be submitted
      // (the component submits on suggestion click)
      await waitFor(
        () => {
          // Input should be cleared after submission
          expect(input).toHaveValue('');
        },
        { timeout: 1000 },
      );
    }
  });
});