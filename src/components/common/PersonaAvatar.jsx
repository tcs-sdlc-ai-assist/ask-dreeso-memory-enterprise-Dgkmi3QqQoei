/**
 * Persona avatar component displaying initials in a colored circle
 * with the persona's theme color. Used in the header, login screen,
 * and session log. Accepts persona object and size prop.
 * @module components/common/PersonaAvatar
 */

import PropTypes from 'prop-types';

/**
 * Size configuration map for avatar dimensions and text sizing.
 * @type {Record<string, {container: string, text: string}>}
 */
const SIZE_CONFIG = {
  xs: {
    container: 'h-5 w-5',
    text: 'text-[8px]',
  },
  sm: {
    container: 'h-7 w-7',
    text: 'text-[10px]',
  },
  md: {
    container: 'h-9 w-9',
    text: 'text-xs',
  },
  lg: {
    container: 'h-12 w-12',
    text: 'text-sm',
  },
  xl: {
    container: 'h-16 w-16',
    text: 'text-lg',
  },
};

/**
 * PersonaAvatar renders a circular avatar displaying the persona's initials
 * with their associated theme colors. Supports multiple sizes for use across
 * the header, login screen, and session log.
 *
 * @param {Object} props
 * @param {import('../../data/personas').Persona} props.persona - The persona object containing initials and color theme
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [props.size='md'] - The avatar size
 * @param {boolean} [props.showRing=false] - Whether to display a ring border around the avatar
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null} The persona avatar element, or null if no persona provided
 */
export function PersonaAvatar({ persona, size = 'md', showRing = false, className }) {
  if (!persona) {
    return null;
  }

  const sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  return (
    <div
      className={`
        flex flex-shrink-0 items-center justify-center
        rounded-full font-urbanist font-semibold
        select-none transition-all duration-200
        ${sizeConfig.container}
        ${sizeConfig.text}
        ${persona.colorTheme.bg}
        ${persona.colorTheme.text}
        ${showRing ? `ring-2 ${persona.colorTheme.ring} ring-offset-1 ring-offset-white dark:ring-offset-gray-950` : ''}
        ${className || ''}
      `}
      title={`${persona.name} — ${persona.role}`}
      aria-label={`${persona.name} avatar`}
      role="img"
    >
      {persona.initials}
    </div>
  );
}

PersonaAvatar.propTypes = {
  persona: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    initials: PropTypes.string.isRequired,
    colorTheme: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      light: PropTypes.string.isRequired,
      dark: PropTypes.string.isRequired,
      ring: PropTypes.string.isRequired,
      bg: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  }),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  showRing: PropTypes.bool,
  className: PropTypes.string,
};

export default PersonaAvatar;