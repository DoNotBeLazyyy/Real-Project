import ValidCommonInput, { ValidCommonInputProps } from '@components/input/ValidCommonInput';
import ValidCommonSelect from '@components/select/ValidCommonSelect';
import { UpdateCodeProps } from '@pages/user/admin/course/ScheduleManagement';
import { useActionStore } from '@store/useActionStore';
import { SelectProps, UnknownObject } from '@type/common.type';
import { InputType } from '@type/grid.type';
import { ICellRendererParams } from 'ag-grid-community';
import { useState } from 'react';

interface NewGridCellProps<TData> extends Omit<ValidCommonInputProps, 'onChange'> {
    dependentField?: string;
    field: string;
    inputType?: InputType;
    options?: SelectProps[];
    params?: ICellRendererParams<TData, unknown>;
    onChange?: (updateProps: UpdateCodeProps<TData>) => void;
}

export default function NewGridCell<TData>({
    dependentField,
    field,
    inputType,
    options,
    params,
    onChange,
    ...props
}: NewGridCellProps<TData>) {
    const [originalValue] = useState(params?.api.getCellValue({ rowNode: params.node, colKey: field }) ?? '');
    const { isAddRemove, isModify } = useActionStore();
    const data = params?.data as TData;
    const rowData = data as UnknownObject;
    const prevVal = params?.api.getCellValue({ rowNode: params.node, colKey: field });

    function handleChange(newVal: string) {
        if (dependentField && onChange) {
            rowData[field] = newVal;
            onChange?.({ data, rowData, field, newVal, prevVal });
        } else {
            rowData[field] = newVal;
        }

        if (!data) return;

        if (isModify && originalValue !== rowData[field]) {
            params?.node.setData({ ...data, status: 'modified' });
        } else if (isModify && originalValue === newVal) {
            params?.node.setData({ ...data, status: '' });
        } else {
            params?.node.setData(data);
        }
    }

    if (!data) {
        return null;
    };

    if (!isAddRemove && !isModify) {
        return options?.find((o) => o.value === rowData[field])?.label ?? rowData[field] as string;
    };

    if (options) {
        return (
            <ValidCommonSelect
                options={options}
                value={rowData[field] as string}
                onChange={handleChange}
            />
        );
    }

    if (inputType) {
        return (
            <ValidCommonInput
                className="w-full"
                inputType={inputType}
                value={rowData[field] as string}
                onChange={handleChange}
                {...props}
            />
        );
    }

    return rowData[field] as string ?? '';
}