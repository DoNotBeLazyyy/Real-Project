import { useUserStore } from '@store/useUserStore';
import { classMerge } from '@utils/css.util';
import { usePath } from '@utils/path.util';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TabProps {
    // Tab label
    label: string;
    // Tab path
    path: string;
}

export interface SidebarMenuProps {
    // User level to determine appropriate tab options per user role
    userLevel?: 'student' | 'faculty' | 'admin';
}

/**
 * Sidebar menu component that displays navigation options based on the user's role.
 *
 * @example
 * function MainSidebar() {
 *   return (
 *      <SidebarMenu userLevel="faculty" />
 *   );
 * }
 */
export default function SidebarMenu({
    userLevel
}: SidebarMenuProps) {
    // Hooks
    const navigate = useNavigate();
    const { pathname, secondaryPath } = usePath();
    const { detail } = useUserStore();
    // State variables
    const [activeTab, setActiveTab] = useState('');
    // Custom variables
    const tabMap = {
        student: [
            { label: 'Dashboard', path: 'dashboard' },
            { label: 'Course', path: 'course' },
            { label: 'Chats', path: 'chat' },
            { label: 'Profile', path: 'profile' }
        ],
        faculty: [
            { label: 'Dashboard', path: 'dashboard' },
            { label: 'Course', path: 'course' },
            { label: 'Chats', path: 'chat' },
            { label: 'Profile', path: 'profile' }
        ],
        admin: [
            { label: 'Dashboard', path: 'dashboard' },
            { label: 'Course', path: 'course' },
            { label: 'Support', path: 'support' },
            { label: 'Account', path: 'account' }
        ]
    };

    const tabOptions = userLevel ? tabMap[userLevel] : [];

    useEffect(() => {
        setActiveTab(secondaryPath);
        console.log('detail: ', detail);
    }, [pathname]);

    /**
     * Changes the active tab and navigates user to designated screen.
     *
     * @param {string} tab - The identifier of the clicked tab.
     */
    function handleSelectedTab(tab: TabProps) {
        if (tab) {
            const tabPath = tab.path;
            setActiveTab(tabPath);
            navigate(`${tabPath}`);
        }
    }

    return (
        <ul className="flex flex-col gap-[4px]">
            {tabOptions.map((tab, tabKey) => (
                <li
                    className={
                        classMerge(
                            'bg-[#F6F4FB] cursor-pointer hover:bg-[#c7c9df] overflow-hidden px-[20px] py-[12px] relative rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]',
                            activeTab === tab.path
                                ? '!bg-[#D4D9EA]'
                                : ''
                        )
                    }
                    key={`${tab.label}-${tabKey}`}
                    onClick={() => handleSelectedTab(tab)}
                >
                    <span className="font-[700] text-[#052554] text-[16px]">
                        {tab.label}
                    </span>
                    {activeTab === tab.path && (
                        <div className="[clip-path:ellipse(60%_80%_at_70%_100%)] absolute bg-[#c7c9df] bottom-[-10px] h-[100px] origin-bottom-right right-[-5px] rounded-[99999px] scale-[0.5] w-[120px]"></div>
                    )}
                </li>
            ))}
        </ul>
    );
}