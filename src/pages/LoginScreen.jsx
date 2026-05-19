/**
 * Demo login screen component (Screen 1 of demo).
 * Renders Dreeso & Sommers branding, SSO buttons (Microsoft/Google — UI only),
 * email/password fields (UI only, no validation), and four 'Quick login as [Persona]'
 * buttons with persona avatars. On quick-login click, sets persona context and
 * navigates to persona home screen.
 * Styled with centered card layout, blue gradient background, and glassmorphism.
 * @module pages/LoginScreen
 */

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PersonaAvatar } from '../components/common/PersonaAvatar';
import { usePersona } from '../context/PersonaContext';
import { useDemoFlow } from '../context/DemoContext';

/**
 * SSO button component for Microsoft/Google login (UI only).
 * @param {Object} props
 * @param {string} props.provider - The SSO provider name
 * @param {React.ReactNode} props.icon - The provider icon element
 * @param {() => void} props.onClick - Click handler
 * @returns {JSX.Element} A styled SSO button
 */
function SSOButton({ provider, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full items-center justify-center gap-2.5
        rounded-uber-lg border border-gray-200 bg-white
        px-4 py-2.5 font-urbanist text-sm font-medium
        text-gray-700 transition-all duration-200
        hover:border-gray-300 hover:bg-gray-50 hover:shadow-uber
        active:scale-[0.98]
        dark:border-gray-700 dark:bg-gray-800
        dark:text-gray-300 dark:hover:border-gray-600
        dark:hover:bg-gray-750
      "
    >
      {icon}
      <span>Continue with {provider}</span>
    </button>
  );
}

/**
 * Quick login persona card button.
 * @param {Object} props
 * @param {import('../data/personas').Persona} props.persona - The persona object
 * @param {(id: string) => void} props.onSelect - Callback when persona is selected
 * @param {number} props.index - Index for stagger animation
 * @returns {JSX.Element} A styled persona quick-login button
 */
function PersonaCard({ persona, onSelect, index }) {
  const handleClick = useCallback(() => {
    onSelect(persona.id);
  }, [persona.id, onSelect]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(persona.id);
      }
    },
    [persona.id, onSelect],
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Quick login as ${persona.name}`}
      className={`
        flex w-full items-center gap-3 rounded-uber-lg
        border border-gray-200 bg-white px-4 py-3
        text-left transition-all duration-200 ease-out
        animate-slide-in
        hover:border-blue-300 hover:bg-blue-50 hover:shadow-uber
        active:scale-[0.98]
        dark:border-gray-700 dark:bg-gray-800
        dark:hover:border-blue-600 dark:hover:bg-blue-900/20
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <PersonaAvatar persona={persona} size="md" showRing />
      <div className="min-w-0 flex-1">
        <div
          className="
            font-urbanist text-sm font-semibold leading-tight
            text-gray-900 dark:text-gray-100
          "
        >
          {persona.name}
        </div>
        <div
          className="
            mt-0.5 font-urbanist text-xs leading-tight
            text-gray-500 dark:text-gray-400
          "
        >
          {persona.role}
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
      >
        <path
          fillRule="evenodd"
          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

/**
 * LoginScreen renders the demo login page with branding, SSO buttons,
 * email/password fields, and quick persona login cards.
 * On quick-login click, sets persona context and navigates to the demo flow.
 *
 * @returns {JSX.Element} The login screen
 */
