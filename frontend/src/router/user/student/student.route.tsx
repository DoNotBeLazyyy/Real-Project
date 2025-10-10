import StudentMainLayout from '@pages/user/student/StudentMainLayout';
import studentChatRoute from '@router/user/student/chat/chat.route';
import studentCourseRoute from '@router/user/student/course/course.route';
import studentDashboardRoute from '@router/user/student/dashboard/dashboard.route';
import studentProfileRoute from '@router/user/student/profile/profile.route';
import { RouteObject } from 'react-router-dom';

export default function studentRoute(): RouteObject[] {
    return [
        {
            path: 'student',
            element: <StudentMainLayout />,
            children: [
                ...studentDashboardRoute(),
                ...studentCourseRoute(),
                ...studentProfileRoute(),
                ...studentChatRoute()
            ]
        }
    ];
}