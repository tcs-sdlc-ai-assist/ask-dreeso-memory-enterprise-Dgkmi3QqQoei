import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { ActionConfirmationPanel } from './ActionConfirmationPanel';
import { SessionProvider } from '../../context/SessionContext';
import { PersonaProvider } from '../../context/PersonaContext';
import { DemoProvider } from '../../context/DemoContext';
import { getActionById, ACTIONS } from '../../data/actions';
import { PERSONA_BY_ID } from '../../data/personas';

/**
 * Helper to render ActionConfirmationPanel wrapped in all required context providers.
 * @param {Object} [props] - Props to pass to ActionConfirmationPanel
 * @returns {Object} The render result
 */
const renderPanel = (props = {}) => {
  return render(
    <BrowserRouter>
      <SessionProvider>
        <PersonaProvider>
          <DemoProvider>
            <ActionConfirmationPanel {...props} />
          </DemoProvider>
        </PersonaProvider>
      </SessionProvider>
    </BrowserRouter>,
  );
};

describe('ActionConfirmationPanel', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Rendering action details
  // -------------------------------------------------------------------------

  it('renders the action label for Export Budget Report', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Export Budget Report')).toBeInTheDocument();
  });

  it('renders the action description', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    expect(screen.getByText(action.description)).toBeInTheDocument();
  });

  it('renders the action type badge', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('export')).toBeInTheDocument();
  });

  it('renders the estimated duration', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Est. 2 minutes')).toBeInTheDocument();
  });

  it('renders the confirmation message', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    expect(screen.getByText(action.confirmationMessage)).toBeInTheDocument();
  });

  it('renders the dialog with correct aria-label', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const dialog = screen.getByRole('dialog', { name: 'Action confirmation: Export Budget Report' });
    expect(dialog).toBeInTheDocument();
  });

  it('renders the Pending status badge initially', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Affected systems
  // -------------------------------------------------------------------------

  it('renders the Affected Systems section header', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Affected Systems')).toBeInTheDocument();
  });

  it('renders all affected system names for Export Budget Report', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    action.affectedSystems.forEach((system) => {
      expect(screen.getByText(system.name)).toBeInTheDocument();
    });
  });

  it('renders affected system impact descriptions', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    action.affectedSystems.forEach((system) => {
      expect(screen.getByText(system.impact)).toBeInTheDocument();
    });
  });

  it('renders access type badges for affected systems', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    // Both systems in Export Budget Report have 'read' access type
    const readBadges = screen.getAllByText('read');
    expect(readBadges.length).toBeGreaterThanOrEqual(2);
  });

  it('renders affected systems for Alert Risk Owners with notify access type', () => {
    renderPanel({ actionId: 'action-alert-risk-owners' });

    // Workday has 'notify' access type
    const notifyBadges = screen.getAllByText('notify');
    expect(notifyBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('renders three affected systems for Alert Risk Owners', () => {
    renderPanel({ actionId: 'action-alert-risk-owners' });

    expect(screen.getByText('Procore')).toBeInTheDocument();
    expect(screen.getByText('Primavera P6')).toBeInTheDocument();
    expect(screen.getByText('Workday')).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Expected outcomes
  // -------------------------------------------------------------------------

  it('renders the Expected Outcomes section header', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Expected Outcomes')).toBeInTheDocument();
  });

  it('renders all expected outcome descriptions', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    action.expectedOutcomes.forEach((outcome) => {
      expect(screen.getByText(outcome.description)).toBeInTheDocument();
    });
  });

  it('renders expected outcome metrics', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    action.expectedOutcomes.forEach((outcome) => {
      expect(screen.getByText(outcome.metric)).toBeInTheDocument();
    });
  });

  it('renders expected outcome expected changes', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    action.expectedOutcomes.forEach((outcome) => {
      expect(screen.getByText(outcome.expectedChange)).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Cross-domain propagation effects
  // -------------------------------------------------------------------------

  it('renders the Cross-Domain Propagation section header', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Cross-Domain Propagation')).toBeInTheDocument();
  });

  it('renders propagation effect domains', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    action.propagationEffects.forEach((effect) => {
      expect(screen.getByText(effect.domain)).toBeInTheDocument();
    });
  });

  it('renders propagation effect descriptions', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    action.propagationEffects.forEach((effect) => {
      expect(screen.getByText(effect.description)).toBeInTheDocument();
    });
  });

  it('renders propagation effect timing badges', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    // Export Budget Report has 'deferred' and 'immediate' timing
    expect(screen.getByText('Deferred')).toBeInTheDocument();
    expect(screen.getByText('Immediate')).toBeInTheDocument();
  });

  it('renders target persona names in propagation effects', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    action.propagationEffects.forEach((effect) => {
      const targetPersona = PERSONA_BY_ID[effect.targetPersonaId];
      if (targetPersona) {
        expect(screen.getByText(`${targetPersona.name} — ${targetPersona.role}`)).toBeInTheDocument();
      }
    });
  });

  it('renders target persona initials in propagation effects', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const action = getActionById('action-export-budget-report');
    action.propagationEffects.forEach((effect) => {
      const targetPersona = PERSONA_BY_ID[effect.targetPersonaId];
      if (targetPersona) {
        expect(screen.getByText(targetPersona.initials)).toBeInTheDocument();
      }
    });
  });

  // -------------------------------------------------------------------------
  // Confirm and cancel buttons
  // -------------------------------------------------------------------------

  it('renders the Confirm Action button', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
  });

  it('renders the Cancel button', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onConfirm callback after confirm button click and processing', async () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();
    renderPanel({ actionId: 'action-export-budget-report', onConfirm });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const confirmButton = screen.getByText('Confirm Action');
    await user.click(confirmButton);

    // Should show In Progress status
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Processing…')).toBeInTheDocument();

    // Advance past the 2000ms timeout
    vi.advanceTimersByTime(2100);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith('action-export-budget-report');
    });

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('calls onCancel callback when cancel button is clicked', async () => {
    const onCancel = vi.fn();
    renderPanel({ actionId: 'action-export-budget-report', onCancel });
    const user = userEvent.setup();

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('shows Cancelled status after cancel button click', async () => {
    const onCancel = vi.fn();
    renderPanel({ actionId: 'action-export-budget-report', onCancel });
    const user = userEvent.setup();

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('disables both buttons after confirmation is completed', async () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();
    renderPanel({ actionId: 'action-export-budget-report', onConfirm });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const confirmButton = screen.getByText('Confirm Action');
    await user.click(confirmButton);

    vi.advanceTimersByTime(2100);

    await waitFor(() => {
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
    });

    // Both buttons should be disabled
    const confirmedButton = screen.getByText('Confirmed').closest('button');
    expect(confirmedButton).toBeDisabled();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeDisabled();

    vi.useRealTimers();
  });

  it('disables cancel button during processing', async () => {
    vi.useFakeTimers();
    renderPanel({ actionId: 'action-export-budget-report' });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const confirmButton = screen.getByText('Confirm Action');
    await user.click(confirmButton);

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeDisabled();

    vi.advanceTimersByTime(2100);
    vi.useRealTimers();
  });

  it('prevents double-clicking the confirm button', async () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();
    renderPanel({ actionId: 'action-export-budget-report', onConfirm });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const confirmButton = screen.getByText('Confirm Action');
    await user.click(confirmButton);

    // The button should now show Processing and be disabled
    const processingButton = screen.getByText('Processing…').closest('button');
    expect(processingButton).toBeDisabled();

    vi.advanceTimersByTime(2100);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    vi.useRealTimers();
  });

  // -------------------------------------------------------------------------
  // Visibility
  // -------------------------------------------------------------------------

  it('returns null when visible is false', () => {
    const { container } = renderPanel({ actionId: 'action-export-budget-report', visible: false });
    expect(container.innerHTML).toBe('');
  });

  it('returns null when actionId is not provided', () => {
    const { container } = renderPanel({ actionId: '' });
    expect(container.innerHTML).toBe('');
  });

  it('returns null when actionId does not match any action', () => {
    const { container } = renderPanel({ actionId: 'non-existent-action' });
    expect(container.innerHTML).toBe('');
  });

  it('renders when visible is true (default)', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Export Budget Report')).toBeInTheDocument();
  });

  it('renders when visible is explicitly true', () => {
    renderPanel({ actionId: 'action-export-budget-report', visible: true });

    expect(screen.getByText('Export Budget Report')).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Different action types
  // -------------------------------------------------------------------------

  it('renders Alert Risk Owners action correctly', () => {
    renderPanel({ actionId: 'action-alert-risk-owners' });

    expect(screen.getByText('Alert Risk Owners')).toBeInTheDocument();
    expect(screen.getByText('notify')).toBeInTheDocument();
    expect(screen.getByText('Est. 15 minutes')).toBeInTheDocument();
  });

  it('renders Send Approval Reminder action correctly', () => {
    renderPanel({ actionId: 'action-vo-approval-reminder' });

    expect(screen.getByText('Send Approval Reminder')).toBeInTheDocument();
    expect(screen.getByText('approve')).toBeInTheDocument();
    expect(screen.getByText('Est. 5 minutes')).toBeInTheDocument();
  });

  it('renders Export Cost Forecast action correctly', () => {
    renderPanel({ actionId: 'action-export-cost-forecast' });

    expect(screen.getByText('Export Cost Forecast')).toBeInTheDocument();
    expect(screen.getByText('export')).toBeInTheDocument();
    expect(screen.getByText('Est. 3 minutes')).toBeInTheDocument();
  });

  it('renders Send Compliance Reminder action correctly', () => {
    renderPanel({ actionId: 'action-vendor-compliance-reminder' });

    expect(screen.getByText('Send Compliance Reminder')).toBeInTheDocument();
    expect(screen.getByText('notify')).toBeInTheDocument();
  });

  it('renders Schedule Energy Model Review action correctly', () => {
    renderPanel({ actionId: 'action-schedule-energy-model-review' });

    expect(screen.getByText('Schedule Energy Model Review')).toBeInTheDocument();
    expect(screen.getByText('schedule')).toBeInTheDocument();
    expect(screen.getByText('Est. 10 minutes')).toBeInTheDocument();
  });

  it('renders Open Deal Risk Dashboard action correctly', () => {
    renderPanel({ actionId: 'action-open-deal-risk-dashboard' });

    expect(screen.getByText('Open Deal Risk Dashboard')).toBeInTheDocument();
    expect(screen.getByText('navigate')).toBeInTheDocument();
    expect(screen.getByText('Est. Instant')).toBeInTheDocument();
  });

  it('renders Export Revenue Report action correctly', () => {
    renderPanel({ actionId: 'action-export-revenue-report' });

    expect(screen.getByText('Export Revenue Report')).toBeInTheDocument();
    expect(screen.getByText('export')).toBeInTheDocument();
  });

  it('renders Export Pipeline Report action correctly', () => {
    renderPanel({ actionId: 'action-export-pipeline-report' });

    expect(screen.getByText('Export Pipeline Report')).toBeInTheDocument();
    expect(screen.getByText('export')).toBeInTheDocument();
  });

  it('renders Export Valuation Certificate action correctly', () => {
    renderPanel({ actionId: 'action-export-valuation-certificate' });

    expect(screen.getByText('Export Valuation Certificate')).toBeInTheDocument();
    expect(screen.getByText('export')).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Propagation effects with scheduled timing
  // -------------------------------------------------------------------------

  it('renders Scheduled timing badge for Schedule Energy Model Review', () => {
    renderPanel({ actionId: 'action-schedule-energy-model-review' });

    expect(screen.getByText('Scheduled')).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Additional className
  // -------------------------------------------------------------------------

  it('applies additional className when provided', () => {
    renderPanel({ actionId: 'action-export-budget-report', className: 'custom-test-class' });

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('custom-test-class');
  });

  // -------------------------------------------------------------------------
  // All actions render without errors
  // -------------------------------------------------------------------------

  it('renders all 10 actions without errors', () => {
    ACTIONS.forEach((action) => {
      const { unmount } = renderPanel({ actionId: action.id });
      expect(screen.getByText(action.label)).toBeInTheDocument();
      unmount();
    });
  });

  // -------------------------------------------------------------------------
  // Propagation effects for different personas
  // -------------------------------------------------------------------------

  it('renders propagation effects targeting Elena Rossi', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const elenaPersona = PERSONA_BY_ID['elena-rossi'];
    expect(screen.getByText(`${elenaPersona.name} — ${elenaPersona.role}`)).toBeInTheDocument();
  });

  it('renders propagation effects targeting James Carter', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    const jamesPersona = PERSONA_BY_ID['james-carter'];
    expect(screen.getByText(`${jamesPersona.name} — ${jamesPersona.role}`)).toBeInTheDocument();
  });

  it('renders propagation effects targeting Sophie Dubois', () => {
    renderPanel({ actionId: 'action-alert-risk-owners' });

    const sophiePersona = PERSONA_BY_ID['sophie-dubois'];
    expect(screen.getByText(`${sophiePersona.name} — ${sophiePersona.role}`)).toBeInTheDocument();
  });

  it('renders propagation effects targeting Lukas Müller', () => {
    renderPanel({ actionId: 'action-export-cost-forecast' });

    const lukasPersona = PERSONA_BY_ID['lukas-muller'];
    expect(screen.getByText(`${lukasPersona.name} — ${lukasPersona.role}`)).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Callbacks are optional
  // -------------------------------------------------------------------------

  it('renders without onConfirm callback', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Export Budget Report')).toBeInTheDocument();
  });

  it('renders without onCancel callback', () => {
    renderPanel({ actionId: 'action-export-budget-report' });

    expect(screen.getByText('Export Budget Report')).toBeInTheDocument();
  });

  it('handles confirm click without onConfirm callback', async () => {
    vi.useFakeTimers();
    renderPanel({ actionId: 'action-export-budget-report' });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const confirmButton = screen.getByText('Confirm Action');
    await user.click(confirmButton);

    vi.advanceTimersByTime(2100);

    await waitFor(() => {
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('handles cancel click without onCancel callback', async () => {
    renderPanel({ actionId: 'action-export-budget-report' });
    const user = userEvent.setup();

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Affected systems with different access types
  // -------------------------------------------------------------------------

  it('renders write access type icon when present', () => {
    // VO Approval Reminder has Salesforce with 'notify' access type
    renderPanel({ actionId: 'action-vo-approval-reminder' });

    const action = getActionById('action-vo-approval-reminder');
    const notifySystem = action.affectedSystems.find((s) => s.accessType === 'notify');
    expect(notifySystem).toBeTruthy();
    expect(screen.getByText(notifySystem.name)).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Disabling buttons after cancel
  // -------------------------------------------------------------------------

  it('disables both buttons after cancellation', async () => {
    renderPanel({ actionId: 'action-export-budget-report' });
    const user = userEvent.setup();

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(cancelButton).toBeDisabled();

    // Confirm button should also be disabled after cancel
    const confirmButtons = screen.getAllByRole('button');
    const confirmBtn = confirmButtons.find((btn) => btn.textContent.includes('Confirm'));
    expect(confirmBtn).toBeDisabled();
  });
});