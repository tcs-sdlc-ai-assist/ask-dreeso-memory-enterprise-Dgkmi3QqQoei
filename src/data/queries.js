/**
 * Mock query-response data for the Ask Dreeso Memory application.
 * Maps persona + query text to structured responses including answer text,
 * source citations, active systems, CTA bubble suggestions, and optional action triggers.
 * Includes autosuggest entries (4-6 per persona) and the complete 20-screen query flow sequence.
 * @module data/queries
 */

/**
 * @typedef {Object} SourceCitation
 * @property {string} systemId - ID of the source system (matches SYSTEM_SOURCES)
 * @property {string} label - Human-readable citation label
 * @property {string} reference - Document or record reference identifier
 * @property {string} date - Date of the cited record (ISO 8601)
 */

/**
 * @typedef {Object} ActionTrigger
 * @property {string} type - Action type ('navigate' | 'export' | 'notify' | 'schedule' | 'approve')
 * @property {string} label - Display label for the action button
 * @property {string} target - Target identifier or URL for the action
 */

/**
 * @typedef {Object} QueryResponse
 * @property {string} id - Unique response identifier
 * @property {string} personaId - Associated persona identifier
 * @property {string} query - The query text that triggers this response
 * @property {string} answer - Structured answer text
 * @property {SourceCitation[]} citations - Source citations backing the answer
 * @property {string[]} activeSystems - IDs of systems actively queried
 * @property {string[]} ctaBubbles - Suggested follow-up query bubbles
 * @property {ActionTrigger[]} [actions] - Optional action triggers
 * @property {string[]} [relatedClusterIds] - Optional related intelligence cluster IDs
 */

/**
 * @typedef {Object} AutosuggestEntry
 * @property {string} id - Unique autosuggest identifier
 * @property {string} personaId - Associated persona identifier
 * @property {string} text - Suggested query text
 * @property {string} category - Category label for grouping suggestions
 * @property {number} priority - Sort priority (lower = higher priority)
 */

/**
 * @typedef {Object} ScreenFlowEntry
 * @property {number} screen - Screen number (1-20)
 * @property {string} queryId - ID of the query response to display
 * @property {string} personaId - Active persona for this screen
 * @property {string} description - Brief description of the screen purpose
 */

// ---------------------------------------------------------------------------
// Autosuggest entries — 4-6 per persona
// ---------------------------------------------------------------------------

/** @type {AutosuggestEntry[]} */
export const LUKAS_AUTOSUGGEST = [
  {
    id: 'suggest-lukas-1',
    personaId: 'lukas-muller',
    text: 'What is the current project budget status?',
    category: 'Budget',
    priority: 1,
  },
  {
    id: 'suggest-lukas-2',
    personaId: 'lukas-muller',
    text: 'Show me the critical path schedule',
    category: 'Schedule',
    priority: 2,
  },
  {
    id: 'suggest-lukas-3',
    personaId: 'lukas-muller',
    text: 'What are the top risks this week?',
    category: 'Risk',
    priority: 3,
  },
  {
    id: 'suggest-lukas-4',
    personaId: 'lukas-muller',
    text: 'How many workers are on-site today?',
    category: 'Resource',
    priority: 4,
  },
  {
    id: 'suggest-lukas-5',
    personaId: 'lukas-muller',
    text: 'Summarise pending variation orders',
    category: 'Commercial',
    priority: 5,
  },
];

/** @type {AutosuggestEntry[]} */
export const ELENA_AUTOSUGGEST = [
  {
    id: 'suggest-elena-1',
    personaId: 'elena-rossi',
    text: 'What is the cost-to-complete forecast?',
    category: 'Budget',
    priority: 1,
  },
  {
    id: 'suggest-elena-2',
    personaId: 'elena-rossi',
    text: 'Which procurement packages are still open?',
    category: 'Procurement',
    priority: 2,
  },
  {
    id: 'suggest-elena-3',
    personaId: 'elena-rossi',
    text: 'Are there any supply-chain risks?',
    category: 'Risk',
    priority: 3,
  },
  {
    id: 'suggest-elena-4',
    personaId: 'elena-rossi',
    text: 'Show vendor compliance status',
    category: 'Compliance',
    priority: 4,
  },
  {
    id: 'suggest-elena-5',
    personaId: 'elena-rossi',
    text: 'What was certified in the latest valuation?',
    category: 'Commercial',
    priority: 5,
  },
  {
    id: 'suggest-elena-6',
    personaId: 'elena-rossi',
    text: 'List critical-path material deliveries',
    category: 'Resource',
    priority: 6,
  },
];

/** @type {AutosuggestEntry[]} */
export const SOPHIE_AUTOSUGGEST = [
  {
    id: 'suggest-sophie-1',
    personaId: 'sophie-dubois',
    text: 'How is the sustainability budget tracking?',
    category: 'Budget',
    priority: 1,
  },
  {
    id: 'suggest-sophie-2',
    personaId: 'sophie-dubois',
    text: 'What ESG milestones are upcoming?',
    category: 'Schedule',
    priority: 2,
  },
  {
    id: 'suggest-sophie-3',
    personaId: 'sophie-dubois',
    text: 'Show environmental risk register',
    category: 'Risk',
    priority: 3,
  },
  {
    id: 'suggest-sophie-4',
    personaId: 'sophie-dubois',
    text: 'What is our BREEAM credit status?',
    category: 'Compliance',
    priority: 4,
  },
  {
    id: 'suggest-sophie-5',
    personaId: 'sophie-dubois',
    text: 'What percentage of materials are low-carbon?',
    category: 'Resource',
    priority: 5,
  },
];

