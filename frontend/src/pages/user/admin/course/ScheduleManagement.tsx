import NewGridFormTable from '@components/GridTable/NewGridFormTable';
import { deleteSchedules, getActiveSchedules, postSchedules, putSchedules } from '@services/schedule.service';
import { useActionStore } from '@store/useActionStore';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps, ScheduleManagementColumnProps } from '@type/management.type';
import { useEffect } from 'react';

export default function ScheduleManagement({
    submitRef,
    useDataStore
}: ManagementProps<ScheduleManagementColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction } = useActionStore();
    const { newRowData, selectedRowData, setData } = useDataStore();
    // Faculty account fields
    const scheduleDefConfigs: GridColumnsProps<ScheduleManagementColumnProps>[] = [
        { field: 'scheduleCode', inputType: 'alphanumeric', maxLength: 20 },
        { field: 'courseId', inputType: 'alphanumeric', maxLength: 20 },
        { field: 'scheduleDays', inputType: 'alphabet', maxLength: 10 },
        { field: 'scheduleStartTime', inputType: 'any', maxLength: 5 },
        { field: 'scheduleEndTime', inputType: 'any', maxLength: 5 }
    ];

    useEffect(() => {
        renderFaculty();
    }, []);

    async function renderFaculty() {
        const facultyList = (await getActiveSchedules())
            .data
            .result;
        setData('rowData', facultyList);
    }

    async function handleAddFaculty() {
        const savedMessage = await postSchedules(newRowData);

        if (savedMessage) {
            setAction('isAddRemove', false);
            setData('newRowData', []);
            renderFaculty();
        }
    }

    async function handleDeleteFaculty() {
        const deleteMessage = await deleteSchedules(selectedRowData);

        if (deleteMessage) {
            setAction('isDelete', false);
            setData('selectedRowData', []);
            renderFaculty();
        }
    }

    async function handleUpdateFaculty(modifiedData?: ScheduleManagementColumnProps[]) {
        if (modifiedData) {
            const updateMessage = await putSchedules(modifiedData);

            if (updateMessage) {
                setAction('isModify', false);
                setData('modifiedRows', []);
                renderFaculty();
            }
        }
    }

    function handleCreateNewFaculty() {
        const newFaculty: ScheduleManagementColumnProps = {
            courseId: '',
            scheduleCode: '',
            scheduleDays: 'M',
            scheduleEndTime: '',
            scheduleStartTime: ''
        };
        const newData = [...newRowData, newFaculty];
        setData('newRowData', newData);
    }

    return (
        <div className="flex flex-col gap-[12px] justify-end p-[20px] w-full">
            <NewGridFormTable<ScheduleManagementColumnProps>
                columns={scheduleDefConfigs}
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