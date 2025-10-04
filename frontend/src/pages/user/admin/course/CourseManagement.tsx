import NewGridFormTable from '@components/GridTable/NewGridFormTable';
import { deleteCourses, getActiveCourses, postCourses, putCourses } from '@services/course.service';
import { useActionStore } from '@store/useActionStore';
import { GridColumnsProps } from '@type/grid.type';
import { ManagementProps, CourseManagementColumnProps } from '@type/management.type';
import { useEffect } from 'react';

export default function CourseManagement({
    submitRef,
    useDataStore
}: ManagementProps<CourseManagementColumnProps>) {
    // Stores
    const { isAddRemove, isDelete, isModify, setAction } = useActionStore();
    const { newRowData, selectedRowData, setData } = useDataStore();
    // Course fields
    const scheduleDefConfigs: GridColumnsProps<CourseManagementColumnProps>[] = [
        { field: 'courseCode', inputType: 'alphabet', maxLength: 6 },
        { field: 'courseName', inputType: 'alphabet', maxLength: 100 },
        { field: 'courseUnit', inputType: 'alphabet', maxLength: 100 },
        { field: 'courseDescription', inputType: 'alphabet', maxLength: 50 }
    ];

    useEffect(() => {
        renderCourse();
    }, []);

    async function renderCourse() {
        const facultyList = (await getActiveCourses())
            .data
            .result;
        setData('rowData', facultyList);
    }

    async function handleAddCourse() {
        const savedMessage = await postCourses(newRowData);

        if (savedMessage) {
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
        if (modifiedData) {
            const updateMessage = await putCourses(modifiedData);

            if (updateMessage) {
                setAction('isModify', false);
                setData('modifiedRows', []);
                renderCourse();
            }
        }
    }

    function handleCreateNewCourse() {
        const newCourse: CourseManagementColumnProps = {
            courseCode: '',
            courseName: '',
            courseUnit: 1,
            courseDescription: ''
        };
        const newData = [...newRowData, newCourse];
        setData('newRowData', newData);
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