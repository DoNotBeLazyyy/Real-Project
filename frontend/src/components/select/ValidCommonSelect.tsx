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

                control: (base) => ({
                    ...base,
                    minHeight: '28px',
                    height: '28px'
                }),
                valueContainer: (base) => ({
                    ...base,
                    height: '28px',
                    padding: '0 6px'
                }),
                indicatorsContainer: (base) => ({
                    ...base,
                    height: '28px'
                }),
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