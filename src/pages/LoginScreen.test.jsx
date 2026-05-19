import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { LoginScreen } from './LoginScreen';
import { SessionProvider } from '../context/SessionContext';
import { PersonaProvider } from '../context/PersonaContext';
import { DemoProvider } from '../context/DemoContext';
import { PERSONAS } from '../data/personas';

/**
 * Helper to render LoginScreen wrapped in all required context providers.
 * @param {Object} [props] - Props to pass to LoginScreen
 * @returns {Object} The render result
 */
const renderLoginScreen = (props = {}) => {
  return render(
    <BrowserRouter>
      <SessionProvider>
        <PersonaProvider>
          <DemoProvider>
            <LoginScreen {...props} />
          </DemoProvider>
        </PersonaProvider>
      </SessionProvider>
    </BrowserRouter>,
  );
};

describe('LoginScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the branding title', () => {
    renderLoginScreen();

    expect(screen.getByText('Ask Dreeso Memory')).toBeInTheDocument();
    expect(screen.getByText('Dreeso & Sommers Intelligence Platform')).toBeInTheDocument();
  });

  it('renders the Microsoft SSO button', () => {
    renderLoginScreen();

    expect(screen.getByText('Continue with Microsoft')).toBeInTheDocument();
  });

  it('renders the Google SSO button', () => {
    renderLoginScreen();

    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('renders the email input field', () => {
    renderLoginScreen();

    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('placeholder', 'name@dreeso.com');
  });

  it('renders the password input field', () => {
    renderLoginScreen();

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
  });

  it('renders the Sign In button', () => {
    renderLoginScreen();

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute('type', 'submit');
  });

  it('renders four quick-login persona buttons', () => {
    renderLoginScreen();

    PERSONAS.forEach((persona) => {
      const button = screen.getByLabelText(`Quick login as ${persona.name}`);
      expect(button).toBeInTheDocument();
    });
  });

  it('renders persona names in quick-login cards', () => {
    renderLoginScreen();

    expect(screen.getByText('Lukas Müller')).toBeInTheDocument();
    expect(screen.getByText('Elena Rossi')).toBeInTheDocument();
    expect(screen.getByText('Sophie Dubois')).toBeInTheDocument();
    expect(screen.getByText('James Carter')).toBeInTheDocument();
  });

  it('renders persona roles in quick-login cards', () => {
    renderLoginScreen();

    expect(screen.getByText('Project Director')).toBeInTheDocument();
    expect(screen.getByText('Senior Quantity Surveyor')).toBeInTheDocument();
    expect(screen.getByText('Project Manager')).toBeInTheDocument();
    expect(screen.getByText('Sales Director')).toBeInTheDocument();
  });

  it('renders the demo disclaimer footer', () => {
    renderLoginScreen();

    expect(
      screen.getByText(/This is a demo environment\. No real authentication is performed\./),
    ).toBeInTheDocument();
  });

  it('renders the "or sign in with email" divider', () => {
    renderLoginScreen();

    expect(screen.getByText('or sign in with email')).toBeInTheDocument();
  });

  it('renders the "quick demo login" divider', () => {
    renderLoginScreen();

    expect(screen.getByText('quick demo login')).toBeInTheDocument();
  });

  it('allows typing in the email field', async () => {
    renderLoginScreen();
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText('Email');

    await user.click(emailInput);
    await user.type(emailInput, 'test@dreeso.com');

    expect(emailInput).toHaveValue('test@dreeso.com');
  });

  it('allows typing in the password field', async () => {
    renderLoginScreen();
    const user = userEvent.setup();
    const passwordInput = screen.getByLabelText('Password');

    await user.click(passwordInput);
    await user.type(passwordInput, 'secret123');

    expect(passwordInput).toHaveValue('secret123');
  });

  it('sets persona context when Lukas Müller quick-login is clicked', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const lukasButton = screen.getByLabelText('Quick login as Lukas Müller');
    await user.click(lukasButton);

    const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
    expect(storedPersona).toBe('lukas-muller');
  });

  it('sets persona context when Elena Rossi quick-login is clicked', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const elenaButton = screen.getByLabelText('Quick login as Elena Rossi');
    await user.click(elenaButton);

    const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
    expect(storedPersona).toBe('elena-rossi');
  });

  it('sets persona context when Sophie Dubois quick-login is clicked', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const sophieButton = screen.getByLabelText('Quick login as Sophie Dubois');
    await user.click(sophieButton);

    const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
    expect(storedPersona).toBe('sophie-dubois');
  });

  it('sets persona context when James Carter quick-login is clicked', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const jamesButton = screen.getByLabelText('Quick login as James Carter');
    await user.click(jamesButton);

    const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
    expect(storedPersona).toBe('james-carter');
  });

  it('sets the demo screen index when a persona is selected', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const lukasButton = screen.getByLabelText('Quick login as Lukas Müller');
    await user.click(lukasButton);

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(1);
  });

  it('sets the correct first screen for Elena Rossi (screen 6)', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const elenaButton = screen.getByLabelText('Quick login as Elena Rossi');
    await user.click(elenaButton);

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(6);
  });

  it('sets the correct first screen for Sophie Dubois (screen 11)', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const sophieButton = screen.getByLabelText('Quick login as Sophie Dubois');
    await user.click(sophieButton);

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(11);
  });

  it('sets the correct first screen for James Carter (screen 16)', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const jamesButton = screen.getByLabelText('Quick login as James Carter');
    await user.click(jamesButton);

    const storedScreen = JSON.parse(localStorage.getItem('ask-dreeso-current-screen'));
    expect(storedScreen).toBe(16);
  });

  it('handles form submission without error (UI only)', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign In' });

    await user.type(emailInput, 'test@dreeso.com');
    await user.type(passwordInput, 'password');
    await user.click(signInButton);

    // Form submission is UI only — no error should occur
    expect(screen.getByText('Ask Dreeso Memory')).toBeInTheDocument();
  });

  it('handles Microsoft SSO button click without error', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const microsoftButton = screen.getByText('Continue with Microsoft');
    await user.click(microsoftButton);

    // SSO is UI only — page should remain intact
    expect(screen.getByText('Ask Dreeso Memory')).toBeInTheDocument();
  });

  it('handles Google SSO button click without error', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const googleButton = screen.getByText('Continue with Google');
    await user.click(googleButton);

    // SSO is UI only — page should remain intact
    expect(screen.getByText('Ask Dreeso Memory')).toBeInTheDocument();
  });

  it('renders persona avatars in quick-login cards', () => {
    renderLoginScreen();

    // Each persona card should have an avatar with the persona's initials
    PERSONAS.forEach((persona) => {
      const avatar = screen.getByTitle(`${persona.name} — ${persona.role}`);
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent(persona.initials);
    });
  });

  it('activates persona via keyboard Enter on quick-login card', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const lukasButton = screen.getByLabelText('Quick login as Lukas Müller');
    lukasButton.focus();
    await user.keyboard('{Enter}');

    const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
    expect(storedPersona).toBe('lukas-muller');
  });

  it('activates persona via keyboard Space on quick-login card', async () => {
    renderLoginScreen();
    const user = userEvent.setup();

    const elenaButton = screen.getByLabelText('Quick login as Elena Rossi');
    elenaButton.focus();
    await user.keyboard(' ');

    const storedPersona = JSON.parse(localStorage.getItem('ask-dreeso-selected-persona'));
    expect(storedPersona).toBe('elena-rossi');
  });

  it('renders stagger animation delays on persona cards', () => {
    renderLoginScreen();

    PERSONAS.forEach((persona, index) => {
      const button = screen.getByLabelText(`Quick login as ${persona.name}`);
      expect(button.style.animationDelay).toBe(`${index * 80}ms`);
    });
  });

  it('renders exactly four quick-login persona cards', () => {
    renderLoginScreen();

    const personaButtons = PERSONAS.map((persona) =>
      screen.getByLabelText(`Quick login as ${persona.name}`),
    );
    expect(personaButtons).toHaveLength(4);
  });
});