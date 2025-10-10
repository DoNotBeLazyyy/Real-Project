import { ButtonNull, DataStoreHook } from './common.type';

export interface ManagementProps<TData> {
    submitRef?: ButtonNull;
    useDataStore: DataStoreHook<TData>;
}

export interface ProgramManagementColumnProps {
    programCode: string;
    programId?: string;
    programName?: string;
    departmentId: string;
    deletedAt?: string | null;
}

export interface DepartmentManagementColumnProps {
    departmentCode: string;
    departmentId?: string;
    departmentName?: string;
    deletedAt?: string | null;
}

export interface ScheduleManagementColumnProps {
    academicYear: string;
    courseId: string;
    facultyId: string;
    programId: string;
    scheduleCode: string;
    scheduleDays: ScheduleDaysProps;
    scheduleEndTime: string;
    scheduleId?: string;
    scheduleStartTime: string;
    semester: string;
    yearLevel: string;
    deletedAt?: string | null;
}

export interface CourseManagementColumnProps {
    courseCode: string;
    courseDescription?: string;
    courseId?: string;
    courseName?: string;
    courseUnit?: number;
    courseMode?: string;
    deletedAt?: string | null;
}

export type ScheduleDaysProps =
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