/**
 * Autosuggest dropdown UI component for the query bar.
 * Renders suggestion items with keyboard navigation (up/down/enter),
 * click selection, and dismiss on blur. Each item shows suggestion text
 * and source context badge. Styled as floating panel above query bar.
 * @module components/QueryBar/AutosuggestDropdown
 */

import PropTypes from 'prop-types';

/**
 * AutosuggestDropdown renders a floating list of query suggestions.
 * Supports keyboard navigation via activeIndex and mouse interaction.
 *
 * @param {Object} props
 * @param {import('../../data/queries').AutosuggestEntry[]} props.suggestions - Array of suggestion entries to display
 * @param {number} props.activeIndex - Currently highlighted suggestion index (-1 if none)
 * @param {(text: string) => void} props.onSelect - Callback when a suggestion is selected (click or enter)
 * @param {boolean} [props.visible=true] - Whether the dropdown is visible
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null} The autosuggest dropdown, or null if not visible or empty
 */
export function AutosuggestDropdown({ suggestions, activeIndex, onSelect, visible = true, className }) {
  if (!visible || !suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        mb-2 rounded-glass glass overflow-hidden
        animate-expand
        dark:border-gray-700
        ${className || ''}
      `}
      role="listbox"
      aria-label="Query suggestions"
    >
      <ul className="py-1">
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.id}
            role="option"
            aria-selected={index === activeIndex}
            className={`
              flex cursor-pointer items-center gap-3 px-4 py-2.5
              text-sm font-urbanist transition-colors duration-150
              ${
                index === activeIndex
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
              }
            `}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(suggestion.text);
            }}
          >
            <span
              className="
                inline-flex h-5 w-5 flex-shrink-0 items-center justify-center
                rounded-full bg-blue-100 text-xs text-blue-600
                dark:bg-blue-800 dark:text-blue-300
              "
            >
              ?
            </span>
            <span className="flex-1 truncate">{suggestion.text}</span>
            <span
              className="
                flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5
                text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400
              "
            >
              {suggestion.category}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

AutosuggestDropdown.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      personaId: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
    }),
  ).isRequired,
  activeIndex: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  className: PropTypes.string,
};

export default AutosuggestDropdown;