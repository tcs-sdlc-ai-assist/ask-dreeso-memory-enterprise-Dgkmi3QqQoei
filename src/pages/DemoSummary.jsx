/**
 * Demo summary screen component (decorative).
 * Displays a session summary with: queries asked, actions taken, systems consulted,
 * personas visited, and a decorative session log. Shown at the end of the 20-screen
 * flow or on demand. Styled as a glassmorphism card with metrics grid.
 * @module pages/DemoSummary
 */

import { useCallback, useMemo } from 'react';

import { Layout } from '../components/Layout/Layout';
import { PersonaAvatar } from '../components/common/PersonaAvatar';
import { Badge } from '../components/common/Badge';
import { usePersona } from '../context/PersonaContext';
import { useDemoFlow } from '../context/DemoContext';
import { useSession } from '../context/SessionContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { PERSONAS } from '../data/personas';
import { QUERIES, SCREEN_FLOW } from '../data/queries';
import { ACTIONS } from '../data/actions';
import { SYSTEM_SOURCES } from '../constants';
import { formatTimestamp } from '../utils/formatters';
import { REFERENCE_DATE } from '../constants';

/**
 * Metric card component for the summary grid.
 * @param {Object} props
 * @param {string} props.label - Metric label
 * @param {string} props.value - Metric value
 * @param {string} props.description - Metric description
 * @param {React.ReactNode} props.icon - Metric icon element
 * @param {string} props.colorClass - Tailwind color class for the icon container
 * @param {number} props.index - Index for stagger animation
 * @returns {JSX.Element} A metric card element
 */
function MetricCard({ label, value, description, icon, colorClass, index }) {
  return (
    <div
      className="
        glass animate-slide-in
        flex flex-col items-center justify-center
        px-4 py-5 text-center
      "
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className={`
          flex h-10 w-10 items-center justify-center
          rounded-full ${colorClass}
        `}
      >
        {icon}
      </div>
      <span
        className="
          mt-3 font-urbanist text-2xl font-bold leading-tight
          text-gray-900 dark:text-gray-50
          sm:text-3xl
        "
      >
        {value}
      </span>
      <span
        className="
          mt-1 font-urbanist text-xs font-semibold uppercase tracking-wider
          text-gray-500 dark:text-gray-400
        "
      >
        {label}
      </span>
      <p
        className="
          mt-1.5 font-urbanist text-[10px] leading-relaxed
          text-gray-400 dark:text-gray-500
        "
      >
        {description}
      </p>
    </div>
  );
}

/**
 * Session log entry component.
 * @param {Object} props
 * @param {string} props.personaName - Name of the persona
 * @param {string} props.query - Query text
 * @param {string} props.timestamp - Formatted timestamp
 * @param {number} props.screenNumber - Screen number
 * @param {import('../data/personas').Persona} [props.persona] - Persona object for avatar
 * @param {number} props.index - Index for stagger animation
 * @returns {JSX.Element} A session log entry element
 */
