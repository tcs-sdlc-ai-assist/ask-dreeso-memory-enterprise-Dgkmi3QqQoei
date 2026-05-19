/**
 * Individual system dot component for the source panel.
 * Renders a circular indicator with active (pulsing green) or inactive (grey) state.
 * Shows tooltip on hover with system name and last-read timestamp.
 * @module components/SourcePanel/SystemDot
 */

import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * SystemDot renders a single system status indicator dot.
 * Active systems pulse green; inactive systems remain muted grey.
 * Displays a tooltip on hover with the system name and last-read timestamp.
 *
 * @param {Object} props
 * @param {string} props.systemName - Display name of the enterprise system
 * @param {boolean} props.isActive - Whether the system is actively queried
 * @param {string} props.lastRead - Human-readable last-read timestamp string
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} A system dot element with tooltip
 */
export function SystemDot({ systemName, isActive, lastRead, className }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative flex flex-col items-center ${className || ''}`}
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
          <div className="font-semibold">{systemName}</div>
          <div className="text-gray-500 dark:text-gray-400">
            {isActive ? 'Active — ' : 'Last read: '}{lastRead}
          </div>
        </div>
      )}

      {/* Dot */}
      <button
        type="button"
        tabIndex={-1}
        aria-label={`${systemName}${isActive ? ' (active)' : ''}`}
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
        {systemName}
      </span>
    </div>
  );
}

SystemDot.propTypes = {
  systemName: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  lastRead: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default SystemDot;