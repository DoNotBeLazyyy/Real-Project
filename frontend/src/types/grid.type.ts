import { ColDefField } from 'ag-grid-community';

// Grid props
export type InputType = 'alphabet' | 'number' | 'alphanumeric' | 'email' | 'any';

export interface GridColumnsProps<TData> {
    field: ColDefField<TData, unknown>;
    inputType?: InputType;
    options?: string[];
    maxLength?: number;
}