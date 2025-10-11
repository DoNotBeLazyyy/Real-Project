import FacultyChat from '@pages/user/faculty/chat';
import { RouteObject } from 'react-router-dom';

export default function facultyChatRoute(): RouteObject[] {
    return [
        {
            path: 'chat',
            element: <FacultyChat />
        }
    ];
}