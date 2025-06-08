import './App.css';
import Ribbon, { type RibbonButton } from './components/Ribbon/Ribbon';
import TabbedView from './components/TabbedView/TabbedView';

function App() {
  // Simplified ribbon buttons configuration
  const ribbonButtons: RibbonButton[] = [
    { 
      id: 'sort', 
      label: 'Sort', 
      icon: '↕️', 
      action: () => console.log('Sort clicked'),
      tooltip: 'Sort table data'
    },
    { 
      id: 'filter', 
      label: 'Filter', 
      icon: '🔍', 
      action: () => console.log('Filter clicked'),
      tooltip: 'Filter table rows'
    },
    { 
      id: 'search', 
      label: 'Search', 
      icon: '🔎', 
      action: () => console.log('Search clicked'),
      tooltip: 'Search in table'
    },
    { 
      id: 'export', 
      label: 'Export', 
      icon: '📤', 
      action: () => console.log('Export clicked'),
      tooltip: 'Export table data',
      variant: 'primary' as const
    },
    { 
      id: 'import', 
      label: 'Import', 
      icon: '📥', 
      action: () => console.log('Import clicked'),
      tooltip: 'Import new data'
    },
    { 
      id: 'refresh', 
      label: 'Refresh', 
      icon: '🔄', 
      action: () => console.log('Refresh clicked'),
      tooltip: 'Refresh current view data'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️', 
      action: () => console.log('Settings clicked'),
      tooltip: 'Table settings'
    },
    { 
      id: 'save', 
      label: 'Save', 
      icon: '💾', 
      action: () => console.log('Save clicked'),
      tooltip: 'Save changes',
    },
    { 
      id: 'delete', 
      label: 'Delete', 
      icon: '🗑️', 
      action: () => console.log('Delete clicked'),
      tooltip: 'Delete selected rows',
    },
    { 
      id: 'help', 
      label: 'Help', 
      icon: '❓', 
      action: () => console.log('Help clicked'),
      tooltip: 'Show help'
    }
  ];

  return (
    <div className="app-container">
      <Ribbon buttons={ribbonButtons} />
      <TabbedView />
    </div>
  );
}

export default App;
