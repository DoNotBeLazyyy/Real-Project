import { createDataStore } from '@store/useDataStore';
import { GridApi } from 'ag-grid-community';
import { JSX, Ref } from 'react';

// Ref props
export type InputRef = Ref<HTMLInputElement> | null;
export type ButtonNull = React.RefObject<HTMLButtonElement | null>;

// Icon svg props
export type IconSvgProps = React.SVGProps<SVGSVGElement>;

// Grid api props
export type NullGridApi = GridApi | null;

// String props
export type StringNum = string | number;
export type StringUndefined = string | undefined;

// Number props
export type NumberNull = number | null;

// State props
export type StateProps<T> = React.Dispatch<React.SetStateAction<T>>;

// Object props
export type UnknownObject = Record<string, unknown>;
export type GenericStoreObject<TData> = Record<string, DataStoreHook<TData>>;
export type JsxObject = Record<string, JSX.Element>;

// Store props
export type DataStoreHook<TData> = ReturnType<typeof createDataStore<TData>>;

// Select props
export interface SelectProps {
    value: string;
    label: string;
}