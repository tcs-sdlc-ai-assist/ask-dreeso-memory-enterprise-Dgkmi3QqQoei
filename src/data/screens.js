/**
 * Complete 20-screen demo flow definition for the Ask Dreeso Memory application.
 * Each screen specifies persona, screen type, query text, response key, cluster visibility,
 * CTA bubbles, active systems, and transition metadata.
 * This is the master narrative sequence for the demo.
 * @module data/screens
 */

import { SCREEN_FLOW, QUERY_BY_ID } from './queries';
import { CLUSTERS_BY_PERSONA } from './clusters';
import { ACTIONS_BY_QUERY } from './actions';
import { PERSONA_BY_ID } from './personas';

/**
 * @typedef {'home' | 'query' | 'response' | 'action' | 'confirmation'} ScreenType
 */

/**
 * @typedef {'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'expand'} TransitionType
 */

/**
 * @typedef {Object} TransitionMeta
 * @property {TransitionType} enter - Transition animation when entering this screen
 * @property {TransitionType} exit - Transition animation when leaving this screen
 * @property {number} duration - Transition duration in milliseconds
 * @property {number} [autoAdvanceMs] - Optional auto-advance delay in milliseconds
 */

/**
 * @typedef {Object} ScreenDefinition
 * @property {number} screen - Screen number (1-20)
 * @property {string} id - Unique screen identifier
 * @property {string} personaId - Active persona for this screen
 * @property {string} personaName - Display name of the active persona
 * @property {string} personaRole - Role of the active persona
 * @property {ScreenType} screenType - Type of screen to render
 * @property {string} queryText - The query text displayed on this screen
 * @property {string} queryId - ID of the associated query response
 * @property {string} responseKey - Key to look up the response data
 * @property {string} answer - The response answer text
 * @property {string[]} clusterIds - Visible cluster IDs for this screen
 * @property {string[]} ctaBubbles - Suggested follow-up query bubbles
 * @property {string[]} activeSystems - IDs of systems actively queried
 * @property {string[]} actionIds - IDs of actions available on this screen
 * @property {string} description - Brief description of the screen purpose
 * @property {TransitionMeta} transition - Transition animation metadata
 * @property {boolean} isFirstInPersonaGroup - Whether this is the first screen for the persona
 * @property {boolean} isLastInPersonaGroup - Whether this is the last screen for the persona
 * @property {number|null} nextScreen - Next screen number, or null if last
 * @property {number|null} prevScreen - Previous screen number, or null if first
 */

// ---------------------------------------------------------------------------
// Transition presets
// ---------------------------------------------------------------------------

/** @type {TransitionMeta} */
const TRANSITION_PERSONA_INTRO = {
  enter: 'fade',
  exit: 'slide-left',
  duration: 400,
  autoAdvanceMs: undefined,
};

/** @type {TransitionMeta} */
const TRANSITION_QUERY_FLOW = {
  enter: 'slide-left',
  exit: 'slide-left',
  duration: 350,
  autoAdvanceMs: undefined,
};

/** @type {TransitionMeta} */
const TRANSITION_PERSONA_EXIT = {
  enter: 'slide-left',
  exit: 'fade',
  duration: 400,
  autoAdvanceMs: undefined,
};

// ---------------------------------------------------------------------------
// Screen type assignment logic
// ---------------------------------------------------------------------------

/**
 * Determines the screen type based on position within persona group and available actions.
 * @param {number} indexInGroup - Zero-based index within the persona's screen group
 * @param {number} groupSize - Total screens in the persona's group
 * @param {boolean} hasActions - Whether the query has associated actions
 * @returns {ScreenType} The determined screen type
 */
const resolveScreenType = (indexInGroup, groupSize, hasActions) => {
  if (indexInGroup === 0) {
    return 'home';
  }
  if (hasActions && indexInGroup === groupSize - 1) {
    return 'action';
  }
  if (hasActions) {
    return 'response';
  }
  return 'query';
};

/**
 * Determines the transition metadata based on position within persona group.
 * @param {boolean} isFirst - Whether this is the first screen in the persona group
 * @param {boolean} isLast - Whether this is the last screen in the persona group
 * @returns {TransitionMeta} The transition metadata
 */
const resolveTransition = (isFirst, isLast) => {
  if (isFirst) {
    return { ...TRANSITION_PERSONA_INTRO };
  }
  if (isLast) {
    return { ...TRANSITION_PERSONA_EXIT };
  }
  return { ...TRANSITION_QUERY_FLOW };
};

// ---------------------------------------------------------------------------
// Persona group boundaries
// ---------------------------------------------------------------------------

/**
 * Persona group ranges (inclusive start, exclusive end screen indices).
 * @type {Array<{personaId: string, start: number, end: number}>}
 */
