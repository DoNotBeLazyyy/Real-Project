import { DynamicButtonProps, PaginationProps } from '@type/pagination.type';
import { useMemo } from 'react';
import PaginationButtons from './PaginationButtons';
import PaginationSizeSelector from './PaginationSizeSelector';

export default function Pagination<T>({
    currentPage,
    gridApi,
    gridData,
    totalPages,
    onUpdatePaginationSize
}: PaginationProps<T>) {
    const dynamicButtons = useMemo<DynamicButtonProps[]>(() => {
        if (currentPage === undefined || totalPages === undefined) return [];

        const maxButtons = 9;
        const half = Math.floor(maxButtons / 2);
        let start = Math.max(1, currentPage + 1 - half);
        let end = start + maxButtons - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxButtons + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => {
            const pageIndex = start + i;
            return {
                buttonLabel: pageIndex.toString(),
                buttonStyle: pageIndex === currentPage + 1 ? 'blue' : 'white', // ✅ match 1-based
                buttonIndex: pageIndex,
                size: 'sm' as const,
                onButtonClick: handleSpecificPage
            };
        });
    }, [currentPage, totalPages]);
    const paginationButtons = useMemo<DynamicButtonProps[]>(() => {
        const isEmpty = !gridData?.length;
        const isFirstPage = currentPage === 0;
        const isLastPage = totalPages !== undefined && currentPage === totalPages - 1;

        return [
            {
                buttonLabel: 'First',
                buttonStyle: 'blue',
                disabled: isEmpty || isFirstPage,
                onButtonClick: handleFirstPage
            },
            {
                buttonLabel: 'Prev',
                buttonStyle: 'blue',
                disabled: isEmpty || isFirstPage,
                onButtonClick: handlePreviousPage
            },
            ...dynamicButtons,
            {
                buttonLabel: 'Next',
                buttonStyle: 'blue',
                disabled: isEmpty || isLastPage,
                onButtonClick: handleNextPage
            },
            {
                buttonLabel: 'Last',
                buttonStyle: 'blue',
                disabled: isEmpty || isLastPage,
                onButtonClick: handleLastPage
            }
        ];
    }, [currentPage, totalPages, gridData, dynamicButtons]);

    function handleFirstPage() {
        gridApi?.paginationGoToFirstPage();
    }

    function handlePreviousPage() {
        gridApi?.paginationGoToPreviousPage();
    }

    function handleLastPage() {
        gridApi?.paginationGoToLastPage();
    }

    function handleNextPage() {
        gridApi?.paginationGoToNextPage();
    }

    function handleSpecificPage(pageIndex: number) {
        gridApi?.paginationGoToPage(pageIndex - 1);
    }

    return (
        <div className="flex items-center justify-between relative w-full">
            <PaginationSizeSelector
                gridApi={gridApi}
                onUpdatePaginationSize={onUpdatePaginationSize}
            />
            <div className="absolute flex gap-[8px] items-center justify-center left-[0px] my-[4px] right-[0px]">
                {paginationButtons.map((btn, btnKey) => (
                    <PaginationButtons
                        key={`${btn.buttonLabel}-${btnKey}`}
                        {...btn}
                    />
                ))}
            </div>
        </div>
    );
}