/** @type {AutosuggestEntry[]} */
export const JAMES_AUTOSUGGEST = [
  {
    id: 'suggest-james-1',
    personaId: 'james-carter',
    text: 'What is our revenue vs. target?',
    category: 'Budget',
    priority: 1,
  },
  {
    id: 'suggest-james-2',
    personaId: 'james-carter',
    text: 'Show the leasing progress timeline',
    category: 'Schedule',
    priority: 2,
  },
  {
    id: 'suggest-james-3',
    personaId: 'james-carter',
    text: 'Are there any at-risk deals?',
    category: 'Risk',
    priority: 3,
  },
  {
    id: 'suggest-james-4',
    personaId: 'james-carter',
    text: 'What is the current sales pipeline value?',
    category: 'Commercial',
    priority: 4,
  },
  {
    id: 'suggest-james-5',
    personaId: 'james-carter',
    text: 'Show contract compliance summary',
    category: 'Compliance',
    priority: 5,
  },
  {
    id: 'suggest-james-6',
    personaId: 'james-carter',
    text: 'How is the sales team performing?',
    category: 'Resource',
    priority: 6,
  },
];

/**
 * All autosuggest entries across all personas.
 * @type {AutosuggestEntry[]}
 */
export const AUTOSUGGEST_ENTRIES = [
  ...LUKAS_AUTOSUGGEST,
  ...ELENA_AUTOSUGGEST,
  ...SOPHIE_AUTOSUGGEST,
  ...JAMES_AUTOSUGGEST,
];

/**
 * Autosuggest entries grouped by persona ID.
 * @type {Record<string, AutosuggestEntry[]>}
 */
export const AUTOSUGGEST_BY_PERSONA = {
  'lukas-muller': LUKAS_AUTOSUGGEST,
  'elena-rossi': ELENA_AUTOSUGGEST,
  'sophie-dubois': SOPHIE_AUTOSUGGEST,
  'james-carter': JAMES_AUTOSUGGEST,
};

// ---------------------------------------------------------------------------
// Query-Response data — 20 entries for the full screen flow
// ---------------------------------------------------------------------------

/** @type {QueryResponse} */
export const QUERY_01 = {
  id: 'query-01',
  personaId: 'lukas-muller',
  query: 'What is the current project budget status?',
  answer:
    'Current cumulative spend is €42.6M against a €45M baseline budget. The Cost Performance Index (CPI) stands at 0.97, indicating a slight overrun trend. Forecast-at-completion is projected at €46.2M, primarily driven by rising structural steel prices. Immediate mitigation is recommended on the steel packages to contain the overrun.',
  citations: [
    {
      systemId: 'sap-fi',
      label: 'SAP FI — Cost Report',
      reference: 'FI-CR-2026-Q1-047',
      date: '2026-04-28',
    },
    {
      systemId: 'procore',
      label: 'Procore — Budget Tracker',
      reference: 'PC-BT-DREESO-112',
      date: '2026-04-27',
    },
  ],
  activeSystems: ['sap-fi', 'procore'],
  ctaBubbles: [
    'Show me the steel cost breakdown',
    'What mitigation actions are available?',
    'Compare budget vs. forecast trend',
  ],
  actions: [
    {
      type: 'export',
      label: 'Export Budget Report',
      target: 'report/budget-status-q1',
    },
  ],
  relatedClusterIds: ['cluster-lukas-budget'],
};

/** @type {QueryResponse} */
export const QUERY_02 = {
  id: 'query-02',
  personaId: 'lukas-muller',
  query: 'Show me the critical path schedule',
  answer:
    'The critical path currently shows a 4-day positive float after accelerating MEP rough-in on floors 3–5. Two near-critical paths through façade installation carry only 2 days of float. The next critical milestone is the curtain-wall installation start on May 15, which depends on material delivery confirmation from the supplier.',
  citations: [
    {
      systemId: 'primavera-p6',
      label: 'Primavera P6 — Schedule Analysis',
      reference: 'P6-SA-DREESO-089',
      date: '2026-04-29',
    },
    {
      systemId: 'procore',
      label: 'Procore — Milestone Tracker',
      reference: 'PC-MT-DREESO-056',
      date: '2026-04-28',
    },
  ],
  activeSystems: ['primavera-p6', 'procore'],
  ctaBubbles: [
    'What is the façade installation timeline?',
    'Show near-critical path details',
    'When is the next major milestone?',
  ],
  relatedClusterIds: ['cluster-lukas-schedule'],
};

