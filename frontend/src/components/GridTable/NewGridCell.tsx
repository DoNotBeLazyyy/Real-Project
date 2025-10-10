import CommonInput, { CommonInputProps } from '@components/input/CommonInput';
import ValidCommonSelect from '@components/select/ValidCommonSelect';
import { UpdateCodeProps } from '@pages/user/admin/course/ScheduleManagement';
import { useActionStore } from '@store/useActionStore';
import { SelectProps, UnknownObject } from '@type/common.type';
import { InputType } from '@type/grid.type';
import { ICellRendererParams } from 'ag-grid-community';
import { useState } from 'react';

interface NewGridCellProps<TData> extends Omit<CommonInputProps, 'onChange' | 'value'> {
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
    const [originalRow] = useState<Record<string, TData>>({ ...params?.node.data });
    const { isAddRemove, isModify } = useActionStore();
    const data = params?.node.data as TData;
    const rowData = data as UnknownObject;

    function handleChange(newVal: string) {
        rowData[field] = newVal;

        if (dependentField && onChange) {
            onChange?.({ data, rowData, field, newVal, prevVal: originalRow[field] as string });
        }

        if (!data) return;

        if (isModify) {
            const isModified = Object.keys(originalRow)
                .some(
                    (key) => {
                        return originalRow[key] !== rowData[key];
                    }
                );

            params?.node.setData({
                ...data,
                status: isModified ? 'modified' : ''
            });
        } else {
            params?.node.setData(data);
        }
    }

    if (!data) {
        return null;
    };

    if (!isAddRemove && !isModify) {
        return options?.find(() => rowData[field])?.label ?? rowData[field] as string;
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
            <CommonInput
                className="w-full"
                inputType={inputType}
                value={rowData[field] as string}
                onChange={handleChange}
                {...props}
            />
        );
    }

    return rowData[field] as string;
}