import FacultyCourse from '@pages/user/faculty/course';
import { RouteObject } from 'react-router-dom';

export default function studentCourseRoute(): RouteObject[] {
    return [
        {
            path: 'course',
            element: <FacultyCourse />
        }
    ];
}