/**
 * Predictions Utilities
 * Helper functions for predictions feature
 */

/** Start of today in local timezone (00:00:00.000). */
export const startOfToday = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getFormattedFutureDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDateForAPI(date);
};

/** Format date as YYYY-MM-DD for API (local date, date-only). */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

