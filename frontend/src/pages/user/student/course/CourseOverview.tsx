import messageIcon from '@assets/icons/message-icon.svg';
import CommonBadge from '@components/badge/CommonBadge';
import DetailCard, { CardStatusProps } from '@components/card/DetailCard';
import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import MainDiv from '@components/container/MainDiv';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface TaskProps {
    taskId: string;
    taskName: string;
    dueDate: string;
    taskStatus: CardStatusProps;
}

interface CourseOverviewMapProps {
    period: string;
    tasks: TaskProps[];
}

export default function CourseOverview() {
    // Hooks
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    // Custom variables
    const iconMap = [
        {
            imageUrl: messageIcon,
            pendingActCount: '5'
        }
    ];
    const courseOverviewMap: CourseOverviewMapProps[] = [
        {
            period: 'Prelim',
            tasks: [
                {
                    taskId: '1',
                    taskName: 'Learning Task No. 1 - Introduction to Software Engineering',
                    dueDate: 'Due Sep. 15, 11:59 PM',
                    taskStatus: 'completed'
                },
                {
                    taskId: '2',
                    taskName: 'Learning Task No. 2 - Agile vs Waterfall',
                    dueDate: 'Due Sep. 20, 11:59 PM',
                    taskStatus: 'completed'
                },
                {
                    taskId: '3',
                    taskName: 'Learning Task No. 3 - Software Development Life Cycle',
                    dueDate: 'Due Sep. 25, 11:59 PM',
                    taskStatus: 'pending'
                },
                {
                    taskId: '4',
                    taskName: 'Learning Task No. 4 - Case Study: Library System',
                    dueDate: 'Due Sep. 30, 11:59 PM',
                    taskStatus: 'pending'
                },
                {
                    taskId: '5',
                    taskName: 'Learning Task No. 5 - Requirements Gathering',
                    dueDate: 'Due Oct. 5, 11:59 PM',
                    taskStatus: 'missed'
                }
            ]
        },
        {
            period: 'Midterm',
            tasks: [
                {
                    taskId: '6',
                    taskName: 'Learning Task No. 6 - UML Diagrams',
                    dueDate: 'Due Oct. 12, 11:59 PM',
                    taskStatus: 'missed'
                },
                {
                    taskId: '7',
                    taskName: 'Learning Task No. 7 - Use Case Design',
                    dueDate: 'Due Oct. 17, 11:59 PM',
                    taskStatus: 'missed'
                },
                {
                    taskId: '8',
                    taskName: 'Learning Task No. 8 - Sequence Diagrams',
                    dueDate: 'Due Oct. 22, 11:59 PM',
                    taskStatus: 'submitted'
                },
                {
                    taskId: '9',
                    taskName: 'Learning Task No. 9 - Activity Diagrams',
                    dueDate: 'Due Oct. 27, 11:59 PM',
                    taskStatus: 'submitted'
                },
                {
                    taskId: '10',
                    taskName: 'Learning Task No. 10 - Class Diagram Exercise',
                    dueDate: 'Due Nov. 1, 11:59 PM',
                    taskStatus: 'pending'
                }
            ]
        },
        {
            period: 'Final',
            tasks: [
                {
                    taskId: '11',
                    taskName: 'Learning Task No. 11 - Software Testing Basics',
                    dueDate: 'Due Nov. 10, 11:59 PM',
                    taskStatus: 'completed'
                },
                {
                    taskId: '12',
                    taskName: 'Learning Task No. 12 - Unit Testing with Jest',
                    dueDate: 'Due Nov. 15, 11:59 PM',
                    taskStatus: 'completed'
                },
                {
                    taskId: '13',
                    taskName: 'Learning Task No. 13 - Integration Testing',
                    dueDate: 'Due Nov. 20, 11:59 PM',
                    taskStatus: 'pending'
                },
                {
                    taskId: '14',
                    taskName: 'Learning Task No. 14 - Deployment Strategies',
                    dueDate: 'Due Nov. 25, 11:59 PM',
                    taskStatus: 'pending'
                },
                {
                    taskId: '15',
                    taskName: 'Learning Task No. 15 - Capstone Project Presentation',
                    dueDate: 'Due Nov. 30, 11:59 PM',
                    taskStatus: 'pending'
                }
            ]
        }
    ];

    function handleTaskClick(taskId: string) {
        navigate(`/student/course/${courseId}/${taskId}/task`);
    }

    return (
        <MainDiv>
            <CommonHeader
                icons={iconMap}
                subTitle="ITC-129 LEC (MWF / 8:00AM - 10:00AM)"
                title="Computer Organization"
            />
            <ShadowCard isLarge>
                <div className="flex flex-col gap-[16px] p-[16px] w-full">
                    {courseOverviewMap.map((course, courseKey) => (
                        <React.Fragment key={courseKey}>
                            <ShadowCard white>
                                <div className="flex flex-col gap-[16px] min-h-[60px] p-[12px] relative w-full">
                                    <h1 className="font-[600] leading-[100%] text-[#052554]">{course.period} Period</h1>
                                    {course.tasks && course.tasks.map((task, taskKey) => (
                                        <div
                                            key={taskKey}
                                            onClick={() => handleTaskClick(task.taskId)}
                                        >
                                            <DetailCard
                                                cardName={task.taskName}
                                                cardStatus={task.taskStatus}
                                                dueDate={task.dueDate}
                                                isBordered
                                                isTask
                                            />
                                        </div>
                                    ))}
                                    <CommonBadge
                                        count={course.tasks.filter((task) => task.taskStatus === 'pending').length}
                                        size="m"
                                    />
                                </div>
                            </ShadowCard>
                        </React.Fragment>
                    ))}
                </div>
            </ShadowCard>
        </MainDiv>
    );
}