/**
 * Action confirmation panel component.
 * Displays a structured confirmation card when a user confirms an action:
 * action title, description, list of affected systems with status icons,
 * expected outcomes, and cross-domain propagation effects.
 * Includes confirm/cancel buttons (mocked).
 * Styled as a prominent glassmorphism card with semantic color coding.
 * @module components/ActionPanel/ActionConfirmationPanel
 */

import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { getActionById } from '../../data/actions';
import { PERSONA_BY_ID } from '../../data/personas';

/**
 * Status badge component for action status display.
 * @param {Object} props
 * @param {string} props.status - The action status
 * @returns {JSX.Element} A styled status badge
 */
function StatusBadge({ status }) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/30',
      textClass: 'text-yellow-700 dark:text-yellow-300',
      dotClass: 'bg-yellow-500',
    },
    'in-progress': {
      label: 'In Progress',
      bgClass: 'bg-blue-50 dark:bg-blue-900/30',
      textClass: 'text-blue-700 dark:text-blue-300',
      dotClass: 'bg-blue-500',
    },
    completed: {
      label: 'Completed',
      bgClass: 'bg-green-50 dark:bg-green-900/30',
      textClass: 'text-green-700 dark:text-green-300',
      dotClass: 'bg-green-500',
    },
    failed: {
      label: 'Failed',
      bgClass: 'bg-red-50 dark:bg-red-900/30',
      textClass: 'text-red-700 dark:text-red-300',
      dotClass: 'bg-red-500',
    },
    cancelled: {
      label: 'Cancelled',
      bgClass: 'bg-gray-50 dark:bg-gray-800/30',
      textClass: 'text-gray-600 dark:text-gray-400',
      dotClass: 'bg-gray-400',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
        text-[10px] font-semibold uppercase tracking-wider
        ${config.bgClass} ${config.textClass}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['pending', 'in-progress', 'completed', 'failed', 'cancelled']).isRequired,
};

/**
 * Access type icon for affected systems.
 * @param {Object} props
 * @param {'read' | 'write' | 'notify'} props.accessType - The type of system interaction
 * @returns {JSX.Element} An icon representing the access type
 */
function AccessTypeIcon({ accessType }) {
  if (accessType === 'read') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 text-blue-500 dark:text-blue-400"
      >
        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        <path
          fillRule="evenodd"
          d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (accessType === 'write') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 text-orange-500 dark:text-orange-400"
      >
        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
      </svg>
    );
  }

  // notify
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-violet-500 dark:text-violet-400"
    >
      <path
        fillRule="evenodd"
        d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

AccessTypeIcon.propTypes = {
  accessType: PropTypes.oneOf(['read', 'write', 'notify']).isRequired,
};

/**
 * Timing badge for propagation effects.
 * @param {Object} props
 * @param {'immediate' | 'deferred' | 'scheduled'} props.timing - The timing of the effect
 * @returns {JSX.Element} A styled timing badge
 */
