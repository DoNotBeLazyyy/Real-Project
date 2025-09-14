import CommonButton from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import Input from '@components/input/Input';
import CommonTableInput from '@components/input/TableInput';
import NewGridTable from '@components/NewGridTable';
import { usePath } from '@utils/path.util';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export interface StudentFacultyRowProps {
    firstName: React.ReactNode;
    lastName: React.ReactNode;
    sex: React.ReactNode;
    email: React.ReactNode;
    age: React.ReactNode; // if you want to render input/JSX instead of number
    address: React.ReactNode;
}

interface InputCellRendererParams {
    params: ICellRendererParams<StudentFacultyRowProps>;
    field: keyof StudentFacultyRowProps;
};

export default function AdminCourse() {
    // Hooks
    const { renderOutlet } = usePath();
    // State variables
    const [rowData, setRowData] = useState<StudentFacultyRowProps[]>([]);
    const dummyData: StudentFacultyRowProps[] = [
        { firstName: 'John', lastName: 'Doe', sex: 'Male', email: 'john.doe@example.com', age: 20, address: '123 Main St' },
        { firstName: 'Jane', lastName: 'Smith', sex: 'Female', email: 'jane.smith@example.com', age: 22, address: '456 Elm St' },
        { firstName: 'Alice', lastName: 'Johnson', sex: 'Female', email: 'alice.johnson@example.com', age: 19, address: '789 Oak Ave' },
        { firstName: 'Bob', lastName: 'Brown', sex: 'Male', email: 'bob.brown@example.com', age: 21, address: '321 Pine Rd' },
        { firstName: 'Charlie', lastName: 'Davis', sex: 'Male', email: 'charlie.davis@example.com', age: 23, address: '654 Maple St' },
        { firstName: 'Eve', lastName: 'Miller', sex: 'Female', email: 'eve.miller@example.com', age: 20, address: '987 Cedar Blvd' },
        { firstName: 'Frank', lastName: 'Wilson', sex: 'Male', email: 'frank.wilson@example.com', age: 22, address: '246 Birch Ln' }
    ];
    // Column definitions for the grid
    const columnDefs: ColDef<StudentFacultyRowProps>[] = [
        {
            field: 'firstName',
            headerName: 'First Name',
            width: 170,
            headerClass: 'ag-grade-header',
            cellClass: 'text-[#080612] text-[13px]',
            cellRenderer: (params: ICellRendererParams<StudentFacultyRowProps>) =>
                renderInputCell({ params, field: 'firstName' })
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            width: 170,
            headerClass: 'ag-grade-header',
            cellClass: 'text-[#080612] text-[13px]',
            cellRenderer: (params: ICellRendererParams<StudentFacultyRowProps>) =>
                renderInputCell({ params, field: 'lastName' })
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 170,
            headerClass: 'ag-grade-header',
            cellClass: 'text-[#080612] text-[13px]',
            cellRenderer: (params: ICellRendererParams<StudentFacultyRowProps>) =>
                renderInputCell({ params, field: 'email' })
        },
        {
            field: 'age',
            headerName: 'Age',
            width: 150,
            headerClass: 'ag-grade-header',
            cellClass: 'text-[#080612] text-[13px] flex items-center justify-center',
            cellRenderer: (params: ICellRendererParams<StudentFacultyRowProps>) =>
                renderInputCell({ params, field: 'age' })
        },
        {
            field: 'sex',
            headerName: 'Sex',
            width: 120,
            headerClass: 'ag-grade-header',
            cellClass: 'text-[#080612] text-[13px] flex items-center justify-center',
            cellRenderer: (params: ICellRendererParams<StudentFacultyRowProps>) => (
                <select
                    value={String(params.data?.sex) || 'Male'}
                    onChange={(e) => {
                        if (!params.data) return;
                        params.data.sex = e.target.value as React.ReactNode;
                        params.api.refreshCells({
                            rowNodes: [params.node],
                            columns: ['sex']
                        });
                    }}
                    className="border px-2 py-1 rounded text-[13px]"
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            )
        },
        {
            field: 'address',
            headerName: 'Address',
            flex: 2,
            headerClass: 'ag-grade-header',
            cellClass: 'text-[#080612] text-[13px] flex justify-center items-center',
            cellRenderer: (params: ICellRendererParams<StudentFacultyRowProps>) =>
                renderInputCell({ params, field: 'address' })
        }
    ];

    useEffect(() => {
        setRowData(dummyData);
    }, []);

    function renderInputCell({ params, field }: InputCellRendererParams) {
        const data = params.data;
        if (!data) return null;

        const value = data[field] ?? '';

        return (
            <CommonTableInput
                value={value as string}
                className="w-full"
                onChange={(e) => {
                    data[field] = e.target.value;
                    params.api.refreshCells({
                        rowNodes: [params.node],
                        columns: [field]
                    });
                }}
            />
        );
    }

    return renderOutlet
        ? <Outlet />
        : (
            <div className="flex flex-col gap-[20px]">
                <CommonHeader
                    title="Account Registration"
                    subTitle="Student"
                />
                <ShadowCard>
                    <div className="flex flex-col gap-[12px] justify-end p-[20px] w-full">
                        <div className="mr-auto">
                            <CommonButton
                                buttonLabel="Add New Record"
                                buttonStyle="blue"
                                size="m"
                                onButtonClick={() => setRowData([...rowData, { firstName: '', lastName: '', sex: 'Male', email: '', age: '', address: '' }])}
                            />
                        </div>
                        <NewGridTable<StudentFacultyRowProps>
                            columnDefs={columnDefs}
                            domLayout="normal"
                            isPaginated={true}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            rowData={rowData}
                            height={400}
                            onRowDataChange={setRowData}
                        />
                    </div>
                </ShadowCard>
            </div>
        );
}