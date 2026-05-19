/**
 * Mock intelligence cluster data for the Ask Dreeso Memory application.
 * Each persona has six clusters covering budget/cost, schedule, risk,
 * compliance, resource, and commercial intelligence.
 * @module data/clusters
 */

/**
 * @typedef {Object} Cluster
 * @property {string} id - Unique cluster identifier
 * @property {string} personaId - Associated persona identifier
 * @property {string} title - Display title for the cluster card
 * @property {string} subtitle - Short descriptor / category label
 * @property {string} metricValue - Primary metric displayed on the card
 * @property {'up' | 'down' | 'stable'} trend - Trend direction indicator
 * @property {string} trendLabel - Human-readable trend description
 * @property {string[]} sourceSystems - IDs of enterprise systems feeding this cluster
 * @property {string} detail - Detailed explanation text for the cluster
 */

// ---------------------------------------------------------------------------
// Lukas Müller — Project Director
// ---------------------------------------------------------------------------

/** @type {Cluster} */
export const LUKAS_BUDGET = {
  id: 'cluster-lukas-budget',
  personaId: 'lukas-muller',
  title: 'Project Budget Health',
  subtitle: 'Budget & Cost Intelligence',
  metricValue: '€42.6M / €45M',
  trend: 'up',
  trendLabel: '+2.1% spend increase this quarter',
  sourceSystems: ['sap-fi', 'procore'],
  detail:
    'Current cumulative spend stands at €42.6M against a €45M baseline. Earned-value analysis shows CPI at 0.97, indicating a slight cost overrun trend driven by rising steel prices. Forecast-at-completion is €46.2M unless mitigation actions are taken on structural steel packages.',
};

/** @type {Cluster} */
export const LUKAS_SCHEDULE = {
  id: 'cluster-lukas-schedule',
  personaId: 'lukas-muller',
  title: 'Master Schedule Status',
  subtitle: 'Schedule Intelligence',
  metricValue: '4 days ahead',
  trend: 'up',
  trendLabel: 'Critical path recovered by 4 days',
  sourceSystems: ['primavera-p6', 'procore'],
  detail:
    'The critical path currently shows a 4-day positive float after accelerating MEP rough-in on floors 3–5. Two near-critical paths through façade installation carry only 2 days of float and require close monitoring over the next sprint cycle.',
};

/** @type {Cluster} */
export const LUKAS_RISK = {
  id: 'cluster-lukas-risk',
  personaId: 'lukas-muller',
  title: 'Active Risk Register',
  subtitle: 'Risk Intelligence',
  metricValue: '12 open risks',
  trend: 'down',
  trendLabel: '3 risks closed since last review',
  sourceSystems: ['procore', 'primavera-p6'],
  detail:
    'Twelve risks remain open across schedule, cost, and quality categories. The top-ranked risk is potential delay in curtain-wall delivery (probability 65%, impact €1.2M). Three risks were closed following successful concrete pour inspections on the east wing.',
};

/** @type {Cluster} */
export const LUKAS_COMPLIANCE = {
  id: 'cluster-lukas-compliance',
  personaId: 'lukas-muller',
  title: 'Permit & Regulatory Status',
  subtitle: 'Compliance Intelligence',
  metricValue: '94% compliant',
  trend: 'stable',
  trendLabel: 'No change since last audit cycle',
  sourceSystems: ['amsterdam-authority-portal', 'nen-compliance-db'],
  detail:
    'All major building permits are approved and active. One minor amendment for the rooftop plant-room layout is pending municipal review (expected approval within 10 business days). NEN 2580 and NEN-EN 13501 fire-safety certifications are current.',
};

/** @type {Cluster} */
export const LUKAS_RESOURCE = {
  id: 'cluster-lukas-resource',
  personaId: 'lukas-muller',
  title: 'Workforce Allocation',
  subtitle: 'Resource Intelligence',
  metricValue: '218 FTEs on-site',
  trend: 'up',
  trendLabel: '+14 FTEs added for MEP phase',
  sourceSystems: ['workday', 'procore'],
  detail:
    'On-site headcount increased to 218 full-time equivalents following mobilisation of the MEP subcontractor crew. Labour productivity index is 1.03 against plan. A shortage of certified welders (3 positions) is being addressed through agency recruitment with an ETA of 5 business days.',
};

