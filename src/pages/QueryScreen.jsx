/**
 * Query interaction screen component.
 * Displays the current query being typed/submitted, the loading state during
 * mock processing, and the rendered QueryResponse with CTA bubbles.
 * Used for screens in the demo flow where a query is submitted and answered.
 * Wrapped in Layout component.
 * @module pages/QueryScreen
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Layout } from '../components/Layout/Layout';
import { QueryResponse } from '../components/QueryResponse/QueryResponse';
import { IntelligenceClusters } from '../components/Clusters/IntelligenceClusters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PersonaAvatar } from '../components/common/PersonaAvatar';
import { usePersona } from '../context/PersonaContext';
import { useDemoFlow } from '../context/DemoContext';
import { useQueryEngine } from '../hooks/useQueryEngine';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { getQueryById } from '../data/queries';

/**
 * QueryScreen renders the query interaction screen for the demo flow.
 * Displays the current query, simulates processing, and shows the
 * structured response with CTA bubbles and source citations.
 *
 * @returns {JSX.Element} The query screen
 */
export function QueryScreen() {
  const { persona, personaId } = usePersona();
  const { currentScreen, currentScreenIndex, advanceScreen } = useDemoFlow();
  const {
    isProcessing,
    response,
    error,
    submitQueryById,
    reset: resetEngine,
  } = useQueryEngine();

  useKeyboardNavigation();

  const [hasSubmitted, setHasSubmitted] = useState(false);

  /**
   * The query response data for the current screen.
   * @type {import('../data/queries').QueryResponse|undefined}
   */
  const screenQuery = useMemo(() => {
    if (!currentScreen || !currentScreen.queryId) {
      return undefined;
    }
    return getQueryById(currentScreen.queryId);
  }, [currentScreen]);

  /**
   * Highlighted cluster IDs from the current screen's related clusters.
   * @type {string[]}
   */
  const highlightedClusterIds = useMemo(() => {
    if (screenQuery && screenQuery.relatedClusterIds) {
      return screenQuery.relatedClusterIds;
    }
    return [];
  }, [screenQuery]);

  // Auto-submit the query when the screen loads
  useEffect(() => {
    if (currentScreen && currentScreen.queryId && !hasSubmitted) {
      resetEngine();
      setHasSubmitted(true);

      // Small delay to show the query text before processing starts
      const timer = setTimeout(() => {
        submitQueryById(currentScreen.queryId);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [currentScreen, hasSubmitted, resetEngine, submitQueryById]);

  // Reset submission state when screen changes
  useEffect(() => {
    setHasSubmitted(false);
  }, [currentScreenIndex]);

  /**
   * Handles CTA bubble click by advancing to the next screen.
   * @param {string} _query - The follow-up query text
   */
  const handleBubbleClick = useCallback(
    (_query) => {
      advanceScreen();
    },
    [advanceScreen],
  );

  /**
   * Handles action button click.
   * @param {import('../data/queries').ActionTrigger} _action - The action trigger data
   */
  const handleActionClick = useCallback(
    (_action) => {
      advanceScreen();
    },
    [advanceScreen],
  );

  if (!persona || !personaId) {
    return (
      <Layout showQueryBar={false} showSourcePanel={false}>
        <div
          className="
            flex min-h-[60vh] flex-col items-center justify-center
            animate-fade-in
          "
        >
          <p
            className="
              font-urbanist text-lg font-medium
              text-gray-500 dark:text-gray-400
            "
          >
            Please select a persona to continue.
          </p>
        </div>
      </Layout>
    );
  }

  if (!currentScreen || !screenQuery) {
    return (
      <Layout>
        <div
          className="
            flex min-h-[60vh] flex-col items-center justify-center
            animate-fade-in
          "
        >
          <p
            className="
              font-urbanist text-lg font-medium
              text-gray-500 dark:text-gray-400
            "
          >
            No query data available for this screen.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-expand">
        {/* Persona context header */}
        <div className="mb-6 flex items-center gap-3">
          <PersonaAvatar persona={persona} size="lg" showRing />
          <div className="min-w-0 flex-1">
            <h2
              className="
                font-urbanist text-lg font-bold leading-tight
                text-gray-900 dark:text-gray-100
                sm:text-xl
              "
            >
              {persona.name}
            </h2>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <span
                className={`
                  inline-flex items-center rounded-full px-2.5 py-0.5
                  text-[10px] font-semibold uppercase tracking-wider
                  ${persona.colorTheme.bg} ${persona.colorTheme.text}
                `}
              >
                {persona.role}
              </span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span
                className="
                  font-urbanist text-xs font-medium
                  text-gray-500 dark:text-gray-400
                "
              >
                Screen {currentScreenIndex} — {currentScreen.description}
              </span>
            </div>
          </div>
        </div>

        {/* Query display */}
        <div className="mb-6">
          <div
            className="
              inline-flex items-center gap-2 rounded-uber
              bg-gray-100 px-4 py-2.5
              dark:bg-gray-800
              animate-slide-in
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <span
              className="
                font-urbanist text-sm font-medium
                text-gray-700 dark:text-gray-300
              "
            >
              {screenQuery.query}
            </span>
          </div>
        </div>

        {/* Loading state */}
        {isProcessing && (
          <div
            className="
              flex min-h-[200px] flex-col items-center justify-center
              animate-fade-in
            "
          >
            <LoadingSpinner
              text="Querying systems..."
              size="lg"
              variant="blue"
            />
            <div
              className="
                mt-4 flex flex-wrap items-center justify-center gap-1.5
              "
            >
              {screenQuery.activeSystems.map((systemId) => (
                <span
                  key={systemId}
                  className="
                    inline-flex items-center gap-1 rounded-full
                    bg-blue-50 px-2 py-0.5
                    text-[10px] font-semibold text-blue-600
                    dark:bg-blue-900/30 dark:text-blue-400
                    animate-pulse
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {systemId}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isProcessing && (
          <div
            className="
              rounded-uber border border-red-200 bg-red-50
              px-4 py-3 dark:border-red-800 dark:bg-red-900/20
              animate-expand
            "
          >
            <div className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500 dark:text-red-400"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <p
                className="
                  font-urbanist text-sm leading-relaxed
                  text-red-700 dark:text-red-300
                "
              >
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Query response */}
        {response && !isProcessing && (
          <QueryResponse
            response={response}
            onBubbleClick={handleBubbleClick}
            onActionClick={handleActionClick}
            visible={true}
          />
        )}

        {/* Related intelligence clusters */}
        {response && !isProcessing && highlightedClusterIds.length > 0 && (
          <div className="mt-8">
            <h3
              className="
                mb-4 font-urbanist text-xs font-semibold uppercase tracking-wider
                text-gray-500 dark:text-gray-400
              "
            >
              Related Intelligence Clusters
            </h3>
            <IntelligenceClusters
              personaId={personaId}
              highlightedClusterIds={highlightedClusterIds}
            />
          </div>
        )}

        {/* Footer info */}
        {response && !isProcessing && (
          <div
            className="
              mt-8 flex items-center gap-2 rounded-uber
              border border-gray-200 bg-gray-50
              px-3 py-2 dark:border-gray-700 dark:bg-gray-800/30
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
            <p
              className="
                font-urbanist text-[10px] leading-relaxed
                text-gray-500 dark:text-gray-400
              "
            >
              Use the query bar below to ask follow-up questions, click a CTA bubble,
              or press the right arrow key to advance to the next screen.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default QueryScreen;