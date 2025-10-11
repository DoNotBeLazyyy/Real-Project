import { SelectProps } from '@type/common.type';
import { useState } from 'react';
import Select, { SingleValue } from 'react-select';

export interface CommonSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options?: SelectProps[];
    value?: string;
    onChange?: (val: string) => void;
}

export default function CommonSelect({
    options,
    value,
    onChange
}: CommonSelectProps) {
    const [selected, setSelected] = useState<SelectProps | null>(options?.find((o) => o.value === value) ?? options?.[0] ?? null);

    function handleSelectChange(selected: SingleValue<SelectProps>) {
        const value = selected?.value;

        if (value) {
            setSelected?.(selected);
            onChange?.(value);
        }
    }

    return (
        <Select
            value={selected}
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