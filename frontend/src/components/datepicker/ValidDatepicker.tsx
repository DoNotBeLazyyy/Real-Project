import { TextField, TextFieldProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { Control, Controller, FieldValues, UseControllerProps } from 'react-hook-form';

interface ValidDatePickerProps<T extends FieldValues = FieldValues>
    extends Omit<DatePickerProps<Dayjs>, 'value' | 'onChange'>,
        UseControllerProps<T> {
    control: Control<T>;
    textFieldProps?: TextFieldProps;
}

export default function ValidDatePicker<T extends FieldValues = FieldValues>({
    control,
    textFieldProps,
    ...props
}: ValidDatePickerProps<T>) {
    return (
        <Controller
            control={control}
            {...props}
            render={({ field, fieldState }) => (
                <DatePicker
                    {...props}
                    value={field.value ?? null}
                    onChange={(date) => field.onChange(date)}
                    slots={{
                        textField: TextField
                    }}
                    slotProps={{
                        textField: {
                            ...textFieldProps,
                            error: !!fieldState.error,
                            helperText: fieldState.error?.message
                        }
                    }}
                />
            )}
        />
    );
}