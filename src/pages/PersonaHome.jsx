/**
 * Persona home screen component.
 * Displays the current persona's greeting, six intelligence cluster cards
 * via IntelligenceClusters, and contextual welcome message.
 * This is the landing screen after login for each persona.
 * Wrapped in Layout component.
 * @module pages/PersonaHome
 */

import { useMemo } from 'react';

import { Layout } from '../components/Layout/Layout';
import { IntelligenceClusters } from '../components/Clusters/IntelligenceClusters';
import { PersonaAvatar } from '../components/common/PersonaAvatar';
import { usePersona } from '../context/PersonaContext';
import { useDemoFlow } from '../context/DemoContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { REFERENCE_DATE } from '../constants';
import { formatTimestamp } from '../utils/formatters';

/**
 * Generates a persona-specific welcome message based on their role.
 * @param {import('../data/personas').Persona} persona - The active persona
 * @returns {string} A contextual welcome message
 */
const getWelcomeMessage = (persona) => {
  if (!persona) {
    return 'Welcome to Ask Dreeso Memory.';
  }

  const messages = {
    'lukas-muller':
      'Your project intelligence dashboard is ready. Review budget health, schedule status, active risks, and workforce allocation across all integrated systems.',
    'elena-rossi':
      'Your procurement and cost intelligence is up to date. Monitor cost-to-complete forecasts, supply-chain risks, vendor compliance, and subcontract valuations.',
    'sophie-dubois':
      'Your sustainability intelligence dashboard is current. Track ESG milestones, environmental risks, BREEAM credit status, and low-carbon material usage.',
    'james-carter':
      'Your commercial intelligence is refreshed. Review revenue performance, leasing progress, deal risk assessments, and sales pipeline metrics.',
  };

  return messages[persona.id] || `Welcome back, ${persona.name}. Your intelligence clusters are ready for review.`;
};

/**
 * Generates a time-of-day greeting.
 * @returns {string} A greeting string based on the reference date time
 */
const getGreeting = () => {
  const ref = new Date(REFERENCE_DATE);
  const hour = ref.getHours();

  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
};

/**
 * PersonaHome renders the persona-specific home screen with a greeting,
 * contextual welcome message, and six intelligence cluster cards.
 * This is the landing screen after login for each persona.
 *
 * @returns {JSX.Element} The persona home screen
 */
export function PersonaHome() {
  const { persona, personaId } = usePersona();
  const { currentScreen } = useDemoFlow();

  useKeyboardNavigation();

  const greeting = useMemo(() => getGreeting(), []);

  const welcomeMessage = useMemo(
    () => getWelcomeMessage(persona),
    [persona],
  );

  const formattedDate = useMemo(
    () => formatTimestamp(REFERENCE_DATE, { includeTime: false }),
    [],
  );

  const highlightedClusterIds = useMemo(() => {
    if (currentScreen && currentScreen.relatedClusterIds) {
      return currentScreen.relatedClusterIds;
    }
    return [];
  }, [currentScreen]);

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

  return (
    <Layout>
      <div className="animate-expand">
        {/* Greeting section */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <PersonaAvatar persona={persona} size="xl" showRing />
            <div className="min-w-0 flex-1">
              <h2
                className="
                  font-urbanist text-2xl font-bold leading-tight
                  text-gray-900 dark:text-gray-100
                  sm:text-3xl
                "
              >
                {greeting}, {persona.name.split(' ')[0]}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
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
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Welcome message */}
          <div
            className="
              mt-5 rounded-uber border border-blue-200 bg-blue-50
              px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20
            "
          >
            <div className="flex items-start gap-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500 dark:text-blue-400"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p
                className="
                  font-urbanist text-sm leading-relaxed
                  text-blue-700 dark:text-blue-300
                "
              >
                {welcomeMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Intelligence clusters section */}
        <div>
          <h3
            className="
              mb-4 font-urbanist text-xs font-semibold uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Intelligence Clusters
          </h3>
          <IntelligenceClusters
            personaId={personaId}
            highlightedClusterIds={highlightedClusterIds}
          />
        </div>

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
            Intelligence clusters are updated in real-time from integrated enterprise systems.
            Use the query bar below to ask questions or click a cluster card for details.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default PersonaHome;