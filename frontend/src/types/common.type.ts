import { GridApi } from 'ag-grid-community';

// Icon svg props
export type IconSvgProps = React.SVGProps<SVGSVGElement>;

// Grid api props
export type NullGridApi = GridApi | null;

// String props
export type StringNum = string | number;

// State props
export type StateProps<T> = React.Dispatch<React.SetStateAction<T>>;