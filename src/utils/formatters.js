/**
 * Data formatting utilities for the Ask Dreeso Memory application.
 * Provides formatDate (relative to REFERENCE_DATE), formatCurrency,
 * formatPercentage, formatTimestamp, and truncateText helpers
 * used across all display components.
 * @module utils/formatters
 */

import { REFERENCE_DATE } from '../constants';

/**
 * Parses a date string or Date object into a valid Date instance.
 * Returns null if the input is invalid.
 * @param {string|Date} input - Date string (ISO 8601) or Date object
 * @returns {Date|null} Parsed Date instance, or null if invalid
 */
const parseDate = (input) => {
  if (!input) {
    return null;
  }
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }
  if (typeof input === 'string') {
    const parsed = new Date(input);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

/**
 * Formats a date as a human-readable relative string compared to REFERENCE_DATE.
 * Examples: "today", "yesterday", "3 days ago", "in 2 days", "2 weeks ago",
 * "3 months ago", "1 year ago". Falls back to ISO date string if the input
 * is invalid.
 * @param {string|Date} date - The date to format (ISO 8601 string or Date object)
 * @param {string} [referenceDate] - Optional override for the reference date (ISO 8601). Defaults to REFERENCE_DATE.
 * @returns {string} Human-readable relative date string
 */
export const formatDate = (date, referenceDate) => {
  const target = parseDate(date);
  if (!target) {
    return 'Invalid date';
  }

  const ref = parseDate(referenceDate || REFERENCE_DATE);
  if (!ref) {
    return target.toISOString().slice(0, 10);
  }

  // Calculate difference in milliseconds
  const diffMs = ref.getTime() - target.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isPast = diffMs > 0;

  const ONE_MINUTE = 60 * 1000;
  const ONE_HOUR = 60 * ONE_MINUTE;
  const ONE_DAY = 24 * ONE_HOUR;
  const ONE_WEEK = 7 * ONE_DAY;
  const ONE_MONTH = 30 * ONE_DAY;
  const ONE_YEAR = 365 * ONE_DAY;

  // Less than 1 day
  if (absDiffMs < ONE_DAY) {
    // Check if it's actually the same calendar day
    const targetDay = target.toISOString().slice(0, 10);
    const refDay = ref.toISOString().slice(0, 10);
    if (targetDay === refDay) {
      return 'today';
    }
    if (isPast) {
      return 'yesterday';
    }
    return 'tomorrow';
  }

  // 1 day
  if (absDiffMs < 2 * ONE_DAY) {
    return isPast ? 'yesterday' : 'tomorrow';
  }

  // Less than 1 week — show days
  if (absDiffMs < ONE_WEEK) {
    const days = Math.floor(absDiffMs / ONE_DAY);
    return isPast ? `${days} days ago` : `in ${days} days`;
  }

  // Less than 1 month — show weeks
  if (absDiffMs < ONE_MONTH) {
    const weeks = Math.floor(absDiffMs / ONE_WEEK);
    return isPast
      ? `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
      : `in ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  }

  // Less than 1 year — show months
  if (absDiffMs < ONE_YEAR) {
    const months = Math.floor(absDiffMs / ONE_MONTH);
    return isPast
      ? `${months} ${months === 1 ? 'month' : 'months'} ago`
      : `in ${months} ${months === 1 ? 'month' : 'months'}`;
  }

  // 1 year or more
  const years = Math.floor(absDiffMs / ONE_YEAR);
  return isPast
    ? `${years} ${years === 1 ? 'year' : 'years'} ago`
    : `in ${years} ${years === 1 ? 'year' : 'years'}`;
};

/**
 * Formats a numeric value as a currency string.
 * Defaults to EUR (€) with locale-aware formatting.
 * @param {number} value - The numeric value to format
 * @param {string} [currency='EUR'] - ISO 4217 currency code
 * @param {string} [locale='en-IE'] - BCP 47 locale string
 * @returns {string} Formatted currency string (e.g. "€42,600,000.00")
 */
export const formatCurrency = (value, currency, locale) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '—';
  }

  const resolvedCurrency = currency || 'EUR';
  const resolvedLocale = locale || 'en-IE';

  try {
    return new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency: resolvedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (_err) {
    return `${resolvedCurrency} ${value.toFixed(2)}`;
  }
};

/**
 * Formats a numeric value as a percentage string.
 * @param {number} value - The numeric value to format (e.g. 0.84 for 84%, or 84 for 84%)
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.isDecimal=false] - If true, treats value as a decimal (0.84 → 84%)
 * @param {number} [options.decimals=0] - Number of decimal places to show
 * @param {boolean} [options.includeSign=false] - If true, includes + sign for positive values
 * @returns {string} Formatted percentage string (e.g. "84%", "+2.1%")
 */
export const formatPercentage = (value, options) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '—';
  }

  const { isDecimal = false, decimals = 0, includeSign = false } = options || {};

  const percentValue = isDecimal ? value * 100 : value;
  const formatted = percentValue.toFixed(decimals);

  const sign = includeSign && percentValue > 0 ? '+' : '';

  return `${sign}${formatted}%`;
};

/**
 * Formats an ISO 8601 timestamp into a human-readable date-time string.
 * @param {string|Date} timestamp - ISO 8601 timestamp string or Date object
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.includeTime=true] - Whether to include the time portion
 * @param {boolean} [options.includeSeconds=false] - Whether to include seconds
 * @param {string} [options.locale='en-GB'] - BCP 47 locale string
 * @returns {string} Formatted timestamp string (e.g. "30 Apr 2026, 09:15")
 */
export const formatTimestamp = (timestamp, options) => {
  const date = parseDate(timestamp);
  if (!date) {
    return 'Invalid date';
  }

  const { includeTime = true, includeSeconds = false, locale = 'en-GB' } = options || {};

  try {
    const dateOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };

    if (includeTime) {
      dateOptions.hour = '2-digit';
      dateOptions.minute = '2-digit';
      if (includeSeconds) {
        dateOptions.second = '2-digit';
      }
    }

    return new Intl.DateTimeFormat(locale, dateOptions).format(date);
  } catch (_err) {
    return date.toISOString();
  }
};

/**
 * Truncates text to a specified maximum length, appending an ellipsis if truncated.
 * @param {string} text - The text to truncate
 * @param {number} [maxLength=100] - Maximum character length before truncation
 * @param {string} [suffix='…'] - Suffix to append when text is truncated
 * @returns {string} The original or truncated text
 */
export const truncateText = (text, maxLength, suffix) => {
  if (typeof text !== 'string') {
    return '';
  }

  const resolvedMaxLength = typeof maxLength === 'number' && maxLength > 0 ? maxLength : 100;
  const resolvedSuffix = typeof suffix === 'string' ? suffix : '…';

  if (text.length <= resolvedMaxLength) {
    return text;
  }

  // Truncate at the last space before maxLength to avoid cutting words
  const truncated = text.slice(0, resolvedMaxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > resolvedMaxLength * 0.5) {
    return truncated.slice(0, lastSpace) + resolvedSuffix;
  }

  return truncated + resolvedSuffix;
};