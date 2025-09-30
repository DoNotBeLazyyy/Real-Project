import { StringUndefined } from '@type/common.type';
import { useEffect, useState } from 'react';
import CommonRadioCheckbox from './CommonRadioCheckbox';

export interface CommonGroupRadioCheckboxProps {
    disabled?: boolean;
    radioOptions: string[];
    onChangeSelect?: (selected: string) => void;
}

export default function CommonGroupRadioCheckbox({
    disabled = false,
    radioOptions,
    onChangeSelect
}: CommonGroupRadioCheckboxProps) {
    const [selected, setSelected] = useState<StringUndefined>('');

    useEffect(() => {
        setSelected(radioOptions[0]);
    }, []);

    function handleSelect(label: string) {
        if (disabled) {
            return;
        };

        setSelected(label);
        onChangeSelect?.(label);
    };

    return (
        <div className="flex gap-[16px]">
            {radioOptions?.map((option, idx) => (
                <CommonRadioCheckbox
                    checked={selected === option}
                    disabled={disabled}
                    key={idx}
                    label={option}
                    name="common-group-radio-checkbox"
                    onChange={handleSelect}
                />
            ))}
        </div>
    );
}