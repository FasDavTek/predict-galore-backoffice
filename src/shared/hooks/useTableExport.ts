/**
 * Reusable hook for table CSV export
 * Maintains DRY principle across all tables
 */

import { useCallback } from 'react';
import { exportToCSV } from '@/shared/constants/exportToCSV';

export interface ExportColumn<T> {
  key: keyof T | string;
  label: string;
  format?: (value: unknown, row: T) => string;
}

export interface UseTableExportOptions<T> {
  data: T[];
  columns: ExportColumn<T>[];
  filename: string;
}

/**
 * Hook for exporting table data to CSV
 * @param options - Export configuration
 * @returns Export handler function
 */
export function useTableExport<T = Record<string, unknown>>(
  options: UseTableExportOptions<T>
) {
  const { data, columns, filename } = options;

  const handleExport = useCallback(() => {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    try {
      // Transform data according to column definitions
      const exportData = data.map((row) => {
        const exportRow: Record<string, string> = {};
        
        columns.forEach((column) => {
          const key = column.key as string;
          let value: unknown;

          // Handle nested keys (e.g., 'user.name')
          if (key.includes('.')) {
            const keys = key.split('.');
            value = keys.reduce((obj, k) => {
              if (obj && typeof obj === 'object' && k in obj) {
                return (obj as Record<string, unknown>)[k];
              }
              return undefined;
            }, row as unknown);
          } else {
            const rowRecord = row as Record<string, unknown>;
            value = rowRecord[key];
          }

          // Apply formatting if provided
          const formattedValue = column.format 
            ? column.format(value, row as T)
            : value ?? '';

          exportRow[column.label] = String(formattedValue ?? '');
        });

        return exportRow;
      });

      exportToCSV(exportData, {
        filename,
        columns: exportData.length > 0 ? Object.keys(exportData[0]).map(key => ({ field: key, headerName: key })) : [],
        excludeFields: [],
        fieldLabels: {},
      });
    } catch (error) {
      console.error('Failed to export table data:', error);
    }
  }, [data, columns, filename]);

  return {
    handleExport,
    canExport: data && data.length > 0,
  };
}
