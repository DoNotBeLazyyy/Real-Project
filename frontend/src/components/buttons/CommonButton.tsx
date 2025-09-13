import { classMerge } from '@utils/css.util';

export interface CommonButtonProps {
    // Button label
    buttonLabel?: string;
    // Button style
    buttonStyle?: 'white' | 'blue';
    // Checks whether button is disabled or not
    disabled?: boolean;
    // Checks whether button is rounded or not
    isRoundedFull?: boolean;
    // Checks whether button is shadowed or not
    isShadowed?: boolean;
    // Button size
    size?: 'sm' | 'm' | 'default';
    // Callback trigger when button is clicked
    onButtonClick?: VoidFunction;
}

export default function CommonButton({
    buttonLabel,
    buttonStyle,
    disabled,
    isRoundedFull = true,
    isShadowed,
    size = 'default',
    onButtonClick
}: CommonButtonProps) {
    const buttonSizeMap = {
        sm: {
            fontSize: '10px',
            padding: '5px 10px'
        },
        m: {
            fontSize: '12px',
            padding: '8px 14px'
        },
        default: {
            fontSize: '14px',
            padding: '10px 20px'
        }
    };
    const buttonSize = buttonSizeMap[size];

    return (
        <button
            className={
                classMerge(
                    'font-[400] leading-[100%]',
                    isRoundedFull
                        ? 'rounded-full'
                        : 'rounded-[4px]',
                    buttonStyle === 'white'
                        ? 'bg-[#FFFFFF] text-[#052554]'
                        : 'bg-[#0C60A1] text-[#FFFFFF]',
                    isShadowed
                        ? 'shadow-[0_4px_4px_rgba(0,0,0,0.35)'
                        : '',
                    disabled && 'bg-[#868686] text-[#dfdfe7]'
                )
            }
            disabled={disabled}
            style={buttonSize}
            onClick={onButtonClick && onButtonClick}
        >
            {buttonLabel}
        </button>
    );
}