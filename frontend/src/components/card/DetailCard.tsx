import { classMerge } from '@utils/css.util';
import { useState } from 'react';

export type CardStatusProps = 'pending' | 'missed' | 'submitted' | 'completed';

export interface DetailCardProps {
    // Subject code and name of a timeline item
    cardDescription?: string;
    // Task name of a timeline item
    cardName?: string;
    // Current cardStatus of a timeline item
    cardStatus?: CardStatusProps;
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
    const [isHovered, setIsHovered] = useState(false);

    // Status → color maps
    const statusColors: Record<CardStatusProps, string> = {
        missed: 'bg-[#ffc5c8]',
        submitted: 'bg-[#B6E7FE]',
        pending: 'bg-[#D4D9EA]',
        completed: 'bg-[#D4D9EA]'
    };
    const statusTextColors: Record<CardStatusProps, string> = {
        missed: 'text-[#BF0A12]',
        completed: 'text-[#0ABF10]',
        submitted: 'text-[#353A40]',
        pending: 'text-[#353A40]'
    };

    const capitalizedStatus = cardStatus
        ? cardStatus.charAt(0)
            .toUpperCase() + cardStatus.slice(1)
        : '';

    /**
     * Handle get card background
     */
    function handleGetCardBackground() {
        if (isTransparent) return 'bg-transparent';
        if (isTask) {
            if (cardStatus === 'missed') return 'bg-[#F6F4FB] opacity-[0.55]';
            if (cardStatus === 'submitted') return 'bg-[#FFFFFF]';
            if (cardStatus === 'pending') return 'bg-[#F6F4FB]';
            return 'bg-[#F6F4FB] opacity-[0.55]';
        }
        if (isFile || isCourse) return '';
        return cardStatus ? statusColors[cardStatus] : statusColors.completed;
    }

    /**
     * Handle set hover state to true when mouse enters the element area
     */
    function handleHoverEnter() {
        setIsHovered(true);
    }

    /**
     * Handle set hover state to false when mouse exits the element area
     */
    function handleHoverLeave() {
        setIsHovered(false);
    }

    return (
        <div
            className={
                classMerge(
                    'flex flex-col gap-y-[4px]',
                    !isTransparent && 'cursor-pointer px-[6px] py-[4px] rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] w-full',
                    !isTask && 'hover:opacity-[0.8]',
                    isBordered && 'border border-[#353A40]',
                    handleGetCardBackground()
                )
            }
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
        >
            <h3
                className={
                    classMerge(
                        'font-[500] text-[14px] w-full',
                        isCourse ? 'break-words' : 'truncate'
                    )
                }
            >
                {cardName}
            </h3>
            <div
                className="flex justify-between text-[12px]"
            >
                {isTask ? (
                    <>
                        <h4 className="leading-[100%]">{dueDate}</h4>
                        <h4
                            className={
                                classMerge(
                                    'leading-[100%] font-[300]',
                                    cardStatus && statusTextColors[cardStatus]
                                )
                            }
                        >
                            {cardStatus}
                        </h4>
                    </>
                ) : (
                    <div className="flex flex-col">
                        <h4 className="leading-[100%]">{cardDescription}</h4>
                        {dueDate && (
                            <h4 className="leading-[100%] mt-[8px]">{dueDate}</h4>
                        )}
                    </div>
                )}
            </div>
            {(!isCourse && !isTask && !isFile) && isHovered && (
                <div
                    className={
                        classMerge(
                            'absolute left-[-200px] px-[8px] py-[8px] rounded-[8px] text-[12px] top-[45px] w-[80%] z-[999]',
                            handleGetCardBackground()
                        )
                    }
                >
                    <h3 className="break-words font-[500] text-[12px]">{cardName}</h3>
                    <div className="flex flex-col justify-between text-[10px]">
                        <h4>{cardDescription}</h4>
                        <h4>{dueDate}</h4>
                        {cardStatus && (
                            <h4>{capitalizedStatus}</h4>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}