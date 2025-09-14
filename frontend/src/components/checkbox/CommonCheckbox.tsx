import { classMerge } from '@utils/css.util';
import { useState } from 'react';

interface CommonCheckboxProps {
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    onChange?: (checked: boolean) => void;
}

export default function CommonCheckbox({
    checked = false,
    disabled = false,
    label,
    onChange
}: CommonCheckboxProps) {
    const [internalChecked, setInternalChecked] = useState(checked);

    function handleToggle() {
        if (disabled) return;
        const newValue = !internalChecked;
        setInternalChecked(newValue);
        onChange?.(newValue);
    }

    return (
        <label className="cursor-pointer flex gap-2 items-center select-none">
            <input
                type="checkbox"
                checked={internalChecked}
                onChange={handleToggle}
                disabled={disabled}
                className="hidden"
            />
            <span
                className={
                    classMerge(
                        'flex items-center justify-center w-5 h-5 rounded border transition',
                        internalChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400',
                        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    )
                }
            >
                {internalChecked && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 text-white w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414L8.414 15 4.293 10.879a1 1 0 111.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </span>
            {label && <span className="font-[500] leading-[100%] text-[#080612] text-[14px]">{label}</span>}
        </label>
    );
}