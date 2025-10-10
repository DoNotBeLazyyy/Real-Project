import NewGridFormTable from '@components/GridTable/NewGridFormTable';
// eslint-disable-next-line object-curly-newline
import { deleteDepartments, getActiveDepartments, getAllDepartments, postDepartments, putDepartments } from '@services/department.service';
import { useActionStore } from '@store/useActionStore';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps, DepartmentManagementColumnProps } from '@type/management.type';
import { useEffect } from 'react';

export default function DepartmentManagement({
    submitRef,
    useDataStore
}: ManagementProps<DepartmentManagementColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction, setReset } = useActionStore();
    const { allRows, newRowData, selectedRowData, setData, reset } = useDataStore();
    // Department fields
    const departmentDefConfigs: GridColumnsProps<DepartmentManagementColumnProps>[] = [
        { field: 'departmentCode', inputType: 'alphanumeric', maxLength: 20 },
        { field: 'departmentName', inputType: 'alphabet', maxLength: 100 }
    ];

    useEffect(() => {
        renderDepartment();
    }, []);

    async function renderDepartment() {
        const facultyList = (await getActiveDepartments())
            .data
            .result;
        setData('rowData', facultyList);
        getAllRows();
    }

    async function getAllRows() {
        const allRows = (await getAllDepartments()).data.result;
        setData('allRows', allRows);
    }

    async function handleAddDepartment() {
        const { filteredData, message } = handleFilterDuplicates(newRowData, 'add');

        if (filteredData.length < 1) {
            return;
        }
        const savedMessage = (await postDepartments(filteredData)).data.retCode;

        if (savedMessage === 'SUCCESS') {
            alert(message);
            setAction('isAddRemove', false);
            setData('newRowData', []);
            renderDepartment();
        }
    }

    async function handleDeleteDepartment() {
        const deleteMessage = await deleteDepartments(selectedRowData);

        if (deleteMessage) {
            setAction('isDelete', false);
            setData('selectedRowData', []);
            renderDepartment();
        }
    }

    async function handleUpdateDepartment(modifiedData?: DepartmentManagementColumnProps[]) {
        const data = modifiedData ?? [];

        const { filteredData, message } = handleFilterDuplicates(data, 'modify');

        if (filteredData.length < 1) {
            return;
        }

        const updateMessage = (await putDepartments(filteredData)).data.retCode;

        if (updateMessage === 'SUCCESS') {
            alert(message);
            setAction('isModify', false);
            setData('modifiedRows', []);
            renderDepartment();
        }
    }

    function handleCreateNewDepartment() {
        const newDepartment: DepartmentManagementColumnProps = {
            departmentCode: '',
            departmentName: ''
        };
        const newData = [...newRowData, newDepartment];
        setData('newRowData', newData);
    }

    function handleFilterDuplicates(data: DepartmentManagementColumnProps[], action?: string) {
        const uniqueData = data.filter((row, index, self) => (
            index === self.findIndex((r) => r.departmentCode === row.departmentCode)
        ));
        const duplicatedRows: DepartmentManagementColumnProps[] = [];
        const newlyAddedRows: DepartmentManagementColumnProps[] = [];
        const softDeletedRows: DepartmentManagementColumnProps[] = [];
        let filteredData = newlyAddedRows;

        uniqueData.forEach((uniqueRow) => {
            const existingRow = allRows.find((row) => (
                row.departmentCode === uniqueRow.departmentCode
            ));
            const modifiedActiveRow = allRows.find((row) => (
                row.departmentCode === uniqueRow.departmentCode && uniqueRow.departmentId !== row.departmentId
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
                reset();
                setReset();
                renderDepartment();
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

    return (
        <div className="flex flex-col gap-[12px] justify-end p-[20px] w-full">
            <NewGridFormTable<DepartmentManagementColumnProps>
                columns={departmentDefConfigs}
                dependentField="departmenCode"
                domLayout="normal"
                height={580}
                pagination={true}
                fieldId="departmentId"
                submitRef={submitRef}
                onCreateNewRow={handleCreateNewDepartment}
                onSubmit={
                    isModify
                        ? handleUpdateDepartment
                        : isAddRemove
                            ? handleAddDepartment
                            : isDelete
                                ? handleDeleteDepartment
                                : undefined
                }
                useDataStore={useDataStore}
            />
        </div>
    );
}