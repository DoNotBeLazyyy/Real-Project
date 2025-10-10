import MainSidebar from '@components/MainSidebar';
import { Outlet } from 'react-router-dom';

export default function AdminMainLayout() {
    return (
        <div className="flex min-h-screen pr-[25px] py-[25px] w-full">
            <div className="bg-white fixed h-[25px] left-0 right-0 top-0" />
            <div className="flex-none w-[275px]">
                <MainSidebar userLevel="admin"/>
            </div>
            <main className="flex-1 mt-[25px]">
                <Outlet />
            </main>
        </div>
    );
}