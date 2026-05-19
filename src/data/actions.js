/**
 * Mock action confirmation data for the Ask Dreeso Memory application.
 * Maps action IDs to confirmation panel content including action description,
 * affected systems, expected outcomes, cross-domain propagation effects,
 * and status indicators.
 * @module data/actions
 */

/**
 * @typedef {'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled'} ActionStatus
 */

/**
 * @typedef {Object} AffectedSystem
 * @property {string} systemId - ID of the affected system (matches SYSTEM_SOURCES)
 * @property {string} name - Human-readable system name
 * @property {string} impact - Description of the impact on this system
 * @property {'read' | 'write' | 'notify'} accessType - Type of system interaction
 */

/**
 * @typedef {Object} PropagationEffect
 * @property {string} domain - The cross-domain area affected
 * @property {string} description - Description of the propagation effect
 * @property {string} targetPersonaId - Persona ID who will be notified or affected
 * @property {'immediate' | 'deferred' | 'scheduled'} timing - When the effect takes place
 */

/**
 * @typedef {Object} ExpectedOutcome
 * @property {string} description - Description of the expected outcome
 * @property {string} metric - Metric or KPI affected
 * @property {string} expectedChange - Expected change description
 */

/**
 * @typedef {Object} ActionConfirmation
 * @property {string} id - Unique action identifier
 * @property {string} actionType - Action type ('navigate' | 'export' | 'notify' | 'schedule' | 'approve')
 * @property {string} label - Display label for the action
 * @property {string} description - Detailed description of what the action does
 * @property {string} target - Target identifier or URL for the action
 * @property {string} queryId - Associated query response ID
 * @property {string} personaId - Persona who initiated the action
 * @property {ActionStatus} status - Current status of the action
 * @property {AffectedSystem[]} affectedSystems - Systems affected by this action
 * @property {ExpectedOutcome[]} expectedOutcomes - Expected outcomes of the action
 * @property {PropagationEffect[]} propagationEffects - Cross-domain propagation effects
 * @property {string} confirmationMessage - Message displayed in the confirmation panel
 * @property {string} estimatedDuration - Estimated time to complete the action
 * @property {string} createdAt - ISO 8601 timestamp of action creation
 */

// ---------------------------------------------------------------------------
// Action Confirmations — mapped to query actions
// ---------------------------------------------------------------------------

/** @type {ActionConfirmation} */
export const ACTION_EXPORT_BUDGET_REPORT = {
  id: 'action-export-budget-report',
  actionType: 'export',
  label: 'Export Budget Report',
  description:
    'Generates a comprehensive budget status report combining SAP FI cost data and Procore budget tracking information. The report includes cumulative spend, CPI analysis, forecast-at-completion, and variance breakdown by cost category.',
  target: 'report/budget-status-q1',
  queryId: 'query-01',
  personaId: 'lukas-muller',
  status: 'pending',
  affectedSystems: [
    {
      systemId: 'sap-fi',
      name: 'SAP FI',
      impact: 'Read cost data and generate financial summary extract',
      accessType: 'read',
    },
    {
      systemId: 'procore',
      name: 'Procore',
      impact: 'Read budget tracker data and earned-value metrics',
      accessType: 'read',
    },
  ],
  expectedOutcomes: [
    {
      description: 'PDF report generated with budget status overview',
      metric: 'Report completeness',
      expectedChange: 'Full Q1 budget report available for download',
    },
    {
      description: 'Cost variance analysis included in report',
      metric: 'CPI tracking',
      expectedChange: 'CPI trend visualised over last 6 months',
    },
  ],
  propagationEffects: [
    {
      domain: 'Commercial',
      description: 'Budget report shared with commercial team for variation order alignment',
      targetPersonaId: 'james-carter',
      timing: 'deferred',
    },
    {
      domain: 'Procurement',
      description: 'Cost overrun data flagged for procurement review on steel packages',
      targetPersonaId: 'elena-rossi',
      timing: 'immediate',
    },
  ],
  confirmationMessage:
    'The budget status report will be generated from SAP FI and Procore data. This may take up to 2 minutes. The report will be available in your downloads and shared with relevant stakeholders.',
  estimatedDuration: '2 minutes',
  createdAt: '2026-04-30T09:15:00Z',
};

