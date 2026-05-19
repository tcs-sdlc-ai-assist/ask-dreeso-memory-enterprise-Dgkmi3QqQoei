import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { SourcePanel } from './SourcePanel';
import { SessionProvider } from '../../context/SessionContext';
import { PersonaProvider } from '../../context/PersonaContext';
import { DemoProvider } from '../../context/DemoContext';
import { SYSTEM_SOURCES } from '../../constants';

/**
 * Helper to render SourcePanel wrapped in all required context providers.
 * @param {Object} [props] - Props to pass to SourcePanel
 * @returns {Object} The render result
 */
const renderSourcePanel = (props = {}) => {
  return render(
    <BrowserRouter>
      <SessionProvider>
        <PersonaProvider>
          <DemoProvider>
            <SourcePanel {...props} />
          </DemoProvider>
        </PersonaProvider>
      </SessionProvider>
    </BrowserRouter>,
  );
};

describe('SourcePanel', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Rendering system dots
  // -------------------------------------------------------------------------

  it('renders all system dots from SYSTEM_SOURCES', () => {
    renderSourcePanel();

    SYSTEM_SOURCES.forEach((system) => {
      const dot = screen.getByLabelText(system.name);
      expect(dot).toBeInTheDocument();
    });
  });

  it('renders exactly the correct number of system dots', () => {
    renderSourcePanel();

    const dots = SYSTEM_SOURCES.map((system) =>
      screen.getByLabelText(system.name),
    );
    expect(dots).toHaveLength(SYSTEM_SOURCES.length);
  });

  it('renders the enterprise system sources status region', () => {
    renderSourcePanel();

    const region = screen.getByRole('status', { name: 'Enterprise system sources' });
    expect(region).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Active and inactive states
  // -------------------------------------------------------------------------

  it('renders inactive dots as grey when no active systems are provided', () => {
    renderSourcePanel({ activeSystems: [] });

    SYSTEM_SOURCES.forEach((system) => {
      const dot = screen.getByLabelText(system.name);
      expect(dot.className).toContain('bg-gray-300');
      expect(dot.className).not.toContain('bg-green-500');
    });
  });

  it('renders active dots with green pulse when active systems are provided', () => {
    const activeSystems = ['procore', 'sap-fi'];
    renderSourcePanel({ activeSystems });

    const procoreDot = screen.getByLabelText('Procore (active)');
    expect(procoreDot).toBeInTheDocument();
    expect(procoreDot.className).toContain('bg-green-500');
    expect(procoreDot.className).toContain('animate-pulse-green');

    const sapFiDot = screen.getByLabelText('SAP FI (active)');
    expect(sapFiDot).toBeInTheDocument();
    expect(sapFiDot.className).toContain('bg-green-500');
    expect(sapFiDot.className).toContain('animate-pulse-green');
  });

  it('renders non-active dots as grey when some systems are active', () => {
    const activeSystems = ['procore'];
    renderSourcePanel({ activeSystems });

    // Procore should be active
    const procoreDot = screen.getByLabelText('Procore (active)');
    expect(procoreDot.className).toContain('bg-green-500');

    // SAP MM should be inactive
    const sapMmDot = screen.getByLabelText('SAP MM');
    expect(sapMmDot.className).toContain('bg-gray-300');
    expect(sapMmDot.className).not.toContain('bg-green-500');
  });

  it('renders all dots as active when all systems are in activeSystems', () => {
    const activeSystems = SYSTEM_SOURCES.map((s) => s.id);
    renderSourcePanel({ activeSystems });

    SYSTEM_SOURCES.forEach((system) => {
      const dot = screen.getByLabelText(`${system.name} (active)`);
      expect(dot).toBeInTheDocument();
      expect(dot.className).toContain('bg-green-500');
    });
  });

  it('includes (active) in aria-label for active systems', () => {
    const activeSystems = ['salesforce'];
    renderSourcePanel({ activeSystems });

    const activeDot = screen.getByLabelText('Salesforce (active)');
    expect(activeDot).toBeInTheDocument();
  });

  it('does not include (active) in aria-label for inactive systems', () => {
    const activeSystems = ['salesforce'];
    renderSourcePanel({ activeSystems });

    const inactiveDot = screen.getByLabelText('Procore');
    expect(inactiveDot).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Tooltip on hover
  // -------------------------------------------------------------------------

  it('shows tooltip with system name on hover', async () => {
    renderSourcePanel();
    const user = userEvent.setup();

    const procoreDot = screen.getByLabelText('Procore');
    const container = procoreDot.closest('.relative');

    await user.hover(container);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(within(tooltip).getByText('Procore')).toBeInTheDocument();
    });
  });

  it('shows "Last read:" in tooltip for inactive systems', async () => {
    renderSourcePanel({ activeSystems: [] });
    const user = userEvent.setup();

    const sapMmDot = screen.getByLabelText('SAP MM');
    const container = sapMmDot.closest('.relative');

    await user.hover(container);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip.textContent).toContain('Last read:');
    });
  });

  it('shows "Active —" in tooltip for active systems', async () => {
    renderSourcePanel({ activeSystems: ['procore'] });
    const user = userEvent.setup();

    const procoreDot = screen.getByLabelText('Procore (active)');
    const container = procoreDot.closest('.relative');

    await user.hover(container);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip.textContent).toContain('Active —');
    });
  });

  it('hides tooltip when mouse leaves the system dot', async () => {
    renderSourcePanel();
    const user = userEvent.setup();

    const procoreDot = screen.getByLabelText('Procore');
    const container = procoreDot.closest('.relative');

    await user.hover(container);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    await user.unhover(container);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Visibility
  // -------------------------------------------------------------------------

  it('renders when visible is true', () => {
    renderSourcePanel({ visible: true });

    const region = screen.getByRole('status', { name: 'Enterprise system sources' });
    expect(region).toBeInTheDocument();
  });

  it('returns null when visible is false', () => {
    const { container } = renderSourcePanel({ visible: false });
    expect(container.innerHTML).toBe('');
  });

  it('renders by default when visible prop is not provided', () => {
    renderSourcePanel();

    const region = screen.getByRole('status', { name: 'Enterprise system sources' });
    expect(region).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Default activeSystems
  // -------------------------------------------------------------------------

  it('renders all dots as inactive when activeSystems is not provided', () => {
    renderSourcePanel();

    SYSTEM_SOURCES.forEach((system) => {
      const dot = screen.getByLabelText(system.name);
      expect(dot.className).toContain('bg-gray-300');
    });
  });

  it('handles empty activeSystems array', () => {
    renderSourcePanel({ activeSystems: [] });

    SYSTEM_SOURCES.forEach((system) => {
      const dot = screen.getByLabelText(system.name);
      expect(dot.className).toContain('bg-gray-300');
    });
  });

  // -------------------------------------------------------------------------
  // Additional className
  // -------------------------------------------------------------------------

  it('applies additional className when provided', () => {
    renderSourcePanel({ className: 'custom-test-class' });

    const region = screen.getByRole('status', { name: 'Enterprise system sources' });
    expect(region.className).toContain('custom-test-class');
  });

  // -------------------------------------------------------------------------
  // System labels
  // -------------------------------------------------------------------------

  it('renders system name labels for each dot', () => {
    renderSourcePanel();

    // Labels are hidden on small screens (md:block), but they should be in the DOM
    SYSTEM_SOURCES.forEach((system) => {
      const labels = screen.getAllByText(system.name);
      expect(labels.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('applies green text color to active system labels', () => {
    renderSourcePanel({ activeSystems: ['procore'] });

    // Find the label span for Procore (not the tooltip, not the button)
    const procoreLabels = screen.getAllByText('Procore');
    const labelSpan = procoreLabels.find(
      (el) => el.tagName.toLowerCase() === 'span' && el.className.includes('text-green-600'),
    );
    expect(labelSpan).toBeTruthy();
  });

  it('applies grey text color to inactive system labels', () => {
    renderSourcePanel({ activeSystems: [] });

    const procoreLabels = screen.getAllByText('Procore');
    const labelSpan = procoreLabels.find(
      (el) => el.tagName.toLowerCase() === 'span' && el.className.includes('text-gray-400'),
    );
    expect(labelSpan).toBeTruthy();
  });

  // -------------------------------------------------------------------------
  // Multiple active systems
  // -------------------------------------------------------------------------

  it('correctly handles multiple active systems', () => {
    const activeSystems = ['procore', 'sap-mm', 'primavera-p6', 'workday'];
    renderSourcePanel({ activeSystems });

    activeSystems.forEach((systemId) => {
      const system = SYSTEM_SOURCES.find((s) => s.id === systemId);
      const dot = screen.getByLabelText(`${system.name} (active)`);
      expect(dot.className).toContain('bg-green-500');
      expect(dot.className).toContain('animate-pulse-green');
    });

    // Check that non-active systems are grey
    const inactiveSystems = SYSTEM_SOURCES.filter((s) => !activeSystems.includes(s.id));
    inactiveSystems.forEach((system) => {
      const dot = screen.getByLabelText(system.name);
      expect(dot.className).toContain('bg-gray-300');
    });
  });

  // -------------------------------------------------------------------------
  // Tooltip shows timestamp
  // -------------------------------------------------------------------------

  it('shows a timestamp in the tooltip on hover', async () => {
    renderSourcePanel();
    const user = userEvent.setup();

    const firstSystem = SYSTEM_SOURCES[0];
    const dot = screen.getByLabelText(firstSystem.name);
    const container = dot.closest('.relative');

    await user.hover(container);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      // Tooltip should contain a timestamp-like string (e.g., "2 May, 23:58" or similar)
      // The timestamp is generated from REFERENCE_DATE with offsets
      expect(tooltip.textContent).toMatch(/\d{1,2}\s\w+,\s\d{2}:\d{2}/);
    });
  });

  // -------------------------------------------------------------------------
  // Unknown active system IDs are ignored gracefully
  // -------------------------------------------------------------------------

  it('handles unknown system IDs in activeSystems gracefully', () => {
    renderSourcePanel({ activeSystems: ['unknown-system-id'] });

    // All known systems should remain inactive
    SYSTEM_SOURCES.forEach((system) => {
      const dot = screen.getByLabelText(system.name);
      expect(dot.className).toContain('bg-gray-300');
    });
  });

  // -------------------------------------------------------------------------
  // Dots are buttons with tabIndex -1
  // -------------------------------------------------------------------------

  it('renders dots as buttons with tabIndex -1', () => {
    renderSourcePanel();

    SYSTEM_SOURCES.forEach((system) => {
      const dot = screen.getByLabelText(system.name);
      expect(dot.tagName.toLowerCase()).toBe('button');
      expect(dot).toHaveAttribute('tabindex', '-1');
    });
  });
});