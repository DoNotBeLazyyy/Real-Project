import Account from '@pages/user/Account';
import ChangePassword from '@pages/user/account/ChangePassword';
import ForgotPassword from '@pages/user/account/ForgotPassword';
import Login from '@pages/user/account/Login';
import { RouteObject } from 'react-router-dom';

export default function accountRoute(): RouteObject[] {
    return [
        {
            element: <Account />,
            path: 'account',
            children: [
                {
                    element: <Login />,
                    path: 'login'
                },
                {
                    element: <ForgotPassword />,
                    path: 'forgot-password'
                },
                {
                    element: <ChangePassword />,
                    path: 'change-password'
                }
            ]
        }
    ];
}