/** @type {Cluster} */
export const LUKAS_COMMERCIAL = {
  id: 'cluster-lukas-commercial',
  personaId: 'lukas-muller',
  title: 'Variation & Claims Tracker',
  subtitle: 'Commercial Intelligence',
  metricValue: '€1.8M in pending VOs',
  trend: 'up',
  trendLabel: '2 new variation orders this month',
  sourceSystems: ['sap-fi', 'salesforce'],
  detail:
    'Five variation orders totalling €1.8M are pending client approval. The largest (VO-041, €720K) relates to upgraded lobby finishes requested by the tenant. Two new VOs were raised this month for additional fire-stopping scope identified during coordination reviews.',
};

// ---------------------------------------------------------------------------
// Elena Rossi — Senior Quantity Surveyor
// ---------------------------------------------------------------------------

/** @type {Cluster} */
export const ELENA_BUDGET = {
  id: 'cluster-elena-budget',
  personaId: 'elena-rossi',
  title: 'Cost-to-Complete Forecast',
  subtitle: 'Budget & Cost Intelligence',
  metricValue: '€2.4M remaining',
  trend: 'down',
  trendLabel: 'Forecast reduced by €300K after re-tender',
  sourceSystems: ['sap-fi', 'sap-mm'],
  detail:
    'The cost-to-complete forecast stands at €2.4M, reduced from €2.7M following a successful re-tender of the raised-floor package. Key cost drivers remaining are mechanical plant installation (€1.1M) and final fit-out works (€0.9M). Contingency drawdown is at 62%.',
};

/** @type {Cluster} */
export const ELENA_SCHEDULE = {
  id: 'cluster-elena-schedule',
  personaId: 'elena-rossi',
  title: 'Procurement Milestone Tracker',
  subtitle: 'Schedule Intelligence',
  metricValue: '87% packages awarded',
  trend: 'up',
  trendLabel: '3 packages awarded this sprint',
  sourceSystems: ['sap-mm', 'primavera-p6'],
  detail:
    'Forty-seven of fifty-four procurement packages have been awarded (87%). Three packages were finalised this sprint: raised flooring, interior glazing, and landscape hardworks. The remaining seven packages are in final evaluation, with award dates aligned to the master schedule.',
};

/** @type {Cluster} */
export const ELENA_RISK = {
  id: 'cluster-elena-risk',
  personaId: 'elena-rossi',
  title: 'Supply-Chain Risk Monitor',
  subtitle: 'Risk Intelligence',
  metricValue: '3 high-risk items',
  trend: 'stable',
  trendLabel: 'No new supply-chain alerts',
  sourceSystems: ['sap-mm', 'vendor-compliance-db'],
  detail:
    'Three material categories remain at elevated risk: structural steel (price volatility), aluminium curtain-wall extrusions (lead-time extension to 14 weeks), and low-carbon concrete (limited supplier capacity in the region). Buffer stock strategies are in place for steel and concrete.',
};

/** @type {Cluster} */
export const ELENA_COMPLIANCE = {
  id: 'cluster-elena-compliance',
  personaId: 'elena-rossi',
  title: 'Vendor Compliance Dashboard',
  subtitle: 'Compliance Intelligence',
  metricValue: '96% vendors compliant',
  trend: 'up',
  trendLabel: '2 vendors resolved non-conformances',
  sourceSystems: ['vendor-compliance-db', 'nen-compliance-db'],
  detail:
    'Of 52 active vendors, 50 meet all contractual compliance requirements (insurance, certifications, safety records). Two vendors resolved outstanding non-conformances this period. One vendor (electrical sub) has a pending ISO 14001 renewal due within 15 days.',
};

/** @type {Cluster} */
export const ELENA_RESOURCE = {
  id: 'cluster-elena-resource',
  personaId: 'elena-rossi',
  title: 'Material Inventory Status',
  subtitle: 'Resource Intelligence',
  metricValue: '1,240 items tracked',
  trend: 'stable',
  trendLabel: 'Inventory levels within target range',
  sourceSystems: ['sap-mm', 'procore'],
  detail:
    'The on-site material inventory tracks 1,240 line items across 18 storage zones. Current stock levels are within the 85–110% target band for all critical-path materials. A delivery of pre-cast stair units (24 pieces) is scheduled for next Tuesday, completing that package.',
};