/** @type {ActionConfirmation} */
export const ACTION_ALERT_RISK_OWNERS = {
  id: 'action-alert-risk-owners',
  actionType: 'notify',
  label: 'Alert Risk Owners',
  description:
    'Sends automated notifications to all risk owners for the 12 open risks identified in the weekly risk review. Notifications include risk severity, required mitigation actions, and response deadlines.',
  target: 'notification/risk-weekly-alert',
  queryId: 'query-03',
  personaId: 'lukas-muller',
  status: 'pending',
  affectedSystems: [
    {
      systemId: 'procore',
      name: 'Procore',
      impact: 'Read risk register and owner assignments',
      accessType: 'read',
    },
    {
      systemId: 'primavera-p6',
      name: 'Primavera P6',
      impact: 'Read schedule impact analysis for risk context',
      accessType: 'read',
    },
    {
      systemId: 'workday',
      name: 'Workday',
      impact: 'Send notifications to risk owner contact details',
      accessType: 'notify',
    },
  ],
  expectedOutcomes: [
    {
      description: 'All 12 risk owners receive notification with action items',
      metric: 'Notification delivery rate',
      expectedChange: '100% delivery within 15 minutes',
    },
    {
      description: 'Risk response tracking initiated',
      metric: 'Risk response rate',
      expectedChange: 'Expected 80% acknowledgement within 24 hours',
    },
  ],
  propagationEffects: [
    {
      domain: 'Procurement',
      description: 'Supply-chain risk alerts forwarded to procurement lead for curtain-wall delivery risk',
      targetPersonaId: 'elena-rossi',
      timing: 'immediate',
    },
    {
      domain: 'Sustainability',
      description: 'Environmental risk items flagged for ESG compliance review',
      targetPersonaId: 'sophie-dubois',
      timing: 'deferred',
    },
  ],
  confirmationMessage:
    'Notifications will be sent to all 12 risk owners via email and in-app alerts. Each notification includes the risk description, severity rating, required actions, and a 48-hour response deadline.',
  estimatedDuration: '15 minutes',
  createdAt: '2026-04-30T10:30:00Z',
};

/** @type {ActionConfirmation} */
export const ACTION_VO_APPROVAL_REMINDER = {
  id: 'action-vo-approval-reminder',
  actionType: 'approve',
  label: 'Send Approval Reminder',
  description:
    'Sends approval reminders to the client for five pending variation orders totalling €1.8M. Includes VO summary, cost impact, and schedule implications for each variation order.',
  target: 'workflow/vo-approval-reminder',
  queryId: 'query-05',
  personaId: 'lukas-muller',
  status: 'pending',
  affectedSystems: [
    {
      systemId: 'sap-fi',
      name: 'SAP FI',
      impact: 'Read variation order financial details and cost impact',
      accessType: 'read',
    },
    {
      systemId: 'salesforce',
      name: 'Salesforce',
      impact: 'Send approval workflow reminders to client contacts',
      accessType: 'notify',
    },
  ],
  expectedOutcomes: [
    {
      description: 'Client receives consolidated VO approval request',
      metric: 'Approval cycle time',
      expectedChange: 'Target reduction from 18 days to 12 days average',
    },
    {
      description: 'VO-041 prioritised for expedited review',
      metric: 'Pending VO value',
      expectedChange: 'Expected €720K approved within 10 business days',
    },
  ],
  propagationEffects: [
    {
      domain: 'Commercial',
      description: 'Sales team notified of pending VO approvals for client relationship management',
      targetPersonaId: 'james-carter',
      timing: 'immediate',
    },
    {
      domain: 'Procurement',
      description: 'Procurement alerted to prepare material orders pending VO-044 fire-stopping approval',
      targetPersonaId: 'elena-rossi',
      timing: 'deferred',
    },
  ],
  confirmationMessage:
    'Approval reminders will be sent to the client project manager and authorised signatories for all 5 pending variation orders. A consolidated summary with cost and schedule impact will be attached.',
  estimatedDuration: '5 minutes',
  createdAt: '2026-04-30T11:00:00Z',
};

