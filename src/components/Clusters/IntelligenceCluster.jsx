/**
 * Individual intelligence cluster card component.
 * Displays title, subtitle, metric value with trend indicator (up/down arrow + color),
 * source system badges, and detail text. Supports highlight state and expand-on-click behavior.
 * Styled with glassmorphism card, subtle shadow, and slide-in animation.
 * @module components/Clusters/IntelligenceCluster
 */

import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { SYSTEM_SOURCES } from '../../constants';

/**
 * Lookup map of system sources keyed by ID for badge display.
 * @type {Record<string, {id: string, name: string, description: string}>}
 */
const SYSTEM_BY_ID = SYSTEM_SOURCES.reduce((map, sys) => {
  map[sys.id] = sys;
  return map;
}, {});

/**
 * Renders a trend indicator arrow and label with appropriate color.
 * @param {Object} props
 * @param {'up' | 'down' | 'stable'} props.trend - Trend direction
 * @param {string} props.trendLabel - Human-readable trend description
 * @returns {JSX.Element} The trend indicator element
 */
function TrendIndicator({ trend, trendLabel }) {
  const trendConfig = {
    up: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
            clipRule="evenodd"
          />
        </svg>
      ),
      colorClass: 'text-green-600 dark:text-green-400',
      bgClass: 'bg-green-50 dark:bg-green-900/30',
    },
    down: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      colorClass: 'text-red-600 dark:text-red-400',
      bgClass: 'bg-red-50 dark:bg-red-900/30',
    },
    stable: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
            clipRule="evenodd"
          />
        </svg>
      ),
      colorClass: 'text-gray-500 dark:text-gray-400',
      bgClass: 'bg-gray-50 dark:bg-gray-800/30',
    },
  };

  const config = trendConfig[trend] || trendConfig.stable;

  return (
    <div className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 ${config.bgClass}`}>
      <span className={config.colorClass}>{config.icon}</span>
      <span className={`text-xs font-medium ${config.colorClass}`}>
        {trendLabel}
      </span>
    </div>
  );
}

TrendIndicator.propTypes = {
  trend: PropTypes.oneOf(['up', 'down', 'stable']).isRequired,
  trendLabel: PropTypes.string.isRequired,
};

/**
 * IntelligenceCluster renders a single intelligence cluster card.
 * Displays title, subtitle, metric value with trend indicator,
 * source system badges, and expandable detail text.
 *
 * @param {Object} props
 * @param {import('../../data/clusters').Cluster} props.cluster - The cluster data object
 * @param {boolean} [props.highlighted=false] - Whether the card is in highlighted state
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} The intelligence cluster card
 */
export function IntelligenceCluster({ cluster, highlighted = false, className }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsExpanded((prev) => !prev);
    }
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${cluster.title} — ${cluster.metricValue}`}
      onClick={handleToggleExpand}
      onKeyDown={handleKeyDown}
      className={`
        glass cursor-pointer select-none
        animate-slide-in
        transition-all duration-300 ease-out
        hover:shadow-uber-md
        ${highlighted
          ? 'ring-2 ring-blue-400/60 shadow-uber-md dark:ring-blue-500/50'
          : 'shadow-uber'
        }
        ${isExpanded ? 'shadow-uber-lg' : ''}
        ${className || ''}
      `}
    >
      <div className="p-4 sm:p-5">
        {/* Header: subtitle badge */}
        <div className="mb-2">
          <span
            className="
              inline-block rounded-full bg-blue-50 px-2.5 py-0.5
              text-[10px] font-semibold uppercase tracking-wider
              text-blue-600 dark:bg-blue-900/40 dark:text-blue-300
            "
          >
            {cluster.subtitle}
          </span>
        </div>

        {/* Title */}
        <h3
          className="
            font-urbanist text-base font-semibold leading-snug
            text-gray-900 dark:text-gray-100
            sm:text-lg
          "
        >
          {cluster.title}
        </h3>

        {/* Metric value */}
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className="
              font-urbanist text-2xl font-bold leading-tight
              text-gray-900 dark:text-gray-50
              sm:text-3xl
            "
          >
            {cluster.metricValue}
          </span>
        </div>

        {/* Trend indicator */}
        <div className="mt-2.5">
          <TrendIndicator trend={cluster.trend} trendLabel={cluster.trendLabel} />
        </div>

        {/* Source system badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cluster.sourceSystems.map((systemId) => {
            const system = SYSTEM_BY_ID[systemId];
            const displayName = system ? system.name : systemId;
            return (
              <span
                key={systemId}
                className="
                  inline-flex items-center rounded-full
                  bg-gray-100 px-2 py-0.5
                  text-[10px] font-medium text-gray-600
                  dark:bg-gray-700 dark:text-gray-300
                "
                title={system ? system.description : systemId}
              >
                {displayName}
              </span>
            );
          })}
        </div>

        {/* Expandable detail text */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-out
            ${isExpanded ? 'mt-3 max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
            <p
              className="
                font-urbanist text-sm leading-relaxed
                text-gray-600 dark:text-gray-400
              "
            >
              {cluster.detail}
            </p>
          </div>
        </div>

        {/* Expand hint */}
        <div className="mt-2 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`
              h-4 w-4 text-gray-400 transition-transform duration-300
              dark:text-gray-500
              ${isExpanded ? 'rotate-180' : 'rotate-0'}
            `}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

IntelligenceCluster.propTypes = {
  cluster: PropTypes.shape({
    id: PropTypes.string.isRequired,
    personaId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    metricValue: PropTypes.string.isRequired,
    trend: PropTypes.oneOf(['up', 'down', 'stable']).isRequired,
    trendLabel: PropTypes.string.isRequired,
    sourceSystems: PropTypes.arrayOf(PropTypes.string).isRequired,
    detail: PropTypes.string.isRequired,
  }).isRequired,
  highlighted: PropTypes.bool,
  className: PropTypes.string,
};

export default IntelligenceCluster;