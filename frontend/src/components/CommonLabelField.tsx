import { ReactNode } from 'react';

interface CommonLabelFieldProps {
    children: ReactNode;
    label: string;
}

export default function CommonLabelField({
    children,
    label
}: CommonLabelFieldProps) {
    return (
        <label className="flex flex-col gap-[8px] w-full">
            <span className="font-[500] leading-[100%] text-[#052554] text-[16px]">{label}</span>
            {children}
        </label>
    );
}