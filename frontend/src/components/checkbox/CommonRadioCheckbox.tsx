import { classMerge } from '@utils/css.util';
import { useState, useEffect } from 'react';

interface CommonRadioCheckboxProps {
    checked?: boolean;
    disabled?: boolean;
    label: string;
    name?: string;
    onChange?: (selected: string) => void;
}

export default function CommonRadioCheckbox({
    checked,
    disabled = false,
    label,
    name,
    onChange
}: CommonRadioCheckboxProps) {
    const [internalChecked, setInternalChecked] = useState(checked ?? false);

    // Sync external checked prop if controlled
    useEffect(() => {
        if (checked !== undefined) {
            setInternalChecked(checked);
        }
    }, [checked]);

    function handleToggle() {
        if (disabled || internalChecked) {
            return;
        };

        setInternalChecked(true);
        onChange?.(label);
    }

    return (
        <label className="cursor-pointer flex gap-2 items-center select-none">
            <input
                type="radio"
                name={name}
                checked={internalChecked}
                onChange={handleToggle}
                disabled={disabled}
                className="hidden"
            />
            <span
                className={
                    classMerge(
                        'flex items-center justify-center w-5 h-5 rounded-full border transition',
                        internalChecked ? 'bg-[#0C60A1] border-[#0C60A1]' : 'bg-[#FFFFFF] border-[#9CA3AF]',
                        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    )
                }
            >
                {internalChecked && (
                    <span className="bg-[#FFFFFF] h-[8px] rounded-full w-[8px]" />
                )}
            </span>
            {label && (
                <span className="font-[500] leading-[100%] text-[#080612] text-[14px]">
                    {label}
                </span>
            )}
        </label>
    );
}