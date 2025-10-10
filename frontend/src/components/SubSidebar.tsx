import arrowDropdownIcon from '@assets/icons/arrow-drop-down-icon.svg';
import logo from '@assets/images/au-logo.svg';
import DetailCard, { CardStatusProps } from '@components/card/DetailCard';
import ShadowCard from '@components/card/ShadowCard';
import CommonDatepicker from '@components/datepicker/CommonDatepicker';
import CommonMediaWithContent from '@components/label/CommonMediaWithContent';
import IconSelect from '@components/select/IconSelect';
import { useUserStore } from '@store/useUserStore';
import { useEffect, useRef, useState } from 'react';

interface TaskListProps {
    cardName: string;
    cardDescription: string;
    dueDate: string;
    cardStatus: CardStatusProps;
}

export default function SubSidebar() {
    // Store
    const { detail } = useUserStore();
    // Ref variables
    const listRef = useRef<HTMLDivElement>(null);
    // State variables
    const [isOverflowing, setIsOverflowing] = useState(false);
    // Custom variables
    const timelineSortingOptions = ['All', 'Overdue', 'Upcoming', 'No due date'];
    const taskList: TaskListProps[] = [
        {
            cardName: 'Introduction to Software Engineering',
            cardDescription: 'ITC - 101 LEC',
            dueDate: 'Due Sep. 15, 11:59 PM',
            cardStatus: 'submitted'
        },
        {
            cardName: 'Agile vs Waterfall Methodologies',
            cardDescription: 'ITC - 102 LEC',
            dueDate: 'Due Sep. 20, 11:59 PM',
            cardStatus: 'submitted'
        },
        {
            cardName: 'Software Development Life Cycle',
            cardDescription: 'ITC - 103 LEC',
            dueDate: 'Due Sep. 25, 11:59 PM',
            cardStatus: 'pending'
        },
        {
            cardName: 'Case Study: Library System',
            cardDescription: 'ITC - 104 LEC',
            dueDate: 'Due Sep. 30, 11:59 PM',
            cardStatus: 'missed'
        },
        {
            cardName: 'Requirements Gathering Techniques',
            cardDescription: 'ITC - 105 LEC',
            dueDate: 'Due Oct. 5, 11:59 PM',
            cardStatus: 'pending'
        }
    ];

    useEffect(() => {
        const checkOverflow = () => {
            if (listRef.current) {
                const { scrollHeight, clientHeight } = listRef.current;
                setIsOverflowing(scrollHeight > clientHeight);
            }
        };

        checkOverflow();

        const observer = new ResizeObserver(checkOverflow);
        if (listRef.current) {
            observer.observe(listRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="bg-transparent bottom-[25px] fixed flex flex-col gap-[16px] py-[16px] right-[9px] rounded-[8px] top-[25px] w-[250px]">
            <ShadowCard>
                <div className="flex flex-col gap-[20px] p-[16px] w-full">
                    <CommonMediaWithContent
                        fontSize="MEDIUM"
                        imageSize="LARGE"
                        imageUrl={logo}
                        isCentered
                        isVertical
                        mediaLabel={`${detail?.firstName} ${detail?.lastName}`}
                    />
                    <ShadowCard white>
                        <CommonDatepicker />
                    </ShadowCard>
                </div>
            </ShadowCard>
            <ShadowCard>
                <div className="flex flex-col gap-[16px] max-h-[calc(100vh-450px)] pb-[8px] pt-[16px] px-[8px] relative w-full">
                    <div className="flex font-[600] h-[16px] items-center justify-center relative text-[#052554]">
                        <span className="-translate-x-1/2 absolute leading-[100%] left-1/2 text-[12px] top-[0px]">
                            Timeline
                        </span>
                        <div className="absolute right-[8px] top-[5px]">
                            <IconSelect
                                height={4}
                                imageUrl={arrowDropdownIcon}
                                selectOptions={timelineSortingOptions}
                                width={8}
                            />
                        </div>
                    </div>

                    {/* Timeline list */}
                    <div
                        ref={listRef}
                        className="flex flex-col gap-[8px] overflow-y-auto pr-[4px] py-[4px] scrollbar-thin"
                    >
                        {taskList.map((task, taskKey) => (
                            <DetailCard
                                cardDescription={task.cardDescription}
                                cardName={task.cardName}
                                cardStatus={task.cardStatus}
                                dueDate={task.dueDate}
                                key={`task-${taskKey}`}
                            />
                        ))}
                    </div>

                    {/* Show only if overflowing */}
                    {isOverflowing && (
                        <div className="text-center">
                            <span className="cursor-pointer hover:font-[600] text-[#052554] text-[14px]">
                                View Timeline Page
                            </span>
                        </div>
                    )}
                </div>
            </ShadowCard>
        </div>
    );
}