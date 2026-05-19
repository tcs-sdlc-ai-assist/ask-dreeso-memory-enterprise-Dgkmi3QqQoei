/**
 * Custom React hook for mock query execution.
 * Takes a query string and persona, simulates processing delay (setTimeout 1-2s),
 * returns mock response from queries data, tracks active systems for source panel
 * animation, and adds to query history via SessionContext.
 * @module hooks/useQueryEngine
 */

import { useCallback, useRef, useState } from 'react';

import { useSession } from '../context/SessionContext';
import { getQueryById, getQueriesByPersona, QUERY_BY_ID } from '../data/queries';
import { SYSTEM_SOURCES } from '../constants';

/**
 * @typedef {Object} QueryEngineState
 * @property {boolean} isProcessing - Whether a query is currently being processed
 * @property {import('../data/queries').QueryResponse|null} response - The current query response
 * @property {string[]} activeSystems - IDs of systems actively queried (for source panel animation)
 * @property {string[]} inactiveSystems - IDs of systems not involved in the current query
 * @property {string|null} error - Error message if query failed
 * @property {number} processingTimeMs - Simulated processing time in milliseconds
 */

/**
 * @typedef {Object} QueryEngineResult
 * @property {boolean} isProcessing - Whether a query is currently being processed
 * @property {import('../data/queries').QueryResponse|null} response - The current query response
 * @property {string[]} activeSystems - IDs of systems actively queried
 * @property {string[]} inactiveSystems - IDs of systems not involved in the current query
 * @property {string|null} error - Error message if query failed
 * @property {number} processingTimeMs - Simulated processing time in milliseconds
 * @property {(query: string, personaId: string) => void} submitQuery - Submits a query for processing
 * @property {(queryId: string) => void} submitQueryById - Submits a query by its ID
 * @property {() => void} reset - Resets the query engine state
 * @property {() => void} cancelQuery - Cancels the current in-flight query
 */

/**
 * All system source IDs for determining inactive systems.
 * @type {string[]}
 */
const ALL_SYSTEM_IDS = SYSTEM_SOURCES.map((s) => s.id);

/**
 * Generates a random delay between min and max milliseconds.
 * @param {number} min - Minimum delay in milliseconds
 * @param {number} max - Maximum delay in milliseconds
 * @returns {number} Random delay in milliseconds
 */
const randomDelay = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Finds the best matching query response for a given query string and persona.
 * Attempts exact match first, then case-insensitive match, then substring match.
 * @param {string} query - The query text
 * @param {string} personaId - The persona identifier
 * @returns {import('../data/queries').QueryResponse|null} The matching response, or null
 */
const findMatchingResponse = (query, personaId) => {
  if (!query || !personaId) {
    return null;
  }

  const personaQueries = getQueriesByPersona(personaId);
  if (!personaQueries.length) {
    return null;
  }

  // Exact match
  const exactMatch = personaQueries.find((q) => q.query === query);
  if (exactMatch) {
    return exactMatch;
  }

  // Case-insensitive match
  const lowerQuery = query.toLowerCase();
  const caseMatch = personaQueries.find(
    (q) => q.query.toLowerCase() === lowerQuery,
  );
  if (caseMatch) {
    return caseMatch;
  }

  // Substring match — find the best overlap
  const substringMatch = personaQueries.find((q) =>
    q.query.toLowerCase().includes(lowerQuery) ||
    lowerQuery.includes(q.query.toLowerCase()),
  );
  if (substringMatch) {
    return substringMatch;
  }

  // Word overlap scoring
  const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);
  let bestMatch = null;
  let bestScore = 0;

  for (const q of personaQueries) {
    const candidateWords = q.query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    let score = 0;
    for (const word of queryWords) {
      if (candidateWords.some((cw) => cw.includes(word) || word.includes(cw))) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = q;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch;
  }

  // Fallback: return the first query for the persona
  return personaQueries[0];
};

/**
 * Custom React hook for mock query execution.
 * Simulates processing delay (1-2s), returns mock response from queries data,
 * tracks active systems for source panel animation, and adds to query history
 * via SessionContext.
 *
 * @returns {QueryEngineResult} Query engine state and handlers
 */
