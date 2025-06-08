import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { createRequire } from 'module';
import { isDev } from './utils/mainUtils.js';
import { getPreloadPath, getUIPath } from './utils/pathResolver.js';
import { createLogger } from './services/LoggingService.js';
import { DatabaseService } from './services/DatabaseService.js';
import { RemoteDatabaseService } from './services/RemoteDatabaseService.js';
import { ConfigService, TableConfig } from './services/ConfigService.js';
import { validateEventFrame } from './utils/mainUtils.js';
import { DEV_CONFIG } from './config/constants.js';

// Load environment variables from .env file
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();

// Create logger
const logger = createLogger('Main');

// Services
let configService: ConfigService | null = null;
let databaseService: DatabaseService | null = null;
let remoteDatabaseService: RemoteDatabaseService | null = null;

// Initialization flags
let servicesInitialized = false;

// Cleanup flag
let isAppCleanedUp = false;

/**
 * Initialize all services
 */
async function initializeServices(): Promise<void> {
	try {
		logger.info('Starting service initialization');
		
		// Step 1: Initialize configuration service
		configService = new ConfigService();
		const config = configService.loadConfig();

		// DEBUG INFO
		logger.info('Configuration loaded', { 
			username: config.username, 
			tableCount: config.tableConfigs.length 
		});
		
		// Step 2: Initialize database service
		databaseService = new DatabaseService();
		
		// Step 3: Check if database needs to be rebuilt
		const tableConfigs = configService.getTableConfigs();
		
		// Check if no table configurations were parsed
		if (tableConfigs.length === 0) {
			logger.warn('No table configurations found in config');
			return;
		}
		
		// Check if a localdb file already exists AND if it matches the most up to date schema.
		const isValidDb = databaseService.localDatabaseExists() && databaseService.validateDatabaseSchema(tableConfigs);
		
		// If either of them is false, rebuild database by:
		if (!isValidDb) {

			logger.info('Database needs to be rebuilt from remote');
			
			// Deleting it if it existed in the first place
			if (databaseService.localDatabaseExists()) {
				logger.info('Deleting invalid local database');
				databaseService.deleteLocalDatabase();
			}
			
			// Initialize remote database service
			remoteDatabaseService = new RemoteDatabaseService();
			
			// Test connection before proceeding
			logger.info('Testing remote database connection');
			const isConnected = await remoteDatabaseService.testConnection();
			if (!isConnected) {
				throw new Error('Could not connect to remote database.');
			}
			
			// If connection succeeded, create fresh database from remote schema and data
			logger.info('Creating local database from remote');
			await remoteDatabaseService.createLocalDatabaseFromRemote(
				databaseService, 
				tableConfigs
			);
			
			logger.info('Database rebuilt successfully');
					} else {
			logger.info('Using existing valid local database');

		}		logger.info('Service initialization completed successfully');
		servicesInitialized = true;

	} catch (error) {

		logger.error('Service initialization failed', { error });
		servicesInitialized = false;
		throw error;
	}
}

/**
 * Setup IPC handlers for UI communication
 */
