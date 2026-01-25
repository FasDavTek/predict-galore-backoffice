import { createLogger } from '@/shared/api';

const logger = createLogger('Utils:CSV');

/**
 * Universal CSV export utility for any table data
 * @param {Array} data - Array of objects to export
 * @param {Object} options - Export configuration options
 * @param {Array} options.columns - Column definitions for custom mapping
 * @param {String} options.filename - Custom filename
 * @param {Array} options.excludeFields - Fields to exclude from export
 * @param {Object} options.fieldLabels - Custom field labels { fieldName: 'Display Name' }
 */
export const exportToCSV = (data, options = {}) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    logger.warn('No data provided for CSV export');
    return;
  }

  const {
    columns,
    filename = `export-${new Date().toISOString().split('T')[0]}`,
    excludeFields = [],
    fieldLabels = {},
  } = options;

  try {
    // Determine headers and field mapping
    let headers = [];
    let fieldKeys = [];

    if (columns && Array.isArray(columns)) {
      // Use provided column definitions
      headers = columns
        .filter(
          (column) => column.field && !excludeFields.includes(column.field) && !column.disableExport
        )
        .map((column) => fieldLabels[column.field] || column.headerName || column.field);

      fieldKeys = columns
        .filter(
          (column) => column.field && !excludeFields.includes(column.field) && !column.disableExport
        )
        .map((column) => column.field);
    } else {
      // Auto-generate from first data object
      const firstItem = data[0];
      fieldKeys = Object.keys(firstItem).filter((key) => !excludeFields.includes(key));

      headers = fieldKeys.map(
        (key) =>
          fieldLabels[key] ||
          key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim()
      );
    }

    // Generate CSV rows
    const csvRows = data.map((item) => {
      return fieldKeys.map((fieldKey) => {
        const value = getNestedValue(item, fieldKey);
        return formatCSVValue(value);
      });
    });

    // Create CSV content
    const csvContent = [headers.join(','), ...csvRows.map((row) => row.join(','))].join('\n');

    // Trigger download
    downloadCSVFile(csvContent, filename);
  } catch (error) {
    logger.error('Error generating CSV', { error });
    throw new Error('Failed to generate CSV file');
  }
};

/**
 * Gets nested object value using dot notation
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return '';

  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : '';
  }, obj);
};

/**
 * Formats value for CSV (handles commas, quotes, and newlines)
 */
const formatCSVValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  // Convert dates to readable format
  if (value instanceof Date) {
    value = value.toLocaleDateString();
  }

  const stringValue = String(value);

  // Escape quotes and wrap in quotes if contains special characters
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

/**
 * Triggers the actual file download
 */
const downloadCSVFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