/** @type {QueryResponse} */
export const QUERY_03 = {
  id: 'query-03',
  personaId: 'lukas-muller',
  query: 'What are the top risks this week?',
  answer:
    'Twelve risks remain open. The top three are: (1) Curtain-wall delivery delay — probability 65%, impact €1.2M; (2) Welder shortage impacting structural steel schedule — probability 45%, impact 8 days delay; (3) Concrete supplier capacity constraint — probability 30%, impact €400K. Three risks were closed this week following successful concrete pour inspections.',
  citations: [
    {
      systemId: 'procore',
      label: 'Procore — Risk Register',
      reference: 'PC-RR-DREESO-034',
      date: '2026-04-30',
    },
    {
      systemId: 'primavera-p6',
      label: 'Primavera P6 — Impact Analysis',
      reference: 'P6-IA-DREESO-021',
      date: '2026-04-29',
    },
  ],
  activeSystems: ['procore', 'primavera-p6'],
  ctaBubbles: [
    'Detail the curtain-wall delivery risk',
    'What is the welder recruitment status?',
    'Show closed risks this month',
  ],
  actions: [
    {
      type: 'notify',
      label: 'Alert Risk Owners',
      target: 'notification/risk-weekly-alert',
    },
  ],
  relatedClusterIds: ['cluster-lukas-risk'],
};

/** @type {QueryResponse} */
export const QUERY_04 = {
  id: 'query-04',
  personaId: 'lukas-muller',
  query: 'How many workers are on-site today?',
  answer:
    'On-site headcount is 218 full-time equivalents. This includes 14 newly mobilised MEP subcontractor personnel. Labour productivity index is 1.03 against plan. There is a shortage of 3 certified welders currently being addressed through agency recruitment, with an estimated arrival in 5 business days.',
  citations: [
    {
      systemId: 'workday',
      label: 'Workday — Workforce Report',
      reference: 'WD-WR-2026-04-30',
      date: '2026-04-30',
    },
    {
      systemId: 'procore',
      label: 'Procore — Daily Log',
      reference: 'PC-DL-DREESO-0430',
      date: '2026-04-30',
    },
  ],
  activeSystems: ['workday', 'procore'],
  ctaBubbles: [
    'Show workforce trend this month',
    'What trades are on-site?',
    'When will the welders arrive?',
  ],
  relatedClusterIds: ['cluster-lukas-resource'],
};

/** @type {QueryResponse} */
export const QUERY_05 = {
  id: 'query-05',
  personaId: 'lukas-muller',
  query: 'Summarise pending variation orders',
  answer:
    'Five variation orders totalling €1.8M are pending client approval. The largest is VO-041 (€720K) for upgraded lobby finishes requested by the tenant. Two new VOs were raised this month: VO-044 (€180K, additional fire-stopping) and VO-045 (€95K, enhanced acoustic insulation on floor 5). Average approval cycle time is 18 days.',
  citations: [
    {
      systemId: 'sap-fi',
      label: 'SAP FI — Variation Order Log',
      reference: 'FI-VO-2026-Q1-005',
      date: '2026-04-28',
    },
    {
      systemId: 'salesforce',
      label: 'Salesforce — Client Approvals',
      reference: 'SF-CA-DREESO-041',
      date: '2026-04-27',
    },
  ],
  activeSystems: ['sap-fi', 'salesforce'],
  ctaBubbles: [
    'Show VO-041 details',
    'What is the approval timeline?',
    'List approved VOs this quarter',
  ],
  actions: [
    {
      type: 'approve',
      label: 'Send Approval Reminder',
      target: 'workflow/vo-approval-reminder',
    },
  ],
  relatedClusterIds: ['cluster-lukas-commercial'],
};

/** @type {QueryResponse} */
export const QUERY_06 = {
  id: 'query-06',
  personaId: 'elena-rossi',
  query: 'What is the cost-to-complete forecast?',
  answer:
    'The cost-to-complete forecast stands at €2.4M, reduced from €2.7M following a successful re-tender of the raised-floor package. Key remaining cost drivers are mechanical plant installation (€1.1M) and final fit-out works (€0.9M). Contingency drawdown is at 62%, leaving €570K in reserve. No budget overrun is projected if current trends hold.',
  citations: [
    {
      systemId: 'sap-fi',
      label: 'SAP FI — Cost Forecast',
      reference: 'FI-CF-2026-04-28',
      date: '2026-04-28',
    },
    {
      systemId: 'sap-mm',
      label: 'SAP MM — Package Summary',
      reference: 'MM-PS-DREESO-054',
      date: '2026-04-27',
    },
  ],
  activeSystems: ['sap-fi', 'sap-mm'],
  ctaBubbles: [
    'Break down mechanical plant costs',
    'Show contingency drawdown history',
    'Compare forecast vs. baseline',
  ],
  actions: [
    {
      type: 'export',
      label: 'Export Cost Forecast',
      target: 'report/cost-to-complete',
    },
  ],
  relatedClusterIds: ['cluster-elena-budget'],
};

