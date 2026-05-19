/**
 * Query response display component.
 * Renders the structured mock response for a submitted query: answer text
 * with source citations (inline badges), metric highlights, and the CTA
 * bubbles section. Includes fade-in animation and source attribution footer.
 * @module components/QueryResponse/QueryResponse
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { CTABubbles } from '../CTABubbles/CTABubbles';
import { SYSTEM_SOURCES } from '../../constants';
import { formatDate } from '../../utils/formatters';

/**
 * Lookup map of system sources keyed by ID.
 * @type {Record<string, {id: string, name: string, description: string}>}
 */
const SYSTEM_BY_ID = SYSTEM_SOURCES.reduce((map, sys) => {
  map[sys.id] = sys;
  return map;
}, {});

/**
 * Renders a single source citation badge.
 * @param {Object} props
 * @param {import('../../data/queries').SourceCitation} props.citation - The citation data
 * @param {number} props.index - Index for stagger animation
 * @returns {JSX.Element} A citation badge element
 */
function CitationBadge({ citation, index }) {
  const system = SYSTEM_BY_ID[citation.systemId];
  const systemName = system ? system.name : citation.systemId;
  const relativeDate = formatDate(citation.date);

  return (
    <div
      className="
        inline-flex items-center gap-2 rounded-uber
        border border-gray-200 bg-gray-50
        px-3 py-2 transition-all duration-200
        hover:border-blue-300 hover:bg-blue-50
        dark:border-gray-700 dark:bg-gray-800/50
        dark:hover:border-blue-600 dark:hover:bg-blue-900/20
        animate-slide-in
      "
      style={{ animationDelay: `${index * 80}ms` }}
      title={`${citation.label} — ${citation.reference}`}
    >
      <div
        className="
          flex h-6 w-6 flex-shrink-0 items-center justify-center
          rounded-full bg-blue-100 dark:bg-blue-900/40
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400"
        >
          <path
            fillRule="evenodd"
            d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className="
              font-urbanist text-xs font-semibold
              text-gray-800 dark:text-gray-200
            "
          >
            {systemName}
          </span>
          <span
            className="
              rounded-full bg-gray-200 px-1.5 py-0.5
              text-[9px] font-medium uppercase text-gray-500
              dark:bg-gray-700 dark:text-gray-400
            "
          >
            {citation.reference}
          </span>
        </div>
        <p
          className="
            mt-0.5 font-urbanist text-[10px] leading-tight
            text-gray-500 dark:text-gray-400
          "
        >
          {citation.label} · {relativeDate}
        </p>
      </div>
    </div>
  );
}

CitationBadge.propTypes = {
  citation: PropTypes.shape({
    systemId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    reference: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * Renders an inline system badge within the answer text.
 * @param {Object} props
 * @param {string} props.systemId - The system identifier
 * @returns {JSX.Element} An inline system badge
 */
function InlineSystemBadge({ systemId }) {
  const system = SYSTEM_BY_ID[systemId];
  const systemName = system ? system.name : systemId;

  return (
    <span
      className="
        inline-flex items-center gap-1 rounded-full
        bg-blue-50 px-2 py-0.5
        text-[10px] font-semibold text-blue-600
        dark:bg-blue-900/30 dark:text-blue-400
      "
    >
      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
      {systemName}
    </span>
  );
}

InlineSystemBadge.propTypes = {
  systemId: PropTypes.string.isRequired,
};

/**
 * Renders an action trigger button.
 * @param {Object} props
 * @param {import('../../data/queries').ActionTrigger} props.action - The action trigger data
 * @param {(action: import('../../data/queries').ActionTrigger) => void} [props.onActionClick] - Callback when action is clicked
 * @param {number} props.index - Index for stagger animation
 * @returns {JSX.Element} An action button element
 */
function ActionButton({ action, onActionClick, index }) {
  const typeConfig = {
    navigate: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
        </svg>
      ),
      className: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    },
    export: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
      ),
      className: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600',
    },
    notify: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
        </svg>
      ),
      className: 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600',
    },
    schedule: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
        </svg>
      ),
      className: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
    },
    approve: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
      ),
      className: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
    },
  };

  const config = typeConfig[action.type] || typeConfig.navigate;

  return (
    <button
      type="button"
      onClick={() => onActionClick && onActionClick(action)}
      className={`
        inline-flex items-center gap-2 rounded-uber-lg
        px-4 py-2 font-urbanist text-sm font-semibold text-white
        transition-all duration-200 active:scale-95
        animate-slide-in
        ${config.className}
      `}
      style={{ animationDelay: `${index * 80}ms` }}
      aria-label={action.label}
    >
      {config.icon}
      <span>{action.label}</span>
    </button>
  );
}

