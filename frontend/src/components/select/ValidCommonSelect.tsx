interface ValidCommonSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options?: string[];
    onChange?: (val: string) => void;
}

export default function ValidCommonSelect({
    options,
    onChange,
    ...props
}: ValidCommonSelectProps) {

    function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        onChange?.(value);
    }

    return (
        <select
            onChange={handleSelectChange}
            {...props}
        >
            {options?.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    );
}