/** @type {QueryResponse} */
export const QUERY_07 = {
  id: 'query-07',
  personaId: 'elena-rossi',
  query: 'Which procurement packages are still open?',
  answer:
    'Seven of fifty-four procurement packages remain open (13%). These are: (1) Lift installation — final evaluation; (2) BMS controls — tender closing next week; (3) Landscaping softworks — shortlisting; (4) Signage & wayfinding — RFP issued; (5) IT cabling — evaluation; (6) Security systems — negotiation; (7) Commissioning services — pre-qualification. All award dates are aligned to the master schedule.',
  citations: [
    {
      systemId: 'sap-mm',
      label: 'SAP MM — Procurement Tracker',
      reference: 'MM-PT-DREESO-047',
      date: '2026-04-29',
    },
    {
      systemId: 'primavera-p6',
      label: 'Primavera P6 — Procurement Milestones',
      reference: 'P6-PM-DREESO-033',
      date: '2026-04-28',
    },
  ],
  activeSystems: ['sap-mm', 'primavera-p6'],
  ctaBubbles: [
    'Show lift installation tender details',
    'When is the BMS tender closing?',
    'Are any packages at risk of delay?',
  ],
  relatedClusterIds: ['cluster-elena-schedule'],
};

/** @type {QueryResponse} */
export const QUERY_08 = {
  id: 'query-08',
  personaId: 'elena-rossi',
  query: 'Are there any supply-chain risks?',
  answer:
    'Three material categories are at elevated risk: (1) Structural steel — price volatility of ±8% over the last 60 days; (2) Aluminium curtain-wall extrusions — lead time extended to 14 weeks from 10 weeks; (3) Low-carbon concrete — limited regional supplier capacity with only two qualified sources. Buffer stock strategies are active for steel and concrete. No new alerts since last review.',
  citations: [
    {
      systemId: 'sap-mm',
      label: 'SAP MM — Supply Risk Dashboard',
      reference: 'MM-SR-2026-04-30',
      date: '2026-04-30',
    },
    {
      systemId: 'vendor-compliance-db',
      label: 'Vendor Compliance DB — Supplier Alerts',
      reference: 'VCD-SA-2026-04-29',
      date: '2026-04-29',
    },
  ],
  activeSystems: ['sap-mm', 'vendor-compliance-db'],
  ctaBubbles: [
    'Show steel price trend',
    'What are the buffer stock levels?',
    'List alternative concrete suppliers',
  ],
  relatedClusterIds: ['cluster-elena-risk'],
};

/** @type {QueryResponse} */
export const QUERY_09 = {
  id: 'query-09',
  personaId: 'elena-rossi',
  query: 'Show vendor compliance status',
  answer:
    'Of 52 active vendors, 50 (96%) meet all contractual compliance requirements including insurance, certifications, and safety records. Two vendors resolved non-conformances this period. One vendor (electrical subcontractor, ID: VND-E-017) has a pending ISO 14001 renewal due within 15 days. An automated reminder has been sent.',
  citations: [
    {
      systemId: 'vendor-compliance-db',
      label: 'Vendor Compliance DB — Status Report',
      reference: 'VCD-SR-2026-04-30',
      date: '2026-04-30',
    },
    {
      systemId: 'nen-compliance-db',
      label: 'NEN Compliance DB — Certification Check',
      reference: 'NEN-CC-2026-04-28',
      date: '2026-04-28',
    },
  ],
  activeSystems: ['vendor-compliance-db', 'nen-compliance-db'],
  ctaBubbles: [
    'Show non-compliant vendor details',
    'When is the ISO 14001 renewal due?',
    'List vendors by compliance score',
  ],
  actions: [
    {
      type: 'notify',
      label: 'Send Compliance Reminder',
      target: 'notification/vendor-compliance-reminder',
    },
  ],
  relatedClusterIds: ['cluster-elena-compliance'],
};

/** @type {QueryResponse} */
export const QUERY_10 = {
  id: 'query-10',
  personaId: 'elena-rossi',
  query: 'What was certified in the latest valuation?',
  answer:
    'The latest interim payment certificate (IPC-09) certified €2.3M across all active subcontract packages. 98% of submitted claims were approved. Key certified amounts: structural steel (€680K), MEP rough-in (€520K), concrete works (€410K), and façade framing (€390K). Retention held stands at €1.9M. No disputed amounts are outstanding.',
  citations: [
    {
      systemId: 'sap-fi',
      label: 'SAP FI — IPC-09 Certificate',
      reference: 'FI-IPC-009-DREESO',
      date: '2026-04-25',
    },
    {
      systemId: 'procore',
      label: 'Procore — Valuation Summary',
      reference: 'PC-VS-DREESO-009',
      date: '2026-04-25',
    },
  ],
  activeSystems: ['sap-fi', 'procore'],
  ctaBubbles: [
    'Show IPC-09 breakdown by trade',
    'What is the retention release schedule?',
    'Compare IPC-09 vs. IPC-08',
  ],
  actions: [
    {
      type: 'export',
      label: 'Export Valuation Certificate',
      target: 'report/ipc-09-certificate',
    },
  ],
  relatedClusterIds: ['cluster-elena-commercial'],
};

