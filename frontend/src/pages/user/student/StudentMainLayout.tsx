import MainSidebar from '@components/MainSidebar';
import SubSidebar from '@components/SubSidebar';
import { Outlet } from 'react-router-dom';

export default function StudentMainLayout() {
    return (
        <div className="flex min-h-screen py-[25px] w-full">
            <div className="bg-white fixed h-[25px] left-0 right-0 top-0" />
            <div className="flex-none w-[275px]">
                <MainSidebar userLevel="student" />
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