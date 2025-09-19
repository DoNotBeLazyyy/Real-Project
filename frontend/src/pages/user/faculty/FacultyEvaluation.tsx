import CommonButton from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import NewGridTable from '@components/GridTable/NewGridTable';
import { usePath } from '@utils/path.util';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define row type
interface FacultyEvaluationRow {
    criteria?: string;
    evaluationScore?: number; // 1-5 scale
    isTotal?: boolean;
}

export default function FacultyEvaluation() {
    // Hooks
    const navigate = useNavigate();
    const { setBasePath } = usePath();
    // Row data for grid
    const [facultyEvaluationData] = useState<FacultyEvaluationRow[]>([
        {
            criteria: 'Speaks English clearly and fluently',
            evaluationScore: 5
        },
        {
            criteria: 'Explains concepts clearly and concisely',
            evaluationScore: 4
        },
        {
            criteria: 'Encourages student participation',
            evaluationScore: 4
        },
        {
            criteria: 'Provides practical examples and applications',
            evaluationScore: 5
        },
        {
            criteria: 'Responsive to student questions and feedback',
            evaluationScore: 5
        },
        {
            criteria: 'Organizes lectures and materials effectively',
            evaluationScore: 4
        }
    ]);
    // Total row pinned at the bottom
    const totalRow: FacultyEvaluationRow[] = [
        {
            criteria: 'Overall Evaluation',
            evaluationScore: 4.5, // e.g., average of all scores
            isTotal: true
        }
    ];
    // Column definitions for the grid
    const columnDefs: ColDef<FacultyEvaluationRow>[] = [
        {
            field: 'criteria',
            headerName: 'Evaluation Criteria',
            flex: 1,
            headerClass: 'ag-grade-header flex items-center justify-center text-center',
            cellClass: 'text-[#080612] text-[13px] flex items-center justify-center'
        },
        {
            field: 'evaluationScore',
            headerName: 'Score',
            width: 120,
            headerClass: 'ag-grade-header ',
            cellClass: 'font-[600] text-[#080612] text-[13px]'
        }
    ];

    useEffect(() => {
        setBasePath('/student/profile/grade-report');
    }, []);

    function handleViewGrade(courseCode: string) {
        navigate(`${courseCode}`);
    }

    return (
        <div className="flex flex-col gap-[16px] w-full">
            <div className="flex items-baseline justify-between leading-[100%]">
                <CommonHeader
                    title="Julius Robert T. Tolentino | ITC - 129 (TTH / 3:00PM - 5:00PM)"
                    subTitle="Faculty Evaluation"
                />
            </div>
            <ShadowCard white>
                <NewGridTable<FacultyEvaluationRow>
                    rowData={facultyEvaluationData}
                    columnDefs={columnDefs}
                    pinnedBottomRowData={totalRow}
                />
            </ShadowCard>
        </div>
    );
}