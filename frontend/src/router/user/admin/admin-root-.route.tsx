import AdminMainLayout from '@pages/user/admin/AdminMainLayout';
import { RouteObject } from 'react-router-dom';
import adminAccountRoute from './account.route';
import adminCourseRoute from './course.route';
import adminDashboardRoute from './dashboard.route';
import adminSupportRoute from './support.route';

export default function adminRoute(): RouteObject[] {
    return [
        {
            path: 'admin',
            element: <AdminMainLayout />,
            children: [
                ...adminAccountRoute(),
                ...adminCourseRoute(),
                ...adminDashboardRoute(),
                ...adminSupportRoute()
            ]
        }
    ];
}