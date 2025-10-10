import notifBellIcon from '@assets/icons/notification-bell-icon.svg';
import settingsIcon from '@assets/icons/settings-icon.svg';
import newsImage from '@assets/images/newsImage.png';
import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import MainDiv from '@components/container/MainDiv';

export default function FacultyDashboard() {
    const iconMap = [
        { imageUrl: notifBellIcon },
        { imageUrl: settingsIcon }
    ];

    return (
        <MainDiv>
            <CommonHeader
                title="Dashboard"
                subTitle="News/Announcement Page"
                icons={iconMap}
            />
            <ShadowCard
                isCentered
                isLarge
            >
                <div className="px-[20px]">
                    <img
                        src={newsImage}
                    />
                </div>
            </ShadowCard>
        </MainDiv>
    );
};