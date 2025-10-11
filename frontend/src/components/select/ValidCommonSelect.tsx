import { Control, Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import CommonSelect, { CommonSelectProps } from './CommonSelect';

interface ValidCommonSelectProps<T extends FieldValues = FieldValues> extends UseControllerProps<T>, Omit<CommonSelectProps, 'defaultValue' | 'name'> {
    control: Control<T>;
}

export function ValidCommonSelect<T extends FieldValues = FieldValues>({
    control,
    ...props
}: ValidCommonSelectProps<T>) {
    return (
        <Controller
            control={control}
            {...props}
            render={({ field }) => (
                <CommonSelect
                    {...field}
                    {...props}
                />
            )}
        />
    );
}