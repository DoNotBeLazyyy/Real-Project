import CommonButton, { CommonButtonProps } from '@components/buttons/CommonButton';

interface ProfileCardHeaderProps extends CommonButtonProps{
    // Profile card label
    cardLabel?: string;
    // List of buttons
    buttons?: CommonButtonProps[];
}

export default function ProfileCardHeader({
    cardLabel,
    buttons,
    ...props
}: ProfileCardHeaderProps) {
    return (
        <div className="flex items-center justify-between w-full">
            <h2 className="font-[600] leading-[100%] text-[#052554] text-[14px]">
                {cardLabel}
            </h2>
            {buttons ? (
                <div className="flex gap-[16px]">
                    {buttons?.map((button, buttonKey) => (
                        <CommonButton
                            buttonLabel={button.buttonLabel}
                            buttonStyle={button.buttonStyle}
                            key={`button-${buttonKey}`}
                            size={button.size}
                            onButtonClick={button.onButtonClick}
                        />
                    ))}
                </div>
            ) : (
                <CommonButton
                    {...props}
                />
            )}
        </div>
    );
}