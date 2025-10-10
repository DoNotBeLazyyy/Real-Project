import AdminAccount from '@pages/user/admin/account';
import { RouteObject } from 'react-router-dom';

export default function adminAccountRoute(): RouteObject[] {
    return [
        {
            path: 'account',
            element: <AdminAccount />
        }
    ];
}