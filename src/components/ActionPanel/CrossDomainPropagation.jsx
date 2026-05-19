/**
 * Cross-domain propagation visualization component.
 * Shows a visual flow of how an action propagates across enterprise systems
 * (e.g., SAP → Salesforce → Workday). Renders connected system nodes with
 * animated connection lines and status updates.
 * Used within ActionConfirmationPanel for relevant actions.
 * @module components/ActionPanel/CrossDomainPropagation
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { SYSTEM_SOURCES } from '../../constants';
import { PERSONA_BY_ID } from '../../data/personas';

/**
 * Lookup map of system sources keyed by ID.
 * @type {Record<string, {id: string, name: string, description: string}>}
 */
const SYSTEM_BY_ID = SYSTEM_SOURCES.reduce((map, sys) => {
  map[sys.id] = sys;
  return map;
}, {});

/**
 * Timing color configuration for propagation effects.
 * @param {'immediate' | 'deferred' | 'scheduled'} timing
 * @returns {{ dotClass: string, lineClass: string, bgClass: string, textClass: string, label: string }}
 */
const getTimingConfig = (timing) => {
  const configs = {
    immediate: {
      dotClass: 'bg-red-500',
      lineClass: 'bg-red-300 dark:bg-red-700',
      bgClass: 'bg-red-50 dark:bg-red-900/20',
      textClass: 'text-red-600 dark:text-red-400',
      badgeClass: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      label: 'Immediate',
    },
    deferred: {
      dotClass: 'bg-amber-500',
      lineClass: 'bg-amber-300 dark:bg-amber-700',
      bgClass: 'bg-amber-50 dark:bg-amber-900/20',
      textClass: 'text-amber-600 dark:text-amber-400',
      badgeClass: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      label: 'Deferred',
    },
    scheduled: {
      dotClass: 'bg-blue-500',
      lineClass: 'bg-blue-300 dark:bg-blue-700',
      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
      textClass: 'text-blue-600 dark:text-blue-400',
      badgeClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      label: 'Scheduled',
    },
  };

  return configs[timing] || configs.deferred;
};

/**
 * Renders a single system node in the propagation flow.
 * @param {Object} props
 * @param {string} props.systemId - The system identifier
 * @param {string} props.systemName - Display name of the system
 * @param {boolean} props.isSource - Whether this is the source system
 * @param {boolean} props.isTarget - Whether this is a target system
 * @param {number} props.index - Index for stagger animation
 * @returns {JSX.Element} A system node element
 */
function SystemNode({ systemId, systemName, isSource, isTarget, index }) {
  return (
    <div
      className="
        flex flex-col items-center gap-1.5
        animate-slide-in
      "
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div
        className={`
          flex h-10 w-10 items-center justify-center
          rounded-full border-2 transition-all duration-300
          ${
            isSource
              ? 'border-blue-400 bg-blue-100 dark:border-blue-500 dark:bg-blue-900/40'
              : isTarget
                ? 'border-violet-400 bg-violet-100 dark:border-violet-500 dark:bg-violet-900/40'
                : 'border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800'
          }
        `}
      >
        {isSource ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 text-blue-600 dark:text-blue-400"
          >
            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`
              h-4 w-4
              ${isTarget
                ? 'text-violet-600 dark:text-violet-400'
                : 'text-gray-500 dark:text-gray-400'
              }
            `}
          >
            <path
              fillRule="evenodd"
              d="M1 6a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H4a3 3 0 01-3-3V6zm4 1.5a2 2 0 114 0 2 2 0 01-4 0zm2 3a4 4 0 00-3.665 2.395.75.75 0 00.416 1A8.98 8.98 0 007 14.5a8.98 8.98 0 003.249-.604.75.75 0 00.416-1.001A4.001 4.001 0 007 10.5zm5-3.75a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zm0 6.5a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zm.75-4a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span
        className="
          max-w-[72px] truncate text-center
          font-urbanist text-[10px] font-medium leading-tight
          text-gray-600 dark:text-gray-400
        "
        title={systemName}
      >
        {systemName}
      </span>
    </div>
  );
}

