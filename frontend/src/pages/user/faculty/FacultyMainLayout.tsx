import MainSidebar from '@components/MainSidebar';
import SubSidebar from '@components/SubSidebar';
import { getFacultyDetail } from '@services/faculty.service';
import { getFacultySchedules } from '@services/schedule.service';
import { useCourseStore } from '@store/useCourseStore';
import { FacultyDetailProps, useUserStore } from '@store/useUserStore';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function FacultyMainLayout() {
    // Hooks
    const { setDetail, username, detail } = useUserStore();
    const { courseList, setCourseList } = useCourseStore();

    useEffect(() => {
        const typedDetail = detail as FacultyDetailProps;
        if (!typedDetail) {
            getUserDetails();
        }
        if (courseList.length < 1) {
            handleGetSchedule();
        }
    }, [location.pathname]);

    async function getUserDetails() {
        const { data } = await getFacultyDetail(username);
        const result = data.result;

        console.log('result: ', result);

        if (result && Object.keys(result).length > 0) {
            setDetail(result);
        }
    }

    async function handleGetSchedule() {
        const facultyDetail = detail as FacultyDetailProps;
        const scheduleList = (await getFacultySchedules(facultyDetail.facultyNumber)).data.result ;
        console.log('schedule: ', scheduleList);
        setCourseList(scheduleList);
    }

    return (
        <div className="flex min-h-screen py-[25px] w-full">
            <div className="bg-white fixed h-[25px] left-0 right-0 top-0" />
            <div className="flex-none w-[275px]">
                <MainSidebar userLevel="faculty" />
            </div>
            <main className="flex-1 mt-[25px]">
                <Outlet />
            </main>
            <div className="flex-none w-[293px]">
                <SubSidebar />
            </div>
        </div>
    );
}