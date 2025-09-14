import { classMerge } from '@utils/css.util';
import React, { InputHTMLAttributes } from 'react';

interface CommonTableInputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Optional fixed width for table inputs */
    width?: string | number;
    /** Optional fixed height for table inputs */
    height?: string | number;
}

/**
 * CommonTableInput
 * A reusable input for table cells with consistent styling.
 */
const CommonTableInput: React.FC<CommonTableInputProps> = ({
    className = '',
    ...props
}) => {
    return (
        <input
            type="text"
            className={
                classMerge(
                    'border border-gray-300 rounded py-[4px] px-[4px] overflow-hidden text-sm outline-none',
                    className
                )
            }
            {...props}
        />
    );
};

export default CommonTableInput;