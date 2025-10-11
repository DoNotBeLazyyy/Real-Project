import CourseMainScreen from '@components/course/CourseMainScreen';
import CourseOverview from '@components/course/CourseOverview';
import CourseTask from '@pages/user/student/course/course-task';
import { RouteObject } from 'react-router-dom';

export default function studentCourseRoute(): RouteObject[] {
    return [
        {
            path: 'course',
            element: <CourseMainScreen />,
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