import { Controller, UseControllerProps } from 'react-hook-form';
import CommonInput, { CommonInputProps } from './CommonInput';

export interface ValidCommonInputProps extends CommonInputProps, UseControllerProps {
    isShowError?: boolean;
};

/**
 * ValidCommonInput
 * A reusable input for table cells with consistent styling and validation.
 */
export default function ValidCommonInput({
    isShowError,
    ...props
}: ValidCommonInputProps) {
    return (
        <Controller
            {...props}
            render={({ field, fieldState }) => (
                <div className="flex flex-col">
                    <CommonInput
                        {...field}
                        {...props}
                    />
                    {isShowError && fieldState.error && (
                        <span className="leading-[100%] mt-[4px] text-[#ef4444] text-[14px]">
                            {fieldState.error.message}
                        </span>
                    )}
                </div>
            )}
        />
    );
}