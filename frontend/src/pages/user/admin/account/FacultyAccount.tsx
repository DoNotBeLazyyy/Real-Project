import NewGridFormTable from '@components/GridTable/NewGridFormTable';
// eslint-disable-next-line object-curly-newline
import { deleteFaculties, getActiveFaculties, getAllFaculties, postFaculties, putFaculties } from '@services/faculty.service';
import { useActionStore } from '@store/useActionStore';
import { FacultyAccountColumnProps } from '@type/account.type';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps } from '@type/management.type';
import { useEffect } from 'react';

export default function FacultyAccount({
    submitRef,
    useDataStore
}: ManagementProps<FacultyAccountColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction } = useActionStore();
    const { newRowData, selectedRowData, totalDataCount, setData, setTotalDataCount } = useDataStore();
    // Faculty account fields
    const facultyColumns: GridColumnsProps<FacultyAccountColumnProps>[] = [
        { field: 'facultyNumber', maxLength: 50 },
        { field: 'address', inputType: 'alphanumeric', maxLength: 50 },
        { field: 'age', inputType: 'number', maxLength: 3 },
        { field: 'email', inputType: 'email', maxLength: 50 },
        { field: 'firstName', inputType: 'alphabet', maxLength: 25 },
        { field: 'lastName', inputType: 'alphabet', maxLength: 25 },
        { field: 'department', inputType: 'alphabet', maxLength: 20 },
        { field: 'sex', inputType: 'alphabet', maxLength: 6 }
    ];

    useEffect(() => {
        renderFaculty();
        getTotalFacultyCount();
    }, []);

    async function renderFaculty() {
        const facultyList = (await getActiveFaculties())
            .data
            .result;
        setData('rowData', facultyList);
    }

    async function getTotalFacultyCount() {
        const totalFacultyCount = (await getAllFaculties())
            .data
            .result
            .length;
        setTotalDataCount(totalFacultyCount);
    }

    async function handleAddFaculty() {
        const savedMessage = await postFaculties(newRowData);

        if (savedMessage) {
            setAction('isAddRemove', false);
            setData('newRowData', []);
            renderFaculty();
            getTotalFacultyCount();
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
            department: ''
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