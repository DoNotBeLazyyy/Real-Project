import FacultyProfile from '@pages/user/faculty/profile';
import { RouteObject } from 'react-router-dom';

export default function facultyProfileRoute(): RouteObject[] {
    return [
        {
            path: 'profile',
            element: <FacultyProfile />
        }
    ];
}