/** @type {QueryResponse} */
export const QUERY_11 = {
  id: 'query-11',
  personaId: 'sophie-dubois',
  query: 'How is the sustainability budget tracking?',
  answer:
    'The dedicated sustainability budget of €3.2M is 66% spent (€2.1M). Expenditure is aligned with the phased ESG investment plan. Major spend categories: BREEAM certification (€420K), low-carbon material premiums (€890K), renewable energy installations (€540K), and biodiversity offsets (€250K). Remaining budget of €1.1M is allocated for solar array completion and final certification costs.',
  citations: [
    {
      systemId: 'sap-fi',
      label: 'SAP FI — ESG Budget Report',
      reference: 'FI-ESG-2026-Q1-012',
      date: '2026-04-28',
    },
    {
      systemId: 'esg-registry',
      label: 'ESG Registry — Investment Tracker',
      reference: 'ESG-IT-DREESO-008',
      date: '2026-04-27',
    },
  ],
  activeSystems: ['sap-fi', 'esg-registry'],
  ctaBubbles: [
    'Break down low-carbon material premiums',
    'What is the solar array budget?',
    'Show ESG spend forecast',
  ],
  relatedClusterIds: ['cluster-sophie-budget'],
};

/** @type {QueryResponse} */
export const QUERY_12 = {
  id: 'query-12',
  personaId: 'sophie-dubois',
  query: 'What ESG milestones are upcoming?',
  answer:
    'Eight of eleven ESG milestones have been achieved. The three remaining milestones are: (1) Energy-model validation — due in 3 weeks; (2) Embodied-carbon final assessment — due in 6 weeks; (3) BREEAM final certification submission — due in 10 weeks. The energy-model validation is on the critical path and requires completion of the building envelope air-tightness test.',
  citations: [
    {
      systemId: 'primavera-p6',
      label: 'Primavera P6 — ESG Milestones',
      reference: 'P6-ESG-DREESO-011',
      date: '2026-04-29',
    },
    {
      systemId: 'esg-registry',
      label: 'ESG Registry — Milestone Tracker',
      reference: 'ESG-MT-DREESO-011',
      date: '2026-04-28',
    },
  ],
  activeSystems: ['primavera-p6', 'esg-registry'],
  ctaBubbles: [
    'What does the energy-model validation require?',
    'Show air-tightness test schedule',
    'List completed ESG milestones',
  ],
  actions: [
    {
      type: 'schedule',
      label: 'Schedule Energy Model Review',
      target: 'calendar/energy-model-review',
    },
  ],
  relatedClusterIds: ['cluster-sophie-schedule'],
};

/** @type {QueryResponse} */
export const QUERY_13 = {
  id: 'query-13',
  personaId: 'sophie-dubois',
  query: 'Show environmental risk register',
  answer:
    'Five environmental risks remain open. Ranked by severity: (1) EU Taxonomy embodied-carbon non-compliance — probability 40%, impact: loss of green financing eligibility; (2) Noise exceedance during piling phase — probability 35%, impact: municipal stop-work order; (3) Construction waste diversion target miss — probability 25%, impact: BREEAM credit loss; (4) Biodiversity net-gain shortfall — probability 20%; (5) Dust monitoring threshold breach — probability 15%. Two risks (site-water discharge) were closed after filtration upgrades.',
  citations: [
    {
      systemId: 'esg-registry',
      label: 'ESG Registry — Risk Register',
      reference: 'ESG-RR-DREESO-005',
      date: '2026-04-30',
    },
    {
      systemId: 'amsterdam-authority-portal',
      label: 'Amsterdam Authority — Environmental Permits',
      reference: 'AAP-EP-2026-0422',
      date: '2026-04-22',
    },
  ],
  activeSystems: ['esg-registry', 'amsterdam-authority-portal'],
  ctaBubbles: [
    'Detail the EU Taxonomy risk',
    'What filtration upgrades were installed?',
    'Show waste diversion metrics',
  ],
  relatedClusterIds: ['cluster-sophie-risk'],
};

/** @type {QueryResponse} */
export const QUERY_14 = {
  id: 'query-14',
  personaId: 'sophie-dubois',
  query: 'What is our BREEAM credit status?',
  answer:
    'Overall ESG compliance score is 91%, improved from 88% after audit remediation. BREEAM credit tracking shows 72 of 79 targeted credits on track. Two credits require additional evidence: Wat 01 (water consumption monitoring data) and Ene 04 (low-carbon energy source verification). Five credits are confirmed as achieved ahead of schedule. The pre-assessment scored "Excellent" with a margin of 4 credits above the threshold.',
  citations: [
    {
      systemId: 'esg-registry',
      label: 'ESG Registry — BREEAM Tracker',
      reference: 'ESG-BT-DREESO-079',
      date: '2026-04-29',
    },
    {
      systemId: 'nen-compliance-db',
      label: 'NEN Compliance DB — Standards Check',
      reference: 'NEN-SC-2026-04-28',
      date: '2026-04-28',
    },
    {
      systemId: 'amsterdam-authority-portal',
      label: 'Amsterdam Authority — Compliance Audit',
      reference: 'AAP-CA-2026-0425',
      date: '2026-04-25',
    },
  ],
  activeSystems: ['esg-registry', 'nen-compliance-db', 'amsterdam-authority-portal'],
  ctaBubbles: [
    'What evidence is needed for Wat 01?',
    'Show Ene 04 verification requirements',
    'Compare current vs. target BREEAM score',
  ],
  relatedClusterIds: ['cluster-sophie-compliance'],
};

