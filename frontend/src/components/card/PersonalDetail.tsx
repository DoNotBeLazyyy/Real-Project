import ShadowCard from '@components/card/ShadowCard';
import CommonHighlightedLabel from '@components/label/CommonHighlightedLabel';
import ProfileCardHeader from '@pages/user/student/profile/ProfileCardHeader';
import { useUserStore } from '@store/useUserStore';

export default function PersonalDetail() {
    const { detail } = useUserStore();
    const maxLength = detail
        ? Object.keys(detail)
            .reduce((max, key) => {
                return key.length > max
                    ? key.length
                    : max;
            }, 0)
        : 0;
    const labelWidth = `${maxLength * 10 + 24}px`;

    return (
        <ShadowCard>
            <div className="flex flex-col gap-[16px] p-[16px] w-full">
                <ProfileCardHeader
                    buttonLabel="Change Password"
                    buttonStyle="blue"
                    cardLabel="User Details"
                    size="m"
                />
                <div className="gap-4 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] w-full">
                    {detail && Object.entries(detail)
                        .map(([key, value]) => {
                            const formattedKey = key
                                .replace(/([A-Z])/g, ' $1')
                                .trim()
                                .toUpperCase();

                            return (
                                <CommonHighlightedLabel
                                    key={`details-${key}`}
                                    label={formattedKey}
                                    labelWidth={labelWidth}
                                    value={String(value ?? '')}
                                />
                            );
                        })}
                </div>
            </div>
        </ShadowCard>
    );
};