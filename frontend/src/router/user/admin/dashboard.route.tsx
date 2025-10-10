import AdminDashboard from '@pages/user/admin/dashboard';
import { RouteObject } from 'react-router-dom';

export default function adminDashboardRoute(): RouteObject[] {
    return [
        {
            element: <AdminDashboard />,
            path: 'dashboard'
        }
    ];
}