/** @type {ActionConfirmation} */
export const ACTION_EXPORT_COST_FORECAST = {
  id: 'action-export-cost-forecast',
  actionType: 'export',
  label: 'Export Cost Forecast',
  description:
    'Generates a detailed cost-to-complete forecast report from SAP FI and SAP MM data. Includes package-level breakdown, contingency analysis, and trend projections.',
  target: 'report/cost-to-complete',
  queryId: 'query-06',
  personaId: 'elena-rossi',
  status: 'pending',
  affectedSystems: [
    {
      systemId: 'sap-fi',
      name: 'SAP FI',
      impact: 'Read cost forecast data and contingency drawdown history',
      accessType: 'read',
    },
    {
      systemId: 'sap-mm',
      name: 'SAP MM',
      impact: 'Read package-level cost summaries and committed values',
      accessType: 'read',
    },
  ],
  expectedOutcomes: [
    {
      description: 'Comprehensive cost forecast report generated',
      metric: 'Forecast accuracy',
      expectedChange: 'Updated forecast reflecting re-tender savings of €300K',
    },
    {
      description: 'Contingency analysis included with drawdown projections',
      metric: 'Contingency remaining',
      expectedChange: '€570K reserve documented with projected utilisation timeline',
    },
  ],
  propagationEffects: [
    {
      domain: 'Project Management',
      description: 'Cost forecast shared with project director for budget review meeting',
      targetPersonaId: 'lukas-muller',
      timing: 'immediate',
    },
    {
      domain: 'Sustainability',
      description: 'Low-carbon material premium costs highlighted for ESG budget reconciliation',
      targetPersonaId: 'sophie-dubois',
      timing: 'deferred',
    },
  ],
  confirmationMessage:
    'The cost-to-complete forecast report will be generated from SAP FI and SAP MM data. The report includes package-level breakdown, contingency analysis, and comparison against baseline. Estimated generation time is 3 minutes.',
  estimatedDuration: '3 minutes',
  createdAt: '2026-04-28T14:20:00Z',
};

/** @type {ActionConfirmation} */
export const ACTION_VENDOR_COMPLIANCE_REMINDER = {
  id: 'action-vendor-compliance-reminder',
  actionType: 'notify',
  label: 'Send Compliance Reminder',
  description:
    'Sends an automated compliance reminder to the electrical subcontractor (VND-E-017) regarding their pending ISO 14001 renewal due within 15 days. Includes required documentation checklist and submission deadline.',
  target: 'notification/vendor-compliance-reminder',
  queryId: 'query-09',
  personaId: 'elena-rossi',
  status: 'pending',
  affectedSystems: [
    {
      systemId: 'vendor-compliance-db',
      name: 'Vendor Compliance DB',
      impact: 'Read vendor compliance status and certification expiry dates',
      accessType: 'read',
    },
    {
      systemId: 'nen-compliance-db',
      name: 'NEN Compliance DB',
      impact: 'Verify NEN standards requirements for ISO 14001 renewal',
      accessType: 'read',
    },
  ],
  expectedOutcomes: [
    {
      description: 'Vendor receives compliance reminder with documentation checklist',
      metric: 'Vendor compliance rate',
      expectedChange: 'Target 100% compliance maintained (currently 96%)',
    },
    {
      description: 'ISO 14001 renewal tracked with escalation timeline',
      metric: 'Certification renewal time',
      expectedChange: 'Expected renewal within 10 business days',
    },
  ],
  propagationEffects: [
    {
      domain: 'Project Management',
      description: 'Project director notified of potential vendor compliance gap in electrical package',
      targetPersonaId: 'lukas-muller',
      timing: 'deferred',
    },
    {
      domain: 'Sustainability',
      description: 'ESG team alerted as ISO 14001 is a BREEAM credit requirement for vendor management',
      targetPersonaId: 'sophie-dubois',
      timing: 'deferred',
    },
  ],
  confirmationMessage:
    'A compliance reminder will be sent to vendor VND-E-017 (electrical subcontractor) regarding ISO 14001 renewal. The notification includes a documentation checklist, submission portal link, and a 10-business-day deadline. An escalation will trigger automatically if no response is received within 5 days.',
  estimatedDuration: '5 minutes',
  createdAt: '2026-04-30T09:45:00Z',
};

