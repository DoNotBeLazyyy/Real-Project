import { ColDefField } from 'ag-grid-community';
import { SelectProps } from './common.type';

// Grid props
export type InputType = 'alphabet' | 'number' | 'alphanumeric' | 'email' | 'any';

export interface GridColumnsProps<TData> {
    field: ColDefField<TData, unknown>;
    inputType?: InputType;
    max?: number;
    maxLength?: number;
    min?: number;
    minLength?: number;
    minWidth?: number;
    options?: SelectProps[];
    pattern?: RegExp;
    name?: string;
}

export interface InputField {
    type?: string;
    placeholder?: string;
    inputType?: InputType;
    name: string;
    value?: string;
    disabled?: boolean;
}