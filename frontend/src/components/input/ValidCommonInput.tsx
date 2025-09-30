import { InputType } from '@type/grid.type';
import { classMerge } from '@utils/css.util';
import React, { InputHTMLAttributes, Ref, useState } from 'react';

export interface ValidCommonInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    inputType?: InputType | '';
    ref?: Ref<HTMLInputElement> | null;
    onChange?: VoidFunction | ((data: string) => void);
}

/**
 * ValidCommonInput
 * A reusable input for table cells with consistent styling.
 */
export default function ValidCommonInput({
    className = '',
    inputType,
    ref,
    onChange,
    ...props
}: ValidCommonInputProps) {
    // State variables
    const [inputValue, setInputValue] = useState('');
    // Pattern variables
    const patterns: Record<InputType, RegExp> = {
        alphabet: /[^a-zA-Z\s]/g,
        number: /[^0-9]/g,
        alphanumeric: /[^a-zA-Z0-9]/g,
        email: /[^a-zA-Z0-9@._-]/g,
        any: /(?!)/
    };

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        let val = e.target.value;

        if (inputType) {
            val = val.replace(patterns[inputType], '')
                .replace(/^\s/g, '')
                .replace(/\s+/g, ' ');
        }

        onChange?.(val);
        setInputValue(val);
    };

    return (
        <input
            className={
                classMerge(
                    'border border-gray-300 rounded py-[4px] px-[4px] overflow-hidden text-[14px] leading-[100%] outline-none',
                    className
                )
            }
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            {...props}
        />
    );
};