/**
 * Application header component.
 * Displays 'Ask Dreeso Memory' logo/title, current persona avatar and name,
 * role badge, and a subtle navigation indicator showing current screen position
 * (e.g., 3/20). Responsive layout with condensed tablet view.
 * @module components/Layout/Header
 */

import PropTypes from 'prop-types';

import { PersonaAvatar } from '../common/PersonaAvatar';
import { usePersona } from '../../context/PersonaContext';
import { useDemoFlow } from '../../context/DemoContext';

/**
 * Screen position indicator showing current screen out of total.
 * @param {Object} props
 * @param {number} props.current - Current screen number (1-based)
 * @param {number} props.total - Total number of screens
 * @returns {JSX.Element} A screen position indicator element
 */
function ScreenIndicator({ current, total }) {
  const progressPercent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      {/* Progress bar (visible on sm+) */}
      <div
        className="
          hidden h-1.5 w-16 overflow-hidden rounded-full
          bg-gray-200 dark:bg-gray-700
          sm:block md:w-24
        "
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Screen ${current} of ${total}`}
      >
        <div
          className="
            h-full rounded-full bg-blue-500 transition-all duration-300 ease-out
            dark:bg-blue-400
          "
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Screen number badge */}
      <span
        className="
          inline-flex items-center rounded-full
          bg-gray-100 px-2.5 py-0.5
          font-urbanist text-[11px] font-semibold tabular-nums
          text-gray-500 dark:bg-gray-800 dark:text-gray-400
        "
      >
        {current}
        <span className="mx-0.5 text-gray-300 dark:text-gray-600">/</span>
        {total}
      </span>
    </div>
  );
}

ScreenIndicator.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

/**
 * Header renders the application header bar with logo/title, persona info,
 * and screen navigation indicator. Responsive layout condenses on tablet.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} The application header
 */
export function Header({ className }) {
  const { persona } = usePersona();
  const { currentScreenIndex, totalScreens } = useDemoFlow();

  return (
    <header
      className={`
        sticky top-0 z-40
        glass-heavy
        border-b border-gray-200/50 dark:border-gray-700/50
        ${className || ''}
      `}
    >
      <div
        className="
          mx-auto flex max-w-7xl items-center justify-between
          px-4 py-3 sm:px-6
        "
      >
        {/* Left: Logo / Title */}
        <div className="flex items-center gap-2">
          <div
            className="
              flex h-8 w-8 flex-shrink-0 items-center justify-center
              rounded-full bg-gradient-blue
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-white"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1
              className="
                font-urbanist text-sm font-bold leading-tight
                text-gray-900 dark:text-gray-100
                sm:text-base
              "
            >
              Ask Dreeso
            </h1>
            <span
              className="
                hidden font-urbanist text-[10px] font-medium leading-tight
                text-gray-400 dark:text-gray-500
                sm:block
              "
            >
              Memory
            </span>
          </div>
        </div>

        {/* Center: Persona info (visible when persona is selected) */}
        {persona && (
          <div
            className="
              flex items-center gap-2.5
              animate-fade-in
            "
          >
            <PersonaAvatar persona={persona} size="sm" showRing />

            {/* Name and role — hidden on xs, visible on sm+ */}
            <div className="hidden flex-col sm:flex">
              <span
                className="
                  font-urbanist text-sm font-semibold leading-tight
                  text-gray-800 dark:text-gray-200
                "
              >
                {persona.name}
              </span>
              <span
                className="
                  inline-flex w-fit rounded-full
                  px-1.5 py-0.5
                  text-[9px] font-semibold uppercase tracking-wider
                  ${persona.colorTheme.bg} ${persona.colorTheme.text}
                "
              >
                {persona.role}
              </span>
            </div>

            {/* Condensed role badge on xs screens */}
            <span
              className={`
                inline-flex rounded-full px-2 py-0.5
                text-[9px] font-semibold uppercase tracking-wider
                sm:hidden
                ${persona.colorTheme.bg} ${persona.colorTheme.text}
              `}
            >
              {persona.initials}
            </span>
          </div>
        )}

        {/* Right: Screen indicator */}
        <ScreenIndicator current={currentScreenIndex} total={totalScreens} />
      </div>
    </header>
  );
}

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;