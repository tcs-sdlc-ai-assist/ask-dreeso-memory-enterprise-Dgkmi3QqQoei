/**
 * Custom React hook for query bar autosuggest functionality.
 * Takes current persona ID and input text, returns filtered suggestions
 * from mock data. Manages visibility state, keyboard navigation within
 * suggestions, and selection handler.
 * @module hooks/useAutosuggest
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getAutosuggestByPersona } from '../data/queries';

/**
 * @typedef {Object} AutosuggestResult
 * @property {import('../data/queries').AutosuggestEntry[]} suggestions - Filtered suggestion entries
 * @property {boolean} isVisible - Whether the suggestion dropdown is visible
 * @property {number} activeIndex - Currently highlighted suggestion index (-1 if none)
 * @property {(visible: boolean) => void} setIsVisible - Sets the visibility of the dropdown
 * @property {(index: number) => void} setActiveIndex - Sets the active suggestion index
 * @property {(text: string) => void} selectSuggestion - Handles selection of a suggestion
 * @property {(event: KeyboardEvent) => void} handleKeyDown - Keyboard event handler for navigation
 * @property {() => void} reset - Resets autosuggest state
 */

/**
 * Custom React hook for query bar autosuggest.
 * Filters suggestions based on persona and input text, manages visibility,
 * keyboard navigation (ArrowUp, ArrowDown, Enter, Escape), and selection.
 *
 * @param {string|null} personaId - The active persona identifier
 * @param {string} inputText - Current text in the query input
 * @param {Object} [options] - Optional configuration
 * @param {number} [options.maxSuggestions=6] - Maximum number of suggestions to return
 * @param {(text: string) => void} [options.onSelect] - Callback invoked when a suggestion is selected
 * @returns {AutosuggestResult} Autosuggest state and handlers
 */
export function useAutosuggest(personaId, inputText, options) {
  const { maxSuggestions = 6, onSelect } = options || {};

  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const onSelectRef = useRef(onSelect);

  // Keep the callback ref up to date without triggering re-renders
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  /**
   * All autosuggest entries for the current persona, sorted by priority.
   * @type {import('../data/queries').AutosuggestEntry[]}
   */
  const allSuggestions = useMemo(() => {
    if (!personaId) {
      return [];
    }
    return getAutosuggestByPersona(personaId);
  }, [personaId]);

  /**
   * Filtered suggestions based on input text.
   * If input is empty, returns all suggestions (up to maxSuggestions).
   * Otherwise, filters by case-insensitive substring match on suggestion text.
   * @type {import('../data/queries').AutosuggestEntry[]}
   */
  const suggestions = useMemo(() => {
    if (!allSuggestions.length) {
      return [];
    }

    const trimmed = typeof inputText === 'string' ? inputText.trim() : '';

    if (trimmed.length === 0) {
      return allSuggestions.slice(0, maxSuggestions);
    }

    const lower = trimmed.toLowerCase();
    const filtered = allSuggestions.filter((entry) =>
      entry.text.toLowerCase().includes(lower),
    );

    return filtered.slice(0, maxSuggestions);
  }, [allSuggestions, inputText, maxSuggestions]);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  // Hide suggestions when persona changes
  useEffect(() => {
    setIsVisible(false);
    setActiveIndex(-1);
  }, [personaId]);

  /**
   * Handles selection of a suggestion by text.
   * Hides the dropdown, resets active index, and invokes the onSelect callback.
   * @param {string} text - The selected suggestion text
   */
  const selectSuggestion = useCallback((text) => {
    setIsVisible(false);
    setActiveIndex(-1);
    if (onSelectRef.current && typeof onSelectRef.current === 'function') {
      onSelectRef.current(text);
    }
  }, []);

  /**
   * Keyboard event handler for navigating and selecting suggestions.
   * Supports ArrowDown, ArrowUp, Enter, Escape, and Tab.
   * @param {KeyboardEvent} event - The keyboard event from the input
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (!isVisible || suggestions.length === 0) {
        // If dropdown is not visible but there are suggestions, show on ArrowDown
        if (event.key === 'ArrowDown' && suggestions.length > 0) {
          event.preventDefault();
          setIsVisible(true);
          setActiveIndex(0);
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setActiveIndex((prev) => {
            const next = prev + 1;
            return next >= suggestions.length ? 0 : next;
          });
          break;

        case 'ArrowUp':
          event.preventDefault();
          setActiveIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? suggestions.length - 1 : next;
          });
          break;

        case 'Enter':
          if (activeIndex >= 0 && activeIndex < suggestions.length) {
            event.preventDefault();
            selectSuggestion(suggestions[activeIndex].text);
          }
          break;

        case 'Escape':
          event.preventDefault();
          setIsVisible(false);
          setActiveIndex(-1);
          break;

        case 'Tab':
          setIsVisible(false);
          setActiveIndex(-1);
          break;

        default:
          break;
      }
    },
    [isVisible, suggestions, activeIndex, selectSuggestion],
  );

  /**
   * Resets all autosuggest state to initial values.
   */
  const reset = useCallback(() => {
    setIsVisible(false);
    setActiveIndex(-1);
  }, []);

  return {
    suggestions,
    isVisible,
    activeIndex,
    setIsVisible,
    setActiveIndex,
    selectSuggestion,
    handleKeyDown,
    reset,
  };
}

export default useAutosuggest;