/**
 * Reusable tooltip component for hover information display.
 * Used by SystemDot for system name/timestamp, and by cluster cards
 * for detail expansion. Supports top/bottom/left/right positioning.
 * Renders as a floating panel with glassmorphism styling and fade-in animation.
 * @module components/common/Tooltip
 */

import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Position configuration map for tooltip placement.
 * Each position provides CSS classes for absolute positioning and the arrow indicator.
 * @type {Record<string, {container: string, arrow: string}>}
 */
const POSITION_CONFIG = {
  top: {
    container: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/80 dark:border-t-gray-800/80',
  },
  bottom: {
    container: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white/80 dark:border-b-gray-800/80',
  },
  left: {
    container: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-white/80 dark:border-l-gray-800/80',
  },
  right: {
    container: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-white/80 dark:border-r-gray-800/80',
  },
};

/**
 * Tooltip renders a floating information panel that appears on hover
 * over its children. Supports top, bottom, left, and right positioning.
 * Styled with glassmorphism and fade-in animation.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The trigger element(s) that the tooltip wraps
 * @param {React.ReactNode} props.content - The tooltip content to display (string or JSX)
 * @param {'top' | 'bottom' | 'left' | 'right'} [props.position='top'] - Tooltip placement relative to the trigger
 * @param {boolean} [props.showArrow=true] - Whether to display the directional arrow indicator
 * @param {number} [props.delayMs=150] - Delay in milliseconds before showing the tooltip on hover
 * @param {boolean} [props.disabled=false] - Whether the tooltip is disabled
 * @param {string} [props.className] - Additional CSS classes for the tooltip container
 * @param {string} [props.wrapperClassName] - Additional CSS classes for the outer wrapper element
 * @returns {JSX.Element} The tooltip wrapper element
 */
export function Tooltip({
  children,
  content,
  position = 'top',
  showArrow = true,
  delayMs = 150,
  disabled = false,
  className,
  wrapperClassName,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);

  const positionConfig = POSITION_CONFIG[position] || POSITION_CONFIG.top;

  /**
   * Handles mouse enter on the trigger element.
   * Shows the tooltip after the configured delay.
   */
  const handleMouseEnter = useCallback(() => {
    if (disabled) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      timerRef.current = null;
    }, delayMs);
  }, [disabled, delayMs]);

  /**
   * Handles mouse leave on the trigger element.
   * Hides the tooltip immediately and cancels any pending show timer.
   */
  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setIsVisible(false);
  }, []);

  /**
   * Handles focus on the trigger element for keyboard accessibility.
   */
  const handleFocus = useCallback(() => {
    if (disabled) {
      return;
    }

    setIsVisible(true);
  }, [disabled]);

  /**
   * Handles blur on the trigger element for keyboard accessibility.
   */
  const handleBlur = useCallback(() => {
    setIsVisible(false);
  }, []);

  if (!content) {
    return <>{children}</>;
  }

  return (
    <div
      className={`relative inline-flex ${wrapperClassName || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}

      {isVisible && !disabled && (
        <div
          className={`
            absolute z-50 pointer-events-none
            ${positionConfig.container}
          `}
        >
          <div
            className={`
              relative whitespace-nowrap rounded-uber px-3 py-1.5
              glass-sm text-xs font-urbanist
              text-gray-800 dark:text-gray-200
              animate-fade-in
              ${className || ''}
            `}
            role="tooltip"
          >
            {content}

            {showArrow && (
              <span
                className={`
                  absolute h-0 w-0
                  ${positionConfig.arrow}
                `}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  showArrow: PropTypes.bool,
  delayMs: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

export default Tooltip;