import CommonRadioCheckbox from './CommonRadioCheckbox';

export interface CommonGroupRadioCheckboxProps {
    disabled?: boolean;
    radioOptions: string[];
    selected?: string;
    onChangeSelect?: (selected: string) => void;
}

export default function CommonGroupRadioCheckbox({
    disabled = false,
    radioOptions,
    selected = radioOptions[0],
    onChangeSelect
}: CommonGroupRadioCheckboxProps) {
    function handleSelect(label: string) {
        if (disabled) {
            return;
        };
        onChangeSelect?.(label);
    };

    return (
        <div className="flex gap-[16px]">
            {radioOptions?.map((option, idx) => (
                <CommonRadioCheckbox
                    checked={selected === option}
                    disabled={disabled}
                    key={idx}
                    label={option}
                    name="common-group-radio-checkbox"
                    onChange={handleSelect}
                />
            ))}
        </div>
    );
}