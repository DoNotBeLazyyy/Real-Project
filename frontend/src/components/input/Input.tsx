import { classMerge } from '@utils/css.util';
import { InputHTMLAttributes, useEffect, useRef } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    type?: 'text' | 'password' | 'number';
    size?: 's' | 'm';
}

export default function Input({
    label,
    type = 'text',
    size,
    ...props
}: InputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (type === 'number' && inputRef.current) {
            const el = inputRef.current;
            el.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                }
            });
        }
    }, [type]);

    return (
        <div className="flex gap-[4px] h-full items-center w-full">
            {label && (
                <span className="leading-[100%] text-[#080612] text-[14px] w-max">
                    {label}
                </span>
            )}
            <input
                className={
                    classMerge(
                        'border-[0.5px] border-black outline-none rounded-[4px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-[#000000] leading-[100%]',
                        size === 's'
                            ? 'p-[2px] text-[14px] shadow-none'
                            : 'p-[12px] text-[16px]'
                    )
                }
                ref={inputRef}
                type={type}
                {...props}
            />
        </div>
    );
}