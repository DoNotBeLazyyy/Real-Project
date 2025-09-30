import { ButtonNull, DataStoreHook } from './common.type';

export interface ManagementProps<TData> {
    submitRef?: ButtonNull;
    useDataStore: DataStoreHook<TData>;
}

export interface ProgramManagementColumnProps {
    programCode: string;
    programName?: string;
    departmentId?: string;
}

export interface DepartmentManagementColumnProps {
    departmentCode: string;
    departmentName?: string;
}

export interface ScheduleManagementColumnProps {
    courseId: string;
    scheduleCode: string;
    scheduleDays?: ScheduleDays;
    scheduleEndTime: string;
    scheduleStartTime: string;
}

export interface CourseManagementColumnProps {
    courseCode: string;
    courseName?: string;
    courseUnit?: number;
    courseDescription?: string;
}

export type ScheduleDays =
    | 'M'
    | 'T'
    | 'W'
    | 'TH'
    | 'F'
    | 'MW'
    | 'MTH'
    | 'MF'
    | 'TW'
    | 'TTH'
    | 'TF'
    | 'WTH'
    | 'WF'
    | 'THF'
    | 'MWF'
    | 'MTF'
    | 'MTHF'
    | 'TWH'
    | 'TWF'
    | 'THF'
    | 'WTHF';