const PERSONA_GROUPS = [
  { personaId: 'lukas-muller', start: 0, end: 5 },
  { personaId: 'elena-rossi', start: 5, end: 10 },
  { personaId: 'sophie-dubois', start: 10, end: 15 },
  { personaId: 'james-carter', start: 15, end: 20 },
];

/**
 * Finds the persona group for a given screen index.
 * @param {number} index - Zero-based screen index
 * @returns {{personaId: string, start: number, end: number}} The persona group
 */
const findPersonaGroup = (index) =>
  PERSONA_GROUPS.find((g) => index >= g.start && index < g.end) || PERSONA_GROUPS[0];

// ---------------------------------------------------------------------------
// Build the 20-screen sequence
// ---------------------------------------------------------------------------

/**
 * Builds a single screen definition from the screen flow entry.
 * @param {import('./queries').ScreenFlowEntry} flowEntry - The screen flow entry
 * @param {number} index - Zero-based index in the flow
 * @returns {ScreenDefinition} The complete screen definition
 */
const buildScreen = (flowEntry, index) => {
  const query = QUERY_BY_ID[flowEntry.queryId];
  const persona = PERSONA_BY_ID[flowEntry.personaId];
  const group = findPersonaGroup(index);
  const indexInGroup = index - group.start;
  const groupSize = group.end - group.start;
  const isFirst = indexInGroup === 0;
  const isLast = indexInGroup === groupSize - 1;

  const queryActions = ACTIONS_BY_QUERY[flowEntry.queryId] || [];
  const hasActions = queryActions.length > 0;

  const personaClusters = CLUSTERS_BY_PERSONA[flowEntry.personaId] || [];
  const clusterIds = personaClusters.map((c) => c.id);

  const screenType = resolveScreenType(indexInGroup, groupSize, hasActions);
  const transition = resolveTransition(isFirst, isLast);

  return {
    screen: flowEntry.screen,
    id: `screen-${String(flowEntry.screen).padStart(2, '0')}`,
    personaId: flowEntry.personaId,
    personaName: persona ? persona.name : flowEntry.personaId,
    personaRole: persona ? persona.role : '',
    screenType,
    queryText: query ? query.query : '',
    queryId: flowEntry.queryId,
    responseKey: flowEntry.queryId,
    answer: query ? query.answer : '',
    clusterIds,
    ctaBubbles: query ? query.ctaBubbles : [],
    activeSystems: query ? query.activeSystems : [],
    actionIds: queryActions.map((a) => a.id),
    description: flowEntry.description,
    transition,
    isFirstInPersonaGroup: isFirst,
    isLastInPersonaGroup: isLast,
    nextScreen: flowEntry.screen < 20 ? flowEntry.screen + 1 : null,
    prevScreen: flowEntry.screen > 1 ? flowEntry.screen - 1 : null,
  };
};

/**
 * The complete 20-screen demo flow sequence.
 * Each entry is a fully resolved screen definition with persona, query, response,
 * cluster visibility, CTA bubbles, active systems, actions, and transition metadata.
 * @type {ScreenDefinition[]}
 */
export const SCREENS = SCREEN_FLOW.map((entry, index) => buildScreen(entry, index));

/**
 * Lookup map of screen definitions keyed by screen number.
 * @type {Record<number, ScreenDefinition>}
 */
export const SCREEN_BY_NUMBER = SCREENS.reduce((map, screen) => {
  map[screen.screen] = screen;
  return map;
}, {});

/**
 * Lookup map of screen definitions keyed by screen ID.
 * @type {Record<string, ScreenDefinition>}
 */
export const SCREEN_BY_ID = SCREENS.reduce((map, screen) => {
  map[screen.id] = screen;
  return map;
}, {});

/**
 * Lookup map of screen definitions grouped by persona ID.
 * @type {Record<string, ScreenDefinition[]>}
 */
export const SCREENS_BY_PERSONA = SCREENS.reduce((map, screen) => {
  if (!map[screen.personaId]) {
    map[screen.personaId] = [];
  }
  map[screen.personaId].push(screen);
  return map;
}, {});

/**
 * Lookup map of screen definitions grouped by screen type.
 * @type {Record<ScreenType, ScreenDefinition[]>}
 */
export const SCREENS_BY_TYPE = SCREENS.reduce((map, screen) => {
  if (!map[screen.screenType]) {
    map[screen.screenType] = [];
  }
  map[screen.screenType].push(screen);
  return map;
}, {});

/**
 * Ordered list of persona IDs as they appear in the demo flow.
 * @type {string[]}
 */
export const PERSONA_ORDER = PERSONA_GROUPS.map((g) => g.personaId);

/**
 * Total number of screens in the demo flow.
 * @type {number}
 */
export const TOTAL_SCREENS = SCREENS.length;

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/**
 * Retrieves a screen definition by its screen number.
 * @param {number} screenNumber - The screen number (1-20)
 * @returns {ScreenDefinition|undefined} The matching screen definition, or undefined if not found
 */
