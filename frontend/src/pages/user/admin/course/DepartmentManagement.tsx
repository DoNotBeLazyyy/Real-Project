import NewGridFormTable from '@components/GridTable/NewGridFormTable';
import { deleteDepartments, getActiveDepartments, postDepartments, putDepartments } from '@services/department.service';
import { useActionStore } from '@store/useActionStore';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps, DepartmentManagementColumnProps } from '@type/management.type';
import { useEffect } from 'react';

export default function DepartmentManagement({
    submitRef,
    useDataStore
}: ManagementProps<DepartmentManagementColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction } = useActionStore();
    const { newRowData, selectedRowData, setData } = useDataStore();
    // Department fields
    const departmentDefConfigs: GridColumnsProps<DepartmentManagementColumnProps>[] = [
        { field: 'departmentCode', inputType: 'any', maxLength: 20 },
        { field: 'departmentName', inputType: 'alphabet', maxLength: 10 }
    ];

    useEffect(() => {
        renderDepartment();
    }, []);

    async function renderDepartment() {
        const facultyList = (await getActiveDepartments())
            .data
            .result;
        setData('rowData', facultyList);
    }

    async function handleAddDepartment() {
        const savedMessage = await postDepartments(newRowData);

        if (savedMessage) {
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
        if (modifiedData) {
            const updateMessage = await putDepartments(modifiedData);

            if (updateMessage) {
                setAction('isModify', false);
                setData('modifiedRows', []);
                renderDepartment();
            }
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