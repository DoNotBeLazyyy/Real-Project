import { NullGridApi } from '@type/common.type';
import { RowNode } from 'ag-grid-community';

interface AgGridHandleChangeProps<TData> {
    data?: TData;
    fieldName?: keyof TData;
    value?: string;
    node?: RowNode;
    api?: NullGridApi;
}

export function getMinWidth<T>(data: T[], field: keyof T, charWidth = 8, padding = 16) {
    const maxLength = Math.max(
        ...data.map((row) => (row[field] ? String(row[field]).length : 0)),
        String(field).length
    );

    return maxLength * charWidth + padding;
}

export function handleFieldChange<TData>(props: AgGridHandleChangeProps<TData>) {
    const { data, fieldName, value, node, api } = props;

    if (!data || !fieldName || !node || !api) {
        return;
    };

    data[fieldName] = value as never;

    api.refreshCells({
        rowNodes: [node],
        columns: [fieldName as string]
    });
}