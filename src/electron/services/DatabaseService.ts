import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { createLogger } from './LoggingService.js';
import { TableConfig } from './ConfigService.js';

const logger = createLogger('Database');

export class DatabaseService {
  private db: Database.Database | null = null;
  private dbPath: string;
  
  constructor() {
    const dbDir = path.join(app.getPath('userData'), 'database');
    
    // Ensure database directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    this.dbPath = path.join(dbDir, 'rexmax.db');
  }
  
  /**
   * Check if local database file exists
   */
  localDatabaseExists(): boolean {
    return fs.existsSync(this.dbPath);
  }
  
  /**
   * Delete the local database file and close connection
   */
  deleteLocalDatabase(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    
    if (fs.existsSync(this.dbPath)) {
      fs.unlinkSync(this.dbPath);
      logger.info('Local database deleted');
    }
  }
  
  /**
   * Get database connection (creates if doesn't exist)
   */  getDatabase(): Database.Database {
    if (!this.db) {
      this.db = new Database(this.dbPath);
      logger.info('Local SQLite database connection established', { path: this.dbPath });
    }
    return this.db;
  }
  
  /**
   * Check if database schema matches the required configuration
   * Returns true if all tables and columns from config exist in database
   */
  validateDatabaseSchema(tableConfigs: TableConfig[]): boolean {
    try {
      if (!this.localDatabaseExists()) {
        logger.info('Local database does not exist');
        return false;
      }
      
      const db = this.getDatabase();
      
      // Check each table in configuration
      for (const tableConfig of tableConfigs) {
        // Check if table exists
        const tableExistsQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
        const tableExists = db.prepare(tableExistsQuery).get(tableConfig.tableName);
        
        if (!tableExists) {
          logger.warn(`Table ${tableConfig.tableName} not found in local database`);
          return false;
        }
        
        // Check if all required columns exist in the table
        const columnsQuery = `PRAGMA table_info(${tableConfig.tableName})`;
        const columns = db.prepare(columnsQuery).all();
        const columnNames = columns.map((col: any) => col.name);
        
        for (const row of tableConfig.desiredRows) {
          if (!columnNames.includes(row.rowName)) {
            logger.warn(`Column ${row.rowName} not found in table ${tableConfig.tableName}`);
            return false;
          }
        }
        
        logger.info(`Table ${tableConfig.tableName} schema validation passed`);
      }
      
      logger.info('Database schema validation successful');
      return true;
    } catch (error) {
      logger.error('Database schema validation failed', { error });
      return false;
    }
  }
  
  /**
   * Check if database contains data
   */
  localDatabaseHasData(): boolean {
    try {
      if (!this.localDatabaseExists()) {
        return false;
      }
      
      const db = this.getDatabase();
      
      // Get all table names
      const tablesQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`;
      const tables = db.prepare(tablesQuery).all();
      
      // Check if any table has data
      for (const table of tables as any[]) {
        const countQuery = `SELECT COUNT(*) as count FROM "${table.name}"`;
        const result = db.prepare(countQuery).get() as any;
        
        if (result.count > 0) {
          logger.info(`Database has data in table ${table.name}`);
          return true;
        }
      }
      
      logger.info('Database exists but contains no data');
      return false;
    } catch (error) {
      logger.error('Failed to check if database has data', { error });
      return false;
    }
  }
  
  /**
   * Get all data from a specific table with only the columns specified in config
   */  getTableData(tableName: string, columns: string[]): any[] {
    try {
      if (!this.localDatabaseExists()) {
        logger.warn(`Attempting to get data from ${tableName} but local database doesn't exist`);
        return [];
      }
      
      const db = this.getDatabase();
      
      // Check if table exists first
      const tableExistsQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
      const tableExists = db.prepare(tableExistsQuery).get(tableName);
      
      if (!tableExists) {
        logger.warn(`Table ${tableName} not found in local database`);
        return [];
      }
      
      // Build column list for query
      const columnList = columns.map(col => `"${col}"`).join(', ');
      const query = `SELECT ${columnList} FROM "${tableName}"`;
      
      const data = db.prepare(query).all();
      logger.info(`Retrieved ${data.length} rows from local table ${tableName}`);
      
      return data;
    } catch (error) {
      logger.error(`Failed to get data from table ${tableName}`, { error });
      return [];
    }
  }
  
  /**
   * Get count of records in a table
   */
  getTableCount(tableName: string): number {
    try {
      const db = this.getDatabase();
      const query = `SELECT COUNT(*) as count FROM "${tableName}"`;
      const result = db.prepare(query).get() as any;
      
      return result.count || 0;
    } catch (error) {
      logger.error(`Failed to get count from table ${tableName}`, { error });
      return 0;
    }
  }
  
  /**
   * Clean up database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      logger.info('Database connection closed');
    }
  }
}