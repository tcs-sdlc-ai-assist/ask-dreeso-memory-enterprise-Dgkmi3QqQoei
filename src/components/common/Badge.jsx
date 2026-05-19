/**
 * Reusable badge/pill UI component for source system labels, status indicators,
 * and role tags. Accepts text, color variant (semantic colors), and size.
 * Used across cluster cards, responses, and confirmation panels.
 * @module components/common/Badge
 */

import PropTypes from 'prop-types';

/**
 * Color variant configuration map.
 * Each variant provides background, text, and dot color classes for light and dark modes.
 * @type {Record<string, {bg: string, text: string, dot: string}>}
 */
const VARIANT_CONFIG = {
  green: {
    bg: 'bg-green-50 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    dot: 'bg-green-500',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  grey: {
    bg: 'bg-gray-100 dark:bg-gray-800/30',
    text: 'text-gray-600 dark:text-gray-400',
    dot: 'bg-gray-400',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-900/30',
    text: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
};

/**
 * Size configuration map for badge dimensions and text sizing.
 * @type {Record<string, {padding: string, text: string, dot: string, gap: string}>}
 */
const SIZE_CONFIG = {
  xs: {
    padding: 'px-1.5 py-0.5',
    text: 'text-[9px]',
    dot: 'h-1 w-1',
    gap: 'gap-1',
  },
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-[10px]',
    dot: 'h-1.5 w-1.5',
    gap: 'gap-1',
  },
  md: {
    padding: 'px-2.5 py-0.5',
    text: 'text-xs',
    dot: 'h-1.5 w-1.5',
    gap: 'gap-1.5',
  },
  lg: {
    padding: 'px-3 py-1',
    text: 'text-sm',
    dot: 'h-2 w-2',
    gap: 'gap-1.5',
  },
};

/**
 * Badge renders a styled pill/badge element with semantic color variants.
 * Supports optional status dot indicator, uppercase styling, and multiple sizes.
 * Used for source system labels, status indicators, role tags, and category labels.
 *
 * @param {Object} props
 * @param {string} props.text - The badge display text
 * @param {'green' | 'amber' | 'red' | 'blue' | 'grey' | 'violet' | 'emerald' | 'orange'} [props.variant='grey'] - Color variant
 * @param {'xs' | 'sm' | 'md' | 'lg'} [props.size='sm'] - Badge size
 * @param {boolean} [props.showDot=false] - Whether to display a status dot indicator
 * @param {boolean} [props.uppercase=true] - Whether to render text in uppercase
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null} The badge element, or null if no text provided
 */
export function Badge({ text, variant = 'grey', size = 'sm', showDot = false, uppercase = true, className }) {
  if (!text) {
    return null;
  }

  const variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG.grey;
  const sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG.sm;

  return (
    <span
      className={`
        inline-flex items-center rounded-full
        font-urbanist font-semibold tracking-wider
        select-none
        ${sizeConfig.padding}
        ${sizeConfig.text}
        ${sizeConfig.gap}
        ${variantConfig.bg}
        ${variantConfig.text}
        ${uppercase ? 'uppercase' : ''}
        ${className || ''}
      `}
    >
      {showDot && (
        <span
          className={`
            flex-shrink-0 rounded-full
            ${sizeConfig.dot}
            ${variantConfig.dot}
          `}
        />
      )}
      {text}
    </span>
  );
}

Badge.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['green', 'amber', 'red', 'blue', 'grey', 'violet', 'emerald', 'orange']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  showDot: PropTypes.bool,
  uppercase: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;