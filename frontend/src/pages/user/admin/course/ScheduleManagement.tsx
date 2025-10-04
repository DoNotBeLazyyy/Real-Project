import NewGridFormTable from '@components/GridTable/NewGridFormTable';
// eslint-disable-next-line object-curly-newline
import { deleteSchedules, getActiveSchedules, getAllSchedules, postSchedules, putSchedules } from '@services/schedule.service';
import { useActionStore } from '@store/useActionStore';
import { SelectProps, UnknownObject } from '@type/common.type';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps, ScheduleDaysProps, ScheduleManagementColumnProps } from '@type/management.type';
import { handleFormatTime, toMinutes } from '@type/string.util';
import { useEffect } from 'react';

interface TimeOptionsProps {
    value: ScheduleDaysProps;
    label: string
}

export interface UpdateCodeProps<TData> {
    data: TData;
    rowData?: UnknownObject;
    field?: string;
    newVal?: string;
    prevVal?: string;
}

export default function ScheduleManagement({
    submitRef,
    useDataStore
}: ManagementProps<ScheduleManagementColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction } = useActionStore();
    const { allRows, newRowData, selectedRowData, setData } = useDataStore();
    // Days options
    const scheduleDayOptions: TimeOptionsProps[] = [
        { value: 'M', label: 'M' },
        { value: 'T', label: 'T' },
        { value: 'W', label: 'W' },
        { value: 'TH', label: 'TH' },
        { value: 'F', label: 'F' },
        { value: 'MW', label: 'MW' },
        { value: 'MTH', label: 'MTH' },
        { value: 'MF', label: 'MF' },
        { value: 'TW', label: 'TW' },
        { value: 'TTH', label: 'TTH' },
        { value: 'TF', label: 'TF' },
        { value: 'WTH', label: 'WTH' },
        { value: 'WF', label: 'WF' },
        { value: 'THF', label: 'THF' },
        { value: 'MWF', label: 'MWF' },
        { value: 'MTF', label: 'MTF' },
        { value: 'MTHF', label: 'MTHF' },
        { value: 'TWH', label: 'TWH' },
        { value: 'TWF', label: 'TWF' },
        { value: 'WTHF', label: 'WTHF' }
    ];
    // Time options
    const timeOptions = [
        { value: '0730', label: '07:30' },
        { value: '0800', label: '08:00' },
        { value: '0830', label: '08:30' },
        { value: '0900', label: '09:00' },
        { value: '0930', label: '09:30' },
        { value: '1000', label: '10:00' },
        { value: '1030', label: '10:30' },
        { value: '1100', label: '11:00' },
        { value: '1130', label: '11:30' },
        { value: '1200', label: '12:00' },
        { value: '1230', label: '12:30' },
        { value: '1300', label: '13:00' },
        { value: '1330', label: '13:30' },
        { value: '1400', label: '14:00' },
        { value: '1430', label: '14:30' },
        { value: '1500', label: '15:00' },
        { value: '1530', label: '15:30' },
        { value: '1600', label: '16:00' },
        { value: '1630', label: '16:30' },
        { value: '1700', label: '17:00' },
        { value: '1730', label: '17:30' },
        { value: '1800', label: '18:00' },
        { value: '1830', label: '18:30' },
        { value: '1900', label: '19:00' },
        { value: '1930', label: '19:30' }
    ];
    // Year level list
    const yearLevelOptions: SelectProps[] = [
        { label: 'First Year', value: 'First' },
        { label: 'Second Year', value: 'Second' },
        { label: 'Third Year', value: 'Third' },
        { label: 'Fourth Year', value: 'Fourth' }
    ];
    // Semester list
    const semesterOptions: SelectProps[] = [
        { label: 'First Semester', value: 'First' },
        { label: 'Second Semester', value: 'Second' }
    ];
    // Schedule account fields
    const scheduleDefConfigs: GridColumnsProps<ScheduleManagementColumnProps>[] = [
        { field: 'scheduleCode', maxLength: 20, minWidth: 220 },
        { field: 'scheduleDays', options: scheduleDayOptions, maxLength: 10, minWidth: 150 },
        { field: 'scheduleStartTime', options: timeOptions, maxLength: 5 },
        { field: 'scheduleEndTime', options: timeOptions, maxLength: 5 },
        { field: 'yearLevel', options: yearLevelOptions, maxLength: 20, minWidth: 150 },
        { field: 'semester', options: semesterOptions, maxLength: 20, minWidth: 170 },
        { field: 'programId', inputType: 'alphanumeric', maxLength: 20 },
        { field: 'facultyId', inputType: 'alphanumeric', maxLength: 20 },
        { field: 'courseId', inputType: 'alphanumeric', maxLength: 20 }
    ];

    useEffect(() => {
        renderSchedule();
    }, []);

    async function getAllRows() {
        const allRows = (await getAllSchedules()).data.result;
        setData('allRows', allRows);
    }

    async function renderSchedule() {
        const facultyList = (await getActiveSchedules())
            .data
            .result;
        setData('rowData', facultyList);
        getAllRows();
    }

    async function handleAddSchedule() {
        const filteredData = handleFilterDuplicates(newRowData, 'add');
        if (filteredData.length < 1) {
            return;
        }
        const savedMessage = (await postSchedules(filteredData)).statusText;
        console.log('test again: ', savedMessage);
        if (savedMessage === 'OK') {
            setAction('isAddRemove', false);
            setData('newRowData', []);
            renderSchedule();
            return;
        }
        alert('Adding failed');
    }

    async function handleDeleteSchedule() {
        const deleteMessage = await deleteSchedules(selectedRowData);

        if (deleteMessage) {
            setAction('isDelete', false);
            setData('selectedRowData', []);
            renderSchedule();
        }
    }

    async function handleUpdateSchedule(modifiedData?: ScheduleManagementColumnProps[]) {
        const data = modifiedData ?? [];
        if (data.length > 0) {
            const filteredData = handleFilterDuplicates(data, 'modify');
            if (filteredData.length < 1) {
                return;
            }
            const updateMessage = (await putSchedules(filteredData)).statusText;

            if (updateMessage === 'OK') {
                alert('Schedule updated successfully!');
            }
        } else {
            alert('No modified data found!');
        }
        setAction('isModify', false);
        setData('modifiedRows', []);
        renderSchedule();
    }

    function handleCreateNewSchedule() {
        const initialValue = `${scheduleDayOptions[0].value}${handleFormatTime(timeOptions[0].value)}${handleFormatTime(timeOptions[2].value)}${'1'}${'1'}${'1'}${'First'}`;
        const newSchedule: ScheduleManagementColumnProps = {
            courseId: '1',
            facultyId: '1',
            programId: '1',
            scheduleCode: initialValue,
            scheduleDays: scheduleDayOptions[0].value,
            scheduleEndTime: timeOptions[2].value,
            scheduleStartTime: timeOptions[0].value,
            semester: 'First',
            yearLevel: 'First'
        };
        const newData = [...newRowData, newSchedule];
        setData('newRowData', newData);
    }

    function handleUpdateCode(updateProps: UpdateCodeProps<ScheduleManagementColumnProps>) {
        const { data, field, prevVal, rowData, newVal } = updateProps;
        const { courseId, facultyId, programId, scheduleDays, scheduleEndTime, scheduleStartTime, semester } = data;
        const scheduleCode = `${scheduleDays}${handleFormatTime(scheduleStartTime)}${handleFormatTime(scheduleEndTime)}${courseId}${programId}${facultyId}${semester}`;

        if (!rowData) return;

        if (newVal) {
            const startMinutes = toMinutes(scheduleStartTime);
            const endMinutes = toMinutes(scheduleEndTime);
            if (!field) return;
            if (startMinutes >= endMinutes) {
                rowData[field] = prevVal;
            } else {
                rowData['scheduleCode'] = scheduleCode;
                rowData[field] = newVal;
            }
        }
    }

    function handleFilterDuplicates(data: ScheduleManagementColumnProps[], action?: string) {
        const matches: string[] = [];
        const nullMatches: string[] = [];
        const uniqueRows = data.filter(
            (row, index, self) =>
                index === self.findIndex((r) => JSON.stringify(r) === JSON.stringify(row))
        );
        let newData = uniqueRows;
        console.log('newData: ', newData);
        allRows.forEach((item1) => {
            newData.forEach((item2) => {
                if (item1.scheduleCode === item2.scheduleCode) {
                    if (item1.deletedAt !== null) {
                        nullMatches.push(item1.scheduleCode);

                        return;
                    }
                    matches.push(item1.scheduleCode);
                }
            });
        });

        console.log('non: ', matches);
        console.log('null: ', nullMatches);

        if (matches.length > 0 || nullMatches.length > 0) {
            let confirmFilterNull;
            let confirmFilterNotNull;
            let finalFilteredData:ScheduleManagementColumnProps[] = [];

            if (nullMatches.length > 0) {
                confirmFilterNull = window.confirm(
                    'Duplicates detected.\n\nSome of these duplicates were previously deleted.\n\nDo you want to restore those and filter duplicates before proceeding?'
                );
            } else {
                confirmFilterNotNull = window.confirm(
                    'Duplicates detected.\n\nDo you want to filter duplicates before proceeding?'
                );
            }

            if (confirmFilterNull) {
                const withNulledData = allRows.filter(
                    (item) =>
                        !matches.includes(item.scheduleCode)
            || nullMatches.includes(item.scheduleCode)
                );

                console.log('withNulledData:', withNulledData);

                let finalFilteredData: ScheduleManagementColumnProps[] = [];

                if (action === 'modify') {
                    finalFilteredData = withNulledData
                        .filter((row) =>
                            newData.some((newItem) => newItem.scheduleId === row.scheduleId))
                        .map((row) => {
                            const match = newData.find(
                                (newItem) => newItem.scheduleId === row.scheduleId
                            );
                            return match
                                ? {
                                    ...row,
                                    ...match,
                                    deletedAt: row.deletedAt
                                }
                                : row;
                        });
                } else if (action === 'add') {
                    finalFilteredData = newData
                        .map((newItem) => {
                            // Find any matching row in DB (even soft-deleted)
                            const existing = withNulledData.find(
                                (row) => row.scheduleCode === newItem.scheduleCode
                            );

                            // RESTORE: found and is soft-deleted
                            if (existing && existing.deletedAt !== null) {
                                console.log('Restoring:', existing.scheduleCode);
                                return {
                                    ...existing,
                                    ...newItem,
                                    deletedAt: null
                                };
                            }

                            // ADD NEW: not found in DB
                            if (!existing) {
                                console.log('Adding new:', newItem.scheduleCode);
                                return {
                                    ...newItem,
                                    deletedAt: null
                                };
                            }

                            // Already active — skip
                            return null;
                        })
                        .filter(Boolean) as ScheduleManagementColumnProps[];
                }

                console.log('finalFilteredData:', finalFilteredData);

                return finalFilteredData;
            } else if (confirmFilterNotNull) {
                finalFilteredData = newData.filter(
                    (item) => !matches.includes(item.scheduleCode)
                );
            }

            if (finalFilteredData.length < 1) {
                alert('All new rows were duplicates');
                setAction('isAddRemove', false);
                setData('newRowData', []);
                renderSchedule();
                return [];
            }

            newData = finalFilteredData;
        }
        return newData;
    }

    return (
        <div className="flex flex-col gap-[12px] justify-end p-[20px] w-full">
            <NewGridFormTable<ScheduleManagementColumnProps>
                columns={scheduleDefConfigs}
                dependentField="scheduleCode"
                domLayout="normal"
                height={580}
                pagination={true}
                fieldId="scheduleId"
                submitRef={submitRef}
                onCreateNewRow={handleCreateNewSchedule}
                onChange={handleUpdateCode}
                onSubmit={
                    isModify
                        ? handleUpdateSchedule
                        : isAddRemove
                            ? handleAddSchedule
                            : isDelete
                                ? handleDeleteSchedule
                                : undefined
                }
                useDataStore={useDataStore}
            />
        </div>
    );
}