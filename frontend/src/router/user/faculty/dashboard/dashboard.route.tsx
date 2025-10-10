import FacultyDashboard from '@pages/user/faculty/dashboard';
import { RouteObject } from 'react-router-dom';

export default function facultyDashboardRoute(): RouteObject[] {
    return [
        {
            path: 'dashboard',
            element: <FacultyDashboard />
        }
    ];
}