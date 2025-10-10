import { useActionStore } from '@store/useActionStore';

export function getMinWidth<T>(data: T[], field: keyof T, charWidth = 8, padding = 16) {
    const maxLength = Math.max(
        ...data.map((row) => (row[field] ? String(row[field]).length : 0)),
        String(field).length
    );

    return maxLength * charWidth + padding;
}

export interface RowWithDeleted {
    deletedAt?: string | null;
}

interface FilterDuplicateProps<T> {
    data: T[];
    action?: string;
    allRows: T[];
    fieldCode: string;
    fieldId: string;
    resetData: VoidFunction;
    renderData: VoidFunction;
}

export function handleFilterDuplicates<T extends RowWithDeleted>(props: FilterDuplicateProps<T>) {
    const { setReset } = useActionStore();
    const { action, allRows, data, fieldCode, fieldId, resetData, renderData } = props;
    const code = fieldCode as keyof T;
    const id = fieldId as keyof T;
    const uniqueData = data.filter((row, index, self) => (
        index === self.findIndex((r) => r[code] === row[code])
    ));
    const duplicatedRows: T[] = [];
    const newlyAddedRows: T[] = [];
    const softDeletedRows: T[] = [];
    let filteredData = newlyAddedRows;

    uniqueData.forEach((uniqueRow) => {
        const existingRow = allRows.find((row) => (
            row[code] === uniqueRow[code]
        ));
        const modifiedActiveRow = allRows.find((row) => (
            row[code] === uniqueRow[code] && uniqueRow[id] !== row[id]
        ));

        console.log('existingRow: ', existingRow);
        console.log('modifiedActiveRow: ', modifiedActiveRow);

        if (action === 'modify' && modifiedActiveRow) {
            newlyAddedRows.push(uniqueRow);
        } else if (existingRow) {
            if (existingRow.deletedAt !== null) {
                softDeletedRows.push(existingRow);
            } else {
                duplicatedRows.push(existingRow);
            }
        } else {
            newlyAddedRows.unshift(uniqueRow);
        }
    });

    const duplicatedCounts = duplicatedRows.length;
    const newlyAddedCounts = newlyAddedRows.length;
    const softDeletedCounts = softDeletedRows.length;
    let message = '';

    if (softDeletedCounts > 0) {
        const confirmFilterNull = window.confirm(
            'Duplicates of inactive records detected, would you like to restore the match inactive records?'
        );

        if (confirmFilterNull) {
            if (action === 'modify') {
                filteredData = uniqueData;
            } else {
                filteredData = [...softDeletedRows, ...newlyAddedRows];
            }
        }
    } else if (newlyAddedCounts < 1 && duplicatedCounts > 0) {
        const confirmReset = window.confirm(
            'All the new records you entered are duplicates of existing active records. Do you want to reset the form?'
        );

        if (confirmReset) {
            setReset();
            resetData();
            renderData();
            filteredData = [];
        }
    }

    if (newlyAddedCounts > 0) {
        if (action === 'add') {
            message += `${newlyAddedCounts} new records added.`;
        } else {
            message += `${newlyAddedCounts + softDeletedCounts} records were modified.`;
        }
    }
    if (duplicatedCounts > 0) {
        message += `${duplicatedCounts} duplicates of active records ignored.`;
    }
    if (softDeletedCounts > 0) {
        message += `${softDeletedCounts} inactive records were restored.`;
    }

    return {
        filteredData,
        message
    };
}