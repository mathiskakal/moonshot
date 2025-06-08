import odbc from 'odbc';
import { createLogger } from './LoggingService.js';
import { TableConfig } from './ConfigService.js';
import { DatabaseService } from './DatabaseService.js';

const logger = createLogger('RemoteDatabase');

export class RemoteDatabaseService {
  private connectionString: string;
  private connectionPool: odbc.Pool | null = null;
  
  constructor() {
    this.connectionString = process.env.DB_CONNECTION_STRING || '';
    
    if (!this.connectionString) {
      logger.warn('DB_CONNECTION_STRING environment variable not found');
    }
  }
  
  /**
   * Initialize the connection pool
   */
  async initialize(): Promise<void> {
    if (!this.connectionString) {
      throw new Error('Connection string is required for remote database access');
    }
    
    try {
      this.connectionPool = await odbc.pool({
        connectionString: this.connectionString,
        initialSize: 2,
        incrementSize: 1,
        maxSize: 10
      });
        logger.info('Remote HFSQL database connection pool initialized');
    } catch (error) {
      logger.error('Failed to initialize remote database connection pool', { error });
      throw error;
    }
  }
  
  /**
   * Test the remote connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.connectionPool) {
      await this.initialize();
    }
    
    let connection: odbc.Connection | null = null;
    
    try {
      connection = await this.connectionPool!.connect();
      await connection.query('SELECT 1');      logger.info('Remote HFSQL connection test successful');
      return true;
    } catch (error) {
      logger.error('Remote HFSQL connection test failed', { error });
      return false;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          logger.error('Error closing connection', { error: closeError });
        }
      }
    }
  }
  
  /**
   * Get schema for a table from remote database
   */
  async getTableSchema(tableName: string): Promise<any[]> {
    if (!this.connectionPool) {
      await this.initialize();
    }
    
    let connection: odbc.Connection | null = null;
    
    try {
      connection = await this.connectionPool!.connect();
      
      // Get a sample row to determine column structure
      const result = await connection.query(`SELECT TOP 1 * FROM ${tableName}`);
      
      if (result.length === 0) {
        logger.warn(`Table ${tableName} is empty, using metadata query`);
        // Fallback to metadata query if table is empty
        const metadataQuery = `
          SELECT COLUMN_NAME, DATA_TYPE 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = '${tableName}'
        `;
        const metadata = await connection.query(metadataQuery);
        return metadata.map((col: any) => ({
          name: col.COLUMN_NAME,
          type: this.mapHfsqlTypeToSqlite(col.DATA_TYPE)
        }));
      }
        // Extract column information from the result
      const columns = Object.keys(result[0] || {}).map(columnName => ({
        name: columnName,
        type: this.getJavaScriptType((result[0] as any)[columnName])
      }));
      
      logger.info(`Schema retrieved for table ${tableName}`, { columnCount: columns.length });
      return columns;
    } catch (error) {
      logger.error(`Failed to get schema for table ${tableName}`, { error });
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          logger.error('Error closing connection', { error: closeError });
        }
      }
    }
  }
  
  /**
   * Create local database tables from remote schema and config
   */
  async createLocalDatabaseFromRemote(
    dbService: DatabaseService,
    tableConfigs: TableConfig[]
  ): Promise<void> {
    // Get database instance
    const db = dbService.getDatabase();
    
    for (const tableConfig of tableConfigs) {
      try {
        logger.info(`Processing table ${tableConfig.tableName}`);
        
        // Get remote schema
        const remoteColumns = await this.getTableSchema(tableConfig.tableName);
        
        // Validate that all desired columns exist in remote schema
        const remoteColumnNames = remoteColumns.map(col => col.name);
        
        for (const row of tableConfig.desiredRows) {
          if (!remoteColumnNames.includes(row.rowName)) {
            throw new Error(`Column ${row.rowName} not found in remote table ${tableConfig.tableName}`);
          }
        }
        
        // Create table with only the columns specified in config (in order)
        const configColumnDefs = tableConfig.desiredRows.map(row => {
          const remoteCol = remoteColumns.find(col => col.name === row.rowName);
          const sqliteType = remoteCol ? this.getSqliteType(remoteCol.type) : 'TEXT';
          return `"${row.rowName}" ${sqliteType}`;
        }).join(', ');
        
        const createTableQuery = `CREATE TABLE IF NOT EXISTS "${tableConfig.tableName}" (${configColumnDefs})`;
        db.exec(createTableQuery);
        
        logger.info(`Table ${tableConfig.tableName} created in local database`);
        
        // Fetch data from remote and insert into local
        await this.fetchAndInsertData(db, tableConfig);
        
      } catch (error) {
        logger.error(`Failed to create local table ${tableConfig.tableName}`, { error });
        throw error;
      }
    }
  }
  
  /**
   * Fetch and insert data from remote to local database
   */
  private async fetchAndInsertData(
    db: any,
    tableConfig: TableConfig
  ): Promise<void> {
    if (!this.connectionPool) {
      await this.initialize();
    }
    
    let connection: odbc.Connection | null = null;
    
    try {
      connection = await this.connectionPool!.connect();
      
      // Only select columns specified in config (in the order specified)
      const columnList = tableConfig.desiredRows.map(row => row.rowName).join(', ');
      
      const query = `SELECT ${columnList} FROM ${tableConfig.tableName}`;
      logger.info(`Executing query: ${query}`);
      
      const remoteData = await connection.query(query);
      
      logger.info(`Retrieved ${remoteData.length} rows from ${tableConfig.tableName}`);
      
      if (remoteData.length === 0) {
        logger.warn(`No data found in remote table ${tableConfig.tableName}`);
        return;
      }
      
      // Prepare insert statement
      const placeholders = tableConfig.desiredRows.map(() => '?').join(', ');
      const insertQuery = `INSERT INTO "${tableConfig.tableName}" (${columnList}) VALUES (${placeholders})`;
      const insertStmt = db.prepare(insertQuery);
      
      // Begin transaction for better performance
      const transaction = db.transaction((items: any[]) => {
        for (const item of items) {
          const values = tableConfig.desiredRows.map(row => item[row.rowName]);
          insertStmt.run(...values);
        }
      });
      
      // Execute transaction
      transaction(remoteData);
      
      logger.info(`Inserted ${remoteData.length} rows into ${tableConfig.tableName}`);
    } catch (error) {
      logger.error(`Failed to fetch and insert data for ${tableConfig.tableName}`, { error });
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          logger.error('Error closing connection', { error: closeError });
        }
      }
    }
  }
  
  /**
   * Get JavaScript type from a value
   */
  private getJavaScriptType(value: any): string {
    if (value === null || value === undefined) return 'TEXT';
    
    const type = typeof value;
    
    switch (type) {
      case 'number': return 'NUMERIC';
      case 'string': return 'TEXT';
      case 'boolean': return 'INTEGER';
      default:
        if (value instanceof Date) return 'TEXT';
        return 'TEXT';
    }
  }
  
  /**
   * Map HFSQL/ODBC types to SQLite types
   */
  private mapHfsqlTypeToSqlite(odbcType: string): string {
    switch (odbcType.toLowerCase()) {
      case 'int':
      case 'integer':
      case 'smallint':
      case 'bigint':
        return 'INTEGER';
      case 'decimal':
      case 'numeric':
      case 'float':
      case 'real':
      case 'double':
        return 'NUMERIC';
      case 'varchar':
      case 'char':
      case 'text':
      case 'nvarchar':
      case 'nchar':
        return 'TEXT';
      case 'date':
      case 'datetime':
      case 'timestamp':
        return 'TEXT';
      case 'bit':
      case 'boolean':
        return 'INTEGER';
      default:
        return 'TEXT';
    }
  }
  
  /**
   * Map JavaScript types to SQLite types
   */
  private getSqliteType(jsType: string): string {
    switch (jsType.toLowerCase()) {
      case 'numeric':
      case 'number': return 'NUMERIC';
      case 'text':
      case 'string': return 'TEXT';
      case 'integer':
      case 'boolean': return 'INTEGER';
      default: return 'TEXT';
    }
  }
  
  /**
   * Clean up resources
   */
  async close(): Promise<void> {
    if (this.connectionPool) {
      try {
        await this.connectionPool.close();
        this.connectionPool = null;
        logger.info('Remote database connection pool closed');
      } catch (error) {
        logger.error('Error closing connection pool', { error });
      }
    }
  }
}