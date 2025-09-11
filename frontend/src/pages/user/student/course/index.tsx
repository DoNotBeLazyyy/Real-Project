import gridMenuIcon from '@assets/icons/grid-menu-icon.svg';
import listMenuIcon from '@assets/icons/list-menu-icon.svg';
import notifBellIcon from '@assets/icons/notification-bell-icon.svg';
import settingsIcon from '@assets/icons/settings-icon.svg';
import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import MainDiv from '@components/container/MainDiv';
import CourseList from '@pages/user/student/course/CourseList';
import { usePath } from '@utils/path.util';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function StudentCourse() {
    // Hooks
    const { isPath, isRoot } = usePath();

    const [isGrid, setIsGrid] = useState(false);
    const iconMap = [
        {
            imageUrl: notifBellIcon,
            pendingActCount: '5'
        },
        {
            imageUrl: settingsIcon
        },
        {
            height: 13,
            imageUrl: isGrid ? gridMenuIcon : listMenuIcon,
            width: 13,
            onIconClick: handleToggleDisplay
        }
    ];

    function handleToggleDisplay() {
        setIsGrid(!isGrid);
    }

    return (
        <>
            {(!isRoot && isPath) ? (
                <Outlet />
            ) : (
                <MainDiv>
                    <CommonHeader
                        title="Courses"
                        subTitle="Course List"
                        icons={iconMap}
                    />
                    <ShadowCard isLarge>
                        <CourseList isGrid={isGrid} />
                    </ShadowCard>
                </MainDiv>
            )}
        </>
    );
};