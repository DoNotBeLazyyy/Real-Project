import { useState } from 'react';

export type CardStatusProps = 'pending' | 'missed' | 'submitted' | 'completed';

export interface DetailCardProps {
    // Subject code and name of a timeline item
    cardDescription?: string;
    // Task name of a timeline item
    cardName?: string;
    // Current cardStatus of a timeline item
    cardStatus?: 'pending' | 'missed' | 'submitted' | 'completed';
    // Due date of a timeline item
    dueDate?: string;
    // Checks whether the detail is bordered
    isBordered?: boolean;
    // Checks whether detail card is a course
    isCourse?: boolean;
    // Checks whether detail card is a file
    isFile?: boolean;
    // Checks whether detail card is a task
    isTask?: boolean;
    // Checks whether detail card is transparent
    isTransparent?: boolean;
}

export default function DetailCard({
    cardDescription,
    cardName,
    cardStatus,
    dueDate,
    isBordered,
    isCourse,
    isFile,
    isTask,
    isTransparent
}: DetailCardProps) {
    const [hovered, setHovered] = useState(false);
    const closedTaskStyle = 'bg-[#F6F4FB] opacity-[0.55]';

    return (
        <div
            className={`
                    flex flex-col gap-y-[4px]
                    ${isTransparent ? 'bg-transparent' : 'cursor-pointer px-[6px] py-[4px] rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] w-full'}
                    ${isTask ? '' : 'hover:opacity-[0.8]'}
                    ${isTask || isFile ? '' : cardStatus === 'missed' ? 'bg-[#ffc5c8]' : cardStatus === 'submitted' ? 'bg-[#D4D9EA]' :  'bg-[#B6E7FE]'}
                    ${!isTask ? '' : cardStatus === 'missed' ? `${closedTaskStyle}` : cardStatus === 'submitted' ? 'bg-[#FFFFFF]' :  cardStatus === 'pending' ? 'bg-[#F6F4FB]' : `${closedTaskStyle}`}
                    ${isBordered ? 'border-[1px] border-[#353A40]' : ''}
                `}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <h3
                className={`
                    font-[500] text-[12px] w-full
                    ${isCourse ? 'break-words' : 'truncate'}
                `}
            >
                {cardName}
            </h3>
            <div
                className="flex justify-between text-[10px]"
            >
                {isTask ? (
                    <>
                        <h4 className="leading-[100%]">{dueDate}</h4>
                        <h4
                            className={`
                                "leading-[100%]" font-[300]
                                ${cardStatus === 'missed' ? 'text-[#BF0A12]' : cardStatus === 'completed' ? 'text-[#0ABF10]' :  'text-[#353A40]'}
                            `}
                        >
                            {cardStatus}
                        </h4>
                    </>
                ) : (
                    <>
                        <h4 className="leading-[100%]">{cardDescription}</h4>
                        <h4 className="leading-[100%]">{dueDate}</h4>
                    </>
                )}
            </div>
            {(!isCourse && !isTask && !isFile) && hovered && (
                <div
                    className={`
                        ${cardStatus === 'missed' ? 'bg-[#ffc5c8]' : cardStatus === 'submitted' ? 'bg-[#D4D9EA]' :  'bg-[#B6E7FE]'} 
                        absolute left-[-180px] px-[8px] py-[8px] rounded-[8px] text-[12px] top-[45px] w-[80%] z-[999]
                    `}
                >
                    <h3 className="break-words font-[500] text-[12px]">{cardName}</h3>
                    <div className="flex flex-col justify-between text-[10px]">
                        <h4>{cardDescription}</h4>
                        <h4>{dueDate}</h4>
                        {cardStatus && (
                            <h4>{cardStatus.charAt(0)
                                .toLocaleUpperCase() + cardStatus.slice(1)}
                            </h4>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}