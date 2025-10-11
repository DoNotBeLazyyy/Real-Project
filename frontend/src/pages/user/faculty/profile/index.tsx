import { CommonButtonProps } from '@components/buttons/CommonButton';
import PersonalDetail from '@components/card/PersonalDetail';
import AssignedCourse from '@pages/user/student/profile/AssignedCourse';
import { useNavigate } from 'react-router-dom';

export default function FacultyProfile() {
    // Hook store
    const navigate = useNavigate();
    // Button list
    const buttons: CommonButtonProps[] = [
        {
            buttonLabel: 'Course Overview',
            buttonStyle: 'blue',
            size: 'm',
            onButtonClick: handleViewOverallGrade
        }
    ];

    function handleViewOverallGrade() {
        navigate('/faculty/course');
    }

    return (
        <div className="flex flex-col gap-[20px] h-full w-full">
            <PersonalDetail />
            <AssignedCourse
                buttonList={buttons}
            />
        </div>
    );
};