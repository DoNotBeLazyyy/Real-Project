import { InputType } from '@type/grid.type';
import { patterns } from '@utils/const.util';
import { classMerge } from '@utils/css.util';
import React, { forwardRef } from 'react';

export interface CommonInputProps {
    className?: string;
    disabled?: boolean;
    inputType?: InputType;
    maxLength?: number;
    minLength?: number;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (value: string) => void;
}

// Use forwardRef to allow passing ref from Controller
const CommonInput = forwardRef<HTMLInputElement, CommonInputProps>(({
    className,
    disabled,
    inputType,
    maxLength,
    minLength,
    placeholder,
    type,
    value,
    onChange
}, ref) => {

    function handleSanitizedChange(e: React.ChangeEvent<HTMLInputElement>) {
        let val = e.target.value;

        if (inputType) {
            val = val
                .replace(patterns[inputType], '')
                .replace(/^\s/g, '')
                .replace(/\s+/g, ' ');
        }

        if (inputType === 'number' && val.length > 1) {
            val = val.replace(/^0+/, '');
        }

        onChange?.(val);
    }

    return (
        <input
            className={classMerge(
                'border-[1px] rounded py-[4px] px-[4px] overflow-hidden leading-[100%] outline-none',
                className,
                disabled && 'bg-[#a1a1a1] text-[#000000] cursor-not-allowed border-[#a1a1a1]'
            )}
            disabled={disabled}
            maxLength={maxLength}
            minLength={minLength}
            placeholder={placeholder}
            ref={ref} // <-- forward the ref here
            type={type ?? 'text'}
            value={value}
            onChange={handleSanitizedChange}
        />
    );
});

CommonInput.displayName = 'CommonInput'; // important for devtools and forwardRef

export default CommonInput;