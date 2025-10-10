import NewGridFormTable from '@components/GridTable/NewGridFormTable';
import { getActiveCourses } from '@services/course.service';
import { getActiveFaculties } from '@services/faculty.service';
import { getActivePrograms } from '@services/program.service';
// eslint-disable-next-line object-curly-newline
import { deleteSchedules, getActiveSchedules, getAllSchedules, postSchedules, putSchedules } from '@services/schedule.service';
import { useActionStore } from '@store/useActionStore';
import { SelectProps, UnknownObject } from '@type/common.type';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps, ScheduleDaysProps, ScheduleManagementColumnProps } from '@type/management.type';
import { handleFormatTime, toMinutes } from '@type/string.util';
import { useEffect, useState } from 'react';

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
    // State variables
    const [courseList, setCourseList] = useState<SelectProps[]>([]);
    const [facultyList, setFacultyList] = useState<SelectProps[]>([]);
    const [programList, setProgramList] = useState<SelectProps[]>([]);
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
    // Academic year list
    const academicYears = [
        { label: '2023-2024', value: '20232024' },
        { label: '2024-2025', value: '20242025' },
        { label: '2025-2026', value: '20252026' },
        { label: '2026-2027', value: '20262027' },
        { label: '2027-2028', value: '20272028' }
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
        { label: 'Second Semester', value: 'Second' },
        { label: 'Summer Semester', value: 'Summer' }
    ];
    // Schedule account fields
    const scheduleDefConfigs: GridColumnsProps<ScheduleManagementColumnProps>[] = [
        { field: 'scheduleCode', maxLength: 20, minWidth: 220 },
        { field: 'academicYear', options: academicYears, minWidth: 160 },
        { field: 'scheduleDays', options: scheduleDayOptions, minWidth: 150 },
        { field: 'scheduleStartTime', options: timeOptions, minWidth: 150 },
        { field: 'scheduleEndTime', options: timeOptions, minWidth: 150 },
        { field: 'yearLevel', options: yearLevelOptions, minWidth: 150 },
        { field: 'semester', options: semesterOptions, minWidth: 170 },
        { field: 'programId', name: 'Program', options: programList, minWidth: 200 },
        { field: 'facultyId', name: 'Faculty', options: facultyList, minWidth: 200 },
        { field: 'courseId', name: 'Course', options: courseList, minWidth: 250 }
    ];

    useEffect(() => {
        renderSchedule();
        getFacultyList();
        getProgramList();
        getCourseList();
    }, []);

    async function getFacultyList() {
        const activeFacultyList = (await getActiveFaculties())?.data?.result;

        if (!activeFacultyList) return;

        const selectOptions: SelectProps[] = activeFacultyList.map((faculty) => ({
            value: faculty.facultyId ?? '',
            label: `${faculty.facultyNumber} - ${faculty.lastName}, ${faculty.firstName}`
        }));

        setFacultyList(selectOptions);
    }

    // Program list
    async function getProgramList() {
        const activeProgramList = (await getActivePrograms())?.data?.result;

        if (!activeProgramList) return;

        const selectOptions: SelectProps[] = activeProgramList.map((program) => ({
            value: program.programId ?? '',
            label: `${program.programCode} - ${program.programName}`
        }));

        setProgramList(selectOptions);
    }

    // Course list
    async function getCourseList() {
        const activeCourseList = (await getActiveCourses())?.data?.result;

        if (!activeCourseList) return;

        const selectOptions: SelectProps[] = activeCourseList.map((course) => ({
            value: course.courseId ?? '',
            label: `${course.courseCode} - ${course.courseName}`
        }));

        setCourseList(selectOptions);
    }

    async function getAllRows() {
        const allRows = (await getAllSchedules()).data.result;
        setData('allRows', allRows);
    }

    async function renderSchedule() {
        const scheduleList = (await getActiveSchedules())
            .data
            .result;

        if (!scheduleList) {
            return;
        }

        setData('rowData', scheduleList);
        getAllRows();
    }

    async function handleAddSchedule() {
        const { filteredData, message } = handleFilterDuplicates(newRowData, 'add');

        if (filteredData.length < 1) {
            return;
        }

        const savedMessage = (await postSchedules(filteredData)).data.retCode;

        if (savedMessage === 'SUCCESS') {
            alert(message);
            setAction('isAddRemove', false);
            setData('newRowData', []);
            renderSchedule();
        }
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

        const { filteredData, message } = handleFilterDuplicates(data, 'modify');

        if (filteredData.length < 1) {
            return;
        }

        const updateMessage = (await putSchedules(filteredData)).data.retCode;

        if (updateMessage === 'SUCCESS') {
            alert(message);
            setAction('isModify', false);
            setData('modifiedRows', []);
            renderSchedule();
        }
    }

    function handleCreateNewSchedule() {
        if (!courseList || courseList.length === 0) {
            alert('Please create a course first.');
            setAction('isAddRemove', false);
            return;
        } else if (!facultyList || facultyList.length === 0) {
            alert('Please create a faculty first.');
            setAction('isAddRemove', false);
            return;
        } else if (!programList || programList.length === 0) {
            alert('Please create a program first.');
            setAction('isAddRemove', false);
            return;
        }

        const academicYear = getAcademicYear();
        const initialValue = `${scheduleDayOptions[0].value}${handleFormatTime(timeOptions[0].value)}${handleFormatTime(timeOptions[2].value)}${programList[0].value}${facultyList[0].value}${courseList[0].value}${'First'}${academicYear}`;
        const newSchedule: ScheduleManagementColumnProps = {
            courseId: courseList[0].value,
            facultyId: facultyList[0].value,
            programId: programList[0].value,
            scheduleCode: initialValue,
            scheduleDays: scheduleDayOptions[0].value,
            scheduleEndTime: timeOptions[2].value,
            scheduleStartTime: timeOptions[0].value,
            semester: 'First',
            academicYear: academicYear,
            yearLevel: 'First'
        };
        const newData = [...newRowData, newSchedule];
        setData('newRowData', newData);
    }

    function getAcademicYear(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        const startYear = month >= 8 ? year : year - 1;
        const endYear = startYear + 1;

        return `${startYear}${endYear}`;
    }

    function handleUpdateCode(updateProps: UpdateCodeProps<ScheduleManagementColumnProps>) {
        const { data, field, prevVal, rowData, newVal } = updateProps;

        if (!rowData || !field) {
            return;
        }

        const { courseId, facultyId, programId, scheduleDays, scheduleEndTime, scheduleStartTime, semester, academicYear } = data;
        const scheduleCode = `${scheduleDays}${handleFormatTime(scheduleStartTime)}${handleFormatTime(scheduleEndTime)}${courseId}${programId}${facultyId}${semester}${academicYear}`;
        const startMinutes = toMinutes(scheduleStartTime);
        const endMinutes = toMinutes(scheduleEndTime);

        if (startMinutes >= endMinutes) {
            rowData[field] = prevVal;
        } else {
            rowData['scheduleCode'] = scheduleCode;
            rowData[field] = newVal;
        }
    }

    function handleFilterDuplicates(data: ScheduleManagementColumnProps[], action?: string) {
        const uniqueData = data.filter((row, index, self) => (
            index === self.findIndex((r) => r.scheduleCode === row.scheduleCode)
        ));
        const duplicatedRows: ScheduleManagementColumnProps[] = [];
        const newlyAddedRows: ScheduleManagementColumnProps[] = [];
        const softDeletedRows: ScheduleManagementColumnProps[] = [];
        let filteredData = newlyAddedRows;

        uniqueData.forEach((uniqueRow) => {
            const existingRow = allRows.find((row) => (
                row.scheduleCode === uniqueRow.scheduleCode
            ));
            console.log('existingRow: ', existingRow);
            const modifiedActiveRow = allRows.find((row) => (
                row.scheduleCode === uniqueRow.scheduleCode && uniqueRow.scheduleId !== row.scheduleId
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
                setAction('isAddRemove', false);
                setAction('isModify', false);
                setData('newRowData', []);
                setData('modifiedRows', []);
                renderSchedule();
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