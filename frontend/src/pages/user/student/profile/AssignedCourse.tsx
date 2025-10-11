import CommonButton, { CommonButtonProps } from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import { useCourseStore } from '@store/useCourseStore';
import { useUserStore } from '@store/useUserStore';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCardHeader from './ProfileCardHeader';

export interface CourseListProps {
    courseCode: string;
    courseName: string;
    schedule: string;
    faculty?: string;
}

interface CourseListCardProps {
    buttonList: CommonButtonProps[];
}

export default function CourseListCard({
    buttonList
}: CourseListCardProps) {
    // Hooks
    const { userRole } = useUserStore();
    const { courseList } = useCourseStore();
    const navigate = useNavigate();
    // Custom variables
    const InfoRow = ({ label, value }: { label?: string; value?: string }) => (
        <div>
            <span className="font-semibold">{label}: </span>
            {value}
        </div>
    );
    // Button label
    const cardButtonLabel = userRole === 'student'
        ? 'View Grade'
        : 'Grade Students';

    function handleViewGrade(courseCode: string) {
        navigate(`grade-report/:${courseCode}`);
    }

    return (
        <ShadowCard>
            <div className="flex flex-col gap-[16px] p-[16px] w-full">
                <div className="flex gap-[8px]">
                    <ProfileCardHeader
                        cardLabel="Course Enrolled (Current Semester)"
                        buttons={buttonList}
                    />
                </div>
                <div className="gap-[12px] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
                    {courseList?.map((c, cndx) => (
                        <React.Fragment key={`course-entry-${cndx}`}>
                            <ShadowCard white >
                                <div className="p-[12px] w-full">
                                    <div className="flex flex-col gap-[16px] leading-[100%] text-[12px]">
                                        <div className="flex items-center justify-between">
                                            <span className="font-[700] text-[#052554] text-[14px]">{c.courseCode}</span>
                                            <CommonButton
                                                buttonLabel={cardButtonLabel}
                                                buttonStyle="blue"
                                                size="sm"
                                                onButtonClick={() => handleViewGrade(c.courseCode)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-[8px] leading-[100%] text-[#080612]">
                                            <InfoRow label="Course Name" value={c.courseName} />
                                            <InfoRow label="Schedule" value={c.schedule} />
                                            {userRole === 'student' && <InfoRow label="Professor" value={c.faculty} />}
                                        </div>
                                    </div>
                                </div>
                            </ShadowCard>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </ShadowCard>
    );
}