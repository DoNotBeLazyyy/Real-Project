import StudentCourse from '@pages/user/student/course';
import CourseTask from '@pages/user/student/course/course-task';
import CourseOverview from '@pages/user/student/course/CourseOverview';
import { RouteObject } from 'react-router-dom';

export default function studentCourseRoute(): RouteObject[] {
    return [
        {
            path: 'course',
            element: <StudentCourse />,
            children: [
                {
                    element: <CourseOverview />,
                    path: ':courseId/overview'
                },
                {
                    element: <CourseTask />,
                    path: ':courseId/:taskId/task'
                }
            ]
        }
    ];
}