/** @type {QueryResponse} */
export const QUERY_15 = {
  id: 'query-15',
  personaId: 'sophie-dubois',
  query: 'What percentage of materials are low-carbon?',
  answer:
    'Low-carbon and recycled-content materials now represent 64% of total material value, up from 60% after switching to CEM III cement for remaining concrete pours. Timber sourcing is 100% FSC-certified. The project target is 70% by completion. Key remaining opportunities: specifying recycled-content steel reinforcement (+3%) and switching to low-VOC paints for interior finishes (+1.5%).',
  citations: [
    {
      systemId: 'sap-mm',
      label: 'SAP MM — Material Sustainability Report',
      reference: 'MM-MSR-DREESO-064',
      date: '2026-04-28',
    },
    {
      systemId: 'esg-registry',
      label: 'ESG Registry — Material Tracker',
      reference: 'ESG-MAT-DREESO-064',
      date: '2026-04-27',
    },
  ],
  activeSystems: ['sap-mm', 'esg-registry'],
  ctaBubbles: [
    'Show recycled-content steel options',
    'What is the cost impact of low-VOC paints?',
    'Track progress toward 70% target',
  ],
  relatedClusterIds: ['cluster-sophie-resource'],
};

/** @type {QueryResponse} */
export const QUERY_16 = {
  id: 'query-16',
  personaId: 'james-carter',
  query: 'What is our revenue vs. target?',
  answer:
    'Year-to-date revenue stands at €18.4M against a €22M annual target, representing 84% attainment. New bookings of €1.6M were secured this quarter from two pre-lease agreements on floors 6 and 7. The pipeline contains €5.2M in qualified opportunities expected to close within 90 days. At current conversion rates, the annual target is achievable with a 68% win rate on pipeline deals.',
  citations: [
    {
      systemId: 'salesforce',
      label: 'Salesforce — Revenue Dashboard',
      reference: 'SF-RD-2026-Q1-018',
      date: '2026-04-30',
    },
    {
      systemId: 'sap-fi',
      label: 'SAP FI — Revenue Ledger',
      reference: 'FI-RL-2026-04-30',
      date: '2026-04-30',
    },
  ],
  activeSystems: ['salesforce', 'sap-fi'],
  ctaBubbles: [
    'Show quarterly revenue breakdown',
    'Detail the floor 6 and 7 leases',
    'What is the pipeline conversion forecast?',
  ],
  actions: [
    {
      type: 'export',
      label: 'Export Revenue Report',
      target: 'report/revenue-vs-target-q1',
    },
  ],
  relatedClusterIds: ['cluster-james-budget'],
};

/** @type {QueryResponse} */
export const QUERY_17 = {
  id: 'query-17',
  personaId: 'james-carter',
  query: 'Show the leasing progress timeline',
  answer:
    'Pre-leasing has reached 72% of total lettable area, up from 64% at the start of the quarter. Heads of terms are signed for floors 1–7 (office) and the ground-floor retail unit. Active negotiations are underway for floors 8–9 with two shortlisted tenants. Expected timeline: floor 8 HOT signing in 4 weeks, floor 9 in 6 weeks. Full pre-lease target of 85% is projected by Q3.',
  citations: [
    {
      systemId: 'salesforce',
      label: 'Salesforce — Leasing Pipeline',
      reference: 'SF-LP-DREESO-072',
      date: '2026-04-29',
    },
    {
      systemId: 'primavera-p6',
      label: 'Primavera P6 — Leasing Milestones',
      reference: 'P6-LM-DREESO-015',
      date: '2026-04-28',
    },
  ],
  activeSystems: ['salesforce', 'primavera-p6'],
  ctaBubbles: [
    'Who are the floor 8 prospects?',
    'What are the floor 9 tenant requirements?',
    'Show leasing progress chart',
  ],
  relatedClusterIds: ['cluster-james-schedule'],
};

/** @type {QueryResponse} */
export const QUERY_18 = {
  id: 'query-18',
  personaId: 'james-carter',
  query: 'Are there any at-risk deals?',
  answer:
    'Two deals are flagged at risk: (1) Floor 8 prospect (TechCorp BV) — requesting a 24-month rent-free period, which exceeds the 12-month policy maximum. Mitigation: a stepped-rent proposal has been prepared offering 6 months rent-free plus 12 months at 75% rate. (2) Ground-floor retail tenant (Café Bloom) — marginal credit score of 58/100. Mitigation: requiring a 6-month bank guarantee as a condition of lease signing.',
  citations: [
    {
      systemId: 'salesforce',
      label: 'Salesforce — Deal Risk Report',
      reference: 'SF-DR-DREESO-002',
      date: '2026-04-30',
    },
    {
      systemId: 'sap-fi',
      label: 'SAP FI — Credit Assessment',
      reference: 'FI-CA-2026-04-29',
      date: '2026-04-29',
    },
  ],
  activeSystems: ['salesforce', 'sap-fi'],
  ctaBubbles: [
    'Show the stepped-rent proposal for floor 8',
    'What is the bank guarantee process?',
    'Compare TechCorp BV offer vs. policy',
  ],
  actions: [
    {
      type: 'navigate',
      label: 'Open Deal Risk Dashboard',
      target: 'dashboard/deal-risk',
    },
  ],
  relatedClusterIds: ['cluster-james-risk'],
};

