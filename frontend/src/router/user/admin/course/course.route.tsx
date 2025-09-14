import AdminCourse from '@pages/user/admin/course';
import { RouteObject } from 'react-router-dom';

export default function adminCourseRoute(): RouteObject[] {
    return [
        {
            path: 'course/',
            element: <AdminCourse />,
            children: [
            ]
        }
    ];
}