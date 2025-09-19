import MinusIcon from '@components/icons/MinusIcon';
import PlusIcon from '@components/icons/PlusIcon';
import { StateProps, StringNum } from '@type/common.type';
import { ColDef, ColDefField, ICellRendererParams } from 'ag-grid-community';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import NewGridTable, { NewGridTableProps } from './NewGridTable';

interface FormValues<TData> {
  gridData: TData[];
}

interface NewGridFormTableProps<TData> extends NewGridTableProps<TData> {
    submitRef?: React.Ref<HTMLButtonElement>;
    isModify?: boolean;
    hasAddRemoveColumn?: boolean;
    onCreateEmptyRow?: (data: TData[]) => void;
    onSubmit?: VoidFunction;
}

export default function NewGridFormTable<TData extends { id: StringNum }>({
    columnDefs,
    hasAddRemoveColumn,
    isModify,
    rowData: initialData,
    submitRef,
    onCreateEmptyRow,
    onSubmit,
    ...props
}: NewGridFormTableProps<TData>) {
    // Forms hook
    const methods = useForm<FormValues<TData>>({
        defaultValues: { gridData: initialData }
    });
    // State variables
    const [rowData, setRowData] = useState<TData[]>([]);
    const [newRowData, setNewRowData] = useState<TData[]>([]);
    // Column definitions
    const colDefs = useMemo(() => {
        if (!columnDefs) {
            return;
        }

        if (hasAddRemoveColumn) {
            const addRemoveColumn = handleAddRemoveColumn(setNewRowData);

            return [addRemoveColumn, ...columnDefs];
        }

        return columnDefs;
    }, [columnDefs, hasAddRemoveColumn, isModify]);

    useEffect(() => {
        if (initialData) {
            setRowData(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        methods.setValue('gridData', rowData);
    }, [rowData]);

    function handleFormSubmit(data: FormValues<TData>) {
        onSubmit?.();
        console.log('Form data + AG Grid data:', data);
    }

    function handleFormError(errors: FieldErrors<FormValues<TData>>) {
        console.log('Form errors:', errors);
    }

    // Generic Plus Column
    function handleAddRemoveColumn(setData: StateProps<TData[]>): ColDef<TData> {
        return {
            headerClass: 'ag-grade-header',
            headerName: '',
            field: 'buttons' as ColDefField<TData, unknown>,
            pinned: 'left',
            width: 80,
            cellRenderer: (params: ICellRendererParams<TData>) => {
                const rowIndex = params.node.rowIndex;

                if (rowIndex === null || rowIndex === undefined) {
                    return null;
                };

                return (
                    <MinusIcon
                        className="bg-[#FFFFFF] border-[#0C60A1] border-[2px] cursor-pointer p-[2px] rounded-full text-[#0C60A1]"
                        strokeWidth={3}
                        onClick={() => {
                            setData((prev) => {
                                const updated = [...prev];
                                updated.splice(rowIndex, 1);
                                return updated;
                            });
                        }}
                    />
                );
            },
            headerComponent: () => {
                return (
                    <PlusIcon
                        className="bg-[#FFFFFF] border-[#0C60A1] border-[1px] cursor-pointer p-[2px] rounded-full text-[#0C60A1]"
                        strokeWidth={3}
                        onClick={() => {
                            setData((prev) => {
                                const newRow: TData = (
                                    onCreateEmptyRow
                                        ? onCreateEmptyRow(prev)
                                        : handleCreateEmptyRow(prev)
                                ) as TData;

                                return [...prev, newRow];
                            });
                        }}
                    />
                );
            }
        };
    }

    function handleCreateEmptyRow(data: TData[]): TData {
        if (!data || data.length === 0) return {} as TData;
        const emptyRow = {} as TData;
        (Object.keys(data[0]) as (keyof TData)[]).forEach((key) => {
            emptyRow[key] = '' as TData[keyof TData];
        });
        return emptyRow;
    }

    return (
        <FormProvider {...methods}>
            <div>
                <NewGridTable<TData>
                    columnDefs={colDefs}
                    rowData={
                        hasAddRemoveColumn
                            ? newRowData
                            : rowData
                    }
                    {...props}
                />
                {submitRef && (
                    <button
                        className="hidden"
                        ref={submitRef}
                        type="submit"
                        onClick={(e) => {
                            console.log('Hidden button clicked!', e);
                            methods.handleSubmit(handleFormSubmit, handleFormError);
                        }}
                    />
                )}
            </div>
        </FormProvider>
    );
}