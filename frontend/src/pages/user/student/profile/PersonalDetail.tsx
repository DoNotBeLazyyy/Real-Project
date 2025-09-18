import ShadowCard from '@components/card/ShadowCard';
import CommonHighlightedLabel from '@components/label/CommonHighlightedLabel';
import ProfileCardHeader from '@pages/user/student/profile/ProfileCardHeader';

export default function PersonalDetail() {
    const studentDetails  = {
        'Email': 'FirstnameLastname@gmail.com',
        'Program': 'BSCS',
        'Gender': 'Male',
        'Year Level': 'First Year',
        'Username': 'Mico123',
        'First Name': 'Mico Angelo',
        'Password': 'Mico123',
        'Last Name': 'Carillanes',
        'Role': 'Student',
        'Enrolled': 'A.Y. 2024 - 2025'
    };
    const maxLength = Object.keys(studentDetails)
        .reduce((max, key) => {
            return key.length > max
                ? key.length
                : max;
        }, 0);
    const labelWidth = `${maxLength * 8 + 24}px`;

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
                    {Object.entries(studentDetails)
                        .map(([key, value]) => (
                            <CommonHighlightedLabel
                                key={`details-${key}`}
                                label={key}
                                labelWidth={labelWidth}
                                value={value}
                            />
                        ))}
                </div>
            </div>
        </ShadowCard>
    );
};