function SessionLogEntry({ personaName, query, timestamp, screenNumber, persona, index }) {
  return (
    <div
      className="
        flex items-start gap-3 rounded-uber bg-gray-50
        px-3 py-2.5 dark:bg-gray-800/50
        animate-slide-in
      "
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {persona && (
        <div className="mt-0.5 flex-shrink-0">
          <PersonaAvatar persona={persona} size="xs" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="
              font-urbanist text-xs font-semibold
              text-gray-800 dark:text-gray-200
            "
          >
            {personaName}
          </span>
          <span
            className="
              rounded-full bg-gray-200 px-1.5 py-0.5
              text-[9px] font-medium text-gray-500
              dark:bg-gray-700 dark:text-gray-400
            "
          >
            Screen {screenNumber}
          </span>
        </div>
        <p
          className="
            mt-0.5 font-urbanist text-[11px] leading-relaxed
            text-gray-600 dark:text-gray-400
          "
        >
          {query}
        </p>
        <span
          className="
            mt-0.5 block font-urbanist text-[9px]
            text-gray-400 dark:text-gray-500
          "
        >
          {timestamp}
        </span>
      </div>
    </div>
  );
}

/**
 * Persona summary card for the personas visited section.
 * @param {Object} props
 * @param {import('../data/personas').Persona} props.persona - Persona object
 * @param {number} props.queryCount - Number of queries for this persona
 * @param {number} props.index - Index for stagger animation
 * @returns {JSX.Element} A persona summary card
 */
function PersonaSummaryCard({ persona, queryCount, index }) {
  return (
    <div
      className="
        flex items-center gap-3 rounded-uber-lg
        border border-gray-200 bg-white px-4 py-3
        dark:border-gray-700 dark:bg-gray-800
        animate-slide-in
      "
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <PersonaAvatar persona={persona} size="md" showRing />
      <div className="min-w-0 flex-1">
        <div
          className="
            font-urbanist text-sm font-semibold leading-tight
            text-gray-900 dark:text-gray-100
          "
        >
          {persona.name}
        </div>
        <div
          className="
            mt-0.5 font-urbanist text-xs leading-tight
            text-gray-500 dark:text-gray-400
          "
        >
          {persona.role}
        </div>
      </div>
      <Badge
        text={`${queryCount} queries`}
        variant="blue"
        size="sm"
        uppercase={false}
      />
    </div>
  );
}

/**
 * DemoSummary renders the demo session summary screen.
 * Displays metrics grid (queries asked, actions taken, systems consulted,
 * personas visited), a decorative session log, and persona summary cards.
 * Shown at the end of the 20-screen flow or on demand.
 *
 * @returns {JSX.Element} The demo summary screen
 */
export function DemoSummary() {
  const { persona, personaId } = usePersona();
  const { currentScreenIndex, restartDemo } = useDemoFlow();
  const { queryHistory } = useSession();

  useKeyboardNavigation();

  /**
   * Total number of queries in the demo flow.
   * @type {number}
   */
  const totalQueries = useMemo(() => QUERIES.length, []);

  /**
   * Total number of actions available in the demo.
   * @type {number}
   */
  const totalActions = useMemo(() => ACTIONS.length, []);

  /**
   * Total number of enterprise systems.
   * @type {number}
   */
  const totalSystems = useMemo(() => SYSTEM_SOURCES.length, []);

  /**
   * Total number of personas.
   * @type {number}
   */
  const totalPersonas = useMemo(() => PERSONAS.length, []);

  /**
   * Queries grouped by persona for the persona summary section.
   * @type {Array<{persona: import('../data/personas').Persona, queryCount: number}>}
   */
  const personaSummaries = useMemo(() => {
    return PERSONAS.map((p) => {
      const count = SCREEN_FLOW.filter((entry) => entry.personaId === p.id).length;
      return { persona: p, queryCount: count };
    });
  }, []);

  /**
   * Decorative session log entries derived from the screen flow.
   * @type {Array<{personaName: string, query: string, timestamp: string, screenNumber: number, persona: import('../data/personas').Persona|undefined}>}
   */
  const sessionLogEntries = useMemo(() => {
    const refDate = new Date(REFERENCE_DATE);

    return SCREEN_FLOW.map((entry, index) => {
      const matchedQuery = QUERIES.find((q) => q.id === entry.queryId);
      const matchedPersona = PERSONAS.find((p) => p.id === entry.personaId);

      // Generate a decorative timestamp offset from reference date
      const entryDate = new Date(refDate);
      entryDate.setMinutes(entryDate.getMinutes() - (SCREEN_FLOW.length - index) * 3);

      return {
        personaName: matchedPersona ? matchedPersona.name : entry.personaId,
        query: matchedQuery ? matchedQuery.query : entry.description,
        timestamp: formatTimestamp(entryDate, { includeTime: true }),
        screenNumber: entry.screen,
        persona: matchedPersona,
      };
    });
  }, []);

  /**
   * Unique systems consulted across all queries.
   * @type {string[]}
   */
  const uniqueSystemsConsulted = useMemo(() => {
    const systemSet = new Set();
    QUERIES.forEach((q) => {
      if (q.activeSystems) {
        q.activeSystems.forEach((s) => systemSet.add(s));
      }
    });
    return Array.from(systemSet);
  }, []);

  /**
   * Formatted reference date for display.
   * @type {string}
   */
  const formattedDate = useMemo(
    () => formatTimestamp(REFERENCE_DATE, { includeTime: false }),
    [],
  );

  /**
   * Handles restart demo button click.
   */
  const handleRestart = useCallback(() => {
    restartDemo();
  }, [restartDemo]);

  return (
    <Layout showQueryBar={false}>
      <div className="animate-expand">
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className="
              mx-auto flex h-14 w-14 items-center justify-center
              rounded-full bg-gradient-blue
              animate-fade-in
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-7 w-7 text-white"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2
            className="
              mt-4 font-urbanist text-2xl font-bold leading-tight
              text-gray-900 dark:text-gray-100
              sm:text-3xl
            "
          >
            Demo Session Complete
          </h2>
          <p
            className="
              mt-2 font-urbanist text-sm
              text-gray-500 dark:text-gray-400
            "
          >
            Ask Dreeso Memory — Session Summary · {formattedDate}
          </p>
        </div>

        {/* Metrics grid */}
        <div
          className="
            grid grid-cols-2 gap-4
            sm:grid-cols-4
          "
        >
          <MetricCard
            label="Queries Asked"
            value={String(totalQueries)}
            description="Across all personas and domains"
            colorClass="bg-blue-100 dark:bg-blue-900/40"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            }
            index={0}
          />
          <MetricCard
            label="Actions Available"
            value={String(totalActions)}
            description="Export, notify, schedule, approve"
            colorClass="bg-emerald-100 dark:bg-emerald-900/40"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            }
            index={1}
          />
          <MetricCard
            label="Systems Consulted"
            value={String(uniqueSystemsConsulted.length)}
            description={`Of ${totalSystems} integrated systems`}
            colorClass="bg-violet-100 dark:bg-violet-900/40"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 text-violet-600 dark:text-violet-400"
              >
                <path
                  fillRule="evenodd"
                  d="M1 6a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H4a3 3 0 01-3-3V6zm4 1.5a2 2 0 114 0 2 2 0 01-4 0zm2 3a4 4 0 00-3.665 2.395.75.75 0 00.416 1A8.98 8.98 0 007 14.5a8.98 8.98 0 003.249-.604.75.75 0 00.416-1.001A4.001 4.001 0 007 10.5zm5-3.75a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zm0 6.5a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zm.75-4a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z"
                  clipRule="evenodd"
                />
              </svg>
            }
            index={2}
          />
          <MetricCard
            label="Personas Visited"
            value={String(totalPersonas)}
            description="Project, QS, PM, Sales"
            colorClass="bg-orange-100 dark:bg-orange-900/40"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 text-orange-600 dark:text-orange-400"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            }
            index={3}
          />
        </div>

        {/* Systems consulted badges */}
        <div className="mt-6">
          <h3
            className="
              mb-3 font-urbanist text-xs font-semibold uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Enterprise Systems Consulted
          </h3>
          <div className="flex flex-wrap gap-2">
            {SYSTEM_SOURCES.map((system, index) => {
              const isConsulted = uniqueSystemsConsulted.includes(system.id);
              return (
                <div
                  key={system.id}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <Badge
                    text={system.name}
                    variant={isConsulted ? 'blue' : 'grey'}
                    size="md"
                    showDot={isConsulted}
                    uppercase={false}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Personas visited */}
        <div className="mt-8">
          <h3
            className="
              mb-3 font-urbanist text-xs font-semibold uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Personas Visited
          </h3>
          <div
            className="
              grid grid-cols-1 gap-3
              sm:grid-cols-2
            "
          >
            {personaSummaries.map((summary, index) => (
              <PersonaSummaryCard
                key={summary.persona.id}
                persona={summary.persona}
                queryCount={summary.queryCount}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Session log */}
        <div className="mt-8">
          <h3
            className="
              mb-3 font-urbanist text-xs font-semibold uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Session Log
          </h3>
          <div
            className="
              glass max-h-96 overflow-y-auto
              p-4
            "
          >
            <div className="space-y-2">
              {sessionLogEntries.map((entry, index) => (
                <SessionLogEntry
                  key={`log-${entry.screenNumber}`}
                  personaName={entry.personaName}
                  query={entry.query}
                  timestamp={entry.timestamp}
                  screenNumber={entry.screenNumber}
                  persona={entry.persona}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* User query history (if any) */}
        {queryHistory && queryHistory.length > 0 && (
          <div className="mt-8">
            <h3
              className="
                mb-3 font-urbanist text-xs font-semibold uppercase tracking-wider
                text-gray-500 dark:text-gray-400
              "
            >
              Your Query History ({queryHistory.length})
            </h3>
            <div
              className="
                glass max-h-48 overflow-y-auto
                p-4
              "
            >
              <div className="space-y-2">
                {queryHistory.slice(0, 20).map((entry, index) => {
                  const matchedPersona = PERSONAS.find((p) => p.id === entry.personaId);
                  return (
                    <div
                      key={`history-${index}`}
                      className="
                        flex items-start gap-3 rounded-uber bg-gray-50
                        px-3 py-2 dark:bg-gray-800/50
                        animate-slide-in
                      "
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      {matchedPersona && (
                        <div className="mt-0.5 flex-shrink-0">
                          <PersonaAvatar persona={matchedPersona} size="xs" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            font-urbanist text-[11px] leading-relaxed
                            text-gray-700 dark:text-gray-300
                          "
                        >
                          {entry.query}
                        </p>
                        <span
                          className="
                            mt-0.5 block font-urbanist text-[9px]
                            text-gray-400 dark:text-gray-500
                          "
                        >
                          {formatTimestamp(entry.timestamp, { includeTime: true })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Restart button */}
        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={handleRestart}
            className="
              flex items-center gap-2 rounded-uber-lg
              bg-blue-600 px-6 py-3
              font-urbanist text-sm font-semibold text-white
              transition-all duration-200
              hover:bg-blue-700 active:scale-95
              dark:bg-blue-500 dark:hover:bg-blue-600
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
                d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-9.624-2.848a.75.75 0 00-1.06 0 7 7 0 0011.712 3.138.75.75 0 00-1.449-.39 5.5 5.5 0 01-9.201-2.466l-.001-.003.312.311h-2.433a.75.75 0 010-1.5h3.634a.75.75 0 01.75.75v3.634a.75.75 0 01-1.5 0v-2.033l-.312.311a.75.75 0 01-1.06 0z"
                clipRule="evenodd"
              />
            </svg>
            Restart Demo
          </button>
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
            This is a decorative demo summary. All data shown is mocked for demonstration purposes.
            Click &quot;Restart Demo&quot; to begin a new session or use keyboard shortcut R.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default DemoSummary;