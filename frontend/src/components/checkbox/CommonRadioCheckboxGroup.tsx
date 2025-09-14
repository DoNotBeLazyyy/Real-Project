import { useState } from 'react';
import CommonRadioCheckbox from './CommonRadioCheckbox';

interface CommonGroupRadioCheckboxProps<T extends string> {
    disabled?: boolean;
    options?: T[];
    value?: T;
    onChange?: (selected: T) => void;
}

export default function CommonGroupRadioCheckbox<T extends string>({
    disabled = false,
    options,
    value,
    onChange
}: CommonGroupRadioCheckboxProps<T>) {
    const [selected, setSelected] = useState<T | undefined>(value);

    // Sync external value prop if controlled
    if (value !== undefined && value !== selected) {
        setSelected(value);
    }

    const handleSelect = (label: T) => {
        if (disabled) return;
        setSelected(label);
        onChange?.(label);
    };

    return (
        <div className="flex gap-[16px]">
            {options?.map((label, idx) => (
                <CommonRadioCheckbox
                    checked={selected === label}
                    disabled={disabled}
                    key={idx}
                    label={label}
                    name="common-group-radio-checkbox"
                    onChange={() => handleSelect(label)}
                />
            ))}
        </div>
    );
}