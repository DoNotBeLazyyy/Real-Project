import AdminSupport from '@pages/user/admin/support';
import { RouteObject } from 'react-router-dom';

export default function adminSupportRoute(): RouteObject[] {
    return [
        {
            element: <AdminSupport />,
            path: 'support'
        }
    ];
}