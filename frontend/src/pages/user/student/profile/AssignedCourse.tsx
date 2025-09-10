import CommonButton from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import React from 'react';
import ProfileCardHeader from './ProfileCardHeader';

export default function AssignedCourse() {
    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <div>
            <span className="font-semibold">{label}: </span>
            {value}
        </div>
    );
    const courses = [
        {
            code: 'CS101',
            name: 'Introduction to Computer Science',
            schedule: 'Mon & Wed 9:00AM - 10:30AM',
            professor: 'Dr. Smith'
        },
        {
            code: 'CS202',
            name: 'Data Structures and Algorithms',
            schedule: 'Tue & Thu 11:00AM - 12:30PM',
            professor: 'Prof. Johnson'
        },
        {
            code: 'CS305',
            name: 'Database Management Systems',
            schedule: 'Mon & Wed 1:00PM - 2:30PM',
            professor: 'Dr. Williams'
        },
        {
            code: 'CS310',
            name: 'Web Development',
            schedule: 'Fri 9:00AM - 12:00PM',
            professor: 'Ms. Brown'
        },
        {
            code: 'CS401',
            name: 'Software Engineering',
            schedule: 'Tue & Thu 2:00PM - 3:30PM',
            professor: 'Dr. Taylor'
        }
    ];

    return (
        <ShadowCard>
            <div className="flex flex-col gap-[16px] p-[16px] w-full">
                <ProfileCardHeader
                    buttonLabel="View Overall Grade"
                    buttonStyle="blue"
                    cardLabel="Course Enrolled (Current Semester)"
                    size="m"
                />
                <div className="gap-[12px] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
                    {courses.map((course, courseKey) => (
                        <React.Fragment key={`${course.code}-${courseKey}`}>
                            <ShadowCard white >
                                <div className="p-[12px] w-full">
                                    <div className="flex flex-col gap-[16px] leading-[100%] text-[12px]">
                                        <div className="flex items-center justify-between">
                                            <span className="font-[700] text-[#052554] text-[14px]">{course.code}</span>
                                            <CommonButton
                                                buttonLabel="View Grade"
                                                buttonStyle="blue"
                                                size="sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-[8px] leading-[100%] text-[#080612]">
                                            <InfoRow label="Course Name" value={course.name} />
                                            <InfoRow label="Schedule" value={course.schedule} />
                                            <InfoRow label="Professor" value={course.professor} />
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