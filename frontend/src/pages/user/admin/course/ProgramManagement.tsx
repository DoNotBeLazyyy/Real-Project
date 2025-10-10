import NewGridFormTable from '@components/GridTable/NewGridFormTable';
import { getActiveDepartments } from '@services/department.service';
// eslint-disable-next-line object-curly-newline
import { deletePrograms, getActivePrograms, postPrograms, putPrograms, getAllPrograms } from '@services/program.service';
import { useActionStore } from '@store/useActionStore';
import { SelectProps } from '@type/common.type';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps, ProgramManagementColumnProps } from '@type/management.type';
import { useEffect, useState } from 'react';

export default function ProgramManagement({
    submitRef,
    useDataStore
}: ManagementProps<ProgramManagementColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction, setReset } = useActionStore();
    const { allRows, newRowData, selectedRowData, setData, reset } = useDataStore();
    // program select list
    const [departmentList, setDepartmentList] = useState<SelectProps[]>([]);
    // Program fields
    const programDefConfigs: GridColumnsProps<ProgramManagementColumnProps>[] = [
        { field: 'programCode', inputType: 'alphabet', maxLength: 6 },
        { field: 'programName', inputType: 'alphabet', maxLength: 100 },
        { field: 'departmentId', options: departmentList, minWidth: 250, name: 'Department' }
    ];

    useEffect(() => {
        renderProgram();
        getDepartmentList();
    }, []);

    async function renderProgram() {
        const facultyList = (await getActivePrograms())
            .data
            .result;
        setData('rowData', facultyList);
        getAllRows();
    }

    async function getAllRows() {
        const allRows = (await getAllPrograms()).data.result;
        setData('allRows', allRows);
    }

    async function getDepartmentList() {
        const activeDepartmentList = (await getActiveDepartments())?.data?.result;

        if (!activeDepartmentList) return;

        const selectOptions: SelectProps[] = activeDepartmentList.map((department) => ({
            value: department.departmentId ?? '',
            label: `${department.departmentCode} - ${department.departmentName}`
        }));

        setDepartmentList(selectOptions);
    }

    async function handleAddProgram() {
        const { filteredData, message } = handleFilterDuplicates(newRowData, 'add');

        if (filteredData.length < 1) {
            return;
        }
        const savedMessage = (await postPrograms(filteredData)).data.retCode;

        if (savedMessage === 'SUCCESS') {
            alert(message);
            setAction('isAddRemove', false);
            setData('newRowData', []);
            renderProgram();
        }
    }

    async function handleDeleteProgram() {
        const deleteMessage = await deletePrograms(selectedRowData);

        if (deleteMessage) {
            setAction('isDelete', false);
            setData('selectedRowData', []);
            renderProgram();
        }
    }

    async function handleUpdateProgram(modifiedData?: ProgramManagementColumnProps[]) {
        const data = modifiedData ?? [];

        const { filteredData, message } = handleFilterDuplicates(data, 'modify');

        if (filteredData.length < 1) {
            return;
        }

        const updateMessage = (await putPrograms(filteredData)).data.retCode;

        if (updateMessage === 'SUCCESS') {
            alert(message);
            setAction('isModify', false);
            setData('modifiedRows', []);
            renderProgram();
        }
    }

    function handleCreateNewProgram() {
        if (!departmentList || departmentList.length === 0) {
            alert('Please create a department first.');
            setAction('isAddRemove', false);
            return;
        }

        const newProgram: ProgramManagementColumnProps = {
            programCode: '',
            programName: '',
            departmentId: departmentList[0].value
        };
        const newData = [...newRowData, newProgram];
        setData('newRowData', newData);
    }

    function handleFilterDuplicates(data: ProgramManagementColumnProps[], action?: string) {
        const uniqueData = data.filter((row, index, self) => (
            index === self.findIndex((r) => r.programCode === row.programCode)
        ));
        const duplicatedRows: ProgramManagementColumnProps[] = [];
        const newlyAddedRows: ProgramManagementColumnProps[] = [];
        const softDeletedRows: ProgramManagementColumnProps[] = [];
        let filteredData = newlyAddedRows;

        uniqueData.forEach((uniqueRow) => {
            const existingRow = allRows.find((row) => (
                row.programCode === uniqueRow.programCode
            ));
            const modifiedActiveRow = allRows.find((row) => (
                row.programCode === uniqueRow.programCode && uniqueRow.programId !== row.programId
            ));

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
                renderProgram();
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
            <NewGridFormTable<ProgramManagementColumnProps>
                columns={programDefConfigs}
                domLayout="normal"
                height={580}
                pagination={true}
                fieldId="programId"
                submitRef={submitRef}
                onCreateNewRow={handleCreateNewProgram}
                onSubmit={
                    isModify
                        ? handleUpdateProgram
                        : isAddRemove
                            ? handleAddProgram
                            : isDelete
                                ? handleDeleteProgram
                                : undefined
                }
                useDataStore={useDataStore}
            />
        </div>
    );
}