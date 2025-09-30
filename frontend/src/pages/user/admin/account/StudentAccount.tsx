import NewGridFormTable from '@components/GridTable/NewGridFormTable';
// eslint-disable-next-line object-curly-newline
import { postStudents, deleteStudents, putStudents, getAllStudents, getActiveStudents } from '@services/student.service';
import { useActionStore } from '@store/useActionStore';
import { StudentAccountColumnProps } from '@type/account.type';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps } from '@type/management.type';
import { useEffect } from 'react';

export default function StudentAccount({
    submitRef,
    useDataStore
}: ManagementProps<StudentAccountColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction } = useActionStore();
    const { newRowData, selectedRowData, totalDataCount, setData, setTotalDataCount } = useDataStore();
    // Year level options
    const yearLevelOptions = [
        '1st Year',
        '2nd Year',
        '3rd Year',
        '4th Year'
    ];
    // Student account fields
    const studentColumns: GridColumnsProps<StudentAccountColumnProps>[] = [
        { field: 'studentNumber', maxLength: 37 },
        { field: 'address', inputType: 'alphanumeric', maxLength: 50 },
        { field: 'age', inputType: 'number', maxLength: 3 },
        { field: 'email', inputType: 'email', maxLength: 50 },
        { field: 'firstName', inputType: 'alphabet', maxLength: 25 },
        { field: 'lastName', inputType: 'alphabet', maxLength: 25 },
        { field: 'program', inputType: 'alphabet', maxLength: 20 },
        { field: 'sex', inputType: 'alphabet', maxLength: 6 },
        { field: 'yearLevel', options: yearLevelOptions }
    ];

    useEffect(() => {
        renderStudents();
        getTotalStudentCount();
    }, []);

    async function renderStudents() {
        const studentList = (await getActiveStudents())
            .data
            .result;
        setData('rowData', studentList);
    }

    async function getTotalStudentCount() {
        const totalStudentCount = (await getAllStudents())
            .data
            .result
            .length;

        setTotalDataCount(totalStudentCount);
    }

    async function handleAddStudents() {
        const savedMessage = await postStudents(newRowData);

        if (savedMessage) {
            setAction('isAddRemove', false);
            setData('newRowData', []);
            renderStudents();
            getTotalStudentCount();
        }
    }

    async function handleDeleteStudents() {
        const deleteMessage = await deleteStudents(selectedRowData);

        if (deleteMessage) {
            setAction('isDelete', false);
            setData('selectedRowData', []);
            renderStudents();
        }
    }

    async function handleUpdateStudents(data?: StudentAccountColumnProps[]) {
        if (data) {
            const updateMessage = await putStudents(data);

            if (updateMessage) {
                setAction('isModify', false);
                setData('modifiedRows', []);
                renderStudents();
            }
        }
    }

    function handleCreateNewStudent() {
        const totalRows = totalDataCount + newRowData.length;
        const newStudent: StudentAccountColumnProps = {
            studentNumber: `S-25${String(totalRows + 1)
                .padStart(3, '0')}`,
            firstName: '',
            lastName: '',
            sex: '',
            email: '',
            age: '',
            address: '',
            program: '',
            yearLevel: yearLevelOptions[0]
        };
        const newData = [...newRowData, newStudent];
        setData('newRowData', newData);
    }

    return (
        <div className="flex flex-col gap-[12px] justify-end p-[20px] w-full">
            <NewGridFormTable<StudentAccountColumnProps>
                columns={studentColumns}
                domLayout="normal"
                height={580}
                pagination={true}
                fieldId="studentId"
                submitRef={submitRef}
                onCreateNewRow={handleCreateNewStudent}
                onSubmit={
                    isModify
                        ? handleUpdateStudents
                        : isAddRemove
                            ? handleAddStudents
                            : isDelete
                                ? handleDeleteStudents
                                : undefined
                }
                useDataStore={useDataStore}
            />
        </div>
    );
}