import CourseMainScreen from '@components/course/CourseMainScreen';
import CourseOverview from '@components/course/CourseOverview';
import { CourseWorkCreation } from '@components/course/CourseworkCreation';
import { RouteObject } from 'react-router-dom';

export default function facultyCourseRoute(): RouteObject[] {
    return [
        {
            path: 'course',
            element: <CourseMainScreen />,
            children: [
                {
                    element: <CourseOverview />,
                    path: ':scheduleId',
                    children: [
                        {
                            element: <CourseWorkCreation />,
                            path: 'course-work-creation'
                        }
                    ]
                }
            ]
        }
    ];
}