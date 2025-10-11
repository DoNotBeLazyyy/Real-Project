import { Control, Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import CommonTextArea, { CommonTextAreaProps } from './CommonTextArea';

interface ValidTextAreaProps<T extends FieldValues = FieldValues> extends Omit<CommonTextAreaProps, 'defaultValue' | 'name'>, UseControllerProps<T>{
    control: Control<T>;
}

export default function ValidTextArea<T extends FieldValues = FieldValues>({
    control,
    ...props
}: ValidTextAreaProps<T>) {
    return (
        <Controller
            control={control}
            {...props}
            render={({ field }) => (
                <div className="flex flex-col">
                    <CommonTextArea
                        {...field}
                        {...props}
                    />
                </div>
            )}
        />
    );
}