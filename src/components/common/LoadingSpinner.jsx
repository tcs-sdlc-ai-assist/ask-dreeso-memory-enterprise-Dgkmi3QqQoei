/**
 * Loading spinner component used during simulated query processing.
 * Displays an animated spinner with optional 'Querying systems...' text.
 * Used to simulate realistic processing delays across the application.
 * @module components/common/LoadingSpinner
 */

import PropTypes from 'prop-types';

/**
 * Size configuration map for spinner dimensions and text sizing.
 * @type {Record<string, {spinner: string, text: string, border: string}>}
 */
const SIZE_CONFIG = {
  xs: {
    spinner: 'h-4 w-4',
    text: 'text-[10px]',
    border: 'border-[2px]',
  },
  sm: {
    spinner: 'h-6 w-6',
    text: 'text-xs',
    border: 'border-2',
  },
  md: {
    spinner: 'h-8 w-8',
    text: 'text-sm',
    border: 'border-2',
  },
  lg: {
    spinner: 'h-12 w-12',
    text: 'text-base',
    border: 'border-[3px]',
  },
  xl: {
    spinner: 'h-16 w-16',
    text: 'text-lg',
    border: 'border-4',
  },
};

/**
 * Color variant configuration map for spinner styling.
 * @type {Record<string, {track: string, indicator: string, text: string}>}
 */
const VARIANT_CONFIG = {
  blue: {
    track: 'border-blue-200 dark:border-blue-800',
    indicator: 'border-t-blue-600 dark:border-t-blue-400',
    text: 'text-blue-600 dark:text-blue-400',
  },
  grey: {
    track: 'border-gray-200 dark:border-gray-700',
    indicator: 'border-t-gray-600 dark:border-t-gray-400',
    text: 'text-gray-600 dark:text-gray-400',
  },
  white: {
    track: 'border-white/20',
    indicator: 'border-t-white',
    text: 'text-white',
  },
  emerald: {
    track: 'border-emerald-200 dark:border-emerald-800',
    indicator: 'border-t-emerald-600 dark:border-t-emerald-400',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  violet: {
    track: 'border-violet-200 dark:border-violet-800',
    indicator: 'border-t-violet-600 dark:border-t-violet-400',
    text: 'text-violet-600 dark:text-violet-400',
  },
};

/**
 * LoadingSpinner renders an animated circular spinner with optional descriptive text.
 * Used during simulated query processing to indicate loading state.
 * Supports multiple sizes, color variants, and optional label text.
 *
 * @param {Object} props
 * @param {string} [props.text='Querying systems...'] - Optional text displayed below the spinner
 * @param {boolean} [props.showText=true] - Whether to display the text label
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [props.size='md'] - Spinner size
 * @param {'blue' | 'grey' | 'white' | 'emerald' | 'violet'} [props.variant='blue'] - Color variant
 * @param {boolean} [props.fullScreen=false] - Whether to center the spinner in the full viewport
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} The loading spinner element
 */
export function LoadingSpinner({
  text = 'Querying systems...',
  showText = true,
  size = 'md',
  variant = 'blue',
  fullScreen = false,
  className,
}) {
  const sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG.md;
  const variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG.blue;

  const content = (
    <div
      className={`
        flex flex-col items-center justify-center gap-3
        animate-fade-in
        ${className || ''}
      `}
      role="status"
      aria-label={showText && text ? text : 'Loading'}
    >
      {/* Spinner */}
      <div
        className={`
          rounded-full
          animate-spin
          ${sizeConfig.spinner}
          ${sizeConfig.border}
          ${variantConfig.track}
          ${variantConfig.indicator}
        `}
      />

      {/* Text label */}
      {showText && text && (
        <p
          className={`
            font-urbanist font-medium leading-tight
            ${sizeConfig.text}
            ${variantConfig.text}
          `}
        >
          {text}
        </p>
      )}

      {/* Screen reader text */}
      <span className="sr-only">{text || 'Loading'}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="
          fixed inset-0 z-50 flex items-center justify-center
          bg-white/60 backdrop-blur-sm
          dark:bg-gray-950/60
        "
      >
        {content}
      </div>
    );
  }

  return content;
}

LoadingSpinner.propTypes = {
  text: PropTypes.string,
  showText: PropTypes.bool,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['blue', 'grey', 'white', 'emerald', 'violet']),
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
};

export default LoadingSpinner;