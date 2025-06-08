// Database Configuration Constants
export const DATABASE_CONFIG = {
  DEFAULT_FETCH_LIMIT: 1000,
  DB_VERBOSE_LOGGING: false
} as const;

// File Paths Constants
export const FILE_PATHS = {
  DATABASE_DIR: 'database',
  DATABASE_FILENAME: 'rexmaxDB.sqlite3',
  SCHEMAS_DIR: 'schemas',
  PRELOAD_PATH: 'dist-electron/preload.cjs',
  UI_PATH: 'dist-react/index.html'
} as const;

// Development Configuration Constants
export const DEV_CONFIG = {
  DEV_SERVER_PORT: 5123,
  DEV_SERVER_HOST: 'localhost'
} as const;

// Table Names Constants /!\ WARNING, FOR NOW, this is useless, as it is defined in ConfigService as a fallback Config
export const TABLE_NAMES = {
  ARTICLES_DIM_UDF: 'ArticlesDimUDF'
} as const;

// SQL Query Constants
/* Will use this system later for SQL queries
export const SQL_QUERIES = {
  COUNT_ALL: 'SELECT COUNT(*) as count FROM',
  COUNT_TOTAL: 'SELECT COUNT(*) as total FROM',
  SELECT_ALL: 'SELECT * FROM',
  DELETE_ALL: 'DELETE FROM',
  PRAGMA_TABLE_INFO: 'PRAGMA table_info'
} as const;
*/

// Remote Database Constants
export const REMOTE_DB_CONFIG = {
  DEFAULT_FETCH_LIMIT: 100,
  TEST_QUERY_LIMIT: 1,
  CONNECTION_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  POOL_INITIAL_SIZE: 2,
  POOL_MAX_SIZE: 10,
  POOL_INCREMENT_SIZE: 1,
  CONNECTION_ERROR_MESSAGE: 'DB_CONNECTION_STRING environment variable is required for remote database access'
} as const;

// Error Messages Constants
/* Will use a similar system later for error messages
export const ERROR_MESSAGES = {
  // Database Errors
  DB_SERVICE_NOT_INITIALIZED: 'Database service not initialized',
  DB_CONNECTION_FAILED: 'Failed to connect to database',
  DB_INIT_ERROR: 'Failed to initialize database',
  DB_CLOSE_ERROR: 'Failed to close database connection',
  DB_QUERY_FAILED: 'Database query execution failed',
  
  // Table Errors
  INVALID_TABLE_NAME: 'Invalid table name provided',
  TABLE_NOT_EXISTS: 'Table does not exist',
  TABLE_CREATION_FAILED: 'Failed to create table',
  
  // Query Errors
  QUERY_EXECUTION_FAILED: 'Query execution failed',
  INVALID_QUERY_PARAMS: 'Invalid query parameters provided',
  
  // Sync Errors
  SYNC_FAILED: 'Data synchronization failed',
  REMOTE_CONNECTION_FAILED: 'Failed to connect to remote database',
  REMOTE_DATA_FETCH_FAILED: 'Failed to fetch data from remote database',
  REMOTE_SYNC_ERROR: 'Remote synchronization error',
  
  // Column Errors
  INVALID_COLUMN_CONFIG: 'Invalid column configuration provided',
  COLUMN_NOT_FOUND: 'Column not found in table schema',
  COLUMN_SERVICE_ERROR: 'Column service operation failed',
  
  // Service Errors
  SERVICE_NOT_INITIALIZED: 'Service not initialized',
  OPERATION_NOT_SUPPORTED: 'Operation not supported',
  
  // Article Errors
  FETCH_ARTICLES_ERROR: 'Failed to fetch articles',
  SYNC_ARTICLES_ERROR: 'Failed to sync articles',
  COUNT_ERROR: 'Failed to get article count'
} as const;
*/

// Performance Threshold Constants
/* Will use a similar system later for performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  SLOW_QUERY_MS: 150,
  VERY_SLOW_QUERY_MS: 300,
  WORKER_THREAD_RECOMMENDATION_MS: 200,
  MAX_HISTORY_ENTRIES: 100
} as const;
*/

// Validation Limits Constants
/* Will use this system later for validation limits
export const VALIDATION_LIMITS = {
  MIN_FETCH_LIMIT: OPERATION_LIMITS.MIN_FETCH_LIMIT,
  MAX_FETCH_LIMIT: OPERATION_LIMITS.MAX_FETCH_LIMIT,
  MIN_OFFSET: OPERATION_LIMITS.MIN_OFFSET,
  MAX_BATCH_SIZE: OPERATION_LIMITS.MAX_BATCH_SIZE,
  MIN_BATCH_SIZE: OPERATION_LIMITS.MIN_BATCH_SIZE,
  MAX_CONNECTION_TIMEOUT: OPERATION_LIMITS.MAX_CONNECTION_TIMEOUT,
  MIN_CONNECTION_TIMEOUT: OPERATION_LIMITS.MIN_CONNECTION_TIMEOUT,
  
  // String Length Limits
  MAX_COLUMN_NAME_LENGTH: 64,
  MAX_TABLE_NAME_LENGTH: 64,
  MAX_ARTICLE_CODE_LENGTH: 100,
  MAX_VIEW_NAME_LENGTH: 64,
  MAX_FILE_PATH_LENGTH: 260,
  
  // Query Limits
  MIN_LIMIT: 1,
  MAX_LIMIT: 10000,
  MAX_OFFSET: 1000000,
  
  // Timeout Limits
  MAX_TIMEOUT_MS: 300000, // 5 minutes
  MIN_TIMEOUT_MS: 100
} as const;
*/