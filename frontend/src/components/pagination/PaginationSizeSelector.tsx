import { PaginationProps } from '@type/pagination.type';

export default function PaginationSizeSelector<T>({
    gridApi,
    onUpdatePaginationSize
}: PaginationProps<T>) {
    // Pagination size selector
    const paginationSizeSelector = [10, 20, 50];

    function handleUpdatePaginationSize(e: React.ChangeEvent<HTMLSelectElement>) {
        const size = Number(e.target.value);
        onUpdatePaginationSize?.(size);
    }

    return(
        <div className="flex gap-[8px] items-center">
            <span>Page Size:</span>
            <select
                className="border px-2 py-1 rounded"
                value={gridApi?.paginationGetPageSize()}
                onChange={handleUpdatePaginationSize}
            >
                {paginationSizeSelector.map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
        </div>
    );
}