/** @type {QueryResponse} */
export const QUERY_19 = {
  id: 'query-19',
  personaId: 'james-carter',
  query: 'What is the current sales pipeline value?',
  answer:
    'The qualified sales pipeline totals €5.2M across eight opportunities, with €800K added this period. Weighted forecast (probability-adjusted) is €3.4M. The largest opportunity is a 2,400 m² office lease on floors 8–9 valued at €1.8M annual rent (probability 55%). Average win rate over the last four quarters is 68%. Pipeline velocity has improved by 12% compared to last quarter.',
  citations: [
    {
      systemId: 'salesforce',
      label: 'Salesforce — Pipeline Report',
      reference: 'SF-PR-2026-Q1-052',
      date: '2026-04-30',
    },
    {
      systemId: 'sap-fi',
      label: 'SAP FI — Revenue Forecast',
      reference: 'FI-RF-2026-04-30',
      date: '2026-04-30',
    },
  ],
  activeSystems: ['salesforce', 'sap-fi'],
  ctaBubbles: [
    'Show pipeline by stage',
    'Detail the floors 8–9 opportunity',
    'What deals are closing this month?',
  ],
  actions: [
    {
      type: 'export',
      label: 'Export Pipeline Report',
      target: 'report/sales-pipeline-q1',
    },
  ],
  relatedClusterIds: ['cluster-james-commercial'],
};

/** @type {QueryResponse} */
export const QUERY_20 = {
  id: 'query-20',
  personaId: 'james-carter',
  query: 'How is the sales team performing?',
  answer:
    'The commercial team of six active agents is fully staffed. Performance metrics: average deal cycle time is 47 days (target: 50 days), conversion rate is 68% (target: 65%), and client satisfaction score is 4.6/5.0. Top performer this quarter is Agent M. van der Berg with €3.1M in closed deals. One agent is scheduled for BREEAM AP training next month to support sustainability-led sales conversations.',
  citations: [
    {
      systemId: 'workday',
      label: 'Workday — Team Performance',
      reference: 'WD-TP-2026-Q1-006',
      date: '2026-04-30',
    },
    {
      systemId: 'salesforce',
      label: 'Salesforce — Agent Metrics',
      reference: 'SF-AM-2026-Q1-006',
      date: '2026-04-29',
    },
  ],
  activeSystems: ['workday', 'salesforce'],
  ctaBubbles: [
    'Show individual agent performance',
    'What is the BREEAM AP training schedule?',
    'Compare team metrics vs. last quarter',
  ],
  relatedClusterIds: ['cluster-james-resource'],
};

// ---------------------------------------------------------------------------
// Aggregated query responses
// ---------------------------------------------------------------------------

/**
 * All query responses for Lukas Müller.
 * @type {QueryResponse[]}
 */
export const LUKAS_QUERIES = [QUERY_01, QUERY_02, QUERY_03, QUERY_04, QUERY_05];

/**
 * All query responses for Elena Rossi.
 * @type {QueryResponse[]}
 */
export const ELENA_QUERIES = [QUERY_06, QUERY_07, QUERY_08, QUERY_09, QUERY_10];

/**
 * All query responses for Sophie Dubois.
 * @type {QueryResponse[]}
 */
export const SOPHIE_QUERIES = [QUERY_11, QUERY_12, QUERY_13, QUERY_14, QUERY_15];

/**
 * All query responses for James Carter.
 * @type {QueryResponse[]}
 */
export const JAMES_QUERIES = [QUERY_16, QUERY_17, QUERY_18, QUERY_19, QUERY_20];

/**
 * Complete list of all query responses (20 total).
 * @type {QueryResponse[]}
 */
export const QUERIES = [
  ...LUKAS_QUERIES,
  ...ELENA_QUERIES,
  ...SOPHIE_QUERIES,
  ...JAMES_QUERIES,
];

/**
 * Lookup map of query responses grouped by persona ID.
 * @type {Record<string, QueryResponse[]>}
 */
export const QUERIES_BY_PERSONA = {
  'lukas-muller': LUKAS_QUERIES,
  'elena-rossi': ELENA_QUERIES,
  'sophie-dubois': SOPHIE_QUERIES,
  'james-carter': JAMES_QUERIES,
};

/**
 * Lookup map of query responses keyed by their unique ID.
 * @type {Record<string, QueryResponse>}
 */
export const QUERY_BY_ID = QUERIES.reduce((map, query) => {
  map[query.id] = query;
  return map;
}, {});

// ---------------------------------------------------------------------------
// 20-screen query flow sequence
// ---------------------------------------------------------------------------

/**
 * The complete 20-screen query flow sequence defining which query
 * and persona are active on each screen.
 * @type {ScreenFlowEntry[]}
 */