export const getScreenByNumber = (screenNumber) => SCREEN_BY_NUMBER[screenNumber];

/**
 * Retrieves a screen definition by its unique ID.
 * @param {string} id - The screen ID (e.g. 'screen-01')
 * @returns {ScreenDefinition|undefined} The matching screen definition, or undefined if not found
 */
export const getScreenById = (id) => SCREEN_BY_ID[id];

/**
 * Retrieves all screen definitions for a given persona ID.
 * @param {string} personaId - The persona identifier
 * @returns {ScreenDefinition[]} Array of screen definitions for the specified persona
 */
export const getScreensByPersona = (personaId) =>
  SCREENS_BY_PERSONA[personaId] || [];

/**
 * Retrieves all screen definitions matching a given screen type.
 * @param {ScreenType} screenType - The screen type to filter by
 * @returns {ScreenDefinition[]} Array of screen definitions with the specified type
 */
export const getScreensByType = (screenType) =>
  SCREENS_BY_TYPE[screenType] || [];

/**
 * Retrieves the next screen definition relative to the given screen number.
 * @param {number} currentScreen - The current screen number
 * @returns {ScreenDefinition|undefined} The next screen definition, or undefined if at the end
 */
export const getNextScreen = (currentScreen) => {
  const current = SCREEN_BY_NUMBER[currentScreen];
  if (!current || current.nextScreen === null) {
    return undefined;
  }
  return SCREEN_BY_NUMBER[current.nextScreen];
};

/**
 * Retrieves the previous screen definition relative to the given screen number.
 * @param {number} currentScreen - The current screen number
 * @returns {ScreenDefinition|undefined} The previous screen definition, or undefined if at the start
 */
export const getPrevScreen = (currentScreen) => {
  const current = SCREEN_BY_NUMBER[currentScreen];
  if (!current || current.prevScreen === null) {
    return undefined;
  }
  return SCREEN_BY_NUMBER[current.prevScreen];
};

/**
 * Retrieves the first screen for a given persona in the demo flow.
 * @param {string} personaId - The persona identifier
 * @returns {ScreenDefinition|undefined} The first screen for the persona, or undefined
 */
export const getFirstScreenForPersona = (personaId) => {
  const screens = SCREENS_BY_PERSONA[personaId];
  return screens && screens.length > 0 ? screens[0] : undefined;
};

/**
 * Retrieves the last screen for a given persona in the demo flow.
 * @param {string} personaId - The persona identifier
 * @returns {ScreenDefinition|undefined} The last screen for the persona, or undefined
 */
export const getLastScreenForPersona = (personaId) => {
  const screens = SCREENS_BY_PERSONA[personaId];
  return screens && screens.length > 0 ? screens[screens.length - 1] : undefined;
};

/**
 * Retrieves all screens that have action triggers available.
 * @returns {ScreenDefinition[]} Array of screen definitions with actions
 */
export const getScreensWithActions = () =>
  SCREENS.filter((screen) => screen.actionIds.length > 0);

/**
 * Retrieves all screens that reference a given active system.
 * @param {string} systemId - The system identifier
 * @returns {ScreenDefinition[]} Array of screen definitions using the specified system
 */
export const getScreensByActiveSystem = (systemId) =>
  SCREENS.filter((screen) => screen.activeSystems.includes(systemId));

/**
 * Calculates the progress percentage for a given screen number.
 * @param {number} screenNumber - The screen number (1-20)
 * @returns {number} Progress percentage (0-100)
 */
export const getProgressPercentage = (screenNumber) => {
  if (screenNumber < 1) return 0;
  if (screenNumber > TOTAL_SCREENS) return 100;
  return Math.round((screenNumber / TOTAL_SCREENS) * 100);
};

/**
 * Calculates the progress within the current persona group.
 * @param {number} screenNumber - The screen number (1-20)
 * @returns {number} Progress percentage within the persona group (0-100)
 */
export const getPersonaProgressPercentage = (screenNumber) => {
  const screen = SCREEN_BY_NUMBER[screenNumber];
  if (!screen) return 0;
  const personaScreens = SCREENS_BY_PERSONA[screen.personaId] || [];
  if (personaScreens.length === 0) return 0;
  const indexInGroup = personaScreens.findIndex((s) => s.screen === screenNumber);
  if (indexInGroup === -1) return 0;
  return Math.round(((indexInGroup + 1) / personaScreens.length) * 100);
};

/**
 * Determines which persona is active at a given screen number.
 * @param {number} screenNumber - The screen number (1-20)
 * @returns {string|undefined} The persona ID, or undefined if screen not found
 */
export const getActivePersonaAtScreen = (screenNumber) => {
  const screen = SCREEN_BY_NUMBER[screenNumber];
  return screen ? screen.personaId : undefined;
};