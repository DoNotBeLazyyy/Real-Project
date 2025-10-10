import NewGridFormTable from '@components/GridTable/NewGridFormTable';
// eslint-disable-next-line object-curly-newline
import { deleteCourses, getActiveCourses, getAllCourses, postCourses, putCourses } from '@services/course.service';
import { useActionStore } from '@store/useActionStore';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps, CourseManagementColumnProps } from '@type/management.type';
import { useEffect } from 'react';

export default function CourseManagement({
    submitRef,
    useDataStore
}: ManagementProps<CourseManagementColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction, setReset } = useActionStore();
    const { newRowData, selectedRowData, allRows, setData, reset } = useDataStore();
    // Course type list
    const courseType = [
        { label: 'LEC', value: 'LEC' },
        { label: 'LAB', value: 'LAB' }
    ];
    // Course fields
    const scheduleDefConfigs: GridColumnsProps<CourseManagementColumnProps>[] = [
        { field: 'courseCode', inputType: 'alphanumeric', maxLength: 10, minWidth: 150 },
        { field: 'courseName', inputType: 'alphabet', maxLength: 100, minWidth: 250 },
        { field: 'courseDescription', inputType: 'alphabet', maxLength: 250, minWidth: 250 },
        { field: 'courseUnit', inputType: 'number', maxLength: 1 },
        { field: 'courseMode', options: courseType, minWidth: 150 }
    ];

    useEffect(() => {
        renderCourse();
    }, []);

    async function renderCourse() {
        const facultyList = (await getActiveCourses())
            .data
            .result;
        setData('rowData', facultyList);
        getAllRows();
    }

    async function getAllRows() {
        const allRows = (await getAllCourses()).data.result;
        setData('allRows', allRows);
    }

    async function handleAddCourse() {
        const { filteredData, message } = handleFilterDuplicates(newRowData, 'add');

        if (filteredData.length < 1) {
            return;
        }
        const savedMessage = (await postCourses(filteredData)).data.retCode;

        if (savedMessage === 'SUCCESS') {
            console.log('testss');
            alert(message);
            setAction('isAddRemove', false);
            setData('newRowData', []);
            renderCourse();
        }
    }

    async function handleDeleteCourse() {
        const deleteMessage = await deleteCourses(selectedRowData);

        if (deleteMessage) {
            setAction('isDelete', false);
            setData('selectedRowData', []);
            renderCourse();
        }
    }

    async function handleUpdateCourse(modifiedData?: CourseManagementColumnProps[]) {
        const data = modifiedData ?? [];

        const { filteredData, message } = handleFilterDuplicates(data, 'modify');

        if (filteredData.length < 1) {
            return;
        }

        const updateMessage = (await putCourses(filteredData)).data.retCode;

        if (updateMessage === 'SUCCESS') {
            alert(message);
            setAction('isModify', false);
            setData('modifiedRows', []);
            renderCourse();
        }
    }

    function handleCreateNewCourse() {
        const newCourse: CourseManagementColumnProps = {
            courseCode: '',
            courseName: '',
            courseUnit: 1,
            courseDescription: '',
            courseMode: courseType[0].value
        };
        const newData = [...newRowData, newCourse];
        setData('newRowData', newData);
    }

    function handleFilterDuplicates(data: CourseManagementColumnProps[], action?: string) {
        const uniqueData = data.filter((row, index, self) => (
            index === self.findIndex((r) => r.courseCode === row.courseCode)
        ));
        const duplicatedRows: CourseManagementColumnProps[] = [];
        const newlyAddedRows: CourseManagementColumnProps[] = [];
        const softDeletedRows: CourseManagementColumnProps[] = [];
        let filteredData = newlyAddedRows;

        uniqueData.forEach((uniqueRow) => {
            const existingRow = allRows.find((row) => (
                row.courseCode === uniqueRow.courseCode
            ));
            const modifiedActiveRow = allRows.find((row) => (
                row.courseCode === uniqueRow.courseCode && uniqueRow.courseId !== row.courseId
            ));

            console.log('existingRow: ', existingRow);
            console.log('modifiedActiveRow: ', modifiedActiveRow);

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
                renderCourse();
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
            <NewGridFormTable<CourseManagementColumnProps>
                columns={scheduleDefConfigs}
                domLayout="normal"
                height={580}
                pagination={true}
                fieldId="courseId"
                submitRef={submitRef}
                onCreateNewRow={handleCreateNewCourse}
                onSubmit={
                    isModify
                        ? handleUpdateCourse
                        : isAddRemove
                            ? handleAddCourse
                            : isDelete
                                ? handleDeleteCourse
                                : undefined
                }
                useDataStore={useDataStore}
            />
        </div>
    );
}