function setupIpcHandlers(): void {
		// Get table data for the UI
	ipcMain.handle('get-table-data', (event, tableName: string) => {
		try {
			if (event.senderFrame) {
				validateEventFrame(event.senderFrame);
			}
					if (!databaseService || !configService || !servicesInitialized) {
				logger.warn(`Services not fully initialized, providing mock data for ${tableName}`);
				// Return mock data when services aren't available
				return [
					{ id: 1, name: `Sample ${tableName} Row 1`, value: 'Mock Data', date: '2025-06-04', status: 'Active' },
					{ id: 2, name: `Sample ${tableName} Row 2`, value: 'Mock Data', date: '2025-06-04', status: 'Active' },
					{ id: 3, name: `Sample ${tableName} Row 3`, value: 'Mock Data', date: '2025-06-04', status: 'Inactive' },
					{ id: 4, name: `Sample ${tableName} Row 4`, value: 'Mock Data', date: '2025-06-04', status: 'Active' },
					{ id: 5, name: `Sample ${tableName} Row 5`, value: 'Mock Data', date: '2025-06-04', status: 'Pending' }
				];
			}
			
			// Get columns for this table from config
			const tableConfigs = configService.getTableConfigs();
			const tableConfig = tableConfigs.find(config => config.tableName === tableName);
			
			if (!tableConfig) {
				throw new Error(`Table configuration not found for ${tableName}`);
			}
			
			const columns = tableConfig.desiredRows.map(row => row.rowName);
			const data = databaseService.getTableData(tableName, columns);
			
			logger.info(`Returning ${data.length} rows for table ${tableName}`);
			return data;
		} catch (error) {
			logger.error(`Failed to get table data for ${tableName}`, { error });
			// Return empty array on error
			return [];
		}
	});
	
	// Get table configurations for UI
	ipcMain.handle('get-table-configs', (event) => {
		try {
			if (event.senderFrame) {
				validateEventFrame(event.senderFrame);
			}
			
			if (!configService) {
				throw new Error('Configuration service not initialized');
			}
			
			const configs = configService.getTableConfigs();
			logger.info(`Returning ${configs.length} table configurations`);
			return configs;
		} catch (error) {
			logger.error('Failed to get table configurations', { error });
			return [];
		}
	});
	
	// Get UI configurations for tabs
	ipcMain.handle('get-ui-configs', (event) => {
		try {
			if (event.senderFrame) {
				validateEventFrame(event.senderFrame);
			}
			
			if (!configService) {
				throw new Error('Configuration service not initialized');
			}
			
			const uiConfigs = configService.getUIConfigs();
			logger.info(`Returning ${uiConfigs.length} UI configurations`);
			return uiConfigs;
		} catch (error) {
			logger.error('Failed to get UI configurations', { error });
			return [];
		}
	});
	
	// Get user information
	ipcMain.handle('get-user-info', (event) => {
		try {
			if (event.senderFrame) {
				validateEventFrame(event.senderFrame);
			}
			
			if (!configService) {
				throw new Error('Configuration service not initialized');
			}
			
			const userInfo = configService.getUserInfo();
			logger.info('Returning user information', { username: userInfo.username });
			return userInfo;
		} catch (error) {
			logger.error('Failed to get user information', { error });
			return { username: 'Unknown', role: 'USER' };
		}
	});
	
	logger.info('IPC handlers setup completed');
}

/**
 * Clean up all resources
 */
async function cleanupResources(): Promise<void> {
  if (isAppCleanedUp) {
    logger.info('Cleanup already performed');
    return;
  }
  
  isAppCleanedUp = true;
  logger.info('Performing application cleanup');
  
  try {
    if (remoteDatabaseService) {
      await remoteDatabaseService.close();
    }
    
    if (databaseService) {
      databaseService.close();
    }
    
    logger.info('Cleanup completed successfully');
  } catch (error) {
    logger.error('Cleanup failed', { error });
  }
}

/**
 * Create the main application window
 */
function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  // Load UI
  if (isDev()) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`http://${DEV_CONFIG.DEV_SERVER_HOST}:${DEV_CONFIG.DEV_SERVER_PORT}`);
  } else {
    mainWindow.loadFile(getUIPath());
  }
  
  return mainWindow;
}

// App ready event - main initialization
app.on('ready', async () => {
  try {
    logger.info('Application starting');
    
    // Setup IPC handlers first (always available)
    setupIpcHandlers();
    
    // Initialize services with the defined data flow
    await initializeServices();
    
    // Only create main window after successful service initialization
    const mainWindow = createMainWindow();
    
    logger.info('Application started successfully');
  } catch (error) {
    logger.error('Failed to initialize application', { error });
    
    // Show error dialog to user
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    dialog.showErrorBox(
      'Initialization Error',
      `Failed to start application: ${errorMessage}\n\nPlease check your configuration file. (None found)`
    );
    
    // Exit the application after showing the error
    app.quit();
  }
});

// App quit events
app.on('will-quit', async (event) => {
  event.preventDefault();
  await cleanupResources();
  app.exit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});