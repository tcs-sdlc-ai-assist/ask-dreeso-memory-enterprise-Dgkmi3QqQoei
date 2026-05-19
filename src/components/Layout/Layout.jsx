/**
 * Main application layout wrapper component.
 * Renders Header at top, main content area (children) in the center
 * with responsive 12-column grid, and the persistent QueryBar + SourcePanel
 * fixed at the bottom. Applies the blue gradient background and manages
 * overall page structure.
 * @module components/Layout/Layout
 */

import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { Header } from './Header';
import { QueryBar } from '../QueryBar/QueryBar';
import { SourcePanel } from '../SourcePanel/SourcePanel';

/**
 * Layout renders the main application shell with a sticky header,
 * scrollable content area, and a fixed bottom bar containing the
 * QueryBar and SourcePanel.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content to render in the main area
 * @param {boolean} [props.showQueryBar=true] - Whether to display the query bar
 * @param {boolean} [props.showSourcePanel=true] - Whether to display the source panel
 * @param {string} [props.className] - Additional CSS classes for the layout wrapper
 * @returns {JSX.Element} The application layout
 */
export function Layout({ children, showQueryBar = true, showSourcePanel = true, className }) {
  const [activeSystems, setActiveSystems] = useState([]);

  /**
   * Handles query response to update active systems for the source panel.
   * @param {import('../../data/queries').QueryResponse} response - The query response
   */
  const handleQueryResponse = useCallback((response) => {
    if (response && response.activeSystems) {
      setActiveSystems(response.activeSystems);
    }
  }, []);

  /**
   * Handles query submission to reset active systems.
   */
  const handleQuerySubmit = useCallback(() => {
    setActiveSystems([]);
  }, []);

  return (
    <div
      className={`
        relative flex min-h-screen flex-col
        bg-gradient-blue-subtle
        ${className || ''}
      `}
    >
      {/* Sticky header */}
      <Header />

      {/* Main content area */}
      <main
        className="
          mx-auto flex w-full max-w-7xl flex-1
          px-4 py-6 sm:px-6 lg:px-8
          pb-40
        "
      >
        <div
          className="
            grid w-full grid-cols-1
            gap-4 sm:gap-6
            sm:grid-cols-12
          "
        >
          <div className="col-span-1 sm:col-span-12">
            {children}
          </div>
        </div>
      </main>

      {/* Fixed bottom bar: Source panel + Query bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Source panel strip */}
        {showSourcePanel && (
          <div
            className="
              glass-sm
              border-t border-gray-200/50 dark:border-gray-700/50
            "
          >
            <SourcePanel
              activeSystems={activeSystems}
              visible={showSourcePanel}
            />
          </div>
        )}

        {/* Query bar */}
        {showQueryBar && (
          <QueryBar
            onResponse={handleQueryResponse}
            onSubmit={handleQuerySubmit}
            className="!fixed !bottom-0"
          />
        )}
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
  showQueryBar: PropTypes.bool,
  showSourcePanel: PropTypes.bool,
  className: PropTypes.string,
};

export default Layout;