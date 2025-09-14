import lockIcon from '@assets/icons/lock-icon.svg';
import logoutIcon from '@assets/icons/logout-icon.svg';
import supportIcon from '@assets/icons/support-icon.svg';
import SidebarMenu, { SidebarMenuProps } from '@components/buttons/SidebarMenu';
import BrandCard from '@components/card/BrandCard';
import SearchContact from '@components/input/SearchContact';
import CommonMediaWithContent from '@components/label/CommonMediaWithContent';

export default function MainSidebar(props: SidebarMenuProps) {    // Custom variables
    const iconButtonsMap = [
        { icon: lockIcon, label: 'Data privacy' },
        { icon: supportIcon, label: 'Technical Support' },
        { icon: logoutIcon, label: 'Logout' }
    ];

    return (
        <div className="bg-[#0C60A1] bottom-[0px] fixed flex flex-col gap-[16px] left-0 overflow-y-auto px-[30px] py-[20px] text-[#FFFFFF] top-[0px] w-[250px]">
            <div className="flex-1">
                <BrandCard isSmall />
            </div>
            <SidebarMenu {...props} />
            <div className="flex flex-col gap-[4px] h-[calc(100vh-430px)]">
                <SearchContact />
            </div>
            <div className="flex flex-col gap-[8px] mt-auto">
                {iconButtonsMap.map((button, key) => (
                    <div
                        className="cursor-pointer hover:underline"
                        key={key}
                    >
                        <CommonMediaWithContent
                            imageUrl={button.icon}
                            mediaLabel={button.label}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}