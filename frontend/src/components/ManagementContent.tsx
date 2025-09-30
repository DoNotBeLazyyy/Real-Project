import { ManagementTabOptionProps } from '@pages/user/admin/account';
import FacultyAccount from '@pages/user/admin/account/FacultyAccount';
import { StudentAccountProps } from '@pages/user/admin/account/StudentAccount';
import ScheduleManagement from '@pages/user/admin/course/ScheduleManagement';
import ShadowCard from './card/ShadowCard';

interface ManagementContentProps extends StudentAccountProps {
    selectedTab: string;
    tabOptions: ManagementTabOptionProps[];
}

export default function ManagementContent({
    selectedTab,
    ...props
}: ManagementContentProps) {
    return (
        <ShadowCard>
            {selectedTab === 'Course' ? (
                <ScheduleManagement
                    {...props}
                />
            ) : selectedTab === 'Faculty' ? (
                <FacultyAccount
                    useFacultyDataStore={useFacultyDataStore}
                    submitRef={submitRef}
                />
            ) : null}
        </ShadowCard>
    );
}