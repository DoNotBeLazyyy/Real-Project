import CommonHeader from '@components/container/CommonHeader';

interface GradeRowProps {
    name: string;
    activities?: number[];
    examinations?: number[];
    projects?: number[];
    children?: GradeRowProps[];
    total?: number;
}

export default function DetailGrade() {
    // Example row data with categories
    const rowData: GradeRowProps[] = [
        {
            name: 'Prelim Grades',
            activities: [95, 90, 87, 92],
            examinations: [85, 88],
            projects: [92, 90],
            children: [
                { name: 'Lecture 1', activities: [95], examinations: [85], projects: [92] },
                { name: 'Lecture 2', activities: [87], examinations: [88], projects: [90] },
                { name: 'Lab 1', activities: [90], examinations: [], projects: [] },
                { name: 'Lab 2', activities: [92], examinations: [], projects: [] }
            ]
        },
        {
            name: 'Midterm Grades',
            activities: [80, 85, 78, 82],
            examinations: [90, 80, 85],
            projects: [88, 86],
            children: [
                { name: 'Lecture 1', activities: [80], examinations: [90], projects: [88] },
                { name: 'Lecture 2', activities: [85], examinations: [80], projects: [86] },
                { name: 'Lab 1', activities: [78], examinations: [], projects: [] },
                { name: 'Lab 2', activities: [82], examinations: [], projects: [] }
            ]
        },
        {
            name: 'Semi-Final Grades',
            activities: [88, 84, 90],
            examinations: [85, 87],
            projects: [80, 82],
            children: [
                { name: 'Lecture 1', activities: [88], examinations: [85], projects: [80] },
                { name: 'Lecture 2', activities: [84], examinations: [87], projects: [82] },
                { name: 'Lab 1', activities: [90], examinations: [], projects: [] }
            ]
        },
        {
            name: 'Final Grades',
            activities: [92, 89, 95],
            examinations: [90, 92],
            projects: [95, 97],
            children: [
                { name: 'Lecture 1', activities: [92], examinations: [90], projects: [95] },
                { name: 'Lecture 2', activities: [89], examinations: [92], projects: [97] },
                { name: 'Lab 1', activities: [95], examinations: [], projects: [] }
            ]
        }
    ];

    // Helper to calculate weighted total
    function calculateTotal(row: GradeRowProps) {
        const sum = (arr?: number[]) =>
            arr && arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

        const activitiesAvg = sum(row.activities) * 0.3;
        const examsAvg = sum(row.examinations) * 0.5;
        const projectsAvg = sum(row.projects) * 0.2;

        return parseFloat((activitiesAvg + examsAvg + projectsAvg).toFixed(2));
    };

    rowData.forEach((row) => {
        row.total = calculateTotal(row);
    });

    // Overall grade (average of all periodicals)
    const overallGrade = rowData
        .reduce((acc, row) => acc + (row.total || 0), 0) / rowData.length;

    // Helper to map numeric grade to equivalent
    function calculateEquivalent(grade: number) {
        if (grade >= 97) return '1.00';
        if (grade >= 94) return '1.25';
        if (grade >= 91) return '1.50';
        if (grade >= 88) return '1.75';
        if (grade >= 85) return '2.00';
        if (grade >= 82) return '2.25';
        if (grade >= 79) return '2.50';
        if (grade >= 76) return '2.75';
        if (grade === 75) return '3.00';
        return '5.00';
    };

    return (
        <div className="flex flex-col gap-[20px]">
            <CommonHeader
                title="ITC - 129 (TTH / 3:00PM - 5:00PM)"
                subTitle="Grade Report"
            />
            <div className="flex flex-col gap-[16px]">
                {rowData.map((row, idx) => (
                    <div
                        key={idx}
                        className="bg-gradient-to-br duration-200 from-[#bdd7ef] hover:shadow-lg p-[16px] rounded-[16px] shadow-md to-[#E8ECF8] transition-all"
                    >
                        <div className="bg-gradient-to-r font-[700] from-[#0C60A1] grid grid-cols-[1fr_120px_120px] mb-[8px] p-[12px] rounded-[12px] text-[#FFFFFF] text-[14px] to-[#052554]">
                            <div className="">{row.name}</div>
                            <div className="text-center">Total Grade</div>
                            <div className="text-center">Equivalent</div>
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            {row.children?.map((child, cidx) => {
                                const childTotal = calculateTotal(child);
                                return (
                                    <div
                                        key={cidx}
                                        className="bg-white/80 duration-200 grid grid-cols-[1fr_120px_120px] hover:shadow-md p-[10px] rounded-[12px] shadow-sm transition-all"
                                    >
                                        <div className="flex font-[600] items-center pl-[20px] text-[#080612] text-[12px]">{child.name}</div>
                                        <div className="text-[#080612] text-[12px] text-center">{childTotal}</div>
                                        <div className="text-[#080612] text-[12px] text-center">{calculateEquivalent(childTotal)}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="bg-[#0C60A1] grid grid-cols-[1fr_120px_120px] mt-[12px] p-[10px] rounded-[12px] shadow-md">
                            <div className="font-[700] text-[#FFFFFF] text-[12px]">Period Total</div>
                            <div className="text-[#FFFFFF] text-[12px] text-center">{row.total}</div>
                            <div className="text-[#FFFFFF] text-[12px] text-center">{calculateEquivalent(row.total || 0)}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-gradient-to-r from-[#0C60A1] grid grid-cols-[1fr_120px_120px] mt-[16px] p-[14px] rounded-[16px] shadow-lg to-[#052554]">
                <div className="font-[800] text-[#FFFFFF] text-[12px]">Overall Grade</div>
                <div className="text-[#FFFFFF] text-[12px] text-center">{overallGrade.toFixed(2)}</div>
                <div className="text-[#FFFFFF] text-[12px] text-center">{calculateEquivalent(overallGrade)}</div>
            </div>
        </div>
    );
}