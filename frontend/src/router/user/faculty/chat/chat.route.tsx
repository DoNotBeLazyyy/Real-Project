import FacultyChat from '@pages/user/faculty/chat';
import { RouteObject } from 'react-router-dom';

export default function studentChatRoute(): RouteObject[] {
    return [
        {
            path: 'chat',
            element: <FacultyChat />
        }
    ];
}