import CommonButton from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import CommonCheckbox from '@components/checkbox/CommonCheckbox';
import CommonHeader from '@components/container/CommonHeader';
import Input from '@components/input/Input';
import NewGridTable from '@components/NewGridTable';
import { ColDef } from 'ag-grid-community';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CourseRowProps {
    code?: string;
    name?: string;
    unit?: number;
    schedule?: string;
    professor?: string;
    selected?: boolean;
}

export default function CourseEnrollment() {
    // Navigation hook
    const navigate = useNavigate();
    // Row data
    const [rowData, setRowData] = useState<CourseRowProps[]>([
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        },
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        },
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        },
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        },
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        },
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        },
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        },
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        },
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        },
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        },
        {
            code: 'ITC-201',
            name: 'Database Systems',
            unit: 3,
            schedule: 'MWF / 9:00AM - 10:00AM',
            professor: 'Dr. Maria Santos'
        },
        {
            code: 'ITC-202',
            name: 'Computer Networks',
            unit: 3,
            schedule: 'TTH / 1:00PM - 2:30PM',
            professor: 'Prof. John Reyes'
        },
        {
            code: 'ITC-203',
            name: 'Human-Computer Interaction',
            unit: 2,
            schedule: 'MWF / 11:00AM - 12:00PM',
            professor: 'Dr. Anna Cruz'
        }
    ]);
    // Col defs
    const columnDefs: ColDef<CourseRowProps>[] = [
        {
            field: 'code',
            headerName: 'Course Code',
            width: 150,
            headerClass: 'ag-grade-header',
            cellClass: 'font-[600] text-[#080612] text-[13px]'
        },
        {
            field: 'name',
            headerName: 'Course Name',
            flex: 1,
            headerClass: 'ag-grade-header',
            cellClass: 'text-[#080612] text-[13px]'
        },
        {
            field: 'unit',
            headerName: 'Unit',
            width: 100,
            headerClass: 'ag-grade-header',
            cellClass: 'font-[600] text-[#080612] text-[13px] flex items-center justify-center'
        },
        {
            field: 'schedule',
            headerName: 'Schedule',
            flex: 1,
            headerClass: 'ag-grade-header',
            cellClass: 'text-[#080612] text-[13px]'
        },
        {
            field: 'professor',
            headerName: 'Professor',
            flex: 1,
            headerClass: 'ag-grade-header',
            cellClass: 'text-[#080612] text-[13px]'
        }
    ];
    const checkBoxMenu = [
        {
            label: 'Lecture'
        },
        {
            label: 'Laboratory'
        },
        {
            label: 'All'
        }
    ];

    function handleCourseEnroll() {
        alert('Enrollment submission successful');
        navigate('');
    }

    return (
        <div className="flex flex-col gap-[16px] w-full">
            <CommonHeader
                title="1st Semester - A.Y. 2024 - 2025"
                subTitle="Course Enrollment"
            />
            <div className="flex justify-between">
                <div className="">
                    <Input
                        label="Course code"
                        placeholder="Enter course code"
                        size="s"
                    />
                </div>
                <div className="flex gap-[8px] ml-auto">
                    {checkBoxMenu.map((checkbox, checkboxKey) => (
                        <CommonCheckbox
                            key={`${checkbox.label}-${checkboxKey}`}
                            label={checkbox.label}
                        />
                    ))}
                </div>
            </div>
            <ShadowCard white>
                <NewGridTable<CourseRowProps>
                    columnDefs={columnDefs}
                    domLayout="normal"
                    height={569}
                    isPaginated={true}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50]}
                    rowData={rowData}
                    selection={{
                        mode: 'multiRow',
                        headerCheckbox: true,
                        selectAll: 'filtered'
                    }}
                />
            </ShadowCard>
            <div className="flex-none ml-auto">
                <CommonButton
                    buttonLabel="Submit Enrollment"
                    buttonStyle="blue"
                    onButtonClick={handleCourseEnroll}
                />
            </div>
        </div>
    );
}