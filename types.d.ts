// This file contains the global types used in the Electron app.
// It acts as a contract between the frontend and the backend

// Column management types (serializable versions for IPC)
type SerializableColumnDefinition = {
    key: string;
    displayName: string;
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
    dataType?: 'string' | 'number' | 'date' | 'boolean';
    required?: boolean;
    description?: string;
    // Note: formatter functions are excluded for IPC serialization
};

type ColumnConfigResult = {
    selectedColumns: SerializableColumnDefinition[];
    visibleColumns: SerializableColumnDefinition[];
    availableColumns: SerializableColumnDefinition[];
};

// The Window interface is extended to include the electron object, which contains the methods that are exposed to the frontend.
interface Window {
    electron: {
        subscribeStatistics: (callback: (statistics: Statistics)=>void)=> UnsubscribeFunction;
        getStaticData: ()=> Promise<StaticData>;
    };
      // Add the electronAPI definition
    electronAPI: {
        getTableData: (tableName: string) => Promise<any[]>;
        getTableConfigs: () => Promise<{
            tableName: string;
            desiredRows: {
                rowName: string;
                displayName: string;
            }[];
        }[]>;
        getUIConfigs: () => Promise<{
            viewDisplayName: string;
            featuresTable: string;
        }[]>;
        getUserInfo: () => Promise<{
            username: string;
            role: string;
        }>;
    };
}