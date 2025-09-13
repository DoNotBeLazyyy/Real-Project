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
    height?: number | string;
    isPaginated?: boolean;
    minCharWidth?: number;
    pinnedBottomRowData?: T[];
    rowData: T[];
}

export default function NewGridTable<T>({
    columnDefs,
    domLayout = 'autoHeight',
    height,
    isPaginated,
    minCharWidth = 8,
    pinnedBottomRowData,
    rowData,
    ...props
}: NewGridTableProps<T>) {
    // State variables
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // Grid setup
    const defaultColDef = useMemo<ColDef>(() => ({
        sortable: true,
        resizable: false,
        suppressMovable: true
    }), []);
    const processedColumns = useMemo(() =>
        columnDefs.map((col) => {
            let minWidth = col.minWidth;

            if (!minWidth && col.field && rowData.length > 0) {
                minWidth = getMinWidth(rowData as Record<string, unknown>[], col.field.toString(), minCharWidth);
            }

            return {
                ...col,
                minWidth
            };
        }), [columnDefs, rowData, minCharWidth]);
    const paginationButtons = [
        {
            label: 'First',
            onClick: (api: any) => api?.paginationGoToFirstPage(),
            isDisabled: () => currentPage === 0
        },
        {
            label: 'Prev',
            onClick: (api: any) => api?.paginationGoToPreviousPage(),
            isDisabled: () => currentPage === 0
        },
        {
            label: 'Next',
            onClick: (api: any) => api?.paginationGoToNextPage(),
            isDisabled: () => currentPage === totalPages - 1
        },
        {
            label: 'Last',
            onClick: (api: any) => api?.paginationGoToLastPage(),
            isDisabled: () => currentPage === totalPages - 1
        }
    ];

    useEffect(() => {
        if (!gridApi) return;

        // Initialize immediately
        setCurrentPage(gridApi.paginationGetCurrentPage());
        setTotalPages(gridApi.paginationGetTotalPages());

        const updatePaginationState = () => {
            setCurrentPage(gridApi.paginationGetCurrentPage());
            setTotalPages(gridApi.paginationGetTotalPages());
        };

        // Listen for page changes
        gridApi.addEventListener('paginationChanged', updatePaginationState);

        // Cleanup when gridApi changes/unmounts
        return () => {
            gridApi.removeEventListener('paginationChanged', updatePaginationState);
        };
    }, [gridApi]);

    function handleGridReady(params: GridReadyEvent) {
        setGridApi(params.api); // ✅ store the Grid API
    }

    return (
        <div
            className="ag-theme-quartz flex flex-col h-full w-full"
            style={{
                height: height
            }}
        >
            <AgGridReact<T>
                columnDefs={processedColumns}
                defaultColDef={defaultColDef}
                domLayout={domLayout}
                onGridReady={handleGridReady}
                pinnedBottomRowData={pinnedBottomRowData}
                rowData={rowData}
                selection={{
                    mode: 'multiRow',
                    headerCheckbox: true,
                    selectAll: 'filtered'
                }}
                {...props}
            />
            {isPaginated && (
                <div className="flex gap-[8px] items-center mx-auto my-[4px]">
                    {paginationButtons.map((btn, btnKey) => (
                        <CommonButton
                            buttonLabel={btn.label}
                            buttonStyle="blue"
                            disabled={btn.isDisabled()}
                            isRoundedFull={false}
                            key={`${btn.label}-${btnKey}`}
                            onButtonClick={() => btn.onClick(gridApi)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}