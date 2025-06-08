// Input Validation System for IPC Handlers
// Provides comprehensive validation with security focus
/*
import { VALIDATION_LIMITS, ERROR_MESSAGES } from '../config/constants.js';
import { FetchDataOptions } from '../types/index.js';

export class ValidationError extends Error {
  public readonly code: string;
  public readonly field: string;
  public readonly value: any;

  constructor(message: string, code: string, field: string, value: any) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.field = field;
    this.value = value;
  }
}

// ================================
// Type Guards
// ================================

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isPositiveInteger(value: any): value is number {
  return isNumber(value) && Number.isInteger(value) && value >= 0;
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

// ================================
// Basic Validation Functions
// ================================

export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null) {
    throw new ValidationError(
      `${fieldName} is required`,
      'REQUIRED_FIELD',
      fieldName,
      value
    );
  }
}

export function validateString(value: any, fieldName: string, options: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
} = {}): string {
  if (options.required && (value === undefined || value === null)) {
    throw new ValidationError(
      `${fieldName} is required`,
      'REQUIRED_FIELD',
      fieldName,
      value
    );
  }

  if (value === undefined || value === null) {
    return '';
  }

  if (!isString(value)) {
    throw new ValidationError(
      `${fieldName} must be a string`,
      'INVALID_TYPE',
      fieldName,
      value
    );
  }

  if (options.minLength !== undefined && value.length < options.minLength) {
    throw new ValidationError(
      `${fieldName} must be at least ${options.minLength} characters`,
      'MIN_LENGTH',
      fieldName,
      value
    );
  }

  if (options.maxLength !== undefined && value.length > options.maxLength) {
    throw new ValidationError(
      `${fieldName} must be at most ${options.maxLength} characters`,
      'MAX_LENGTH',
      fieldName,
      value
    );
  }

  if (options.pattern && !options.pattern.test(value)) {
    throw new ValidationError(
      `${fieldName} format is invalid`,
      'INVALID_FORMAT',
      fieldName,
      value
    );
  }

  return value;
}

export function validateNumber(value: any, fieldName: string, options: {
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
} = {}): number {
  if (options.required && (value === undefined || value === null)) {
    throw new ValidationError(
      `${fieldName} is required`,
      'REQUIRED_FIELD',
      fieldName,
      value
    );
  }

  if (value === undefined || value === null) {
    return 0;
  }

  if (!isNumber(value)) {
    throw new ValidationError(
      `${fieldName} must be a number`,
      'INVALID_TYPE',
      fieldName,
      value
    );
  }

  if (options.integer && !Number.isInteger(value)) {
    throw new ValidationError(
      `${fieldName} must be an integer`,
      'INVALID_INTEGER',
      fieldName,
      value
    );
  }

  if (options.min !== undefined && value < options.min) {
    throw new ValidationError(
      `${fieldName} must be at least ${options.min}`,
      'MIN_VALUE',
      fieldName,
      value
    );
  }

  if (options.max !== undefined && value > options.max) {
    throw new ValidationError(
      `${fieldName} must be at most ${options.max}`,
      'MAX_VALUE',
      fieldName,
      value
    );
  }

  return value;
}

// ================================
// SQL Injection Prevention
// ================================

export function validateColumnName(columnName: string): string {
  const validatedName = validateString(columnName, 'columnName', {
    required: true,
    maxLength: VALIDATION_LIMITS.MAX_COLUMN_NAME_LENGTH,
    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/
  });

  // Additional security: whitelist known safe column names
  const safeColumns = [
    'ARTICLESCODE', 'ARTICLESDESC', 'DIM7DESC', 'SUPPLIERCODE', 
    'BARCODE', 'ARTICLESUOM', 'LASTPURCHASEPRICE', 'DEVISECODE',
    'DIM6DESC', 'DIM1CODE', 'DIM1DESC', 'DIM3CODE', 'DIM3DESC',
    'DIM11DESC', 'DIM12DESC', 'DIM16DESC', 'DIM10DESC'
  ];

  if (!safeColumns.includes(validatedName)) {
    throw new ValidationError(
      `Column name '${validatedName}' is not allowed`,
      'INVALID_COLUMN',
      'columnName',
      validatedName
    );
  }

  return validatedName;
}

export function validateSortDirection(direction: any): 'ASC' | 'DESC' {
  if (direction === undefined || direction === null) {
    return 'ASC';
  }

  if (!isString(direction)) {
    throw new ValidationError(
      'Sort direction must be a string',
      'INVALID_TYPE',
      'sortDirection',
      direction
    );
  }

  const normalizedDirection = direction.toUpperCase();
  if (normalizedDirection !== 'ASC' && normalizedDirection !== 'DESC') {
    throw new ValidationError(
      'Sort direction must be ASC or DESC',
      'INVALID_SORT_DIRECTION',
      'sortDirection',
      direction
    );
  }

  return normalizedDirection as 'ASC' | 'DESC';
}

export function validateTableName(tableName: string): string {
  const validatedName = validateString(tableName, 'tableName', {
    required: true,
    maxLength: VALIDATION_LIMITS.MAX_TABLE_NAME_LENGTH,
    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/
  });
  // Whitelist known safe table names
  const safeTables = [
    'articles_dim_udf', 
    'ARTICLES_DIM_UDF', 
    'ArticlesDimUDF'  // Mixed case variant used in the application
  ];
  if (!safeTables.includes(validatedName)) {
    throw new ValidationError(
      `Table name '${validatedName}' is not allowed`,
      'INVALID_TABLE',
      'tableName',
      validatedName
    );
  }

  return validatedName;
}

// ================================
// Complex Object Validation
// ================================

export function validateFetchDataOptions(options: any): FetchDataOptions {
  if (options === undefined || options === null) {
    return {};
  }

  if (typeof options !== 'object') {
    throw new ValidationError(
      'Fetch options must be an object',
      'INVALID_TYPE',
      'options',
      options
    );
  }

  const validated: FetchDataOptions = {};

  // Validate limit
  if (options.limit !== undefined) {
    validated.limit = validateNumber(options.limit, 'limit', {
      min: VALIDATION_LIMITS.MIN_LIMIT,
      max: VALIDATION_LIMITS.MAX_LIMIT,
      integer: true
    });
  }

  // Validate offset
  if (options.offset !== undefined) {
    validated.offset = validateNumber(options.offset, 'offset', {
      min: 0,
      max: VALIDATION_LIMITS.MAX_OFFSET,
      integer: true
    });
  }

  // Validate orderBy
  if (options.orderBy !== undefined) {
    validated.orderBy = validateColumnName(options.orderBy);
  }

  // Validate orderDirection
  if (options.orderDirection !== undefined) {
    validated.orderDirection = validateSortDirection(options.orderDirection);
  }

  return validated;
}

export function validateArticleCode(articleCode: any): string {
  return validateString(articleCode, 'articleCode', {
    required: true,
    minLength: 1,
    maxLength: VALIDATION_LIMITS.MAX_ARTICLE_CODE_LENGTH,
    pattern: /^[a-zA-Z0-9_-]+$/
  });
}

export function validateViewName(viewName: any): string {
  return validateString(viewName, 'viewName', {
    required: true,
    minLength: 1,
    maxLength: VALIDATION_LIMITS.MAX_VIEW_NAME_LENGTH,
    pattern: /^[a-zA-Z0-9_\- ]+$/
  });
}

// ================================
// Array Validation
// ================================

export function validateStringArray(value: any, fieldName: string, options: {
  required?: boolean;
  maxLength?: number;
  itemMaxLength?: number;
} = {}): string[] {
  if (options.required && (value === undefined || value === null)) {
    throw new ValidationError(
      `${fieldName} is required`,
      'REQUIRED_FIELD',
      fieldName,
      value
    );
  }

  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new ValidationError(
      `${fieldName} must be an array`,
      'INVALID_TYPE',
      fieldName,
      value
    );
  }

  if (options.maxLength !== undefined && value.length > options.maxLength) {
    throw new ValidationError(
      `${fieldName} must have at most ${options.maxLength} items`,
      'MAX_ARRAY_LENGTH',
      fieldName,
      value
    );
  }

  return value.map((item, index) => {
    try {
      return validateString(item, `${fieldName}[${index}]`, {
        required: true,
        maxLength: options.itemMaxLength
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(
          `${fieldName}[${index}]: ${error.message}`,
          error.code,
          `${fieldName}[${index}]`,
          item
        );
      }
      throw error;
    }
  });
}

// ================================
// Column Configuration Validation
// ================================

export function validateColumnConfig(config: any): any {
  if (config === undefined || config === null) {
    throw new ValidationError(
      'Column configuration is required',
      'REQUIRED_FIELD',
      'columnConfig',
      config
    );
  }

  if (typeof config !== 'object') {
    throw new ValidationError(
      'Column configuration must be an object',
      'INVALID_TYPE',
      'columnConfig',
      config
    );
  }

  // Validate structure but allow flexible column definitions
  // This is intentionally loose to support dynamic column configurations
  return config;
}

// ================================
// File Path Validation
// ================================

export function validateFilePath(filePath: any): string {
  const validated = validateString(filePath, 'filePath', {
    required: true,
    maxLength: VALIDATION_LIMITS.MAX_FILE_PATH_LENGTH
  });

  // Basic security checks for file paths
  if (validated.includes('..') || validated.includes('//')) {
    throw new ValidationError(
      'File path contains invalid characters',
      'INVALID_FILE_PATH',
      'filePath',
      validated
    );
  }

  return validated;
}

// ================================
// Batch Validation
// ================================

export function validateBatchSize(batchSize: any): number {
  return validateNumber(batchSize, 'batchSize', {
    min: 1,
    max: VALIDATION_LIMITS.MAX_BATCH_SIZE,
    integer: true
  });
}

export function validateTimeout(timeout: any): number {
  return validateNumber(timeout, 'timeout', {
    min: 100,
    max: VALIDATION_LIMITS.MAX_TIMEOUT_MS,
    integer: true
  });
}

// ================================
// Utility Functions
// ================================

export function sanitizeForLogging(value: any): string {
  if (typeof value === 'string' && value.length > 100) {
    return value.substring(0, 100) + '...';
  }
  if (typeof value === 'object') {
    return '[Object]';
  }
  return String(value);
}

export function createValidationErrorResponse(error: ValidationError): { 
  success: false; 
  error: string; 
  code: string; 
  field: string; 
} {
  return {
    success: false,
    error: error.message,
    code: error.code,
    field: error.field
  };
}
*/