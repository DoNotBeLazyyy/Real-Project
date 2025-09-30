import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import GridActionbar from '@components/GridTable/GridActionbar';
import FacultyAccount from '@pages/user/admin/account/FacultyAccount';
import StudentAccount from '@pages/user/admin/account/StudentAccount';
import { createDataStore } from '@store/useDataStore';
import { FacultyAccountColumnProps, StudentAccountColumnProps } from '@type/account.type';
import { GenericStoreObject, JsxObject } from '@type/common.type';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { RefObject, useRef, useState } from 'react';

export interface StudentFacultyRowProps {
    [key: string]: unknown;
    address: string;
    age: string;
    department?: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    program?: string;
    sex: string;
    yearLevel?: string;
}

export interface ButtonOptionsProps {
    condition: boolean;
    label: string;
    submitRef?: RefObject<HTMLButtonElement | null>;
    onButtonClick: () => void;
}

type FacultyStudentProps = FacultyAccountColumnProps | StudentAccountColumnProps;

const useStudentDataStore = createDataStore<StudentAccountColumnProps>();
const useFacultyDataStore = createDataStore<FacultyAccountColumnProps>();

export default function AdminAccount() {
    // Ref variables
    const submitRef = useRef<HTMLButtonElement>(null);
    // State variables
    const [selectedRole, setSelectedRole] = useState('Student');
    // Account store map
    const accountStoreMap: GenericStoreObject<FacultyStudentProps> = {
        Student: useStudentDataStore,
        Faculty: useFacultyDataStore
    };
    const accountComponentMap: JsxObject = {
        Student: (
            <StudentAccount
                useDataStore={useStudentDataStore}
                submitRef={submitRef}
            />
        ),
        Faculty: (
            <FacultyAccount
                useDataStore={useFacultyDataStore}
                submitRef={submitRef}
            />
        )
    };

    // User level options
    const roleOptions = [
        'Student',
        'Faculty'
    ];

    function handleSubmitClick() {
        if (submitRef.current) {
            submitRef.current.click();
        }
    }

    return (
        <div className="flex flex-col gap-[20px]">
            <CommonHeader title="Account Management" />
            <GridActionbar<FacultyStudentProps>
                radioOptions={roleOptions}
                onSubmitClick={handleSubmitClick}
                setSelected={setSelectedRole}
                useDataStore={accountStoreMap[selectedRole]}
            />
            <ShadowCard>
                {accountComponentMap[selectedRole]}
            </ShadowCard>
        </div>
    );
}