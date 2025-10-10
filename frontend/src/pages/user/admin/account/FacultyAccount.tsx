import NewGridFormTable from '@components/GridTable/NewGridFormTable';
import { getActiveDepartments } from '@services/department.service';
// eslint-disable-next-line object-curly-newline
import { deleteFaculties, getActiveFaculties, getAllFaculties, postFaculties, putFaculties } from '@services/faculty.service';
import { useActionStore } from '@store/useActionStore';
import { FacultyAccountColumnProps } from '@type/account.type';
import { SelectProps } from '@type/common.type';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps } from '@type/management.type';
import { useEffect, useState } from 'react';

export default function FacultyAccount({
    submitRef,
    useDataStore
}: ManagementProps<FacultyAccountColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction } = useActionStore();
    const { newRowData, selectedRowData, totalDataCount, setData, setTotalDataCount } = useDataStore();
    // Department select list
    const [departmentList, setDepartmentList] = useState<SelectProps[]>([]);
    // Sex option list
    const sexList = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' }
    ];
    // Faculty account fields
    const facultyColumns: GridColumnsProps<FacultyAccountColumnProps>[] = [
        { field: 'facultyNumber', minWidth: 150 },
        { field: 'address', inputType: 'any', maxLength: 100, minWidth: 250 },
        { field: 'age', inputType: 'number', maxLength: 2, minWidth: 100 },
        { field: 'email', inputType: 'email', maxLength: 100, minWidth: 250 },
        { field: 'firstName', inputType: 'alphabet', maxLength: 30, minWidth: 150 },
        { field: 'lastName', inputType: 'alphabet', maxLength: 30, minWidth: 150 },
        { field: 'department', options: departmentList, maxLength: 20, minWidth: 250 },
        { field: 'sex', options: sexList, minWidth: 150 }
    ];

    useEffect(() => {
        renderFaculty();
        getDepartmentList();
    }, []);

    async function renderFaculty() {
        const facultyList = (await getActiveFaculties())
            .data
            .result;
        setData('rowData', facultyList);
        getTotalFacultyCount();
    }

    async function getTotalFacultyCount() {
        const totalFacultyCount = (await getAllFaculties())
            .data
            .result
            .length;
        setTotalDataCount(totalFacultyCount);
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

    async function handleAddFaculty() {
        const savedMessage = await postFaculties(newRowData);

        if (savedMessage) {
            setAction('isAddRemove', false);
            setData('newRowData', []);
            renderFaculty();
        }
    }

    async function handleDeleteFaculty() {
        const deleteMessage = await deleteFaculties(selectedRowData);

        if (deleteMessage) {
            setAction('isDelete', false);
            setData('selectedRowData', []);
            renderFaculty();
        }
    }

    async function handleUpdateFaculty(data?: FacultyAccountColumnProps[]) {
        if (data) {
            const updateMessage = await putFaculties(data);

            if (updateMessage) {
                setAction('isModify', false);
                setData('modifiedRows', []);
                renderFaculty();
            }
        }
    }

    function handleCreateNewFaculty() {
        if (!departmentList || departmentList.length === 0) {
            alert('Please create a department first.');
            setAction('isAddRemove', false);
            return;
        }

        const totalRows = totalDataCount + newRowData.length;
        const newFaculty: FacultyAccountColumnProps = {
            facultyNumber: `F-25${String(totalRows + 1)
                .padStart(3, '0')}`,
            firstName: '',
            lastName: '',
            sex: '',
            email: '',
            age: '',
            address: '',
            department: departmentList[0].value
        };
        const newData = [...newRowData, newFaculty];
        setData('newRowData', newData);
    }

    return (
        <div className="flex flex-col gap-[12px] justify-end p-[20px] w-full">
            <NewGridFormTable<FacultyAccountColumnProps>
                columns={facultyColumns}
                domLayout="normal"
                height={580}
                pagination={true}
                fieldId="facultyId"
                submitRef={submitRef}
                onCreateNewRow={handleCreateNewFaculty}
                onSubmit={
                    isModify
                        ? handleUpdateFaculty
                        : isAddRemove
                            ? handleAddFaculty
                            : isDelete
                                ? handleDeleteFaculty
                                : undefined
                }
                useDataStore={useDataStore}
            />
        </div>
    );
}