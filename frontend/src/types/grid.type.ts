import { ColDefField } from 'ag-grid-community';
import { SelectProps } from './common.type';

// Grid props
export type InputType = 'alphabet' | 'number' | 'alphanumeric' | 'email' | 'any';

export interface GridColumnsProps<TData> {
    field: ColDefField<TData, unknown>;
    inputType?: InputType;
    options?: SelectProps[];
    maxLength?: number;
    minWidth?: number;
}