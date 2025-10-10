import PersonalDetail from '@components/card/PersonalDetail';
import AssignedCourse from '@pages/user/student/profile/AssignedCourse';

export default function FacultyProfile() {
    return (
        <div className="flex flex-col gap-[20px] h-full w-full">
            <PersonalDetail />
            <AssignedCourse />
        </div>
    );
};