/** @type {ActionConfirmation} */
export const ACTION_EXPORT_VALUATION_CERTIFICATE = {
  id: 'action-export-valuation-certificate',
  actionType: 'export',
  label: 'Export Valuation Certificate',
  description:
    'Generates the official IPC-09 interim payment certificate with full trade-level breakdown, retention summary, and cumulative valuation history.',
  target: 'report/ipc-09-certificate',
  queryId: 'query-10',
  personaId: 'elena-rossi',
  status: 'pending',
  affectedSystems: [
    {
      systemId: 'sap-fi',
      name: 'SAP FI',
      impact: 'Read certified payment amounts and retention calculations',
      accessType: 'read',
    },
    {
      systemId: 'procore',
      name: 'Procore',
      impact: 'Read valuation submissions and approval records',
      accessType: 'read',
    },
  ],
  expectedOutcomes: [
    {
      description: 'IPC-09 certificate generated in PDF format',
      metric: 'Certificate accuracy',
      expectedChange: '€2.3M certified amount documented with trade breakdown',
    },
    {
      description: 'Retention summary included for audit trail',
      metric: 'Retention tracking',
      expectedChange: '€1.9M retention held documented with release schedule',
    },
  ],
  propagationEffects: [
    {
      domain: 'Project Management',
      description: 'Valuation certificate shared with project director for sign-off',
      targetPersonaId: 'lukas-muller',
      timing: 'immediate',
    },
    {
      domain: 'Commercial',
      description: 'Commercial team updated on certified amounts for client reporting',
      targetPersonaId: 'james-carter',
      timing: 'deferred',
    },
  ],
  confirmationMessage:
    'The IPC-09 valuation certificate will be generated from SAP FI and Procore data. The certificate includes trade-level breakdown, cumulative valuation history, and retention summary. It will be available for download and sent to the project director for sign-off.',
  estimatedDuration: '3 minutes',
  createdAt: '2026-04-25T16:00:00Z',
};

/** @type {ActionConfirmation} */
export const ACTION_SCHEDULE_ENERGY_MODEL_REVIEW = {
  id: 'action-schedule-energy-model-review',
  actionType: 'schedule',
  label: 'Schedule Energy Model Review',
  description:
    'Schedules a cross-functional review meeting for the energy-model validation milestone. Invites include the sustainability team, MEP consultants, and building envelope specialists.',
  target: 'calendar/energy-model-review',
  queryId: 'query-12',
  personaId: 'sophie-dubois',
  status: 'pending',
  affectedSystems: [
    {
      systemId: 'primavera-p6',
      name: 'Primavera P6',
      impact: 'Read milestone dependencies and schedule constraints',
      accessType: 'read',
    },
    {
      systemId: 'esg-registry',
      name: 'ESG Registry',
      impact: 'Read energy-model requirements and BREEAM credit dependencies',
      accessType: 'read',
    },
    {
      systemId: 'workday',
      name: 'Workday',
      impact: 'Check team availability and send calendar invitations',
      accessType: 'notify',
    },
  ],
  expectedOutcomes: [
    {
      description: 'Review meeting scheduled with all required participants',
      metric: 'Milestone readiness',
      expectedChange: 'Energy-model validation preparation advanced by 1 week',
    },
    {
      description: 'Pre-meeting documentation package distributed',
      metric: 'Meeting effectiveness',
      expectedChange: 'All participants briefed with air-tightness test results and model inputs',
    },
  ],
  propagationEffects: [
    {
      domain: 'Project Management',
      description: 'Project director invited to review meeting for milestone sign-off authority',
      targetPersonaId: 'lukas-muller',
      timing: 'scheduled',
    },
    {
      domain: 'Procurement',
      description: 'Procurement lead notified of any material requirements arising from energy model review',
      targetPersonaId: 'elena-rossi',
      timing: 'deferred',
    },
  ],
  confirmationMessage:
    'A cross-functional energy-model review meeting will be scheduled within the next 5 business days. Calendar invitations will be sent to the sustainability team, MEP consultants, building envelope specialists, and the project director. A pre-meeting briefing pack will be distributed 48 hours before the meeting.',
  estimatedDuration: '10 minutes',
  createdAt: '2026-04-29T13:00:00Z',
};

