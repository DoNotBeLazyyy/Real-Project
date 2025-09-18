import { getMinWidth } from '@utils/ag-grid.util';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { useEffect, useMemo, useState } from 'react';
import CommonButton from './buttons/CommonButton';

interface NewGridTableProps<T> extends AgGridReactProps {
    columnDefs: ColDef<T>[];
    domLayout?: 'normal' | 'autoHeight';
    height?: number;
    isPaginated?: boolean;
    minCharWidth?: number;
    rowData: T[];
}

export default function NewGridTable<T extends Record<string, unknown>>({
    columnDefs,
    domLayout = 'autoHeight',
    height,
    isPaginated = true,
    minCharWidth = 8,
    rowData: tableRowData,
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

        return [...colsWithMinWidth];
    }, [columnDefs, rowData, minCharWidth]);

    useEffect(() => {
        setRowData(tableRowData || []);
    }, [tableRowData]);

    function handleUpdatePagination(api: GridApi) {
        setCurrentPage(api.paginationGetCurrentPage());
        setTotalPages(api.paginationGetTotalPages());
    }

    function handleGridReady(params: GridReadyEvent) {
        const onUpdatePagination = () => handleUpdatePagination(params.api);
        setGridApi(params.api);
        onUpdatePagination();

        params.api.addEventListener('paginationChanged', onUpdatePagination);
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
                gridOptions={{
                    suppressMultiSort: true
                }}
                rowData={rowData}
                onGridReady={handleGridReady}
                {...props}
            />

            {isPaginated && gridApi && (
                <div className="flex gap-[8px] items-center mx-auto my-[4px]">
                    {/* First & Prev */}
                    <CommonButton
                        buttonLabel="First"
                        buttonStyle="blue"
                        disabled={currentPage === 0}
                        isRoundedFull={false}
                        onButtonClick={() => gridApi.paginationGoToFirstPage()}
                    />
                    <CommonButton
                        buttonLabel="Prev"
                        buttonStyle="blue"
                        disabled={currentPage === 0}
                        isRoundedFull={false}
                        onButtonClick={() => gridApi.paginationGoToPreviousPage()}
                    />

                    {/* Page number buttons (max 9) */}
                    {(() => {
                        const maxButtons = 9;
                        const half = Math.floor(maxButtons / 2);

                        let start = Math.max(0, currentPage - half);
                        let end = start + maxButtons - 1;

                        if (end >= totalPages) {
                            end = totalPages - 1;
                            start = Math.max(0, end - maxButtons + 1);
                        }

                        return Array.from(
                            { length: end - start + 1 },
                            (_, i) => start + i
                        )
                            .map((pageIndex) => (
                                <CommonButton
                                    key={pageIndex}
                                    buttonLabel={(pageIndex + 1).toString()}
                                    buttonStyle={pageIndex === currentPage ? 'blue' : 'white'}
                                    size="sm"
                                    disabled={false}
                                    isRoundedFull={false}
                                    onButtonClick={() => gridApi.paginationGoToPage(pageIndex)}
                                />
                            ));
                    })()}

                    {/* Next & Last */}
                    <CommonButton
                        buttonLabel="Next"
                        buttonStyle="blue"
                        disabled={currentPage === totalPages - 1}
                        isRoundedFull={false}
                        onButtonClick={() => gridApi.paginationGoToNextPage()}
                    />
                    <CommonButton
                        buttonLabel="Last"
                        buttonStyle="blue"
                        disabled={currentPage === totalPages - 1}
                        isRoundedFull={false}
                        onButtonClick={() => gridApi.paginationGoToLastPage()}
                    />
                </div>
            )}
        </div>
    );
}