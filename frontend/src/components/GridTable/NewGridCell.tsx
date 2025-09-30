import ValidCommonInput, { ValidCommonInputProps } from '@components/input/ValidCommonInput';
import { useActionStore } from '@store/useActionStore';
import { UnknownObject } from '@type/common.type';
import { InputType } from '@type/grid.type';
import { ICellRendererParams } from 'ag-grid-community';

interface NewGridCellProps<TData> extends ValidCommonInputProps {
    field: string;
    inputType?: InputType;
    options?: string[];
    params?: ICellRendererParams<TData, unknown>;
}

export default function NewGridCell<TData>({
    field,
    inputType,
    options,
    params,
    ...props
}: NewGridCellProps<TData>) {
    const { isAddRemove, isModify } = useActionStore();
    const data = params?.data as TData;
    const rowData = data as UnknownObject;
    const updatedData = rowData[field] as string;
    const preVal = params?.api.getCellValue({ rowNode: params.node, colKey: field });

    function handleChange(newVal: string) {
        rowData[field] = newVal;

        if (!data) return;

        if (isModify && preVal !== newVal) {
            params?.node.setData({ ...data, status: 'modified' });
        } else {
            params?.node.setData(data);
        }
    }

    if (!data) return null;

    if (!isAddRemove && !isModify) return updatedData ?? '';

    if (options) {
        return (
            <select
                value={updatedData}
                onChange={(e) => handleChange(e.target.value)}
                className="border border-gray-300 px-2 py-[2px] rounded w-full"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        );
    }

    if (inputType) {
        return (
            <ValidCommonInput
                className="w-full"
                inputType={inputType}
                value={updatedData}
                onChange={handleChange}
                {...props}
            />
        );
    }

    return updatedData ?? '';
}