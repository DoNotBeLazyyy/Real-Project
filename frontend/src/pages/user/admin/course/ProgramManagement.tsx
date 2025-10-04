import NewGridFormTable from '@components/GridTable/NewGridFormTable';
import { deletePrograms, getActivePrograms, postPrograms, putPrograms } from '@services/program.service';
import { useActionStore } from '@store/useActionStore';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps, ProgramManagementColumnProps } from '@type/management.type';
import { useEffect } from 'react';

export default function ProgramManagement({
    submitRef,
    useDataStore
}: ManagementProps<ProgramManagementColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction } = useActionStore();
    const { newRowData, selectedRowData, setData } = useDataStore();
    // Program fields
    const scheduleDefConfigs: GridColumnsProps<ProgramManagementColumnProps>[] = [
        { field: 'programCode', inputType: 'alphabet', maxLength: 6 },
        { field: 'programName', inputType: 'alphabet', maxLength: 100 },
        { field: 'departmentId', inputType: 'alphabet', maxLength: 50 }
    ];

    useEffect(() => {
        renderProgram();
    }, []);

    async function renderProgram() {
        const facultyList = (await getActivePrograms())
            .data
            .result;
        setData('rowData', facultyList);
    }

    async function handleAddProgram() {
        const savedMessage = await postPrograms(newRowData);

        if (savedMessage) {
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
        if (modifiedData) {
            const updateMessage = await putPrograms(modifiedData);

            if (updateMessage) {
                setAction('isModify', false);
                setData('modifiedRows', []);
                renderProgram();
            }
        }
    }

    function handleCreateNewProgram() {
        const newProgram: ProgramManagementColumnProps = {
            departmentId: '',
            programCode: '',
            programName: ''
        };
        const newData = [...newRowData, newProgram];
        setData('newRowData', newData);
    }

    return (
        <div className="flex flex-col gap-[12px] justify-end p-[20px] w-full">
            <NewGridFormTable<ProgramManagementColumnProps>
                columns={scheduleDefConfigs}
                dependentField="programCode"
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