/** @type {Cluster} */
export const ELENA_COMMERCIAL = {
  id: 'cluster-elena-commercial',
  personaId: 'elena-rossi',
  title: 'Subcontract Valuation Summary',
  subtitle: 'Commercial Intelligence',
  metricValue: '€38.1M certified',
  trend: 'up',
  trendLabel: '€2.3M certified in latest valuation',
  sourceSystems: ['sap-fi', 'procore'],
  detail:
    'Cumulative certified subcontract valuations total €38.1M across all packages. The latest interim valuation (IPC-09) certified €2.3M, with 98% of submitted claims approved. Retention held stands at €1.9M. No disputed amounts are outstanding.',
};

// ---------------------------------------------------------------------------
// Sophie Dubois — Project Manager
// ---------------------------------------------------------------------------

/** @type {Cluster} */
export const SOPHIE_BUDGET = {
  id: 'cluster-sophie-budget',
  personaId: 'sophie-dubois',
  title: 'Sustainability Budget Tracker',
  subtitle: 'Budget & Cost Intelligence',
  metricValue: '€3.2M allocated',
  trend: 'stable',
  trendLabel: 'Spend on track with ESG plan',
  sourceSystems: ['sap-fi', 'esg-registry'],
  detail:
    'The dedicated sustainability budget of €3.2M covers BREEAM certification costs, low-carbon material premiums, renewable energy installations, and biodiversity offsets. Current spend is €2.1M (66%), aligned with the phased ESG investment plan.',
};

/** @type {Cluster} */
export const SOPHIE_SCHEDULE = {
  id: 'cluster-sophie-schedule',
  personaId: 'sophie-dubois',
  title: 'ESG Milestone Timeline',
  subtitle: 'Schedule Intelligence',
  metricValue: '8 of 11 milestones met',
  trend: 'up',
  trendLabel: 'BREEAM pre-assessment completed ahead of schedule',
  sourceSystems: ['primavera-p6', 'esg-registry'],
  detail:
    'Eight of eleven ESG milestones have been achieved, including the BREEAM pre-assessment (scored "Excellent"), embodied-carbon baseline report, and social-value commitments sign-off. The next milestone is the energy-model validation due in 3 weeks.',
};

/** @type {Cluster} */
export const SOPHIE_RISK = {
  id: 'cluster-sophie-risk',
  personaId: 'sophie-dubois',
  title: 'Environmental Risk Register',
  subtitle: 'Risk Intelligence',
  metricValue: '5 open risks',
  trend: 'down',
  trendLabel: '2 environmental risks mitigated',
  sourceSystems: ['esg-registry', 'amsterdam-authority-portal'],
  detail:
    'Five environmental risks remain open. The highest-ranked is potential non-compliance with the updated EU Taxonomy technical screening criteria for embodied carbon (probability 40%). Two risks related to site-water discharge quality were closed after installing additional filtration.',
};

/** @type {Cluster} */
export const SOPHIE_COMPLIANCE = {
  id: 'cluster-sophie-compliance',
  personaId: 'sophie-dubois',
  title: 'Regulatory & ESG Compliance',
  subtitle: 'Compliance Intelligence',
  metricValue: '91% compliant',
  trend: 'up',
  trendLabel: 'Improved from 88% after audit remediation',
  sourceSystems: ['esg-registry', 'nen-compliance-db', 'amsterdam-authority-portal'],
  detail:
    'Overall ESG compliance score improved to 91% following remediation of three audit findings related to waste-segregation documentation. BREEAM credit tracking shows 72 of 79 targeted credits on track. Two credits (Wat 01, Ene 04) require additional evidence submission.',
};

/** @type {Cluster} */
export const SOPHIE_RESOURCE = {
  id: 'cluster-sophie-resource',
  personaId: 'sophie-dubois',
  title: 'Sustainable Material Usage',
  subtitle: 'Resource Intelligence',
  metricValue: '64% low-carbon materials',
  trend: 'up',
  trendLabel: '+4% increase after concrete switch',
  sourceSystems: ['sap-mm', 'esg-registry'],
  detail:
    'Low-carbon and recycled-content materials now represent 64% of total material value, up from 60% after switching to CEM III cement for remaining concrete pours. Timber sourcing is 100% FSC-certified. The target is 70% by project completion.',
};

