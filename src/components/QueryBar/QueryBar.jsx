/**
 * Persistent query bar component rendered at the bottom of every screen.
 * Features text input with placeholder, autosuggest dropdown, send button,
 * expand animation on focus, and submission via Enter/Send/suggestion click.
 * On submit, triggers useQueryEngine.
 * Styled with glassmorphism, Urbanist font, and responsive width.
 * @module components/QueryBar/QueryBar
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { useAutosuggest } from '../../hooks/useAutosuggest';
import { useQueryEngine } from '../../hooks/useQueryEngine';
import { usePersona } from '../../context/PersonaContext';

/**
 * Persistent query bar component with autosuggest and mock query execution.
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes
 * @param {(response: import('../../data/queries').QueryResponse) => void} [props.onResponse] - Callback when a query response is received
 * @param {(query: string) => void} [props.onSubmit] - Callback when a query is submitted
 * @param {boolean} [props.disabled] - Whether the query bar is disabled
 * @returns {JSX.Element} The query bar component
 */
export function QueryBar({ className, onResponse, onSubmit, disabled }) {
  const { persona, personaId } = usePersona();
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const {
    isProcessing,
    response,
    error,
    submitQuery,
    reset: resetEngine,
  } = useQueryEngine();

  const handleSuggestionSelect = useCallback((text) => {
    setInputText(text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const {
    suggestions,
    isVisible: isSuggestVisible,
    activeIndex,
    setIsVisible: setSuggestVisible,
    handleKeyDown: handleSuggestKeyDown,
    selectSuggestion,
    reset: resetSuggest,
  } = useAutosuggest(personaId, inputText, {
    maxSuggestions: 6,
    onSelect: handleSuggestionSelect,
  });

  // Notify parent when a response is received
  useEffect(() => {
    if (response && onResponse) {
      onResponse(response);
    }
  }, [response, onResponse]);

  /**
   * Handles query submission.
   * @param {string} [queryText] - Optional override text to submit
   */
  const handleSubmit = useCallback(
    (queryText) => {
      const text = (queryText || inputText).trim();
      if (!text || !personaId || isProcessing || disabled) {
        return;
      }

      resetSuggest();
      submitQuery(text, personaId);

      if (onSubmit) {
        onSubmit(text);
      }

      setInputText('');
    },
    [inputText, personaId, isProcessing, disabled, resetSuggest, submitQuery, onSubmit],
  );

  /**
   * Handles input change events.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setInputText(value);
      if (value.trim().length > 0 || isFocused) {
        setSuggestVisible(true);
      }
    },
    [isFocused, setSuggestVisible],
  );

  /**
   * Handles keyboard events on the input.
   * Delegates to autosuggest keyboard handler first,
   * then handles Enter for submission.
   * @param {React.KeyboardEvent<HTMLInputElement>} event
   */
  const handleKeyDown = useCallback(
    (event) => {
      // Let autosuggest handle navigation keys
      handleSuggestKeyDown(event);

      // If autosuggest didn't prevent default for Enter, handle submission
      if (event.key === 'Enter' && !event.defaultPrevented) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSuggestKeyDown, handleSubmit],
  );

  /**
   * Handles focus on the input.
   */
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (suggestions.length > 0) {
      setSuggestVisible(true);
    }
  }, [suggestions.length, setSuggestVisible]);

  /**
   * Handles blur on the input.
   * Delays hiding suggestions to allow click events on suggestions.
   */
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      setSuggestVisible(false);
    }, 200);
  }, [setSuggestVisible]);

  /**
   * Handles clicking a suggestion item.
   * @param {string} text - The suggestion text
   */
  const handleSuggestionClick = useCallback(
    (text) => {
      selectSuggestion(text);
      // Submit the selected suggestion directly
      setTimeout(() => {
        handleSubmit(text);
      }, 50);
    },
    [selectSuggestion, handleSubmit],
  );

  /**
   * Handles send button click.
   */
  const handleSendClick = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const placeholderText = persona
    ? `Ask a question as ${persona.name}…`
    : 'Select a persona to start asking questions…';

  const isDisabled = disabled || !personaId || isProcessing;

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 ${className || ''}`}
    >
      <div
        className={`
          mx-auto w-full max-w-2xl transition-all duration-300 ease-out
          ${isFocused ? 'max-w-3xl' : 'max-w-2xl'}
        `}
      >
        {/* Autosuggest dropdown */}
        {isSuggestVisible && suggestions.length > 0 && (
          <div
            className="
              mb-2 rounded-glass glass overflow-hidden
              animate-expand
              dark:border-gray-700
            "
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
                    handleSuggestionClick(suggestion.text);
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
        )}

        {/* Query input bar */}
        <div
          className={`
            glass-heavy flex items-center gap-2 rounded-uber-xl
            px-4 py-3 transition-all duration-300 ease-out
            ${isFocused ? 'shadow-uber-lg ring-2 ring-blue-400/50 dark:ring-blue-500/40' : 'shadow-uber-md'}
            ${isDisabled ? 'opacity-60' : ''}
          `}
        >
          {/* Persona indicator */}
          {persona && (
            <div
              className={`
                flex h-8 w-8 flex-shrink-0 items-center justify-center
                rounded-full text-xs font-semibold
                ${persona.colorTheme.bg} ${persona.colorTheme.text}
              `}
              title={persona.name}
            >
              {persona.initials}
            </div>
          )}

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholderText}
            disabled={isDisabled}
            autoComplete="off"
            aria-label="Query input"
            aria-autocomplete="list"
            aria-expanded={isSuggestVisible && suggestions.length > 0}
            className="
              flex-1 bg-transparent font-urbanist text-sm
              text-gray-900 placeholder-gray-400 outline-none
              dark:text-gray-100 dark:placeholder-gray-500
              disabled:cursor-not-allowed
            "
          />

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex flex-shrink-0 items-center gap-1.5 px-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" style={{ animationDelay: '150ms' }} />
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" style={{ animationDelay: '300ms' }} />
            </div>
          )}

          {/* Send button */}
          <button
            type="button"
            onClick={handleSendClick}
            disabled={isDisabled || inputText.trim().length === 0}
            aria-label="Send query"
            className="
              flex h-8 w-8 flex-shrink-0 items-center justify-center
              rounded-full bg-blue-600 text-white
              transition-all duration-200
              hover:bg-blue-700 active:scale-95
              disabled:cursor-not-allowed disabled:bg-gray-300
              dark:bg-blue-500 dark:hover:bg-blue-600
              dark:disabled:bg-gray-600
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="
              mt-2 rounded-uber px-4 py-2 text-center text-xs
              text-red-600 dark:text-red-400
            "
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

QueryBar.propTypes = {
  className: PropTypes.string,
  onResponse: PropTypes.func,
  onSubmit: PropTypes.func,
  disabled: PropTypes.bool,
};

export default QueryBar;