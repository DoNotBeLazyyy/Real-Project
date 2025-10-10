import { useUserStore } from '@store/useUserStore';
import { usePath } from '@utils/path.util';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function Root() {
    const { pathname } = usePath();
    const navigate = useNavigate();
    const { isInitial, token, userRole } = useUserStore();
    const accountPaths = ['/api/account/login', '/api/account/forgot-password'];
    const isAccountPath = accountPaths.some((path) => pathname.startsWith(path));

    useEffect(() => {
        if (isInitial) {
            navigate('/account/change-password');
        } else if (!token && !isAccountPath) {
            navigate('/account/login', { replace: true });
        } else if (token && !pathname.startsWith(`/${userRole}/`)) {
            navigate(`/${userRole}/dashboard`);
        }
    }, [isInitial, pathname, userRole, token]);

    return <Outlet />;
}