export function useQueryEngine() {
  const { addQuery } = useSession();

  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeSystems, setActiveSystems] = useState([]);
  const [inactiveSystems, setInactiveSystems] = useState(ALL_SYSTEM_IDS);
  const [error, setError] = useState(null);
  const [processingTimeMs, setProcessingTimeMs] = useState(0);

  const timerRef = useRef(null);
  const isCancelledRef = useRef(false);

  /**
   * Submits a query string for mock processing.
   * Simulates a 1-2 second delay, then resolves with the mock response.
   * @param {string} query - The query text
   * @param {string} personaId - The persona identifier
   */
  const submitQuery = useCallback(
    (query, personaId) => {
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        setError('Query text is required');
        return;
      }

      if (!personaId || typeof personaId !== 'string') {
        setError('Persona ID is required');
        return;
      }

      // Cancel any in-flight query
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      isCancelledRef.current = false;
      setIsProcessing(true);
      setError(null);
      setResponse(null);

      // Find the matching mock response
      const matchedResponse = findMatchingResponse(query.trim(), personaId);

      // Determine active/inactive systems from the response
      const responseActiveSystems = matchedResponse ? matchedResponse.activeSystems : [];
      const responseInactiveSystems = ALL_SYSTEM_IDS.filter(
        (id) => !responseActiveSystems.includes(id),
      );

      // Set active systems immediately for animation
      setActiveSystems(responseActiveSystems);
      setInactiveSystems(responseInactiveSystems);

      // Simulate processing delay (1200-2200ms)
      const delay = randomDelay(1200, 2200);
      setProcessingTimeMs(delay);

      timerRef.current = setTimeout(() => {
        timerRef.current = null;

        if (isCancelledRef.current) {
          return;
        }

        if (!matchedResponse) {
          setIsProcessing(false);
          setError('No matching response found for this query');
          setActiveSystems([]);
          setInactiveSystems(ALL_SYSTEM_IDS);
          return;
        }

        setResponse(matchedResponse);
        setIsProcessing(false);

        // Add to query history
        addQuery({
          query: query.trim(),
          personaId,
          timestamp: new Date().toISOString(),
        });
      }, delay);
    },
    [addQuery],
  );

  /**
   * Submits a query by its unique ID.
   * Looks up the query response directly and simulates processing.
   * @param {string} queryId - The query identifier
   */
  const submitQueryById = useCallback(
    (queryId) => {
      if (!queryId || typeof queryId !== 'string') {
        setError('Query ID is required');
        return;
      }

      const queryResponse = getQueryById(queryId);
      if (!queryResponse) {
        setError(`No query found with ID: ${queryId}`);
        return;
      }

      // Cancel any in-flight query
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      isCancelledRef.current = false;
      setIsProcessing(true);
      setError(null);
      setResponse(null);

      // Set active systems immediately for animation
      const responseActiveSystems = queryResponse.activeSystems || [];
      const responseInactiveSystems = ALL_SYSTEM_IDS.filter(
        (id) => !responseActiveSystems.includes(id),
      );

      setActiveSystems(responseActiveSystems);
      setInactiveSystems(responseInactiveSystems);

      // Simulate processing delay (1200-2200ms)
      const delay = randomDelay(1200, 2200);
      setProcessingTimeMs(delay);

      timerRef.current = setTimeout(() => {
        timerRef.current = null;

        if (isCancelledRef.current) {
          return;
        }

        setResponse(queryResponse);
        setIsProcessing(false);

        // Add to query history
        addQuery({
          query: queryResponse.query,
          personaId: queryResponse.personaId,
          timestamp: new Date().toISOString(),
        });
      }, delay);
    },
    [addQuery],
  );

  /**
   * Resets the query engine state to initial values.
   */
  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isCancelledRef.current = false;
    setIsProcessing(false);
    setResponse(null);
    setActiveSystems([]);
    setInactiveSystems(ALL_SYSTEM_IDS);
    setError(null);
    setProcessingTimeMs(0);
  }, []);

  /**
   * Cancels the current in-flight query.
   */
  const cancelQuery = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isCancelledRef.current = true;
    setIsProcessing(false);
    setActiveSystems([]);
    setInactiveSystems(ALL_SYSTEM_IDS);
    setProcessingTimeMs(0);
  }, []);

  return {
    isProcessing,
    response,
    activeSystems,
    inactiveSystems,
    error,
    processingTimeMs,
    submitQuery,
    submitQueryById,
    reset,
    cancelQuery,
  };
}

export default useQueryEngine;