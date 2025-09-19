import ValidCommonInput, { ValidCommonInputProps } from '@components/input/ValidCommonInput';
import { InputType } from '@type/grid.type';
import { ICellRendererParams } from 'ag-grid-community';

interface NewGridCellProps<TData> extends ValidCommonInputProps {
    field: string;
    inputType?: InputType;
    isAddRemove?: boolean;
    isModify?: boolean;
    params?: ICellRendererParams<TData, unknown>;
}

export default function NewGridCell<TData>({
    field,
    inputType,
    isAddRemove,
    isModify,
    params,
    ...props
}: NewGridCellProps<TData>) {
    const data = params?.data;
    const value = ((data as Record<string, unknown>)[field] ?? '') as string;

    function handleChange(val: string) {
        if (!field || !params) return;

        (data as Record<string, unknown>)[field] = val;

        params.api.refreshCells({
            rowNodes: [params.node],
            columns: [field] // ✅ safe now, because we checked
        });
    }

    if (!data) {
        return null;
    } else if (isAddRemove) {
        return (
            <ValidCommonInput
                className="w-full"
                inputType={inputType}
                value={value}
                onChange={handleChange}
                {...props}
            />
        );
    } else {
        return value ?? '';
    }
}