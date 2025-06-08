import React from 'react';
import DataTable from '../components/DataTable/DataTable';

interface MinMaxViewProps {
  viewName?: string;
  data?: any[];
}

const MinMaxView: React.FC<MinMaxViewProps> = ({ viewName, data }) => {
  return (
    <DataTable 
      data={data || []}
      loadingMessage={`Loading ${viewName || 'Min/Max'} data...`}
      className="minmax-data-table"
    />
  );
};

export default MinMaxView;