/** @type {ActionConfirmation} */
export const ACTION_EXPORT_REVENUE_REPORT = {
  id: 'action-export-revenue-report',
  actionType: 'export',
  label: 'Export Revenue Report',
  description:
    'Generates a revenue vs. target report combining Salesforce booking data and SAP FI revenue ledger entries. Includes quarterly breakdown, pipeline forecast, and attainment analysis.',
  target: 'report/revenue-vs-target-q1',
  queryId: 'query-16',
  personaId: 'james-carter',
  status: 'pending',
  affectedSystems: [
    {
      systemId: 'salesforce',
      name: 'Salesforce',
      impact: 'Read booking data, pipeline opportunities, and conversion metrics',
      accessType: 'read',
    },
    {
      systemId: 'sap-fi',
      name: 'SAP FI',
      impact: 'Read revenue ledger entries and financial reconciliation data',
      accessType: 'read',
    },
  ],
  expectedOutcomes: [
    {
      description: 'Revenue report generated with quarterly breakdown',
      metric: 'Revenue attainment',
      expectedChange: '84% attainment documented with path-to-target analysis',
    },
    {
      description: 'Pipeline forecast included with probability weighting',
      metric: 'Forecast accuracy',
      expectedChange: '€3.4M weighted forecast documented for next 90 days',
    },
  ],
  propagationEffects: [
    {
      domain: 'Project Management',
      description: 'Revenue report shared with project director for executive steering committee',
      targetPersonaId: 'lukas-muller',
      timing: 'deferred',
    },
    {
      domain: 'Sustainability',
      description: 'Green incentive revenue highlighted for ESG reporting alignment',
      targetPersonaId: 'sophie-dubois',
      timing: 'deferred',
    },
  ],
  confirmationMessage:
    'The revenue vs. target report will be generated from Salesforce and SAP FI data. The report includes quarterly revenue breakdown, pipeline forecast, attainment analysis, and new booking details. It will be available for download within 2 minutes.',
  estimatedDuration: '2 minutes',
  createdAt: '2026-04-30T08:30:00Z',
};

/** @type {ActionConfirmation} */
export const ACTION_OPEN_DEAL_RISK_DASHBOARD = {
  id: 'action-open-deal-risk-dashboard',
  actionType: 'navigate',
  label: 'Open Deal Risk Dashboard',
  description:
    'Navigates to the deal risk dashboard showing detailed risk profiles for the two at-risk deals: TechCorp BV (floor 8) and Café Bloom (ground-floor retail). Includes mitigation strategies and approval workflows.',
  target: 'dashboard/deal-risk',
  queryId: 'query-18',
  personaId: 'james-carter',
  status: 'pending',
  affectedSystems: [
    {
      systemId: 'salesforce',
      name: 'Salesforce',
      impact: 'Read deal risk profiles, mitigation strategies, and negotiation history',
      accessType: 'read',
    },
    {
      systemId: 'sap-fi',
      name: 'SAP FI',
      impact: 'Read credit assessment data and financial risk indicators',
      accessType: 'read',
    },
  ],
  expectedOutcomes: [
    {
      description: 'Deal risk dashboard displayed with real-time data',
      metric: 'Risk visibility',
      expectedChange: 'Full risk profile visible for both at-risk deals',
    },
    {
      description: 'Mitigation action tracking enabled',
      metric: 'Deal conversion',
      expectedChange: 'Stepped-rent proposal and bank guarantee workflows accessible',
    },
  ],
  propagationEffects: [
    {
      domain: 'Project Management',
      description: 'Project director alerted if deal risks impact project revenue assumptions',
      targetPersonaId: 'lukas-muller',
      timing: 'deferred',
    },
    {
      domain: 'Procurement',
      description: 'Procurement notified of potential fit-out scope changes if floor 8 deal terms change',
      targetPersonaId: 'elena-rossi',
      timing: 'deferred',
    },
  ],
  confirmationMessage:
    'Opening the deal risk dashboard with real-time data from Salesforce and SAP FI. The dashboard shows risk profiles, mitigation strategies, and approval workflows for the two at-risk deals.',
  estimatedDuration: 'Instant',
  createdAt: '2026-04-30T11:45:00Z',
};

