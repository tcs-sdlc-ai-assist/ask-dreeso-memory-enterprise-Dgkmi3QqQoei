/**
 * CTA follow-up bubbles component.
 * Renders 3-4 contextual suggestion bubbles left-aligned below a query response.
 * Each bubble is a clickable pill showing follow-up query text.
 * On click, auto-populates the query bar and triggers submission.
 * Styled as rounded pills with hover effect and subtle animation.
 * @module components/CTABubbles/CTABubbles
 */

import { useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * CTABubbles renders a row of contextual follow-up query suggestion pills.
 * Each bubble displays a follow-up query text and triggers submission on click.
 *
 * @param {Object} props
 * @param {string[]} props.bubbles - Array of follow-up query text strings (typically 3-4)
 * @param {(query: string) => void} props.onBubbleClick - Callback when a bubble is clicked
 * @param {boolean} [props.disabled=false] - Whether the bubbles are disabled
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null} The CTA bubbles row, or null if no bubbles provided
 */
export function CTABubbles({ bubbles, onBubbleClick, disabled = false, className }) {
  const handleClick = useCallback(
    (text) => {
      if (!disabled && onBubbleClick) {
        onBubbleClick(text);
      }
    },
    [disabled, onBubbleClick],
  );

  const handleKeyDown = useCallback(
    (event, text) => {
      if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
        event.preventDefault();
        if (onBubbleClick) {
          onBubbleClick(text);
        }
      }
    },
    [disabled, onBubbleClick],
  );

  if (!bubbles || bubbles.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap items-start gap-2 ${className || ''}`}
      role="group"
      aria-label="Follow-up suggestions"
    >
      {bubbles.map((text, index) => (
        <button
          key={`${text}-${index}`}
          type="button"
          onClick={() => handleClick(text)}
          onKeyDown={(event) => handleKeyDown(event, text)}
          disabled={disabled}
          aria-label={`Ask: ${text}`}
          className={`
            inline-flex items-center rounded-full
            border border-blue-200 bg-blue-50
            px-3.5 py-1.5
            font-urbanist text-xs font-medium text-blue-700
            transition-all duration-200 ease-out
            animate-slide-in
            hover:bg-blue-100 hover:border-blue-300 hover:shadow-uber
            active:scale-95
            dark:border-blue-700 dark:bg-blue-900/30
            dark:text-blue-300 dark:hover:bg-blue-800/40
            dark:hover:border-blue-600
            disabled:cursor-not-allowed disabled:opacity-50
            disabled:hover:bg-blue-50 disabled:hover:border-blue-200
            disabled:hover:shadow-none disabled:active:scale-100
            dark:disabled:hover:bg-blue-900/30
            dark:disabled:hover:border-blue-700
          `}
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 opacity-60"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="truncate max-w-[240px] sm:max-w-xs">{text}</span>
        </button>
      ))}
    </div>
  );
}

CTABubbles.propTypes = {
  bubbles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onBubbleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default CTABubbles;