export const SCREEN_FLOW = [
  {
    screen: 1,
    queryId: 'query-01',
    personaId: 'lukas-muller',
    description: 'Lukas asks about project budget status',
  },
  {
    screen: 2,
    queryId: 'query-02',
    personaId: 'lukas-muller',
    description: 'Lukas reviews the critical path schedule',
  },
  {
    screen: 3,
    queryId: 'query-03',
    personaId: 'lukas-muller',
    description: 'Lukas checks top risks this week',
  },
  {
    screen: 4,
    queryId: 'query-04',
    personaId: 'lukas-muller',
    description: 'Lukas queries on-site workforce count',
  },
  {
    screen: 5,
    queryId: 'query-05',
    personaId: 'lukas-muller',
    description: 'Lukas summarises pending variation orders',
  },
  {
    screen: 6,
    queryId: 'query-06',
    personaId: 'elena-rossi',
    description: 'Elena reviews cost-to-complete forecast',
  },
  {
    screen: 7,
    queryId: 'query-07',
    personaId: 'elena-rossi',
    description: 'Elena checks open procurement packages',
  },
  {
    screen: 8,
    queryId: 'query-08',
    personaId: 'elena-rossi',
    description: 'Elena assesses supply-chain risks',
  },
  {
    screen: 9,
    queryId: 'query-09',
    personaId: 'elena-rossi',
    description: 'Elena reviews vendor compliance status',
  },
  {
    screen: 10,
    queryId: 'query-10',
    personaId: 'elena-rossi',
    description: 'Elena checks latest valuation certification',
  },
  {
    screen: 11,
    queryId: 'query-11',
    personaId: 'sophie-dubois',
    description: 'Sophie tracks sustainability budget',
  },
  {
    screen: 12,
    queryId: 'query-12',
    personaId: 'sophie-dubois',
    description: 'Sophie reviews upcoming ESG milestones',
  },
  {
    screen: 13,
    queryId: 'query-13',
    personaId: 'sophie-dubois',
    description: 'Sophie checks environmental risk register',
  },
  {
    screen: 14,
    queryId: 'query-14',
    personaId: 'sophie-dubois',
    description: 'Sophie reviews BREEAM credit status',
  },
  {
    screen: 15,
    queryId: 'query-15',
    personaId: 'sophie-dubois',
    description: 'Sophie checks low-carbon material percentage',
  },
  {
    screen: 16,
    queryId: 'query-16',
    personaId: 'james-carter',
    description: 'James reviews revenue vs. target',
  },
  {
    screen: 17,
    queryId: 'query-17',
    personaId: 'james-carter',
    description: 'James checks leasing progress timeline',
  },
  {
    screen: 18,
    queryId: 'query-18',
    personaId: 'james-carter',
    description: 'James assesses at-risk deals',
  },
  {
    screen: 19,
    queryId: 'query-19',
    personaId: 'james-carter',
    description: 'James reviews sales pipeline value',
  },
  {
    screen: 20,
    queryId: 'query-20',
    personaId: 'james-carter',
    description: 'James checks sales team performance',
  },
];

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/**
 * Retrieves a query response by its unique identifier.
 * @param {string} id - The query ID to look up
 * @returns {QueryResponse|undefined} The matching query response, or undefined if not found
 */
export const getQueryById = (id) => QUERY_BY_ID[id];

/**
 * Retrieves all query responses associated with a given persona ID.
 * @param {string} personaId - The persona identifier
 * @returns {QueryResponse[]} Array of query responses for the specified persona
 */
export const getQueriesByPersona = (personaId) =>
  QUERIES_BY_PERSONA[personaId] || [];

/**
 * Retrieves the screen flow entry for a given screen number.
 * @param {number} screenNumber - The screen number (1-20)
 * @returns {ScreenFlowEntry|undefined} The matching screen flow entry, or undefined if not found
 */
export const getScreenFlowEntry = (screenNumber) =>
  SCREEN_FLOW.find((entry) => entry.screen === screenNumber);

/**
 * Retrieves the query response for a given screen number.
 * @param {number} screenNumber - The screen number (1-20)
 * @returns {QueryResponse|undefined} The query response for the specified screen, or undefined
 */
export const getQueryByScreen = (screenNumber) => {
  const entry = getScreenFlowEntry(screenNumber);
  return entry ? getQueryById(entry.queryId) : undefined;
};

/**
 * Retrieves autosuggest entries for a given persona ID, sorted by priority.
 * @param {string} personaId - The persona identifier
 * @returns {AutosuggestEntry[]} Sorted array of autosuggest entries
 */
export const getAutosuggestByPersona = (personaId) =>
  (AUTOSUGGEST_BY_PERSONA[personaId] || []).slice().sort((a, b) => a.priority - b.priority);

/**
 * Searches all query responses for those referencing a given source system.
 * @param {string} sourceSystemId - The source system identifier
 * @returns {QueryResponse[]} Array of query responses citing the specified system
 */
export const getQueriesBySourceSystem = (sourceSystemId) =>
  QUERIES.filter((query) => query.activeSystems.includes(sourceSystemId));

/**
 * Retrieves all query responses that have action triggers.
 * @returns {QueryResponse[]} Array of query responses with actions defined
 */
export const getQueriesWithActions = () =>
  QUERIES.filter((query) => query.actions && query.actions.length > 0);

/**
 * Searches query responses by partial text match against query or answer fields.
 * @param {string} searchText - The text to search for (case-insensitive)
 * @returns {QueryResponse[]} Array of matching query responses
 */
export const searchQueries = (searchText) => {
  if (!searchText || typeof searchText !== 'string') {
    return [];
  }
  const lower = searchText.toLowerCase();
  return QUERIES.filter(
    (query) =>
      query.query.toLowerCase().includes(lower) ||
      query.answer.toLowerCase().includes(lower),
  );
};