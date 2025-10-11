import CommonBadge from '@components/badge/CommonBadge';
import DetailCard from '@components/card/DetailCard';
import ShadowCard from '@components/card/ShadowCard';
import CommonMediaWithContent from '@components/label/CommonMediaWithContent';
import { CourseListProps, useCourseStore } from '@store/useCourseStore';
import { useUserStore } from '@store/useUserStore';
import { classMerge } from '@utils/css.util';
import { useNavigate } from 'react-router-dom';

interface MainCourseListProps {
    // Checks whether course list is grid or list
    isGrid?: boolean;
}

export interface CourseItemProps {
    cardDescription: string;
    cardName: string;
    pendingActCount?: number;
}

export default function MainCourseList({
    isGrid
}: MainCourseListProps) {
    // Hooks
    const navigate = useNavigate();
    const { userRole } = useUserStore();
    const { courseList } = useCourseStore();

    function handleCourseClick(course: CourseListProps) {
        navigate(`${course.scheduleId}`);
    }

    return (
        <div
            className={
                classMerge(
                    'p-[16px]',
                    isGrid
                        ? 'grid gap-[20px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] grid-rows-[250px] w-full'
                        : 'w-full flex flex-col gap-[12px]'
                )
            }
        >
            {courseList.map((course, key) => (
                <div
                    key={key}
                    onClick={() => handleCourseClick(course)}
                >
                    <ShadowCard white>
                        <div
                            className={
                                classMerge(
                                    'cursor-pointer relative w-full',
                                    isGrid
                                        ? 'h-[250px]'
                                        : 'flex gap-[16px] w-full px-[16px] py-[8px]'
                                )
                            }
                        >
                            <CommonMediaWithContent
                                boxColor="#000000"
                                boxSize={isGrid ? 'MEDIUM' : 'SMALL'}
                                isVertical={isGrid}
                            >
                                <div className={isGrid ? 'p-[8px]' : 'flex-1'}>
                                    <DetailCard
                                        cardDescription={course.courseCode}
                                        cardName={course.courseName}
                                        isCourse
                                        isTransparent
                                    />
                                </div>
                            </CommonMediaWithContent>
                            {userRole === 'student' && <CommonBadge
                                count="1"
                                size="sm"
                            />}
                        </div>
                    </ShadowCard>
                </div>
            ))}
        </div>
    );
}