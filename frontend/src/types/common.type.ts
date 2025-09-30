import { createDataStore } from '@store/useDataStore';
import { GridApi } from 'ag-grid-community';
import { JSX, RefObject } from 'react';

// Icon svg props
export type IconSvgProps = React.SVGProps<SVGSVGElement>;

// Grid api props
export type NullGridApi = GridApi | null;

// String props
export type StringNum = string | number;
export type StringUndefined = string | undefined;

// State props
export type StateProps<T> = React.Dispatch<React.SetStateAction<T>>;

// Object props
export type UnknownObject = Record<string, unknown>;
export type GenericStoreObject<TData> = Record<string, DataStoreHook<TData>>;
export type JsxObject = Record<string, JSX.Element>;

// Ref props
export type ButtonNull = RefObject<HTMLButtonElement | null>;

// Store props
export type DataStoreHook<TData> = ReturnType<typeof createDataStore<TData>>;