/** @type {Cluster} */
export const SOPHIE_COMMERCIAL = {
  id: 'cluster-sophie-commercial',
  personaId: 'sophie-dubois',
  title: 'Green Incentive & Grant Status',
  subtitle: 'Commercial Intelligence',
  metricValue: '€480K secured',
  trend: 'up',
  trendLabel: 'New €120K grant approved for solar array',
  sourceSystems: ['salesforce', 'sap-fi'],
  detail:
    'Total green incentives and grants secured amount to €480K, including a newly approved €120K subsidy from the Amsterdam Climate Fund for the rooftop solar array. An additional €200K application for the national SDE++ scheme is under review with a decision expected in 6 weeks.',
};

// ---------------------------------------------------------------------------
// James Carter — Sales Director
// ---------------------------------------------------------------------------

/** @type {Cluster} */
export const JAMES_BUDGET = {
  id: 'cluster-james-budget',
  personaId: 'james-carter',
  title: 'Revenue vs. Target',
  subtitle: 'Budget & Cost Intelligence',
  metricValue: '€18.4M / €22M',
  trend: 'up',
  trendLabel: '+€1.6M new bookings this quarter',
  sourceSystems: ['salesforce', 'sap-fi'],
  detail:
    'Year-to-date revenue stands at €18.4M against a €22M annual target (84% attainment). New bookings of €1.6M were secured this quarter from two pre-lease agreements on floors 6 and 7. The pipeline contains €5.2M in qualified opportunities expected to close within 90 days.',
};

/** @type {Cluster} */
export const JAMES_SCHEDULE = {
  id: 'cluster-james-schedule',
  personaId: 'james-carter',
  title: 'Leasing Timeline Tracker',
  subtitle: 'Schedule Intelligence',
  metricValue: '72% pre-leased',
  trend: 'up',
  trendLabel: '+8% leasing progress this quarter',
  sourceSystems: ['salesforce', 'primavera-p6'],
  detail:
    'Pre-leasing has reached 72% of total lettable area, up from 64% at the start of the quarter. Heads of terms are signed for floors 1–7 (office) and the ground-floor retail unit. Active negotiations are underway for floors 8–9 with two shortlisted tenants.',
};

/** @type {Cluster} */
export const JAMES_RISK = {
  id: 'cluster-james-risk',
  personaId: 'james-carter',
  title: 'Deal Risk Assessment',
  subtitle: 'Risk Intelligence',
  metricValue: '2 at-risk deals',
  trend: 'stable',
  trendLabel: 'No change in deal risk profile',
  sourceSystems: ['salesforce', 'sap-fi'],
  detail:
    'Two deals are flagged at risk: a floor-8 prospect requesting a 24-month rent-free period (above policy) and a retail tenant whose credit check returned a marginal score. Mitigation strategies include a stepped-rent proposal for floor 8 and a bank-guarantee requirement for the retail unit.',
};

/** @type {Cluster} */
export const JAMES_COMPLIANCE = {
  id: 'cluster-james-compliance',
  personaId: 'james-carter',
  title: 'Contract & Legal Compliance',
  subtitle: 'Compliance Intelligence',
  metricValue: '100% contracts reviewed',
  trend: 'stable',
  trendLabel: 'All active contracts within policy',
  sourceSystems: ['salesforce', 'vendor-compliance-db'],
  detail:
    'All twelve active lease and pre-lease contracts have been reviewed by legal and comply with corporate leasing policy. Standard clauses for break options, indexation, and ESG obligations are included. No outstanding legal disputes or arbitration proceedings.',
};

/** @type {Cluster} */
export const JAMES_RESOURCE = {
  id: 'cluster-james-resource',
  personaId: 'james-carter',
  title: 'Sales Team Capacity',
  subtitle: 'Resource Intelligence',
  metricValue: '6 active agents',
  trend: 'stable',
  trendLabel: 'Team fully staffed',
  sourceSystems: ['workday', 'salesforce'],
  detail:
    'The commercial team comprises six active agents covering office leasing (3), retail leasing (1), and investor relations (2). Average deal cycle time is 47 days. One agent is scheduled for BREEAM AP training next month to support sustainability-led sales conversations.',
};

