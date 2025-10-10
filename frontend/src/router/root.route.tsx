import Root from '@pages/Root';
import adminRoute from '@router/user/admin/admin-root-.route';
import studentRoute from '@router/user/student/student.route';
import { RouteObject } from 'react-router-dom';
import accountRoute from './account/account.route';
import facultyRoute from './user/faculty/faculty.route';

export default function routeRoot(): RouteObject[] {
    return [
        {
            path: '*',
            element: <Root />,
            children: [
                ...accountRoute(),
                ...adminRoute(),
                ...facultyRoute(),
                ...studentRoute()
            ]
        }
    ];
}