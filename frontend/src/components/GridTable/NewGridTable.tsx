import { NullGridApi, StateProps, UnknownObject } from '@type/common.type';
import { getMinWidth } from '@utils/ag-grid.util';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { useEffect, useMemo, useState } from 'react';
import Pagination from '../pagination/Pagination';
import NewGridTableFilter from './NewGridTableFilter';

export interface NewGridTableProps<T> extends AgGridReactProps {
    columnDefs?: ColDef<T>[];
    domLayout?: 'normal' | 'autoHeight';
    hasFloatingFilter?: boolean;
    height?: number;
    minCharWidth?: number;
    gridApi: NullGridApi;
    rowData?: T[];
    setGridApi: StateProps<NullGridApi>;
}

export default function NewGridTable<T>({
    columnDefs,
    domLayout = 'autoHeight',
    hasFloatingFilter,
    height,
    minCharWidth,
    gridApi,
    rowData: tableRowData,
    pagination,
    setGridApi,
    ...props
}: NewGridTableProps<T>) {
    // Use internal state for rowData
    const [rowData, setRowData] = useState<T[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [paginationSize, setPaginationSize] = useState(10);
    // Default column definition
    const defaultColDef = useMemo<ColDef>(() => ({
        cellClass: 'text-[#080612] text-[14px]',
        filter: 'agTextColumnFilter',
        filterParams: {
            filterOptions: ['contains'],
            debounceMs: 200,
            suppressAndOrCondition: true
        },
        flex: 1,
        floatingFilter: hasFloatingFilter,
        floatingFilterComponent: NewGridTableFilter,
        suppressFloatingFilterButton: true,
        headerClass: 'ag-grade-header',
        resizable: false,
        sortable: true,
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
        suppressMovable: true
    }), [hasFloatingFilter]);
    // Process columns: prepend Plus column and calculate minWidth
    const colDefs = useMemo(() => {
        const colsWithMinWidth = columnDefs?.map((col) => {
            let minWidth = col.minWidth;

            if (col.field && rowData.length > 0) {
                const contentWidth = getMinWidth(
                    rowData as UnknownObject[],
                    col.field.toString(),
                    8
                );

                if (minWidth) {
                    minWidth = Math.max(contentWidth, minWidth);
                } else {
                    minWidth = contentWidth;
                }
            }

            return { ...col, minWidth };
        });

        if (colsWithMinWidth) {
            return [...colsWithMinWidth];
        }
    }, [columnDefs, rowData, minCharWidth]);

    useEffect(() => {
        setRowData(tableRowData || []);
    }, [tableRowData]);

    function handleUpdatePagination(api: GridApi) {
        setCurrentPage(api.paginationGetCurrentPage());
        setTotalPages(api.paginationGetTotalPages());
    }

    function handleGridReady(params: GridReadyEvent) {
        const onUpdatePaginationSize = () => handleUpdatePagination(params.api);
        setGridApi(params.api);
        onUpdatePaginationSize();

        params.api.addEventListener('paginationChanged', onUpdatePaginationSize);
    }

    function handleUpdatePaginationSize(size: number) {
        setPaginationSize?.(size);
    }

    return (
        <div
            className="ag-theme-quartz flex flex-col h-full w-full"
            style={{ height }}
        >
            <AgGridReact<T>
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                domLayout={domLayout}
                overlayNoRowsTemplate="No data found."
                overlayLoadingTemplate="Loading..."
                pagination={pagination}
                paginationPageSize={paginationSize}
                rowData={rowData}
                suppressMultiSort
                suppressPaginationPanel
                onGridReady={handleGridReady}
                {...props}
            />

            {pagination && (
                <div className="flex items-center justify-between pb-[4px] pt-[8px] px-[8px]">
                    <Pagination<T>
                        currentPage={currentPage}
                        gridApi={gridApi}
                        gridData={rowData}
                        paginationSize={paginationSize}
                        totalPages={totalPages}
                        onUpdatePaginationSize={handleUpdatePaginationSize}
                    />
                </div>
            )}
        </div>
    );
}