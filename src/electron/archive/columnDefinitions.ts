// Column Definitions - Pure Configuration Data
// Separated from business logic for better maintainability
/*
export interface ColumnDefinition {
  key: string;
  displayName: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  dataType?: 'string' | 'number' | 'date' | 'boolean';
  required?: boolean;
  formatter?: (value: any) => string;
  description?: string;
}

export const ARTICLE_COLUMN_DEFINITIONS: ColumnDefinition[] = [
  { 
    key: 'ARTICLESCODE', 
    displayName: 'Article Code', 
    width: 120, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    required: true,
    description: 'Unique identifier for the article'
  },
  { 
    key: 'ARTICLESDESC', 
    displayName: 'Article Description', 
    width: 200, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Detailed description of the article'
  },
  { 
    key: 'DIM7DESC', 
    displayName: 'Category', 
    width: 150, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Product category classification'
  },
  { 
    key: 'SUPPLIERCODE', 
    displayName: 'Supplier Code', 
    width: 120, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Code identifying the supplier'
  },
  { 
    key: 'BARCODE', 
    displayName: 'Barcode', 
    width: 140, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Product barcode for scanning'
  },
  { 
    key: 'ARTICLESUOM', 
    displayName: 'Unit of Measure', 
    width: 120, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Unit of measurement (kg, pcs, etc.)'
  },
  { 
    key: 'LASTPURCHASEPRICE', 
    displayName: 'Last Purchase Price', 
    width: 150, 
    sortable: true, 
    filterable: true,
    dataType: 'number',
    formatter: (value: number) => value ? `$${value.toFixed(2)}` : '$0.00',
    description: 'Most recent purchase price'
  },
  { 
    key: 'DEVISECODE', 
    displayName: 'Currency Code', 
    width: 100, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Currency code (USD, EUR, etc.)'
  },
  { 
    key: 'DIM6DESC', 
    displayName: 'Subcategory', 
    width: 150, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Product subcategory'
  },
  { 
    key: 'DIM1CODE', 
    displayName: 'Dimension 1 Code', 
    width: 120, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'First dimension classification code'
  },
  { 
    key: 'DIM1DESC', 
    displayName: 'Dimension 1', 
    width: 150, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'First dimension classification description'
  },
  { 
    key: 'DIM3CODE', 
    displayName: 'Dimension 3 Code', 
    width: 120, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Third dimension classification code'
  },
  { 
    key: 'DIM3DESC', 
    displayName: 'Dimension 3', 
    width: 150, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Third dimension classification description'
  },
  { 
    key: 'DIM11DESC', 
    displayName: 'Dimension 11', 
    width: 150, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Eleventh dimension classification'
  },
  { 
    key: 'DIM12DESC', 
    displayName: 'Brand', 
    width: 120, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Product brand name'
  },
  { 
    key: 'DIM16DESC', 
    displayName: 'Size/Model', 
    width: 120, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Product size or model information'
  },
  { 
    key: 'DIM10DESC', 
    displayName: 'Color', 
    width: 100, 
    sortable: true, 
    filterable: true,
    dataType: 'string',
    description: 'Product color'
  }
];

// Table-specific configurations mapping
import { TABLE_NAMES } from './constants.js';

export const TABLE_COLUMN_CONFIGS = {
  [TABLE_NAMES.ARTICLES_DIM_UDF]: ARTICLE_COLUMN_DEFINITIONS,
  // Future tables can be added here as the application grows
} as const;

// Helper function to get columns for a specific table
export function getColumnDefinitionsForTable(tableName: string): ColumnDefinition[] {
  return TABLE_COLUMN_CONFIGS[tableName as keyof typeof TABLE_COLUMN_CONFIGS] || [];
}

// Helper function to get a specific column definition
export function getColumnDefinition(tableName: string, columnKey: string): ColumnDefinition | undefined {
  const tableColumns = getColumnDefinitionsForTable(tableName);
  return tableColumns.find(col => col.key === columnKey);
}

// Helper functions for backward compatibility with old database.ts
export function getDefaultColumnSelectionForTable(tableName: string): string[] {
  const columns = getColumnDefinitionsForTable(tableName);
  return columns.map(col => col.key);
}

export function getSelectedColumns(tableName: string): string[] {
  // For now, return all available columns as selected
  // This will be replaced by the ColumnService in the future
  return getDefaultColumnSelectionForTable(tableName);
}

export function shouldIncludeColumn(tableName: string, columnName: string): boolean {
  const selectedColumns = getSelectedColumns(tableName);
  return selectedColumns.length === 0 || selectedColumns.includes(columnName);
}



export function getColumnSelectionInfo(tableName: string): { total: number; selected: number; columns: ColumnDefinition[] } {
  const allColumns = getColumnDefinitionsForTable(tableName);
  const selectedColumnKeys = getSelectedColumns(tableName);
  const selectedColumns = allColumns.filter(col => selectedColumnKeys.includes(col.key));
  
  return {
    total: allColumns.length,
    selected: selectedColumns.length,
    columns: selectedColumns
  };
}
*/