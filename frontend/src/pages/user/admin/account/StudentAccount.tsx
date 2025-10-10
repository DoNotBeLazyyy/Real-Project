import NewGridFormTable from '@components/GridTable/NewGridFormTable';
import { getActivePrograms } from '@services/program.service';
// eslint-disable-next-line object-curly-newline
import { postStudents, deleteStudents, putStudents, getAllStudents, getActiveStudents } from '@services/student.service';
import { useActionStore } from '@store/useActionStore';
import { StudentAccountColumnProps } from '@type/account.type';
import { SelectProps } from '@type/common.type';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps } from '@type/management.type';
import { useEffect, useState } from 'react';

export default function StudentAccount({
    submitRef,
    useDataStore
}: ManagementProps<StudentAccountColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction } = useActionStore();
    const { newRowData, selectedRowData, totalDataCount, setData, setTotalDataCount } = useDataStore();
    // State variables
    const [programList, setProgramList] = useState<SelectProps[]>([]);
    // Year level options
    const yearLevelOptions: SelectProps[] = [
        { label: 'First Year', value: 'First' },
        { label: 'Second Year', value: 'Second' },
        { label: 'Third Year', value: 'Third' },
        { label: 'Fourth Year', value: 'Fourth' }
    ];
    // Sex option list
    const sexList = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' }
    ];
    // Student account fields
    const studentColumns: GridColumnsProps<StudentAccountColumnProps>[] = [
        { field: 'studentNumber', maxLength: 30, minWidth: 250 },
        { field: 'address', inputType: 'any', maxLength: 100, minWidth: 250 },
        { field: 'age', inputType: 'number', maxLength: 2, minWidth: 100 },
        { field: 'email', inputType: 'email', maxLength: 100, minWidth: 250 },
        { field: 'firstName', inputType: 'alphabet', maxLength: 30, minWidth: 150 },
        { field: 'lastName', inputType: 'alphabet', maxLength: 30, minWidth: 150 },
        { field: 'program', options: programList, minWidth: 250 },
        { field: 'sex', options: sexList, minWidth: 150 },
        { field: 'yearLevel', options: yearLevelOptions, minWidth: 150 }
    ];

    useEffect(() => {
        renderStudents();
        getTotalStudentCount();
        getProgramList();
    }, []);

    async function renderStudents() {
        const studentList = (await getActiveStudents())
            .data
            .result;
        setData('rowData', studentList);
    }

    async function getProgramList() {
        const activeProgramList = (await getActivePrograms())?.data?.result;

        if (!activeProgramList) return;

        const selectOptions: SelectProps[] = activeProgramList.map((program) => ({
            value: program.programId ?? '',
            label: `${program.programCode} - ${program.programName}`
        }));

        setProgramList(selectOptions);
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
        if (!programList || programList.length === 0) {
            alert('Please create a program first.');
            setAction('isAddRemove', false);
            return;
        }

        const totalRows = totalDataCount + newRowData.length;
        const newStudent: StudentAccountColumnProps = {
            studentNumber: `S-25${String(totalRows + 1)
                .padStart(3, '0')}`,
            firstName: '',
            lastName: '',
            sex: sexList[0].value,
            email: '',
            age: '',
            address: '',
            program: programList[0].value,
            yearLevel: yearLevelOptions[0].value
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