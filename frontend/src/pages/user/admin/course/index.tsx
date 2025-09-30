import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import GridActionbar from '@components/GridTable/GridActionbar';
import { useActionStore } from '@store/useActionStore';
import { createDataStore } from '@store/useDataStore';
import { GenericStoreObject, JsxObject } from '@type/common.type';
import { CourseManagementColumnProps, ScheduleManagementColumnProps, DepartmentManagementColumnProps, ProgramManagementColumnProps } from '@type/management.type';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useEffect, useRef, useState } from 'react';
import ScheduleManagement from './ScheduleManagement';

type ManagementRowProps =
    | CourseManagementColumnProps
    | ScheduleManagementColumnProps
    | DepartmentManagementColumnProps
    | ProgramManagementColumnProps;

const useCourseDataStore = createDataStore<CourseManagementColumnProps>();
const useScheduleDataStore = createDataStore<ScheduleManagementColumnProps>();
const useDepartmentDataStore = createDataStore<DepartmentManagementColumnProps>();
const useProgramDataStore = createDataStore<ProgramManagementColumnProps>();

export default function AdminCourse() {
    // Store hooks
    useActionStore();
    // Ref variables
    const submitRef = useRef<HTMLButtonElement>(null);
    // State variables
    const [selectedTab, setSelectedTab] = useState('Course');
    // User level options
    const tabOptions = [
        'Course',
        'Schedule',
        'Department',
        'Program'
    ];
    const managementStoreMap: GenericStoreObject<ManagementRowProps> = {
        Course: useCourseDataStore,
        Schedule: useScheduleDataStore,
        Department: useDepartmentDataStore,
        Program: useProgramDataStore
    };
    const managementComponentMap: JsxObject = {
        Schedule: (
            <ScheduleManagement
                useDataStore={useScheduleDataStore}
                submitRef={submitRef}
            />
        )
    };

    useEffect(() => {
        setSelectedTab(tabOptions[0]);
    }, []);

    function handleSubmitClick() {
        if (submitRef.current) {
            submitRef.current.click();
        }
    }

    return (
        <div className="flex flex-col gap-[20px]">
            <CommonHeader title="Course Management" />
            <GridActionbar<ManagementRowProps>
                radioOptions={tabOptions}
                onSubmitClick={handleSubmitClick}
                setSelected={setSelectedTab}
                useDataStore={managementStoreMap[selectedTab]}
            />
            <ShadowCard>
                {managementComponentMap[selectedTab]}
            </ShadowCard>
        </div>
    );
}