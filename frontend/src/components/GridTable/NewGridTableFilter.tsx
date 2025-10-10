import CommonInput from '@components/input/CommonInput';
import { InputType } from '@type/grid.type';
import { IFloatingFilterParams } from 'ag-grid-community';

interface NewGridTableFilterProps extends IFloatingFilterParams {
    inputType: InputType;
}

export default function NewGridTableFilter(props: NewGridTableFilterProps) {
    // Header name variable
    const headerName = props.column.getColDef().headerName;
    // Input type variable
    const inputType = props.inputType ?? '';

    function handleFilterChange(data: string) {
        props.parentFilterInstance((instance) => {
            instance.onFloatingFilterChanged('contains', data);
        });
    }

    return (
        <CommonInput
            className="mx-[10px] px-[10px] w-full"
            inputType={inputType}
            placeholder={`Search ${headerName}`}
            onChange={handleFilterChange}
        />
    );
}