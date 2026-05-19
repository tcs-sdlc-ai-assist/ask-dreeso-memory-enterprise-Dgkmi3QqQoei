/**
 * Intelligence clusters grid component.
 * Renders IntelligenceCluster cards in a responsive 12-column grid
 * (3x2 on desktop, 2x3 on tablet, 1x6 on mobile).
 * Receives persona-specific cluster data and manages highlight/expansion state.
 * Includes slide-in stagger animation on mount.
 * @module components/Clusters/IntelligenceClusters
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { IntelligenceCluster } from './IntelligenceCluster';
import { getClustersByPersona } from '../../data/clusters';

/**
 * IntelligenceClusters renders a responsive grid of IntelligenceCluster cards
 * for a given persona. Displays up to six cluster cards with staggered
 * slide-in animation on mount.
 *
 * @param {Object} props
 * @param {string} props.personaId - The persona identifier to load clusters for
 * @param {string[]} [props.highlightedClusterIds=[]] - Array of cluster IDs to highlight
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null} The intelligence clusters grid, or null if no clusters
 */
export function IntelligenceClusters({ personaId, highlightedClusterIds = [], className }) {
  const clusters = useMemo(() => {
    if (!personaId) {
      return [];
    }
    return getClustersByPersona(personaId);
  }, [personaId]);

  const highlightedSet = useMemo(
    () => new Set(highlightedClusterIds || []),
    [highlightedClusterIds],
  );

  if (!clusters || clusters.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-3
        ${className || ''}
      `}
      role="region"
      aria-label="Intelligence clusters"
    >
      {clusters.map((cluster, index) => (
        <div
          key={cluster.id}
          style={{ animationDelay: `${index * 80}ms` }}
          className="animate-slide-in"
        >
          <IntelligenceCluster
            cluster={cluster}
            highlighted={highlightedSet.has(cluster.id)}
          />
        </div>
      ))}
    </div>
  );
}

IntelligenceClusters.propTypes = {
  personaId: PropTypes.string.isRequired,
  highlightedClusterIds: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default IntelligenceClusters;