/**
 * Detailed persona definitions for the Ask Dreeso Memory application.
 * Each persona includes profile information, visual theming, and associated intelligence cluster IDs.
 * @module data/personas
 */

/**
 * @typedef {Object} Persona
 * @property {string} id - Unique identifier for the persona
 * @property {string} name - Full display name
 * @property {string} role - Job title / role description
 * @property {string} email - Contact email address
 * @property {string} initials - Two-letter avatar initials
 * @property {Object} colorTheme - Visual theme colors for the persona
 * @property {string} colorTheme.primary - Primary brand color (hex)
 * @property {string} colorTheme.light - Light variant for backgrounds (hex)
 * @property {string} colorTheme.dark - Dark variant for accents (hex)
 * @property {string} colorTheme.ring - Tailwind ring/border color class
 * @property {string} colorTheme.bg - Tailwind background color class
 * @property {string} colorTheme.text - Tailwind text color class
 * @property {string[]} clusterIds - Associated intelligence cluster identifiers
 */

/**
 * Lukas Müller — Project Director persona.
 * Oversees project execution, scheduling, and cross-functional coordination.
 * @type {Persona}
 */
export const LUKAS_MULLER = {
  id: 'lukas-muller',
  name: 'Lukas Müller',
  role: 'Project Director',
  email: 'l.muller@dreeso.com',
  initials: 'LM',
  colorTheme: {
    primary: '#2563eb',
    light: '#eff6ff',
    dark: '#1e3a8a',
    ring: 'ring-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-700 dark:text-blue-300',
  },
  clusterIds: [
    'cluster-project-timeline',
    'cluster-resource-allocation',
    'cluster-risk-management',
    'cluster-stakeholder-comms',
  ],
};

/**
 * Elena Rossi — Senior Quantity Surveyor persona.
 * Manages procurement, cost estimation, and vendor compliance.
 * @type {Persona}
 */
export const ELENA_ROSSI = {
  id: 'elena-rossi',
  name: 'Elena Rossi',
  role: 'Senior Quantity Surveyor',
  email: 'e.rossi@dreeso.com',
  initials: 'ER',
  colorTheme: {
    primary: '#059669',
    light: '#ecfdf5',
    dark: '#064e3b',
    ring: 'ring-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  clusterIds: [
    'cluster-procurement',
    'cluster-cost-estimation',
    'cluster-vendor-compliance',
    'cluster-material-tracking',
  ],
};

/**
 * Sophie Dubois — Project Manager persona.
 * Handles sustainability targets, ESG compliance, and environmental reporting.
 * @type {Persona}
 */
export const SOPHIE_DUBOIS = {
  id: 'sophie-dubois',
  name: 'Sophie Dubois',
  role: 'Project Manager',
  email: 's.dubois@dreeso.com',
  initials: 'SD',
  colorTheme: {
    primary: '#7c3aed',
    light: '#f5f3ff',
    dark: '#4c1d95',
    ring: 'ring-violet-500',
    bg: 'bg-violet-100 dark:bg-violet-900',
    text: 'text-violet-700 dark:text-violet-300',
  },
  clusterIds: [
    'cluster-sustainability',
    'cluster-esg-compliance',
    'cluster-environmental-reporting',
    'cluster-regulatory-permits',
  ],
};

/**
 * James Carter — Sales Director persona.
 * Drives commercial strategy, client relationships, and revenue forecasting.
 * @type {Persona}
 */
export const JAMES_CARTER = {
  id: 'james-carter',
  name: 'James Carter',
  role: 'Sales Director',
  email: 'j.carter@dreeso.com',
  initials: 'JC',
  colorTheme: {
    primary: '#ea580c',
    light: '#fff7ed',
    dark: '#9a3412',
    ring: 'ring-orange-500',
    bg: 'bg-orange-100 dark:bg-orange-900',
    text: 'text-orange-700 dark:text-orange-300',
  },
  clusterIds: [
    'cluster-commercial-strategy',
    'cluster-client-relations',
    'cluster-revenue-forecasting',
    'cluster-contract-management',
  ],
};

/**
 * Complete list of all persona definitions.
 * @type {Persona[]}
 */
export const PERSONAS = [
  LUKAS_MULLER,
  ELENA_ROSSI,
  SOPHIE_DUBOIS,
  JAMES_CARTER,
];

/**
 * Lookup map of personas keyed by their unique ID.
 * @type {Record<string, Persona>}
 */
export const PERSONA_BY_ID = PERSONAS.reduce((map, persona) => {
  map[persona.id] = persona;
  return map;
}, {});

/**
 * Retrieves a persona by its unique identifier.
 * @param {string} id - The persona ID to look up
 * @returns {Persona|undefined} The matching persona, or undefined if not found
 */
export const getPersonaById = (id) => PERSONA_BY_ID[id];

/**
 * Retrieves all personas associated with a given intelligence cluster ID.
 * @param {string} clusterId - The cluster identifier to search for
 * @returns {Persona[]} Array of personas linked to the specified cluster
 */
export const getPersonasByCluster = (clusterId) =>
  PERSONAS.filter((persona) => persona.clusterIds.includes(clusterId));