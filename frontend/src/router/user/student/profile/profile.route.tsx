import StudentProfile from '@pages/user/student/profile';
import CourseEnrollment from '@pages/user/student/profile/CourseEnrollment';
import { RouteObject } from 'react-router-dom';
import gradeRoute from './grade-report.route';

export default function studentProfileRoute(): RouteObject[] {
    return [
        {
            path: 'profile/',
            element: <StudentProfile />,
            children: [
                ...gradeRoute(),
                {
                    element: <CourseEnrollment />,
                    path: 'course-enrollment'
                }
            ]
        }
    ];
}