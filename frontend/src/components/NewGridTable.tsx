import { getMinWidth } from '@utils/ag-grid.util';
// eslint-disable-next-line object-curly-newline
import { CellValueChangedEvent, ColDef, ColDefField, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { useEffect, useMemo, useState } from 'react';
import CommonButton from './buttons/CommonButton';
import MinusIcon from './icons/MinusIcon';
import PlusIcon from './icons/PlusIcon';

interface NewGridTableProps<T> extends AgGridReactProps {
    columnDefs: ColDef<T>[];
    domLayout?: 'normal' | 'autoHeight';
    height?: number;
    isPaginated?: boolean;
    minCharWidth?: number;
    rowData: T[];
    hasAddRemoveColumn?: boolean;
    onCreateEmptyRow?: (data: T[]) => void;
    onRowDataChange?: (data: T[]) => void;
}

export default function NewGridTable<T extends Record<string, unknown>>({
    columnDefs,
    domLayout = 'autoHeight',
    height,
    isPaginated,
    minCharWidth = 8,
    rowData: tableRowData,
    hasAddRemoveColumn,
    onCreateEmptyRow,
    onRowDataChange,
    ...props
}: NewGridTableProps<T>) {
    // Use internal state for rowData
    const [rowData, setRowData] = useState<T[]>(tableRowData || []);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // Default column definition
    const defaultColDef = useMemo<ColDef>(() => ({
        sortable: true,
        resizable: false,
        suppressMovable: true
    }), []);
    // Process columns: prepend Plus column and calculate minWidth
    const processedColumns = useMemo(() => {
        const plusCol = getPlusColumn(rowData, setRowData);

        const colsWithMinWidth = columnDefs.map((col) => {
            let minWidth = col.minWidth;
            if (!minWidth && col.field && rowData.length > 0) {
                minWidth = getMinWidth(
                    rowData as Record<string, unknown>[],
                    col.field.toString(),
                    minCharWidth
                );
            }

            return { ...col, minWidth };
        });

        if (hasAddRemoveColumn) {
            return [plusCol, ...colsWithMinWidth];
        } else {
            return [...colsWithMinWidth];
        }
    }, [columnDefs, rowData, minCharWidth]);
    // Pagination buttons
    const paginationButtons = useMemo(() => [
        { label: 'First', onClick: (api: GridApi) => api.paginationGoToFirstPage(), isDisabled: () => currentPage === 0 },
        { label: 'Prev', onClick: (api: GridApi) => api.paginationGoToPreviousPage(), isDisabled: () => currentPage === 0 },
        { label: 'Next', onClick: (api: GridApi) => api.paginationGoToNextPage(), isDisabled: () => currentPage === totalPages - 1 },
        { label: 'Last', onClick: (api: GridApi) => api.paginationGoToLastPage(), isDisabled: () => currentPage === totalPages - 1 }
    ], [currentPage, totalPages]);

    // Sync props.rowData to state if it changes
    useEffect(() => {
        setRowData(tableRowData || []);
    }, [tableRowData]);

    // Grid ready
    function handleGridReady(params: GridReadyEvent) {
        setGridApi(params.api);
        setCurrentPage(params.api.paginationGetCurrentPage());
        setTotalPages(params.api.paginationGetTotalPages());

        const updatePaginationState = () => {
            setCurrentPage(params.api.paginationGetCurrentPage());
            setTotalPages(params.api.paginationGetTotalPages());
        };
        params.api.addEventListener('paginationChanged', updatePaginationState);
    }

    // Handle cell value changes
    function handleCellValueChanged(event: CellValueChangedEvent<T>) {
        if (onRowDataChange) {
            const updatedData: T[] = [];
            event.api.forEachNode((node) => node.data && updatedData.push(node.data));
            onRowDataChange(updatedData);
        }
    }

    // Create empty row based on existing rowData
    function handleCreateEmptyRow(data: T[]): T {
        if (!data || data.length === 0) return {} as T;
        const emptyRow = {} as T;
        (Object.keys(data[0]) as (keyof T)[]).forEach((key) => {
            emptyRow[key] = '' as T[keyof T];
        });
        return emptyRow;
    }

    // Generic Plus Column
    function getPlusColumn(data: T[], setData: (d: T[]) => void): ColDef<T> {
        return {
            headerClass: 'ag-grade-header',
            headerName: '',
            field: 'buttons' as ColDefField<T, unknown>,
            pinned: 'left',
            width: 80,
            cellRenderer: (params: ICellRendererParams<T>) => {
                const rowIndex = params.node.rowIndex;

                if (rowIndex === null || rowIndex === undefined) {
                    return null;
                };

                return (
                    <MinusIcon
                        className="bg-[#FFFFFF] border-[#0C60A1] border-[2px] cursor-pointer p-[2px] rounded-full text-[#0C60A1]"
                        strokeWidth={3}
                        onClick={() => {
                            const updatedRows = [...data];
                            updatedRows.splice(rowIndex, 1);
                            setData(updatedRows);
                        }}
                    />
                );
            },
            headerComponent: () => {
                return (
                    <PlusIcon
                        className="bg-[#FFFFFF] border-[#0C60A1] border-[1px] cursor-pointer p-[2px] rounded-full text-[#0C60A1]"
                        strokeWidth={3}
                        onClick={() => {
                            const newRow: T = (onCreateEmptyRow
                                ? onCreateEmptyRow(data)
                                : handleCreateEmptyRow(data)
                            ) as T;
                            const updatedRows = [...data];
                            updatedRows.push(newRow);
                            setData(updatedRows);
                        }}
                    />
                );
            }
        };
    }

    return (
        <div
            className="ag-theme-quartz flex flex-col h-full w-full"
            style={{ height }}
        >
            <AgGridReact<T>
                columnDefs={processedColumns}
                defaultColDef={defaultColDef}
                domLayout={domLayout}
                rowData={rowData}
                onCellValueChanged={handleCellValueChanged}
                onGridReady={handleGridReady}
                {...props}
            />

            {isPaginated && gridApi && (
                <div className="flex gap-[8px] items-center mx-auto my-[4px]">
                    {paginationButtons.map((btn, i) => (
                        <CommonButton
                            key={i}
                            buttonLabel={btn.label}
                            buttonStyle="blue"
                            disabled={btn.isDisabled()}
                            isRoundedFull={false}
                            onButtonClick={() => btn.onClick(gridApi)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}