ActionButton.propTypes = {
  action: PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
  onActionClick: PropTypes.func,
  index: PropTypes.number.isRequired,
};

/**
 * QueryResponse renders the structured mock response for a submitted query.
 * Displays the answer text with inline system badges, source citations,
 * optional action triggers, and CTA follow-up bubbles.
 * Includes fade-in animation and source attribution footer.
 *
 * @param {Object} props
 * @param {import('../../data/queries').QueryResponse} props.response - The query response data
 * @param {(query: string) => void} [props.onBubbleClick] - Callback when a CTA bubble is clicked
 * @param {(action: import('../../data/queries').ActionTrigger) => void} [props.onActionClick] - Callback when an action button is clicked
 * @param {boolean} [props.visible=true] - Whether the component is visible
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null} The query response display, or null if not visible or no response
 */
export function QueryResponse({ response, onBubbleClick, onActionClick, visible = true, className }) {
  /**
   * Active system IDs for inline badge display.
   * @type {string[]}
   */
  const activeSystems = useMemo(() => {
    if (!response || !response.activeSystems) {
      return [];
    }
    return response.activeSystems;
  }, [response]);

  /**
   * Determine if the response has action triggers.
   * @type {boolean}
   */
  const hasActions = useMemo(() => {
    return response && response.actions && response.actions.length > 0;
  }, [response]);

  if (!visible || !response) {
    return null;
  }

  return (
    <div
      className={`animate-expand ${className || ''}`}
      role="article"
      aria-label={`Response to: ${response.query}`}
    >
      {/* Query echo */}
      <div className="mb-4">
        <div
          className="
            inline-flex items-center gap-2 rounded-uber
            bg-gray-100 px-3 py-2
            dark:bg-gray-800
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
            {response.query}
          </span>
        </div>
      </div>

      {/* Answer text */}
      <div className="glass p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div
            className="
              mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center
              rounded-full bg-blue-100 dark:bg-blue-900/40
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-blue-600 dark:text-blue-400"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="
                font-urbanist text-sm leading-relaxed
                text-gray-800 dark:text-gray-200
                sm:text-base
              "
            >
              {response.answer}
            </p>

            {/* Inline active system badges */}
            {activeSystems.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span
                  className="
                    text-[10px] font-medium uppercase tracking-wider
                    text-gray-400 dark:text-gray-500
                  "
                >
                  Sources:
                </span>
                {activeSystems.map((systemId) => (
                  <InlineSystemBadge key={systemId} systemId={systemId} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Source citations */}
      {response.citations && response.citations.length > 0 && (
        <div className="mt-4">
          <h4
            className="
              mb-2 font-urbanist text-xs font-semibold uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Source Citations
          </h4>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {response.citations.map((citation, index) => (
              <CitationBadge
                key={`${citation.systemId}-${citation.reference}`}
                citation={citation}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action triggers */}
      {hasActions && (
        <div className="mt-4">
          <h4
            className="
              mb-2 font-urbanist text-xs font-semibold uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Available Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            {response.actions.map((action, index) => (
              <ActionButton
                key={`${action.type}-${action.target}`}
                action={action}
                onActionClick={onActionClick}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA follow-up bubbles */}
      {response.ctaBubbles && response.ctaBubbles.length > 0 && (
        <div className="mt-5">
          <h4
            className="
              mb-2 font-urbanist text-xs font-semibold uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Follow-up Questions
          </h4>
          <CTABubbles
            bubbles={response.ctaBubbles}
            onBubbleClick={onBubbleClick || (() => {})}
          />
        </div>
      )}

      {/* Source attribution footer */}
      <div
        className="
          mt-5 flex items-center gap-2 rounded-uber
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
          Response generated from {response.citations ? response.citations.length : 0}{' '}
          {response.citations && response.citations.length === 1 ? 'source' : 'sources'} across{' '}
          {activeSystems.length} {activeSystems.length === 1 ? 'system' : 'systems'}. Data reflects
          the latest available records.
        </p>
      </div>
    </div>
  );
}

QueryResponse.propTypes = {
  response: PropTypes.shape({
    id: PropTypes.string.isRequired,
    personaId: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    citations: PropTypes.arrayOf(
      PropTypes.shape({
        systemId: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        reference: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    activeSystems: PropTypes.arrayOf(PropTypes.string).isRequired,
    ctaBubbles: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        target: PropTypes.string.isRequired,
      }),
    ),
    relatedClusterIds: PropTypes.arrayOf(PropTypes.string),
  }),
  onBubbleClick: PropTypes.func,
  onActionClick: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
};

export default QueryResponse;