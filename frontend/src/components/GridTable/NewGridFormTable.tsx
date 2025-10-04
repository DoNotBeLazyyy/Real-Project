import MinusIcon from '@components/icons/MinusIcon';
import PlusIcon from '@components/icons/PlusIcon';
import { UpdateCodeProps } from '@pages/user/admin/course/ScheduleManagement';
import { useActionStore } from '@store/useActionStore';
import { DataStoreHook, NullGridApi, UnknownObject } from '@type/common.type';
import { GridColumnsProps } from '@type/grid.type';
import { formatHeaderName } from '@type/string.util';
import { ColDef, ColDefField, ICellRendererParams, SelectionChangedEvent } from 'ag-grid-community';
import { RefObject, useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import NewGridCell from './NewGridCell';
import NewGridTable, { NewGridTableProps } from './NewGridTable';

interface FormValues<TData> {
    gridData: TData[];
}

interface NewGridFormTableProps<TData> extends Omit<NewGridTableProps<TData>, 'setGridApi' | 'gridApi'> {
    columns: GridColumnsProps<TData>[];
    dependentField?: string;
    fieldId: string;
    submitRef?: RefObject<HTMLButtonElement | null>;
    onCreateNewRow: () => void;
    onChange?: (updateProps: UpdateCodeProps<TData>) => void;
    onSubmit?: (modifiedData?: TData[]) => void;
    useDataStore: DataStoreHook<TData>;
}

export default function NewGridFormTable<TData>({
    columns,
    dependentField,
    rowData: initialData,
    fieldId,
    submitRef,
    onCreateNewRow,
    onChange,
    onSubmit,
    useDataStore,
    ...props
}: NewGridFormTableProps<TData>) {
    // Store
    const { newRowData, rowData, selectedRowData, setData } = useDataStore();
    const { isAddRemove, isDelete, isModify } = useActionStore();
    // Forms hook
    const methods = useForm<FormValues<TData>>({
        defaultValues: { gridData: initialData }
    });
    // Grid api
    const [gridApi, setGridApi] = useState<NullGridApi>(null);
    // Generated column definitions
    // Columns based on the data fields
    const dataColumns: ColDef<TData>[] = columns.map((col) => {
        const field = col.field; // keyof TData

        return {
            field,
            flex: 1,
            headerName: formatHeaderName(field),
            minWidth: col.minWidth ?? 100,
            cellRenderer: (params: ICellRendererParams) => (
                <NewGridCell<TData>
                    dependentField={dependentField}
                    field={field}
                    options={col.options}
                    onChange={onChange}
                    inputType={col.inputType}
                    maxLength={col.maxLength}
                    params={params}
                />
            )
        } as ColDef<TData>;
    });
    // Final column definitions including extra columns like status or add/remove
    const colDefs = useMemo(() => {
        if (!columns) return [];

        const finalColumns: ColDef<TData>[] = [];

        if (isModify) {
            finalColumns.push({
                field: 'status',
                floatingFilter: false,
                headerName: 'Status',
                maxWidth: 120,
                minWidth: 120,
                sortable: false
            } as ColDef<TData>);
        }

        if (isAddRemove) {
            const addRemoveColumn = handleAddRemoveColumn() as ColDef<TData>;

            finalColumns.push(addRemoveColumn);
        }

        finalColumns.push(...dataColumns);

        return finalColumns;
    }, [columns, isAddRemove, isModify]);

    useEffect(() => {
        if (initialData) {
            setData('rowData', initialData);
        }
    }, [initialData]);

    useEffect(() => {
        methods.setValue('gridData', rowData);
    }, [rowData]);

    function handleFormSubmit() {
        if (isModify) {
            const newModifiedRows: TData[] = [];

            gridApi?.forEachNode((node) => {
                const data = node.data as UnknownObject;

                if (data?.status) {
                    newModifiedRows.push(data as TData);
                    node.setData({ ...data, status: undefined });
                }
            });

            onSubmit?.(newModifiedRows);

            return;
        }

        if (newRowData.length < 1 && selectedRowData.length < 1) {
            return;
        }

        onSubmit?.();
    }

    function handleFormError(errors: FieldErrors<FormValues<TData>>) {
        console.log('Form errors:', errors);
    }

    function handleAddRemoveColumn(): ColDef<TData> {
        return {
            headerClass: 'ag-grade-header',
            headerName: '',
            field: 'buttons' as ColDefField<TData, unknown>,
            minWidth: 80,
            maxWidth: 80,
            cellRenderer: (params: ICellRendererParams<TData>) => {
                const rowIndex = params.node.rowIndex;

                if (rowIndex === null || rowIndex === undefined) {
                    return null;
                };

                return (
                    <MinusIcon
                        className="bg-[#FFFFFF] border-[#0C60A1] border-[2px] cursor-pointer p-[2px] rounded-full text-[#0C60A1]"
                        strokeWidth={3}
                        onClick={() => {}}
                    />
                );
            },
            headerComponent: () => {
                return (
                    <PlusIcon
                        className="bg-[#FFFFFF] border-[#0C60A1] border-[1px] cursor-pointer p-[2px] rounded-full text-[#0C60A1]"
                        strokeWidth={3}
                        onClick={onCreateNewRow}
                    />
                );
            }
        };
    }

    function handleSelectedRows(event: SelectionChangedEvent) {
        const selected = event.api.getSelectedRows();
        const selectedIds = selected.map((row) => row[fieldId]);
        setData('selectedRowData', selectedIds);
    }

    return (
        <FormProvider {...methods}>
            <NewGridTable<TData>
                columnDefs={colDefs}
                rowData={
                    isAddRemove
                        ? newRowData
                        : rowData
                }
                selection={
                    isDelete
                        ? {
                            checkboxes: true,
                            enableClickSelection: false,
                            headerCheckbox: true,
                            mode: 'multiRow',
                            selectAll: 'currentPage'
                        }
                        : undefined
                }
                hasFloatingFilter={!isAddRemove}
                gridApi={gridApi}
                setGridApi={setGridApi}
                onSelectionChanged={handleSelectedRows}
                {...props}
            />
            {submitRef && (
                <button
                    className="hidden"
                    ref={submitRef}
                    type="submit"
                    onClick={methods.handleSubmit(handleFormSubmit, handleFormError)}
                />
            )}
        </FormProvider>
    );
}