/**
 * Source transparency panel component.
 * Renders a horizontal strip of system dots beneath the query bar.
 * Each dot represents an enterprise system (Procore, SAP, etc.).
 * Active systems pulse green during query execution; inactive remain muted grey.
 * Hover tooltip shows system name and mocked last-read timestamp.
 * @module components/SourcePanel/SourcePanel
 */

import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { SYSTEM_SOURCES } from '../../constants';
import { REFERENCE_DATE } from '../../constants';

/**
 * Generates a mocked last-read timestamp for a system.
 * Returns a time relative to the reference date, varying by system index.
 * @param {number} index - The system index for deterministic variation
 * @returns {string} Human-readable last-read timestamp string
 */
const getMockedTimestamp = (index) => {
  const offsets = [2, 5, 12, 18, 25, 35, 48, 60, 90, 120, 150];
  const offsetMinutes = offsets[index % offsets.length];
  const ref = new Date(REFERENCE_DATE);
  ref.setMinutes(ref.getMinutes() - offsetMinutes);

  const hours = ref.getHours().toString().padStart(2, '0');
  const minutes = ref.getMinutes().toString().padStart(2, '0');
  const day = ref.getDate();
  const month = ref.toLocaleString('en-GB', { month: 'short' });

  return `${day} ${month}, ${hours}:${minutes}`;
};

/**
 * Individual system dot with tooltip.
 * @param {Object} props
 * @param {Object} props.system - The system source object
 * @param {string} props.system.id - System identifier
 * @param {string} props.system.name - System display name
 * @param {string} props.system.description - System description
 * @param {boolean} props.isActive - Whether the system is actively queried
 * @param {number} props.index - Index for deterministic timestamp generation
 * @returns {JSX.Element} A system dot element with tooltip
 */
function SystemDot({ system, isActive, index }) {
  const [isHovered, setIsHovered] = useState(false);

  const timestamp = useMemo(() => getMockedTimestamp(index), [index]);

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      {isHovered && (
        <div
          className="
            absolute bottom-full mb-2 z-50
            whitespace-nowrap rounded-uber px-3 py-1.5
            glass-sm text-xs font-urbanist
            text-gray-800 dark:text-gray-200
            animate-fade-in pointer-events-none
          "
          role="tooltip"
        >
          <div className="font-semibold">{system.name}</div>
          <div className="text-gray-500 dark:text-gray-400">
            {isActive ? 'Active — ' : 'Last read: '}{timestamp}
          </div>
        </div>
      )}

      {/* Dot */}
      <button
        type="button"
        tabIndex={-1}
        aria-label={`${system.name}${isActive ? ' (active)' : ''}`}
        className={`
          h-3 w-3 rounded-full transition-all duration-300 ease-out
          focus:outline-none
          ${
            isActive
              ? 'bg-green-500 animate-pulse-green shadow-sm'
              : 'bg-gray-300 dark:bg-gray-600'
          }
        `}
      />

      {/* Label (visible on md+) */}
      <span
        className={`
          mt-1 hidden text-[9px] font-urbanist leading-tight text-center
          md:block max-w-[56px] truncate
          ${
            isActive
              ? 'text-green-600 dark:text-green-400 font-medium'
              : 'text-gray-400 dark:text-gray-500'
          }
        `}
      >
        {system.name}
      </span>
    </div>
  );
}

SystemDot.propTypes = {
  system: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * SourcePanel renders a horizontal strip of enterprise system dots.
 * Active systems pulse green during query execution; inactive remain muted grey.
 * Each dot shows a tooltip on hover with system name and mocked last-read timestamp.
 *
 * @param {Object} props
 * @param {string[]} [props.activeSystems=[]] - Array of active system IDs
 * @param {boolean} [props.visible=true] - Whether the panel is visible
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null} The source panel, or null if not visible
 */
export function SourcePanel({ activeSystems = [], visible = true, className }) {
  const activeSet = useMemo(
    () => new Set(activeSystems || []),
    [activeSystems],
  );

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`
        flex items-start justify-center gap-3 px-4 py-2
        sm:gap-4 md:gap-5
        ${className || ''}
      `}
      role="status"
      aria-label="Enterprise system sources"
    >
      {SYSTEM_SOURCES.map((system, index) => (
        <SystemDot
          key={system.id}
          system={system}
          isActive={activeSet.has(system.id)}
          index={index}
        />
      ))}
    </div>
  );
}

SourcePanel.propTypes = {
  activeSystems: PropTypes.arrayOf(PropTypes.string),
  visible: PropTypes.bool,
  className: PropTypes.string,
};

export default SourcePanel;