import CommonButton from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import CommonTextArea from '@components/input/CommonTextArea';
import NewGridTable from '@components/NewGridTable';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define row type
interface FacultyEvaluationRow {
    criteria?: string;
    evaluationScore?: number; // 1-5 scale
    isTotal?: boolean;
}

export default function FacultyEvaluation() {
    // Navigation hook
    const navigate = useNavigate();
    // Score options
    const scoreOptions = [
        { value: 1, label: '1 - Very Unsatisfactory' },
        { value: 2, label: '2 - Unsatisfactory' },
        { value: 3, label: '3 - Satisfactory' },
        { value: 4, label: '4 - Good' },
        { value: 5, label: '5 - Excellent' }
    ];
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
            criteria: 'Language Overall Evaluation',
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
            headerClass: 'ag-grade-header flex justify-end items-end',
            cellClass: (params) => params.node.rowPinned === 'bottom' ? 'font-[700] text-[#0C60A1]' : 'text-[#080612] text-[14px] flex items-center justify-center'
        },
        {
            field: 'evaluationScore',
            headerName: 'Rating',
            width: 200,
            headerClass: 'ag-grade-header',
            cellClass: (params) => params.node.rowPinned === 'bottom' ? 'font-[700] text-[#0C60A1]' : 'flex items-start justify-end',
            cellRenderer: (params: ICellRendererParams<FacultyEvaluationRow>) => {
                if (params.data?.isTotal) return params.data.evaluationScore; // show total

                return (
                    <select
                        className="border-[#0C60A1] border-[1px] font-[500] px-[8px] py-[4px] rounded-[4px] text-[#080612] w-full"
                        value={params.data?.evaluationScore || ''}
                        onChange={() => {}}
                    >
                        {scoreOptions.map((score, optionKey) => (
                            <option
                                key={`${score}-${optionKey}`}
                                value={score.value}
                            >
                                {score.label}
                            </option>
                        ))}
                    </select>
                );
            }
        }
    ];

    function handleSubmitEvaluation() {
        alert('Evaluation Submitted');
        navigate('/student/profile/grade-report/test-link');
    }

    return (
        <div className="flex flex-col gap-[16px] w-full">
            <CommonHeader
                title="Julius Robert T. Tolentino | ITC - 129 (TTH / 3:00PM - 5:00PM)"
                subTitle="Faculty Evaluation"
            />
            <ShadowCard white>
                <div className="flex flex-col gap-[16px] p-[16px] w-full">
                    <h3 className="font-[600] leading-[100%] text-[#0C60A1] text-[20px]">Language</h3>
                    <ShadowCard white>
                        <NewGridTable<FacultyEvaluationRow>
                            rowData={facultyEvaluationData}
                            columnDefs={columnDefs}
                            pinnedBottomRowData={totalRow}
                        />
                    </ShadowCard>
                </div>
            </ShadowCard>
            <ShadowCard white>
                <div className="flex flex-col gap-[16px] p-[16px] w-full">
                    <h3 className="font-[600] leading-[100%] text-[#0C60A1] text-[20px]">Technical</h3>
                    <ShadowCard white>
                        <NewGridTable<FacultyEvaluationRow>
                            rowData={facultyEvaluationData}
                            columnDefs={columnDefs}
                            pinnedBottomRowData={totalRow}
                        />
                    </ShadowCard>
                </div>
            </ShadowCard>
            <div className="flex h-[200px]">
                <CommonTextArea
                    placeholder="Provide more feedback about the professor or the course..."
                />
            </div>
            <div className="flex justify-end w-full">
                <CommonButton
                    buttonLabel="Submit Evaluation"
                    buttonStyle="blue"
                    onButtonClick={handleSubmitEvaluation}
                />
            </div>
        </div>
    );
}