/**
 * Application-wide constants and configuration values.
 * @module constants
 */

/**
 * Reference date used for memory/timeline calculations (ISO 8601 format).
 * Falls back to May 2, 2026 if not set in environment.
 * @type {string}
 */
export const REFERENCE_DATE = import.meta.env.VITE_REFERENCE_DATE || '2026-05-02';

/**
 * Total number of screens in the application.
 * @type {number}
 */
export const SCREEN_COUNT = 20;

/**
 * List of persona profiles used throughout the application.
 * @type {Array<{id: string, name: string, role: string, email: string}>}
 */
export const PERSONA_LIST = [
  {
    id: 'lukas-muller',
    name: 'Lukas Müller',
    role: 'Project Director',
    email: 'l.muller@dreeso.com',
  },
  {
    id: 'elena-rossi',
    name: 'Elena Rossi',
    role: 'Procurement Lead',
    email: 'e.rossi@dreeso.com',
  },
  {
    id: 'sophie-dubois',
    name: 'Sophie Dubois',
    role: 'Sustainability Manager',
    email: 's.dubois@dreeso.com',
  },
  {
    id: 'james-carter',
    name: 'James Carter',
    role: 'Commercial Manager',
    email: 'j.carter@dreeso.com',
  },
];

/**
 * Enterprise system sources integrated with the application.
 * @type {Array<{id: string, name: string, description: string}>}
 */
export const SYSTEM_SOURCES = [
  {
    id: 'procore',
    name: 'Procore',
    description: 'Construction project management platform',
  },
  {
    id: 'sap-mm',
    name: 'SAP MM',
    description: 'SAP Materials Management module',
  },
  {
    id: 'sap-fi',
    name: 'SAP FI',
    description: 'SAP Financial Accounting module',
  },
  {
    id: 'navisworks',
    name: 'Navisworks',
    description: '3D model review and coordination tool',
  },
  {
    id: 'primavera-p6',
    name: 'Primavera P6',
    description: 'Enterprise project portfolio management',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Customer relationship management platform',
  },
  {
    id: 'workday',
    name: 'Workday',
    description: 'Human capital and workforce management',
  },
  {
    id: 'vendor-compliance-db',
    name: 'Vendor Compliance DB',
    description: 'Vendor compliance and certification database',
  },
  {
    id: 'esg-registry',
    name: 'ESG Registry',
    description: 'Environmental, Social, and Governance registry',
  },
  {
    id: 'amsterdam-authority-portal',
    name: 'Amsterdam Authority Portal',
    description: 'Municipal authority permits and regulatory portal',
  },
  {
    id: 'nen-compliance-db',
    name: 'NEN Compliance DB',
    description: 'NEN standards compliance database',
  },
];

/**
 * Keyboard shortcut mappings for application navigation and actions.
 * @type {Record<string, {key: string, description: string, ctrlKey?: boolean, shiftKey?: boolean, altKey?: boolean}>}
 */
export const KEYBOARD_SHORTCUTS = {
  NEXT_SCREEN: {
    key: 'ArrowRight',
    description: 'Navigate to next screen',
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  },
  PREV_SCREEN: {
    key: 'ArrowLeft',
    description: 'Navigate to previous screen',
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  },
  TOGGLE_DARK_MODE: {
    key: 'd',
    description: 'Toggle dark mode',
    ctrlKey: true,
    shiftKey: false,
    altKey: false,
  },
  SEARCH: {
    key: 'k',
    description: 'Open search',
    ctrlKey: true,
    shiftKey: false,
    altKey: false,
  },
  ESCAPE: {
    key: 'Escape',
    description: 'Close modal or cancel action',
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  },
  HOME: {
    key: 'Home',
    description: 'Go to first screen',
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  },
  END: {
    key: 'End',
    description: 'Go to last screen',
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  },
};

/**
 * Keys used for localStorage persistence.
 * @type {Record<string, string>}
 */
export const LOCALSTORAGE_KEYS = {
  DARK_MODE: 'ask-dreeso-dark-mode',
  CURRENT_SCREEN: 'ask-dreeso-current-screen',
  SELECTED_PERSONA: 'ask-dreeso-selected-persona',
  USER_PREFERENCES: 'ask-dreeso-user-preferences',
  TIMELINE_STATE: 'ask-dreeso-timeline-state',
};