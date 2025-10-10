import { SelectProps } from '@type/common.type';
import Select, { SingleValue } from 'react-select';

interface ValidCommonSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options?: SelectProps[];
    value?: string;
    onChange?: (val: string) => void;
}

export default function ValidCommonSelect({
    options,
    value,
    onChange
}: ValidCommonSelectProps) {

    function handleSelectChange(selected: SingleValue<SelectProps>) {
        const value = selected?.value;

        if (value) {
            onChange?.(value);
        }
    }

    return (
        <Select
            value={options?.find((o) => o.value === value) ?? options?.[0] ?? null}
            onChange={handleSelectChange}
            options={options}
            className="new_grid_cell w-full"
            isSearchable={true}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
                menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999
                }),
                menu: (base) => ({
                    ...base,
                    width: 'auto',
                    minWidth: '100%',
                    whiteSpace: 'nowrap'
                })
            }}
        />
    );
}