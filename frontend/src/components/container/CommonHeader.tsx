import IconSelect, { IconSelectProps } from '@components/select/IconSelect';
import React from 'react';

interface CommonHeaderProps {
    // Header icons
    icons?: Omit<IconSelectProps, 'selectOptions' | 'isHeader'>[];
    // Header sub title
    subTitle?: string;
    // Header title
    title?: string;
}

export default function CommonHeader({
    icons,
    subTitle,
    title
}: CommonHeaderProps) {
    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[8px] leading-[100%]">
                    <h1 className="font-[800] text-[#0C60A1] text-[20px]">
                        {title}
                    </h1>
                    <h2 className="font-[500] text-[#080612] text-[14px]">
                        {subTitle}
                    </h2>
                </div>
                {icons && (
                    <div className="flex gap-[8px] relative">
                        {icons?.map((icon, key) => (
                            <React.Fragment key={key}>
                                <IconSelect
                                    height={icon.height || 11}
                                    imageUrl={icon.imageUrl}
                                    isHeader
                                    pendingActCount={icon.pendingActCount}
                                    width={icon.width || 11}
                                    onIconClick={icon.onIconClick ? icon.onIconClick : undefined}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}