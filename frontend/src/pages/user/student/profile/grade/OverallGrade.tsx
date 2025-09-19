import CommonButton from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import NewGridTable from '@components/GridTable/NewGridTable';
import { usePath } from '@utils/path.util';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// Define row type
interface GradeRowProps {
    code?: string;
    name?: string;
    grade?: string;
    equiv?: string;
    button?: React.ReactNode;
    isTotal?: boolean;
}

export default function OverallGrade() {
    // Hooks
    const navigate = useNavigate();
    const { renderOutlet, setBasePath } = usePath();
    // Row data for grid
    const [rowData] = useState<GradeRowProps[]>([
        {
            code: 'ITC - 105',
            name: 'Software Engineering',
            grade: '74',
            equiv: '0'
        },
        {
            code: 'ITC - 106',
            name: 'Operating Systems',
            grade: '88',
            equiv: '1.25'
        },
        {
            code: 'ITC - 107',
            name: 'Web Development',
            grade: '91',
            equiv: '0'
        },
        {
            code: 'ITC - 108',
            name: 'Mobile App Development',
            grade: '82',
            equiv: '1.0'
        },
        {
            code: 'ITC - 109',
            name: 'Cybersecurity Basics',
            grade: '77',
            equiv: '0'
        },
        {
            code: 'ITC - 110',
            name: 'Artificial Intelligence',
            grade: '89',
            equiv: '1.25'
        }
    ]);
    // Total row pinned at the bottom
    const totalRow: GradeRowProps[] = [
        {
            code: '',
            equiv: '0',
            grade: '0',
            isTotal: true,
            name: 'Total Grade'
        }
    ];
    // Column definitions for the grid
    const columnDefs: ColDef<GradeRowProps>[] = [
        {
            field: 'code',
            headerName: 'Course Code',
            width: 140,
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
            field: 'grade',
            headerName: 'Grade',
            width: 180,
            headerClass: 'ag-grade-header flex items-center justify-center text-center w-full', // centers header
            cellClass: 'font-[600] text-[#080612] text-[13px] flex items-center justify-center', // centers cell content
            cellRenderer: (params: ICellRendererParams<GradeRowProps>) => {
                const courseCode = params.data?.code;

                if (params.node.childIndex % 2 === 0 && courseCode) {
                    return (
                        <CommonButton
                            buttonLabel="Evaluate Faculty"
                            buttonStyle="blue"
                            size="m"
                            onButtonClick={() => handleEvaluateFaculty(courseCode)}
                        />
                    );
                } else {
                    return params.node.data?.grade;
                }
            }
        },
        {
            field: 'equiv',
            headerName: 'Equivalent',
            width: 120,
            headerClass: 'ag-grade-header',
            cellClass: ' font-[600] text-[#080612] text-[13px]'
        }
    ];

    useEffect(() => {
        setBasePath('/student/profile/grade-report');
    });

    // function handleViewGrade(courseCode: string) {
    //     navigate(`${courseCode}`);
    // }

    function handleEvaluateFaculty(courseCode: string) {
        navigate(`evaluate-faculty/:${courseCode}`);
    }

    return renderOutlet
        ? <Outlet />
        : (
            <div className="flex flex-col gap-[16px] w-full">
                <div className="flex items-baseline justify-between leading-[100%]">
                    <CommonHeader
                        title="A.Y. 2024 - 2025"
                        subTitle="1st Semester - Grade Report"
                    />
                </div>
                <ShadowCard white>
                    <NewGridTable<GradeRowProps>
                        rowData={rowData}
                        columnDefs={columnDefs}
                        pinnedBottomRowData={totalRow}
                    />
                </ShadowCard>
            </div>
        );
}