import React, { useState, useEffect } from 'react';
import DataTable from '../DataTable/DataTable';
import { useTableData } from '../../hooks/useTableData';
import type { TabConfig } from '../../types/ViewConfig';
import './TabbedView.css';

// Hardcoded tabs configuration as requested
const TABS: TabConfig[] = [
  { 
    id: 'articles', 
    name: 'Articles', 
    tableName: 'ARTICLESDIMUDF', 
    icon: '📊' 
  },
  { 
    id: 'stock', 
    name: 'Stock', 
    tableName: 'ZZTEMPOLAPSTOCK', 
    icon: '📦' 
  }
];

const TabbedView: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>(TABS[0].id);
  const { data, loading, errors, loadTable } = useTableData();

  // Load data for the active tab when component mounts or tab changes
  useEffect(() => {
    const activeTab = TABS.find(tab => tab.id === activeTabId);
    if (activeTab) {
      loadTable(activeTab.tableName);
    }
  }, [activeTabId, loadTable]);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const renderTabContent = () => {
    const activeTab = TABS.find(tab => tab.id === activeTabId);
    if (!activeTab) return null;

    const tableName = activeTab.tableName;
    const isLoading = loading[tableName];
    const error = errors[tableName];
    const tableData = data[tableName] || [];

    // Show error state
    if (error) {
      return (
        <div className="tabbed-view-error">
          <div className="tabbed-view-error-content">
            <div className="tabbed-view-error-icon">⚠️</div>
            <h3>Error Loading {activeTab.name}</h3>
            <p>{error}</p>
            <button 
              onClick={() => loadTable(tableName)}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: 'var(--tab-active-text-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // Show loading state
    if (isLoading) {
      return (
        <div className="tabbed-view-loading">
          <div className="tabbed-view-loading-content">
            <div className="tabbed-view-loading-icon">⏳</div>
            <h3>Loading {activeTab.name} Data...</h3>
            <p>Please wait while we fetch the table data.</p>
          </div>
        </div>
      );
    }

    // Show data table
    return (
      <DataTable 
        data={tableData}
        loadingMessage={`Loading ${activeTab.name} data...`}
      />
    );
  };

  return (
    <div className="tabbed-view">
      <div className="tabbed-view-tabs-container">
        <div className="tabbed-view-tabs">
          {TABS.map((tab) => {
            const isActive = activeTabId === tab.id;
            const isLoading = loading[tab.tableName];
            const hasError = errors[tab.tableName];
            
            return (
              <button
                key={tab.id}
                className={`tabbed-view-tab ${isActive ? 'active' : ''} ${hasError ? 'error' : ''}`}
                onClick={() => handleTabClick(tab.id)}
                disabled={isLoading}
                title={hasError || tab.name}
              >
                <span className="tabbed-view-tab-icon">
                  {isLoading ? '⏳' : tab.icon}
                </span>
                <span className="tabbed-view-tab-name">{tab.name}</span>
                {hasError && (
                  <span className="tabbed-view-tab-error-indicator">⚠️</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="tabbed-view-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TabbedView;
