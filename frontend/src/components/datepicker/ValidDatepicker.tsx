import { TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface ValidDatePickerProps<T extends FieldValues = FieldValues> {
    control: Control<T>;
    name: Path<T>;
    defaultValue?: string; // string instead of Date
    textFieldProps?: TextFieldProps;
}

export default function ValidDatePicker<T extends FieldValues>({
    control,
    name,
    textFieldProps
}: ValidDatePickerProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <DatePicker
                    className="bg-[#FFFFFF]"
                    value={field.value ? new Date(field.value) : null} // string -> Date
                    onChange={(date) => {
                        if (date) {
                            field.onChange(date.toISOString()
                                .split('T')[0]); // Date -> string
                        } else {
                            field.onChange('');
                        }
                    }}
                    enableAccessibleFieldDOMStructure={false} // fix MUI error
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