/** @type {Cluster} */
export const JAMES_COMMERCIAL = {
  id: 'cluster-james-commercial',
  personaId: 'james-carter',
  title: 'Pipeline & Forecast',
  subtitle: 'Commercial Intelligence',
  metricValue: '€5.2M pipeline',
  trend: 'up',
  trendLabel: '+€800K added to qualified pipeline',
  sourceSystems: ['salesforce', 'sap-fi'],
  detail:
    'The qualified sales pipeline totals €5.2M across eight opportunities. Weighted forecast (probability-adjusted) is €3.4M. The largest opportunity is a 2,400 m² office lease on floors 8–9 valued at €1.8M annual rent. Average win rate over the last four quarters is 68%.',
};

// ---------------------------------------------------------------------------
// Aggregated exports
// ---------------------------------------------------------------------------

/**
 * All clusters for Lukas Müller.
 * @type {Cluster[]}
 */
export const LUKAS_CLUSTERS = [
  LUKAS_BUDGET,
  LUKAS_SCHEDULE,
  LUKAS_RISK,
  LUKAS_COMPLIANCE,
  LUKAS_RESOURCE,
  LUKAS_COMMERCIAL,
];

/**
 * All clusters for Elena Rossi.
 * @type {Cluster[]}
 */
export const ELENA_CLUSTERS = [
  ELENA_BUDGET,
  ELENA_SCHEDULE,
  ELENA_RISK,
  ELENA_COMPLIANCE,
  ELENA_RESOURCE,
  ELENA_COMMERCIAL,
];

/**
 * All clusters for Sophie Dubois.
 * @type {Cluster[]}
 */
export const SOPHIE_CLUSTERS = [
  SOPHIE_BUDGET,
  SOPHIE_SCHEDULE,
  SOPHIE_RISK,
  SOPHIE_COMPLIANCE,
  SOPHIE_RESOURCE,
  SOPHIE_COMMERCIAL,
];

/**
 * All clusters for James Carter.
 * @type {Cluster[]}
 */
export const JAMES_CLUSTERS = [
  JAMES_BUDGET,
  JAMES_SCHEDULE,
  JAMES_RISK,
  JAMES_COMPLIANCE,
  JAMES_RESOURCE,
  JAMES_COMMERCIAL,
];

/**
 * Complete list of all intelligence clusters across all personas (24 total).
 * @type {Cluster[]}
 */
export const CLUSTERS = [
  ...LUKAS_CLUSTERS,
  ...ELENA_CLUSTERS,
  ...SOPHIE_CLUSTERS,
  ...JAMES_CLUSTERS,
];

/**
 * Lookup map of clusters grouped by persona ID.
 * @type {Record<string, Cluster[]>}
 */
export const CLUSTERS_BY_PERSONA = {
  'lukas-muller': LUKAS_CLUSTERS,
  'elena-rossi': ELENA_CLUSTERS,
  'sophie-dubois': SOPHIE_CLUSTERS,
  'james-carter': JAMES_CLUSTERS,
};

/**
 * Lookup map of clusters keyed by their unique ID.
 * @type {Record<string, Cluster>}
 */
export const CLUSTER_BY_ID = CLUSTERS.reduce((map, cluster) => {
  map[cluster.id] = cluster;
  return map;
}, {});

/**
 * Retrieves a cluster by its unique identifier.
 * @param {string} id - The cluster ID to look up
 * @returns {Cluster|undefined} The matching cluster, or undefined if not found
 */
export const getClusterById = (id) => CLUSTER_BY_ID[id];

/**
 * Retrieves all clusters associated with a given persona ID.
 * @param {string} personaId - The persona identifier
 * @returns {Cluster[]} Array of clusters for the specified persona
 */
export const getClustersByPersona = (personaId) =>
  CLUSTERS_BY_PERSONA[personaId] || [];

/**
 * Retrieves all clusters that reference a given source system.
 * @param {string} sourceSystemId - The source system identifier
 * @returns {Cluster[]} Array of clusters fed by the specified source system
 */
export const getClustersBySourceSystem = (sourceSystemId) =>
  CLUSTERS.filter((cluster) => cluster.sourceSystems.includes(sourceSystemId));

/**
 * Retrieves all clusters matching a given trend direction.
 * @param {'up' | 'down' | 'stable'} trend - The trend direction to filter by
 * @returns {Cluster[]} Array of clusters with the specified trend
 */
export const getClustersByTrend = (trend) =>
  CLUSTERS.filter((cluster) => cluster.trend === trend);