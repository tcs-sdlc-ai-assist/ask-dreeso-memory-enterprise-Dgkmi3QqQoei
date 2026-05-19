/**
 * Keyboard shortcut hint overlay component.
 * Small floating UI showing available keyboard shortcuts as a semi-transparent
 * overlay in the bottom-right corner. Displays F/Space/N/R/L keys with their
 * actions. Can be toggled visible/hidden via a small trigger button.
 * @module components/common/KeyboardHint
 */

import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Keyboard shortcut definitions displayed in the overlay.
 * @type {Array<{key: string, label: string, description: string}>}
 */
const SHORTCUTS = [
  { key: 'F', label: 'F', description: 'Next screen' },
  { key: 'Space', label: '␣', description: 'Next screen' },
  { key: 'ArrowRight', label: '→', description: 'Next screen' },
  { key: 'ArrowLeft', label: '←', description: 'Previous screen' },
  { key: 'N', label: 'N', description: 'Next persona' },
  { key: 'R', label: 'R', description: 'Restart demo' },
  { key: 'L', label: 'L', description: 'Logout' },
];

/**
 * Renders a single shortcut row with key badge and description.
 * @param {Object} props
 * @param {string} props.label - The key label to display in the badge
 * @param {string} props.description - Description of the shortcut action
 * @returns {JSX.Element} A shortcut row element
 */
function ShortcutRow({ label, description }) {
  return (
    <div className="flex items-center gap-2.5">
      <kbd
        className="
          inline-flex h-6 min-w-[24px] items-center justify-center
          rounded-md border border-gray-300 bg-gray-100
          px-1.5 font-urbanist text-[10px] font-semibold
          text-gray-700 shadow-sm
          dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300
        "
      >
        {label}
      </kbd>
      <span
        className="
          font-urbanist text-[11px] leading-tight
          text-gray-500 dark:text-gray-400
        "
      >
        {description}
      </span>
    </div>
  );
}

ShortcutRow.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

/**
 * KeyboardHint renders a floating overlay in the bottom-right corner
 * showing available keyboard shortcuts. The overlay can be toggled
 * visible/hidden via a small trigger button.
 *
 * @param {Object} props
 * @param {boolean} [props.defaultVisible=false] - Whether the overlay is visible by default
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} The keyboard hint overlay
 */
export function KeyboardHint({ defaultVisible = false, className }) {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const handleToggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsVisible((prev) => !prev);
    }
  }, []);

  return (
    <div
      className={`
        fixed bottom-20 right-4 z-40
        flex flex-col items-end gap-2
        ${className || ''}
      `}
    >
      {/* Shortcut overlay panel */}
      {isVisible && (
        <div
          className="
            glass-sm animate-expand
            w-52 rounded-uber-lg
            px-4 py-3
          "
          role="region"
          aria-label="Keyboard shortcuts"
        >
          <h4
            className="
              mb-2 font-urbanist text-[10px] font-semibold
              uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Keyboard Shortcuts
          </h4>
          <div className="space-y-1.5">
            {SHORTCUTS.map((shortcut) => (
              <ShortcutRow
                key={shortcut.key}
                label={shortcut.label}
                description={shortcut.description}
              />
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label={isVisible ? 'Hide keyboard shortcuts' : 'Show keyboard shortcuts'}
        aria-expanded={isVisible}
        className="
          flex h-8 w-8 items-center justify-center
          rounded-full glass-sm
          text-gray-500 transition-all duration-200
          hover:bg-gray-100 hover:text-gray-700
          active:scale-95
          dark:text-gray-400 dark:hover:bg-gray-800
          dark:hover:text-gray-200
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

KeyboardHint.propTypes = {
  defaultVisible: PropTypes.bool,
  className: PropTypes.string,
};

export default KeyboardHint;