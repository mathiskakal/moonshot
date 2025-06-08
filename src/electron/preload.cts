const { contextBridge, ipcRenderer } = require('electron');

// Expose secure IPC methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
	/**
	 * Get data for a specific table
	 */
	getTableData: (tableName: string) => 
		ipcRenderer.invoke('get-table-data', tableName),
	
	/**
	 * Get all table configurations from config
	 */
	getTableConfigs: () => 
		ipcRenderer.invoke('get-table-configs'),
	
	/**
	 * Get UI configurations for tab system
	 */
	getUIConfigs: () => 
		ipcRenderer.invoke('get-ui-configs'),
	
	/**
	 * Get user information
	 */
	getUserInfo: () => 
		ipcRenderer.invoke('get-user-info')
} satisfies Window['electronAPI']);