/** @type {ActionConfirmation} */
export const ACTION_EXPORT_PIPELINE_REPORT = {
  id: 'action-export-pipeline-report',
  actionType: 'export',
  label: 'Export Pipeline Report',
  description:
    'Generates a sales pipeline report with opportunity-level detail, stage distribution, probability weighting, and velocity metrics. Includes comparison against previous quarter.',
  target: 'report/sales-pipeline-q1',
  queryId: 'query-19',
  personaId: 'james-carter',
  status: 'pending',
  affectedSystems: [
    {
      systemId: 'salesforce',
      name: 'Salesforce',
      impact: 'Read pipeline opportunities, stage data, and win-rate history',
      accessType: 'read',
    },
    {
      systemId: 'sap-fi',
      name: 'SAP FI',
      impact: 'Read revenue forecast and financial projections',
      accessType: 'read',
    },
  ],
  expectedOutcomes: [
    {
      description: 'Pipeline report generated with opportunity-level detail',
      metric: 'Pipeline value',
      expectedChange: '€5.2M pipeline documented with stage distribution',
    },
    {
      description: 'Velocity metrics and quarter-over-quarter comparison included',
      metric: 'Pipeline velocity',
      expectedChange: '12% velocity improvement documented vs. last quarter',
    },
  ],
  propagationEffects: [
    {
      domain: 'Project Management',
      description: 'Pipeline report shared with project director for resource planning alignment',
      targetPersonaId: 'lukas-muller',
      timing: 'deferred',
    },
    {
      domain: 'Sustainability',
      description: 'Tenant ESG requirements from pipeline deals flagged for sustainability planning',
      targetPersonaId: 'sophie-dubois',
      timing: 'deferred',
    },
  ],
  confirmationMessage:
    'The sales pipeline report will be generated from Salesforce and SAP FI data. The report includes opportunity-level detail, stage distribution, probability weighting, velocity metrics, and quarter-over-quarter comparison. Available for download within 2 minutes.',
  estimatedDuration: '2 minutes',
  createdAt: '2026-04-30T15:00:00Z',
};

// ---------------------------------------------------------------------------
// Aggregated exports
// ---------------------------------------------------------------------------

/**
 * All action confirmations for Lukas Müller.
 * @type {ActionConfirmation[]}
 */
export const LUKAS_ACTIONS = [
  ACTION_EXPORT_BUDGET_REPORT,
  ACTION_ALERT_RISK_OWNERS,
  ACTION_VO_APPROVAL_REMINDER,
];

/**
 * All action confirmations for Elena Rossi.
 * @type {ActionConfirmation[]}
 */
export const ELENA_ACTIONS = [
  ACTION_EXPORT_COST_FORECAST,
  ACTION_VENDOR_COMPLIANCE_REMINDER,
  ACTION_EXPORT_VALUATION_CERTIFICATE,
];

/**
 * All action confirmations for Sophie Dubois.
 * @type {ActionConfirmation[]}
 */
export const SOPHIE_ACTIONS = [
  ACTION_SCHEDULE_ENERGY_MODEL_REVIEW,
];

/**
 * All action confirmations for James Carter.
 * @type {ActionConfirmation[]}
 */
export const JAMES_ACTIONS = [
  ACTION_EXPORT_REVENUE_REPORT,
  ACTION_OPEN_DEAL_RISK_DASHBOARD,
  ACTION_EXPORT_PIPELINE_REPORT,
];

/**
 * Complete list of all action confirmations (10 total).
 * @type {ActionConfirmation[]}
 */
export const ACTIONS = [
  ...LUKAS_ACTIONS,
  ...ELENA_ACTIONS,
  ...SOPHIE_ACTIONS,
  ...JAMES_ACTIONS,
];

/**
 * Lookup map of action confirmations grouped by persona ID.
 * @type {Record<string, ActionConfirmation[]>}
 */
export const ACTIONS_BY_PERSONA = {
  'lukas-muller': LUKAS_ACTIONS,
  'elena-rossi': ELENA_ACTIONS,
  'sophie-dubois': SOPHIE_ACTIONS,
  'james-carter': JAMES_ACTIONS,
};

