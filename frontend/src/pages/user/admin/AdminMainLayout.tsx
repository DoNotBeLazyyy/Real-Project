import MainSidebar from '@components/MainSidebar';
import { usePath } from '@utils/path.util';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function AdminMainLayout() {
    // Hooks
    const navigate = useNavigate();
    const { pathname } = usePath();
    // Custom variables
    const userName = true;
    const isAuthenticated = Boolean(userName);
    const accountPaths = ['/student/account/login', '/student/account/forgot-password'];
    const isAccountPath = accountPaths.includes(pathname);
    const isAccountSection = pathname.startsWith('/student/account');
    const isStudentRoot = pathname === '/student';

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/student/account/login', { replace: true });
        } else if (isAuthenticated && (isAccountSection || isStudentRoot)) {
            navigate('/student/dashboard', { replace: true });
        }
    }, [isAuthenticated, pathname]);

    if (!isAuthenticated && isAccountPath) {
        return ;
    }

    if (isAuthenticated) {
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

    return <Outlet />;
}