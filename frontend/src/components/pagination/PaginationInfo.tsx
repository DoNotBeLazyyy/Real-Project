import { PaginationProps } from '@type/pagination.type';
import { useEffect, useState } from 'react';

export default function PaginationInfo<T>({
    currentPage,
    gridData,
    paginationSize,
    totalPages
}: Omit<PaginationProps<T>, 'gridApi'>) {
    const [totalRows, setTotalRows] = useState(0);
    const current = currentPage;

    useEffect(() => {
        if (gridData !== undefined && gridData !== null) {
            setTotalRows(gridData?.length);
        }
    }, [gridData]);

    if (current === undefined || current === null) {
        return;
    }

    if (paginationSize === undefined || paginationSize === null) {
        return;
    }

    const startRow = current * paginationSize + 1;
    let endRow = (current + 1) * paginationSize;

    if (endRow > totalRows) {
        endRow = totalRows;
    }

    return (
        <span>
            {startRow} to {endRow} of {totalRows} | Page {current + 1} of {totalPages ? totalPages : 1}
        </span>
    );
}