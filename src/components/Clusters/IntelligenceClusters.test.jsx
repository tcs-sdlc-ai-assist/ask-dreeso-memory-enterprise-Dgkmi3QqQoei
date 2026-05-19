import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { IntelligenceClusters } from './IntelligenceClusters';
import { SessionProvider } from '../../context/SessionContext';
import { PersonaProvider } from '../../context/PersonaContext';
import { DemoProvider } from '../../context/DemoContext';
import { getClustersByPersona } from '../../data/clusters';

/**
 * Helper to render IntelligenceClusters wrapped in all required context providers.
 * @param {Object} [props] - Props to pass to IntelligenceClusters
 * @returns {Object} The render result
 */
const renderClusters = (props = {}) => {
  return render(
    <BrowserRouter>
      <SessionProvider>
        <PersonaProvider>
          <DemoProvider>
            <IntelligenceClusters {...props} />
          </DemoProvider>
        </PersonaProvider>
      </SessionProvider>
    </BrowserRouter>,
  );
};

describe('IntelligenceClusters', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders six cluster cards for Lukas Müller', () => {
    renderClusters({ personaId: 'lukas-muller' });

    const clusters = getClustersByPersona('lukas-muller');
    expect(clusters).toHaveLength(6);

    clusters.forEach((cluster) => {
      expect(screen.getByText(cluster.title)).toBeInTheDocument();
    });
  });

  it('renders six cluster cards for Elena Rossi', () => {
    renderClusters({ personaId: 'elena-rossi' });

    const clusters = getClustersByPersona('elena-rossi');
    expect(clusters).toHaveLength(6);

    clusters.forEach((cluster) => {
      expect(screen.getByText(cluster.title)).toBeInTheDocument();
    });
  });

  it('renders six cluster cards for Sophie Dubois', () => {
    renderClusters({ personaId: 'sophie-dubois' });

    const clusters = getClustersByPersona('sophie-dubois');
    expect(clusters).toHaveLength(6);

    clusters.forEach((cluster) => {
      expect(screen.getByText(cluster.title)).toBeInTheDocument();
    });
  });

  it('renders six cluster cards for James Carter', () => {
    renderClusters({ personaId: 'james-carter' });

    const clusters = getClustersByPersona('james-carter');
    expect(clusters).toHaveLength(6);

    clusters.forEach((cluster) => {
      expect(screen.getByText(cluster.title)).toBeInTheDocument();
    });
  });

  it('returns null when personaId is not provided', () => {
    const { container } = renderClusters({ personaId: '' });
    expect(container.innerHTML).toBe('');
  });

  it('returns null when personaId has no matching clusters', () => {
    const { container } = renderClusters({ personaId: 'unknown-persona' });
    expect(container.innerHTML).toBe('');
  });

  it('displays correct metric values for Lukas clusters', () => {
    renderClusters({ personaId: 'lukas-muller' });

    expect(screen.getByText('€42.6M / €45M')).toBeInTheDocument();
    expect(screen.getByText('4 days ahead')).toBeInTheDocument();
    expect(screen.getByText('12 open risks')).toBeInTheDocument();
    expect(screen.getByText('94% compliant')).toBeInTheDocument();
    expect(screen.getByText('218 FTEs on-site')).toBeInTheDocument();
    expect(screen.getByText('€1.8M in pending VOs')).toBeInTheDocument();
  });

  it('displays correct subtitle badges for clusters', () => {
    renderClusters({ personaId: 'lukas-muller' });

    expect(screen.getByText('Budget & Cost Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Schedule Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Risk Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Compliance Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Resource Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Commercial Intelligence')).toBeInTheDocument();
  });

  it('displays trend labels for clusters', () => {
    renderClusters({ personaId: 'lukas-muller' });

    expect(screen.getByText('+2.1% spend increase this quarter')).toBeInTheDocument();
    expect(screen.getByText('Critical path recovered by 4 days')).toBeInTheDocument();
    expect(screen.getByText('3 risks closed since last review')).toBeInTheDocument();
  });

  it('renders the intelligence clusters region with aria-label', () => {
    renderClusters({ personaId: 'lukas-muller' });

    const region = screen.getByRole('region', { name: 'Intelligence clusters' });
    expect(region).toBeInTheDocument();
  });

  it('applies highlighted state to specified cluster IDs', () => {
    renderClusters({
      personaId: 'lukas-muller',
      highlightedClusterIds: ['cluster-lukas-budget'],
    });

    // The highlighted cluster card should have ring styling
    const budgetCard = screen.getByLabelText('Project Budget Health — €42.6M / €45M');
    expect(budgetCard).toBeInTheDocument();
    expect(budgetCard.className).toContain('ring-2');
  });

  it('does not apply highlighted state to non-highlighted clusters', () => {
    renderClusters({
      personaId: 'lukas-muller',
      highlightedClusterIds: ['cluster-lukas-budget'],
    });

    // The non-highlighted cluster card should not have ring-2 styling
    const scheduleCard = screen.getByLabelText('Master Schedule Status — 4 days ahead');
    expect(scheduleCard).toBeInTheDocument();
    expect(scheduleCard.className).not.toContain('ring-2 ring-blue');
  });

  it('handles empty highlightedClusterIds array', () => {
    renderClusters({
      personaId: 'lukas-muller',
      highlightedClusterIds: [],
    });

    const clusters = getClustersByPersona('lukas-muller');
    clusters.forEach((cluster) => {
      expect(screen.getByText(cluster.title)).toBeInTheDocument();
    });
  });

  it('expands cluster detail text on click', async () => {
    renderClusters({ personaId: 'lukas-muller' });
    const user = userEvent.setup();

    const budgetCard = screen.getByLabelText('Project Budget Health — €42.6M / €45M');
    expect(budgetCard).toHaveAttribute('aria-expanded', 'false');

    await user.click(budgetCard);

    expect(budgetCard).toHaveAttribute('aria-expanded', 'true');

    // Detail text should now be visible
    expect(
      screen.getByText(/Current cumulative spend stands at €42.6M against a €45M baseline/),
    ).toBeInTheDocument();
  });

  it('collapses cluster detail text on second click', async () => {
    renderClusters({ personaId: 'lukas-muller' });
    const user = userEvent.setup();

    const budgetCard = screen.getByLabelText('Project Budget Health — €42.6M / €45M');

    // Expand
    await user.click(budgetCard);
    expect(budgetCard).toHaveAttribute('aria-expanded', 'true');

    // Collapse
    await user.click(budgetCard);
    expect(budgetCard).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands cluster detail text on Enter key press', async () => {
    renderClusters({ personaId: 'lukas-muller' });
    const user = userEvent.setup();

    const budgetCard = screen.getByLabelText('Project Budget Health — €42.6M / €45M');

    budgetCard.focus();
    await user.keyboard('{Enter}');

    expect(budgetCard).toHaveAttribute('aria-expanded', 'true');
  });

  it('expands cluster detail text on Space key press', async () => {
    renderClusters({ personaId: 'lukas-muller' });
    const user = userEvent.setup();

    const budgetCard = screen.getByLabelText('Project Budget Health — €42.6M / €45M');

    budgetCard.focus();
    await user.keyboard(' ');

    expect(budgetCard).toHaveAttribute('aria-expanded', 'true');
  });

  it('displays source system badges on cluster cards', () => {
    renderClusters({ personaId: 'lukas-muller' });

    // The budget cluster sources are sap-fi and procore
    expect(screen.getAllByText('SAP FI').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Procore').length).toBeGreaterThanOrEqual(1);
  });

  it('applies additional className when provided', () => {
    renderClusters({
      personaId: 'lukas-muller',
      className: 'custom-test-class',
    });

    const region = screen.getByRole('region', { name: 'Intelligence clusters' });
    expect(region.className).toContain('custom-test-class');
  });

  it('renders correct data for Elena Rossi clusters', () => {
    renderClusters({ personaId: 'elena-rossi' });

    expect(screen.getByText('Cost-to-Complete Forecast')).toBeInTheDocument();
    expect(screen.getByText('€2.4M remaining')).toBeInTheDocument();
    expect(screen.getByText('Procurement Milestone Tracker')).toBeInTheDocument();
    expect(screen.getByText('87% packages awarded')).toBeInTheDocument();
    expect(screen.getByText('Supply-Chain Risk Monitor')).toBeInTheDocument();
    expect(screen.getByText('3 high-risk items')).toBeInTheDocument();
  });

  it('renders correct data for Sophie Dubois clusters', () => {
    renderClusters({ personaId: 'sophie-dubois' });

    expect(screen.getByText('Sustainability Budget Tracker')).toBeInTheDocument();
    expect(screen.getByText('€3.2M allocated')).toBeInTheDocument();
    expect(screen.getByText('ESG Milestone Timeline')).toBeInTheDocument();
    expect(screen.getByText('8 of 11 milestones met')).toBeInTheDocument();
  });

  it('renders correct data for James Carter clusters', () => {
    renderClusters({ personaId: 'james-carter' });

    expect(screen.getByText('Revenue vs. Target')).toBeInTheDocument();
    expect(screen.getByText('€18.4M / €22M')).toBeInTheDocument();
    expect(screen.getByText('Leasing Timeline Tracker')).toBeInTheDocument();
    expect(screen.getByText('72% pre-leased')).toBeInTheDocument();
    expect(screen.getByText('Pipeline & Forecast')).toBeInTheDocument();
    expect(screen.getByText('€5.2M pipeline')).toBeInTheDocument();
  });

  it('highlights multiple clusters when multiple IDs are provided', () => {
    renderClusters({
      personaId: 'lukas-muller',
      highlightedClusterIds: ['cluster-lukas-budget', 'cluster-lukas-risk'],
    });

    const budgetCard = screen.getByLabelText('Project Budget Health — €42.6M / €45M');
    expect(budgetCard.className).toContain('ring-2');

    const riskCard = screen.getByLabelText('Active Risk Register — 12 open risks');
    expect(riskCard.className).toContain('ring-2');

    // Non-highlighted card should not have ring
    const scheduleCard = screen.getByLabelText('Master Schedule Status — 4 days ahead');
    expect(scheduleCard.className).not.toContain('ring-2 ring-blue');
  });

  it('renders grid layout with correct responsive classes', () => {
    renderClusters({ personaId: 'lukas-muller' });

    const region = screen.getByRole('region', { name: 'Intelligence clusters' });
    expect(region.className).toContain('grid');
    expect(region.className).toContain('grid-cols-1');
    expect(region.className).toContain('sm:grid-cols-2');
    expect(region.className).toContain('lg:grid-cols-3');
  });

  it('renders stagger animation delays on cluster cards', () => {
    renderClusters({ personaId: 'lukas-muller' });

    const region = screen.getByRole('region', { name: 'Intelligence clusters' });
    const animatedChildren = region.querySelectorAll('.animate-slide-in');

    // Should have 6 animated wrappers (one per cluster)
    expect(animatedChildren.length).toBe(6);

    // Check that animation delays are staggered
    animatedChildren.forEach((child, index) => {
      expect(child.style.animationDelay).toBe(`${index * 80}ms`);
    });
  });
});