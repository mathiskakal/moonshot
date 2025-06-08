import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import './DataTable.css';

// Generic data type - can be any object with string keys
export type DataRecord = Record<string, any>;

// Props interface for the DataTable component
export interface DataTableProps {
  data: DataRecord[];
  columns?: ColumnDef<DataRecord, any>[];
  className?: string;
  loadingMessage?: string;
}

const columnHelper = createColumnHelper<DataRecord>();

function DataTable({
  data,
  columns: providedColumns,
  className = '',
  loadingMessage = 'Loading data or no data to display...'
}: DataTableProps) {
  // Generate columns from data if not provided
  const generatedColumns = data.length > 0 && !providedColumns
    ? Object.keys(data[0]).map((key) =>
        columnHelper.accessor(key, {
          id: key,
          header: () => <span>{key}</span>,
          cell: (info) => info.getValue(),
        })
      )
    : [];
  const columns = (providedColumns || generatedColumns) as ColumnDef<DataRecord, any>[];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // Show loading message if no data or columns
  if (!data.length || !columns.length) {
    return (
      <div className={`table-wrapper ${className}`}>
        <div className="loading-message">{loadingMessage}</div>
      </div>
    );
  }

  return (
    <div className={`table-wrapper ${className}`}>
      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      position: 'sticky',
                      top: 0,
                      backgroundColor: 'var(--table-header-bg)',
                      color: 'var(--table-header-text-color)',
                      padding: '0.75rem',
                      textAlign: 'left',
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        padding: '8px',
                        display: 'block'
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
