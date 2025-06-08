import { useState, useCallback } from 'react';
import type { DataRecord } from '../types/ViewConfig';

interface UseTableDataReturn {
  data: Record<string, DataRecord[]>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  loadTable: (tableName: string) => Promise<void>;
  refreshTable: (tableName: string) => Promise<void>;
}

export function useTableData(): UseTableDataReturn {
  const [data, setData] = useState<Record<string, DataRecord[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const loadTable = useCallback(async (tableName: string) => {
    try {
      setLoading(prev => ({ ...prev, [tableName]: true }));
      setErrors(prev => ({ ...prev, [tableName]: null }));

      // Use the secure IPC endpoint
      const tableData = await window.electronAPI.getTableData(tableName);
      
      setData(prev => ({ ...prev, [tableName]: tableData }));
    } catch (error) {
      console.error(`Failed to load table ${tableName}:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [tableName]: error instanceof Error ? error.message : 'Failed to load table data' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [tableName]: false }));
    }
  }, []);

  const refreshTable = useCallback(async (tableName: string) => {
    await loadTable(tableName);
  }, [loadTable]);

  return {
    data,
    loading,
    errors,
    loadTable,
    refreshTable
  };
}
