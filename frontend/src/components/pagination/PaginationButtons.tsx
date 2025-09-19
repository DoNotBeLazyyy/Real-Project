import CommonButton from '@components/buttons/CommonButton';
import { DynamicButtonProps } from '@type/pagination.type';

export default function PaginationButtons({
    buttonIndex,
    onButtonClick,
    ...props
}: DynamicButtonProps) {
    const buttonSize = buttonIndex
        ? 'sm'
        : 'm';

    function handleButtonClick() {
        if (buttonIndex) {
            onButtonClick?.(buttonIndex);
            return;
        }

        (onButtonClick as VoidFunction)?.();
    }

    return (
        <CommonButton
            isRoundedFull={false}
            size={buttonSize}
            onButtonClick={handleButtonClick}
            {...props}
        />
    );
}