/**
 * Lookup map of action confirmations keyed by their unique ID.
 * @type {Record<string, ActionConfirmation>}
 */
export const ACTION_BY_ID = ACTIONS.reduce((map, action) => {
  map[action.id] = action;
  return map;
}, {});

/**
 * Lookup map of action confirmations keyed by their target.
 * @type {Record<string, ActionConfirmation>}
 */
export const ACTION_BY_TARGET = ACTIONS.reduce((map, action) => {
  map[action.target] = action;
  return map;
}, {});

/**
 * Lookup map of action confirmations keyed by their associated query ID.
 * @type {Record<string, ActionConfirmation[]>}
 */
export const ACTIONS_BY_QUERY = ACTIONS.reduce((map, action) => {
  if (!map[action.queryId]) {
    map[action.queryId] = [];
  }
  map[action.queryId].push(action);
  return map;
}, {});

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/**
 * Retrieves an action confirmation by its unique identifier.
 * @param {string} id - The action ID to look up
 * @returns {ActionConfirmation|undefined} The matching action, or undefined if not found
 */
export const getActionById = (id) => ACTION_BY_ID[id];

/**
 * Retrieves all action confirmations associated with a given persona ID.
 * @param {string} personaId - The persona identifier
 * @returns {ActionConfirmation[]} Array of action confirmations for the specified persona
 */
export const getActionsByPersona = (personaId) =>
  ACTIONS_BY_PERSONA[personaId] || [];

/**
 * Retrieves all action confirmations associated with a given query ID.
 * @param {string} queryId - The query identifier
 * @returns {ActionConfirmation[]} Array of action confirmations for the specified query
 */
export const getActionsByQuery = (queryId) =>
  ACTIONS_BY_QUERY[queryId] || [];

/**
 * Retrieves an action confirmation by its target identifier.
 * @param {string} target - The target identifier to look up
 * @returns {ActionConfirmation|undefined} The matching action, or undefined if not found
 */
export const getActionByTarget = (target) => ACTION_BY_TARGET[target];

/**
 * Retrieves all action confirmations matching a given action type.
 * @param {string} actionType - The action type to filter by ('navigate' | 'export' | 'notify' | 'schedule' | 'approve')
 * @returns {ActionConfirmation[]} Array of action confirmations with the specified type
 */
export const getActionsByType = (actionType) =>
  ACTIONS.filter((action) => action.actionType === actionType);

/**
 * Retrieves all action confirmations matching a given status.
 * @param {ActionStatus} status - The status to filter by
 * @returns {ActionConfirmation[]} Array of action confirmations with the specified status
 */
export const getActionsByStatus = (status) =>
  ACTIONS.filter((action) => action.status === status);

/**
 * Retrieves all action confirmations that affect a given system.
 * @param {string} systemId - The system identifier to search for
 * @returns {ActionConfirmation[]} Array of action confirmations affecting the specified system
 */
export const getActionsByAffectedSystem = (systemId) =>
  ACTIONS.filter((action) =>
    action.affectedSystems.some((sys) => sys.systemId === systemId),
  );

/**
 * Retrieves all propagation effects targeting a given persona.
 * @param {string} personaId - The target persona identifier
 * @returns {Array<{action: ActionConfirmation, effect: PropagationEffect}>} Array of action-effect pairs
 */
export const getPropagationEffectsForPersona = (personaId) =>
  ACTIONS.reduce((results, action) => {
    const effects = action.propagationEffects.filter(
      (effect) => effect.targetPersonaId === personaId,
    );
    effects.forEach((effect) => {
      results.push({ action, effect });
    });
    return results;
  }, []);

/**
 * Retrieves all propagation effects with a given timing.
 * @param {'immediate' | 'deferred' | 'scheduled'} timing - The timing to filter by
 * @returns {Array<{action: ActionConfirmation, effect: PropagationEffect}>} Array of action-effect pairs
 */
export const getPropagationEffectsByTiming = (timing) =>
  ACTIONS.reduce((results, action) => {
    const effects = action.propagationEffects.filter(
      (effect) => effect.timing === timing,
    );
    effects.forEach((effect) => {
      results.push({ action, effect });
    });
    return results;
  }, []);