function TimingBadge({ timing }) {
  const timingConfig = {
    immediate: {
      label: 'Immediate',
      className: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    },
    deferred: {
      label: 'Deferred',
      className: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
    scheduled: {
      label: 'Scheduled',
      className: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
  };

  const config = timingConfig[timing] || timingConfig.deferred;

  return (
    <span
      className={`
        inline-flex rounded-full px-2 py-0.5
        text-[10px] font-semibold uppercase tracking-wider
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}

TimingBadge.propTypes = {
  timing: PropTypes.oneOf(['immediate', 'deferred', 'scheduled']).isRequired,
};

/**
 * ActionConfirmationPanel renders a structured confirmation card for an action.
 * Displays action title, description, affected systems with status icons,
 * expected outcomes, cross-domain propagation effects, and confirm/cancel buttons.
 *
 * @param {Object} props
 * @param {string} props.actionId - The action ID to display confirmation for
 * @param {(actionId: string) => void} [props.onConfirm] - Callback when the confirm button is clicked
 * @param {() => void} [props.onCancel] - Callback when the cancel button is clicked
 * @param {boolean} [props.visible=true] - Whether the panel is visible
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null} The action confirmation panel, or null if not visible or action not found
 */
export function ActionConfirmationPanel({ actionId, onConfirm, onCancel, visible = true, className }) {
  const [actionStatus, setActionStatus] = useState('pending');
  const [isConfirming, setIsConfirming] = useState(false);

  const action = useMemo(() => {
    if (!actionId) {
      return null;
    }
    return getActionById(actionId);
  }, [actionId]);

  const handleConfirm = useCallback(() => {
    if (isConfirming || actionStatus === 'completed') {
      return;
    }

    setIsConfirming(true);
    setActionStatus('in-progress');

    // Simulate action execution with a delay
    setTimeout(() => {
      setActionStatus('completed');
      setIsConfirming(false);

      if (onConfirm) {
        onConfirm(actionId);
      }
    }, 2000);
  }, [actionId, isConfirming, actionStatus, onConfirm]);

  const handleCancel = useCallback(() => {
    if (isConfirming) {
      return;
    }

    setActionStatus('cancelled');

    if (onCancel) {
      onCancel();
    }
  }, [isConfirming, onCancel]);

  if (!visible || !action) {
    return null;
  }

  const actionTypeConfig = {
    navigate: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
        </svg>
      ),
      colorClass: 'text-blue-600 dark:text-blue-400',
      bgClass: 'bg-blue-100 dark:bg-blue-900/40',
    },
    export: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
      ),
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-100 dark:bg-emerald-900/40',
    },
    notify: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
        </svg>
      ),
      colorClass: 'text-violet-600 dark:text-violet-400',
      bgClass: 'bg-violet-100 dark:bg-violet-900/40',
    },
    schedule: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
        </svg>
      ),
      colorClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-100 dark:bg-amber-900/40',
    },
    approve: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
      ),
      colorClass: 'text-green-600 dark:text-green-400',
      bgClass: 'bg-green-100 dark:bg-green-900/40',
    },
  };

  const typeConfig = actionTypeConfig[action.actionType] || actionTypeConfig.navigate;

  return (
    <div
      className={`
        glass animate-expand
        overflow-hidden
        ${className || ''}
      `}
      role="dialog"
      aria-label={`Action confirmation: ${action.label}`}
    >
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`
                flex h-10 w-10 flex-shrink-0 items-center justify-center
                rounded-full ${typeConfig.bgClass} ${typeConfig.colorClass}
              `}
            >
              {typeConfig.icon}
            </div>
            <div>
              <h3
                className="
                  font-urbanist text-lg font-semibold leading-snug
                  text-gray-900 dark:text-gray-100
                "
              >
                {action.label}
              </h3>
              <div className="mt-0.5 flex items-center gap-2">
                <span
                  className="
                    text-xs font-medium capitalize text-gray-500
                    dark:text-gray-400
                  "
                >
                  {action.actionType}
                </span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <StatusBadge status={actionStatus} />
              </div>
            </div>
          </div>

          {/* Estimated duration */}
          <div
            className="
              flex-shrink-0 rounded-full bg-gray-100 px-2.5 py-1
              text-[10px] font-medium text-gray-500
              dark:bg-gray-800 dark:text-gray-400
            "
          >
            Est. {action.estimatedDuration}
          </div>
        </div>

        {/* Description */}
        <p
          className="
            mt-4 font-urbanist text-sm leading-relaxed
            text-gray-600 dark:text-gray-400
          "
        >
          {action.description}
        </p>

        {/* Confirmation message */}
        <div
          className="
            mt-4 rounded-uber border border-blue-200 bg-blue-50
            px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20
          "
        >
          <div className="flex items-start gap-2">
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
                font-urbanist text-xs leading-relaxed
                text-blue-700 dark:text-blue-300
              "
            >
              {action.confirmationMessage}
            </p>
          </div>
        </div>

        {/* Affected Systems */}
        <div className="mt-5">
          <h4
            className="
              font-urbanist text-xs font-semibold uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Affected Systems
          </h4>
          <div className="mt-2 space-y-2">
            {action.affectedSystems.map((system) => (
              <div
                key={system.systemId}
                className="
                  flex items-start gap-3 rounded-uber bg-gray-50
                  px-3 py-2.5 dark:bg-gray-800/50
                "
              >
                <div className="mt-0.5 flex-shrink-0">
                  <AccessTypeIcon accessType={system.accessType} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        font-urbanist text-sm font-medium
                        text-gray-900 dark:text-gray-100
                      "
                    >
                      {system.name}
                    </span>
                    <span
                      className="
                        rounded-full bg-gray-200 px-1.5 py-0.5
                        text-[9px] font-medium uppercase text-gray-500
                        dark:bg-gray-700 dark:text-gray-400
                      "
                    >
                      {system.accessType}
                    </span>
                  </div>
                  <p
                    className="
                      mt-0.5 font-urbanist text-xs leading-relaxed
                      text-gray-500 dark:text-gray-400
                    "
                  >
                    {system.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Outcomes */}
        <div className="mt-5">
          <h4
            className="
              font-urbanist text-xs font-semibold uppercase tracking-wider
              text-gray-500 dark:text-gray-400
            "
          >
            Expected Outcomes
          </h4>
          <div className="mt-2 space-y-2">
            {action.expectedOutcomes.map((outcome, index) => (
              <div
                key={`outcome-${index}`}
                className="
                  flex items-start gap-3 rounded-uber bg-green-50
                  px-3 py-2.5 dark:bg-green-900/20
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="min-w-0 flex-1">
                  <p
                    className="
                      font-urbanist text-sm leading-relaxed
                      text-gray-800 dark:text-gray-200
                    "
                  >
                    {outcome.description}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="
                        text-[10px] font-semibold uppercase tracking-wider
                        text-gray-400 dark:text-gray-500
                      "
                    >
                      {outcome.metric}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span
                      className="
                        text-xs text-green-600 dark:text-green-400
                      "
                    >
                      {outcome.expectedChange}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Domain Propagation Effects */}
        {action.propagationEffects && action.propagationEffects.length > 0 && (
          <div className="mt-5">
            <h4
              className="
                font-urbanist text-xs font-semibold uppercase tracking-wider
                text-gray-500 dark:text-gray-400
              "
            >
              Cross-Domain Propagation
            </h4>
            <div className="mt-2 space-y-2">
              {action.propagationEffects.map((effect, index) => {
                const targetPersona = PERSONA_BY_ID[effect.targetPersonaId];
                return (
                  <div
                    key={`propagation-${index}`}
                    className="
                      flex items-start gap-3 rounded-uber bg-violet-50
                      px-3 py-2.5 dark:bg-violet-900/20
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-500 dark:text-violet-400"
                    >
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="
                            font-urbanist text-xs font-semibold
                            text-violet-700 dark:text-violet-300
                          "
                        >
                          {effect.domain}
                        </span>
                        <TimingBadge timing={effect.timing} />
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
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isConfirming || actionStatus === 'completed' || actionStatus === 'cancelled'}
            className="
              rounded-uber-lg px-4 py-2
              font-urbanist text-sm font-medium
              text-gray-600 transition-all duration-200
              hover:bg-gray-100 hover:text-gray-800
              active:scale-95
              dark:text-gray-400 dark:hover:bg-gray-800
              dark:hover:text-gray-200
              disabled:cursor-not-allowed disabled:opacity-50
              disabled:hover:bg-transparent
              disabled:active:scale-100
            "
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming || actionStatus === 'completed' || actionStatus === 'cancelled'}
            className="
              flex items-center gap-2 rounded-uber-lg
              bg-blue-600 px-5 py-2
              font-urbanist text-sm font-semibold text-white
              transition-all duration-200
              hover:bg-blue-700 active:scale-95
              dark:bg-blue-500 dark:hover:bg-blue-600
              disabled:cursor-not-allowed disabled:opacity-50
              disabled:hover:bg-blue-600 disabled:active:scale-100
              dark:disabled:hover:bg-blue-500
            "
          >
            {isConfirming && (
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            {actionStatus === 'completed' ? 'Confirmed' : isConfirming ? 'Processing…' : 'Confirm Action'}
          </button>
        </div>
      </div>
    </div>
  );
}

ActionConfirmationPanel.propTypes = {
  actionId: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
};

export default ActionConfirmationPanel;