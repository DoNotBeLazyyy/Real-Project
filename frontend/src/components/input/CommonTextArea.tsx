import ShadowCard from '@components/card/ShadowCard';
import { classMerge } from '@utils/css.util';

export interface CommonTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    // Text area title
    title?: string;
    // Text area description
    description?: string;
    // Text area height;
    height?: string | number;
    className?: string;
    isShadowed?: boolean;
}

export default function CommonTextArea({
    className,
    description,
    height,
    isShadowed,
    title,
    ...props
} : CommonTextAreaProps) {
    return (
        <>
            {isShadowed
                ? <ShadowCard white>
                    <div
                        className="flex flex-col gap-[8px] h-full p-[8px] text-[#080612] w-full"
                        style={{ height }}
                    >
                        {title && (
                            <p className="font-[600] leading-[100%] text-[12px]">{title}</p>
                        )}
                        {description && (
                            <p className="font-[400] leading-[100%] text-[12px]">{description}</p>
                        )}
                        <textarea
                            className="bg-[#EDEDF0] border h-full p-[8px] placeholder-[#939393] resize-none rounded-[8px] text-[14px] w-full"
                            style={{ height }}
                            placeholder="Write your thoughts here..."
                            {...props}
                        />
                    </div>
                </ShadowCard>
                : <div
                    className="flex flex-col gap-[8px] h-full text-[#080612] w-full"
                    style={{ height }}
                >
                    {title && (
                        <p className="font-[600] leading-[100%] text-[12px]">{title}</p>
                    )}
                    {description && (
                        <p className="font-[400] leading-[100%] text-[12px]">{description}</p>
                    )}
                    <textarea
                        className={
                            classMerge(
                                'bg-[#EDEDF0] border h-full p-[8px] placeholder-[#939393] resize-none rounded-[8px] text-[14px] w-full',
                                className
                            )
                        }
                        style={{ height }}
                        placeholder="Write your thoughts here..."
                        {...props}
                    />
                </div>}
        </>

    );
}