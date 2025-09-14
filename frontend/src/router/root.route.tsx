import Root from '@pages/Root';
import adminRoute from '@router/user/admin/admin-root-.route';
import studentRoute from '@router/user/student/student-root.route';
import { RouteObject } from 'react-router-dom';

export default function routeRoot(): RouteObject[] {
    return [
        {
            path: '/',
            element: <Root />,
            children: [
                ...studentRoute(),
                ...adminRoute()
            ]
        }
    ];
}