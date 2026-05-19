/**
 * Action confirmation screen component.
 * Displays the ActionConfirmationPanel with cross-domain propagation
 * visualization for screens where the user confirms an enterprise action.
 * Shows affected systems, outcomes, and propagation flow.
 * Wrapped in Layout component.
 * @module pages/ActionScreen
 */

import { useCallback, useMemo } from 'react';

import { Layout } from '../components/Layout/Layout';
import { ActionConfirmationPanel } from '../components/ActionPanel/ActionConfirmationPanel';
import { CrossDomainPropagation } from '../components/ActionPanel/CrossDomainPropagation';
import { IntelligenceClusters } from '../components/Clusters/IntelligenceClusters';
import { PersonaAvatar } from '../components/common/PersonaAvatar';
import { usePersona } from '../context/PersonaContext';
import { useDemoFlow } from '../context/DemoContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { getActionById } from '../data/actions';
import { getQueryById } from '../data/queries';

/**
 * ActionScreen renders the action confirmation screen for the demo flow.
 * Displays the ActionConfirmationPanel with cross-domain propagation
 * visualization, affected systems, expected outcomes, and propagation effects.
 *
 * @returns {JSX.Element} The action confirmation screen
 */
export function ActionScreen() {
  const { persona, personaId } = usePersona();
  const { currentScreen, currentScreenIndex, advanceScreen } = useDemoFlow();

  useKeyboardNavigation();

  /**
   * The action IDs available on the current screen.
   * @type {string[]}
   */
  const actionIds = useMemo(() => {
    if (!currentScreen || !currentScreen.actionIds) {
      return [];
    }
    return currentScreen.actionIds;
  }, [currentScreen]);

  /**
   * The first action for the current screen (primary action).
   * @type {import('../data/actions').ActionConfirmation|undefined}
   */
  const primaryAction = useMemo(() => {
    if (actionIds.length === 0) {
      return undefined;
    }
    return getActionById(actionIds[0]);
  }, [actionIds]);

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

  /**
   * Handles action confirmation.
   * Advances to the next screen in the demo flow.
   * @param {string} _actionId - The confirmed action ID
   */
  const handleConfirm = useCallback(
    (_actionId) => {
      advanceScreen();
    },
    [advanceScreen],
  );

  /**
   * Handles action cancellation.
   * Advances to the next screen in the demo flow.
   */
  const handleCancel = useCallback(() => {
    advanceScreen();
  }, [advanceScreen]);

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

  if (!currentScreen || !primaryAction) {
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
            No action data available for this screen.
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

        {/* Query context */}
        {screenQuery && (
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
        )}

        {/* Action section header */}
        <div className="mb-4">
          <h3
            className="
              font-urbanist text-xs font-semibold uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Action Confirmation
          </h3>
        </div>

        {/* Action confirmation panel */}
        <ActionConfirmationPanel
          actionId={primaryAction.id}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          visible={true}
        />

        {/* Cross-domain propagation visualization */}
        {primaryAction.propagationEffects && primaryAction.propagationEffects.length > 0 && (
          <div className="mt-6">
            <CrossDomainPropagation
              affectedSystems={primaryAction.affectedSystems}
              propagationEffects={primaryAction.propagationEffects}
              visible={true}
            />
          </div>
        )}

        {/* Related intelligence clusters */}
        {highlightedClusterIds.length > 0 && (
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
            Review the action details, affected systems, and cross-domain propagation effects
            before confirming. Press the right arrow key to advance to the next screen.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default ActionScreen;