SystemNode.propTypes = {
  systemId: PropTypes.string.isRequired,
  systemName: PropTypes.string.isRequired,
  isSource: PropTypes.bool.isRequired,
  isTarget: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * Renders an animated connection line between system nodes.
 * @param {Object} props
 * @param {'immediate' | 'deferred' | 'scheduled'} props.timing - The timing of the propagation
 * @param {number} props.index - Index for stagger animation
 * @returns {JSX.Element} A connection line element
 */
function ConnectionLine({ timing, index }) {
  const config = getTimingConfig(timing);

  return (
    <div
      className="
        flex flex-col items-center justify-center
        self-center
        animate-slide-in
      "
      style={{ animationDelay: `${index * 120 + 60}ms` }}
    >
      <div className="flex items-center gap-0.5">
        <div className={`h-0.5 w-3 rounded-full ${config.lineClass}`} />
        <div className={`h-1.5 w-1.5 animate-pulse rounded-full ${config.dotClass}`} />
        <div className={`h-0.5 w-3 rounded-full ${config.lineClass}`} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-3 w-3 ${config.textClass}`}
        >
          <path
            fillRule="evenodd"
            d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

ConnectionLine.propTypes = {
  timing: PropTypes.oneOf(['immediate', 'deferred', 'scheduled']).isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * Renders a single propagation effect card with domain, description,
 * target persona, and timing badge.
 * @param {Object} props
 * @param {Object} props.effect - The propagation effect data
 * @param {string} props.effect.domain - The cross-domain area affected
 * @param {string} props.effect.description - Description of the propagation effect
 * @param {string} props.effect.targetPersonaId - Persona ID who will be notified or affected
 * @param {'immediate' | 'deferred' | 'scheduled'} props.effect.timing - When the effect takes place
 * @param {number} props.index - Index for stagger animation
 * @returns {JSX.Element} A propagation effect card
 */
function PropagationEffectCard({ effect, index }) {
  const config = getTimingConfig(effect.timing);
  const targetPersona = PERSONA_BY_ID[effect.targetPersonaId];

  return (
    <div
      className={`
        rounded-uber px-3 py-2.5
        animate-slide-in
        ${config.bgClass}
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex-shrink-0">
          <div className={`h-2 w-2 rounded-full ${config.dotClass}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`
                font-urbanist text-xs font-semibold
                ${config.textClass}
              `}
            >
              {effect.domain}
            </span>
            <span
              className={`
                inline-flex rounded-full px-2 py-0.5
                text-[10px] font-semibold uppercase tracking-wider
                ${config.badgeClass}
              `}
            >
              {config.label}
            </span>
          </div>
          <p
            className="
              mt-1 font-urbanist text-xs leading-relaxed
              text-gray-600 dark:text-gray-400
            "
          >
            {effect.description}
          </p>
          {targetPersona && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <div
                className={`
                  flex h-5 w-5 items-center justify-center
                  rounded-full text-[8px] font-bold
                  ${targetPersona.colorTheme.bg} ${targetPersona.colorTheme.text}
                `}
              >
                {targetPersona.initials}
              </div>
              <span
                className="
                  text-[10px] font-medium text-gray-500
                  dark:text-gray-400
                "
              >
                {targetPersona.name} — {targetPersona.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

PropagationEffectCard.propTypes = {
  effect: PropTypes.shape({
    domain: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    targetPersonaId: PropTypes.string.isRequired,
    timing: PropTypes.oneOf(['immediate', 'deferred', 'scheduled']).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * CrossDomainPropagation renders a visual flow of how an action propagates
 * across enterprise systems. Shows connected system nodes with animated
 * connection lines, propagation effect cards with timing badges, and
 * target persona indicators.
 *
 * @param {Object} props
 * @param {import('../../data/actions').AffectedSystem[]} props.affectedSystems - Systems affected by the action
 * @param {import('../../data/actions').PropagationEffect[]} props.propagationEffects - Cross-domain propagation effects
 * @param {boolean} [props.visible=true] - Whether the component is visible
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null} The cross-domain propagation visualization, or null if not visible or no data
 */
export function CrossDomainPropagation({ affectedSystems, propagationEffects, visible = true, className }) {
  /**
   * Build the list of unique system nodes to display in the flow.
   * Source systems come from affectedSystems, target systems are inferred
   * from propagation effect domains.
   */
  const flowNodes = useMemo(() => {
    if (!affectedSystems || affectedSystems.length === 0) {
      return [];
    }

    const sourceNodes = affectedSystems.map((sys) => ({
      systemId: sys.systemId,
      systemName: sys.name || (SYSTEM_BY_ID[sys.systemId] ? SYSTEM_BY_ID[sys.systemId].name : sys.systemId),
      isSource: true,
      isTarget: false,
    }));

    // Deduplicate by systemId
    const seen = new Set(sourceNodes.map((n) => n.systemId));
    const allNodes = [...sourceNodes];

    // Add target systems from propagation effects if they reference known systems
    if (propagationEffects && propagationEffects.length > 0) {
      for (const effect of propagationEffects) {
        // Try to find a system that matches the domain name
        const matchingSystem = SYSTEM_SOURCES.find(
          (sys) =>
            sys.name.toLowerCase().includes(effect.domain.toLowerCase()) ||
            effect.domain.toLowerCase().includes(sys.name.toLowerCase()),
        );

        if (matchingSystem && !seen.has(matchingSystem.id)) {
          seen.add(matchingSystem.id);
          allNodes.push({
            systemId: matchingSystem.id,
            systemName: matchingSystem.name,
            isSource: false,
            isTarget: true,
          });
        }
      }
    }

    return allNodes;
  }, [affectedSystems, propagationEffects]);

  /**
   * Determine the primary timing for the connection lines.
   */
  const primaryTiming = useMemo(() => {
    if (!propagationEffects || propagationEffects.length === 0) {
      return 'deferred';
    }

    // Use the most urgent timing
    const hasImmediate = propagationEffects.some((e) => e.timing === 'immediate');
    if (hasImmediate) {
      return 'immediate';
    }

    const hasDeferred = propagationEffects.some((e) => e.timing === 'deferred');
    if (hasDeferred) {
      return 'deferred';
    }

    return 'scheduled';
  }, [propagationEffects]);

  if (!visible) {
    return null;
  }

  if ((!affectedSystems || affectedSystems.length === 0) && (!propagationEffects || propagationEffects.length === 0)) {
    return null;
  }

  return (
    <div
      className={`animate-expand ${className || ''}`}
      role="region"
      aria-label="Cross-domain propagation flow"
    >
      {/* Section header */}
      <h4
        className="
          font-urbanist text-xs font-semibold uppercase tracking-wider
          text-gray-500 dark:text-gray-400
        "
      >
        Cross-Domain Propagation Flow
      </h4>

      {/* System node flow visualization */}
      {flowNodes.length > 0 && (
        <div
          className="
            mt-3 flex flex-wrap items-center justify-center gap-1
            rounded-uber bg-gray-50 px-4 py-4
            dark:bg-gray-800/30
          "
        >
          {flowNodes.map((node, index) => (
            <div key={node.systemId} className="flex items-center">
              {index > 0 && (
                <ConnectionLine
                  timing={primaryTiming}
                  index={index}
                />
              )}
              <SystemNode
                systemId={node.systemId}
                systemName={node.systemName}
                isSource={node.isSource}
                isTarget={node.isTarget}
                index={index}
              />
            </div>
          ))}
        </div>
      )}

      {/* Propagation effect cards */}
      {propagationEffects && propagationEffects.length > 0 && (
        <div className="mt-3 space-y-2">
          {propagationEffects.map((effect, index) => (
            <PropagationEffectCard
              key={`propagation-${effect.domain}-${index}`}
              effect={effect}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Summary footer */}
      {propagationEffects && propagationEffects.length > 0 && (
        <div
          className="
            mt-3 flex items-center gap-2 rounded-uber
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
            {propagationEffects.length} cross-domain {propagationEffects.length === 1 ? 'effect' : 'effects'} will propagate across {flowNodes.filter((n) => n.isSource).length} source {flowNodes.filter((n) => n.isSource).length === 1 ? 'system' : 'systems'}
          </p>
        </div>
      )}
    </div>
  );
}

CrossDomainPropagation.propTypes = {
  affectedSystems: PropTypes.arrayOf(
    PropTypes.shape({
      systemId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      impact: PropTypes.string.isRequired,
      accessType: PropTypes.oneOf(['read', 'write', 'notify']).isRequired,
    }),
  ),
  propagationEffects: PropTypes.arrayOf(
    PropTypes.shape({
      domain: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      targetPersonaId: PropTypes.string.isRequired,
      timing: PropTypes.oneOf(['immediate', 'deferred', 'scheduled']).isRequired,
    }),
  ),
  visible: PropTypes.bool,
  className: PropTypes.string,
};

export default CrossDomainPropagation;