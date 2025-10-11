import { Control, Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import CommonInput, { CommonInputProps } from './CommonInput';

export interface ValidCommonInputProps<T extends FieldValues = FieldValues> extends CommonInputProps, UseControllerProps<T> {
    isShowError?: boolean;
    control: Control<T>;
};

/**
 * ValidCommonInput
 * A reusable input for table cells with consistent styling and validation.
 */
export default function ValidCommonInput<T extends FieldValues = FieldValues>({
    isShowError,
    control,
    ...props
}: ValidCommonInputProps<T>) {
    return (
        <Controller
            control={control}
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