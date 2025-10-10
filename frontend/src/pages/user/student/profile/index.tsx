import PersonalDetail from '@components/card/PersonalDetail';
import AssignedCourse from '@pages/user/student/profile/AssignedCourse';
import { Outlet, useOutlet } from 'react-router-dom';

export default function StudentProfile() {
    const outlet = useOutlet();

    if (outlet) {
        return <Outlet />;
    } else {
        return (
            <div className="flex flex-col gap-[20px] h-full w-full">
                <PersonalDetail />
                <AssignedCourse />
            </div>
        );
    }
};