export function LoginScreen() {
  const { setPersona, personas } = usePersona();
  const { goToScreen } = useDemoFlow();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Handles quick persona login selection.
   * Sets the persona context and navigates to the first screen of the persona group.
   * @param {string} personaId - The selected persona identifier
   */
  const handlePersonaSelect = useCallback(
    (personaId) => {
      setPersona(personaId);

      // Each persona has 5 screens: persona 0 → screens 1-5, persona 1 → screens 6-10, etc.
      const personaIndex = personas.findIndex((p) => p.id === personaId);
      const firstScreen = personaIndex >= 0 ? personaIndex * 5 + 1 : 1;
      goToScreen(firstScreen);
    },
    [setPersona, personas, goToScreen],
  );

  /**
   * Handles SSO button click (UI only — no real auth).
   * @param {string} _provider - The SSO provider name
   */
  const handleSSOClick = useCallback((_provider) => {
    // UI only — no real authentication
  }, []);

  /**
   * Handles email/password form submission (UI only — no real auth).
   * @param {React.FormEvent} event - The form submit event
   */
  const handleFormSubmit = useCallback((event) => {
    event.preventDefault();
    // UI only — no real authentication
  }, []);

  return (
    <div
      className="
        flex min-h-screen items-center justify-center
        bg-gradient-blue-subtle
        px-4 py-8
      "
    >
      <div
        className="
          glass-heavy w-full max-w-md
          animate-expand
          overflow-hidden rounded-uber-xl
        "
      >
        <div className="p-6 sm:p-8">
          {/* Branding */}
          <div className="flex flex-col items-center">
            <div
              className="
                flex h-14 w-14 items-center justify-center
                rounded-full bg-gradient-blue
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-7 w-7 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1
              className="
                mt-4 font-urbanist text-2xl font-bold leading-tight
                text-gray-900 dark:text-gray-100
              "
            >
              Ask Dreeso Memory
            </h1>
            <p
              className="
                mt-1 font-urbanist text-sm
                text-gray-500 dark:text-gray-400
              "
            >
              Dreeso &amp; Sommers Intelligence Platform
            </p>
          </div>

          {/* SSO Buttons */}
          <div className="mt-6 space-y-2.5">
            <SSOButton
              provider="Microsoft"
              onClick={() => handleSSOClick('microsoft')}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21 21"
                  className="h-5 w-5"
                >
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
              }
            />
            <SSOButton
              provider="Google"
              onClick={() => handleSSOClick('google')}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
            />
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span
              className="
                font-urbanist text-xs font-medium
                text-gray-400 dark:text-gray-500
              "
            >
              or sign in with email
            </span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Email/Password Form (UI only) */}
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="login-email"
                className="
                  block font-urbanist text-xs font-medium
                  text-gray-600 dark:text-gray-400
                "
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@dreeso.com"
                autoComplete="email"
                className="
                  mt-1 w-full rounded-uber-lg border border-gray-200
                  bg-white px-3.5 py-2.5 font-urbanist text-sm
                  text-gray-900 placeholder-gray-400
                  outline-none transition-all duration-200
                  focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30
                  dark:border-gray-700 dark:bg-gray-800
                  dark:text-gray-100 dark:placeholder-gray-500
                  dark:focus:border-blue-500 dark:focus:ring-blue-500/30
                "
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="
                  block font-urbanist text-xs font-medium
                  text-gray-600 dark:text-gray-400
                "
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="
                  mt-1 w-full rounded-uber-lg border border-gray-200
                  bg-white px-3.5 py-2.5 font-urbanist text-sm
                  text-gray-900 placeholder-gray-400
                  outline-none transition-all duration-200
                  focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30
                  dark:border-gray-700 dark:bg-gray-800
                  dark:text-gray-100 dark:placeholder-gray-500
                  dark:focus:border-blue-500 dark:focus:ring-blue-500/30
                "
              />
            </div>
            <button
              type="submit"
              className="
                w-full rounded-uber-lg bg-blue-600 px-4 py-2.5
                font-urbanist text-sm font-semibold text-white
                transition-all duration-200
                hover:bg-blue-700 active:scale-[0.98]
                dark:bg-blue-500 dark:hover:bg-blue-600
              "
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span
              className="
                font-urbanist text-xs font-medium
                text-gray-400 dark:text-gray-500
              "
            >
              quick demo login
            </span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Quick Persona Login Cards */}
          <div className="space-y-2">
            {personas.map((persona, index) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                onSelect={handlePersonaSelect}
                index={index}
              />
            ))}
          </div>

          {/* Footer */}
          <p
            className="
              mt-6 text-center font-urbanist text-[10px] leading-relaxed
              text-gray-400 dark:text-gray-500
            "
          >
            This is a demo environment. No real authentication is performed.
            <br />
            All data is mocked for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;