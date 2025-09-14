import AdminMainLayout from '@pages/user/admin/AdminMainLayout';
import { RouteObject } from 'react-router-dom';
import adminAccountRoute from './account/account.route';
import adminCourseRoute from './course/course.route';

export default function adminRoute(): RouteObject[] {
    return [
        {
            path: 'admin/',
            element: <AdminMainLayout />,
            children: [
                ...adminCourseRoute(),
                ...adminAccountRoute()
            ]
        }
    ];
}