import FacultyMainLayout from '@pages/user/faculty/FacultyMainLayout';
import facultyChatRoute from '@router/user/faculty/chat/chat.route';
import facultyCourseRoute from '@router/user/faculty/course/course.route';
import facultyDashboardRoute from '@router/user/faculty/dashboard/dashboard.route';
import facultyProfileRoute from '@router/user/faculty/profile/profile.route';
import { RouteObject } from 'react-router-dom';

export default function facultyRoute(): RouteObject[] {
    return [
        {
            path: 'faculty',
            element: <FacultyMainLayout />,
            children: [
                ...facultyDashboardRoute(),
                ...facultyCourseRoute(),
                ...facultyProfileRoute(),
                ...facultyChatRoute()
            ]
        }
    ];
}