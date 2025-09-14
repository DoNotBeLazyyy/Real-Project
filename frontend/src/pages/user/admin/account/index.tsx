import ShadowCard from '@components/card/ShadowCard';
import CommonGroupRadioCheckbox from '@components/checkbox/CommonRadioCheckboxGroup';
import CommonHeader from '@components/container/CommonHeader';
import CommonTableInput from '@components/input/TableInput';
import NewGridTable from '@components/NewGridTable';
import { usePath } from '@utils/path.util';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

type RoleProps = 'Student' | 'Faculty';

interface StudentFacultyRowProps {
    [key: string]: unknown;
    address?: React.ReactNode;
    age?: React.ReactNode;
    department?: React.ReactNode;
    email?: React.ReactNode;
    facultyId?: React.ReactNode;
    firstName?: React.ReactNode;
    lastName?: React.ReactNode;
    program?: React.ReactNode;
    sex?: React.ReactNode;
    studentId?: React.ReactNode;
}

interface InputCellRendererParams {
    params: ICellRendererParams<StudentFacultyRowProps>;
    field: keyof StudentFacultyRowProps;
};

export default function AdminAccount() {
    // Hooks
    const { renderOutlet } = usePath();
    // State variables
    const [studentRowData, setStudentRowData] = useState<StudentFacultyRowProps[]>([]);
    const [facultyRowData, setFacultyRowData] = useState<StudentFacultyRowProps[]>([]);
    const [selectedRole, setSelectedRole] = useState<RoleProps>('Student');
    const [columnDefs, setColumnDefs] = useState<ColDef<StudentFacultyRowProps>[]>([]);
    // Dummy Student data
    const dummyStudentData: StudentFacultyRowProps[] = [
        { studentId: 'S001', firstName: 'John', lastName: 'Doe', sex: 'Male', email: 'john.doe@example.com', age: 20, address: '123 Main St', program: 'BSCS' },
        { studentId: 'S002', firstName: 'Jane', lastName: 'Smith', sex: 'Female', email: 'jane.smith@example.com', age: 20, address: '456 Elm St', program: 'BSIT' },
        { studentId: 'S003', firstName: 'Alice', lastName: 'Johnson', sex: 'Female', email: 'alice.johnson@example.com', age: 20, address: '789 Oak Ave', program: 'BSHM' },
        { studentId: 'S004', firstName: 'Bob', lastName: 'Brown', sex: 'Male', email: 'bob.brown@example.com', age: 20, address: '321 Pine Rd', program: 'BSCS' },
        { studentId: 'S005', firstName: 'Charlie', lastName: 'Davis', sex: 'Male', email: 'charlie.davis@example.com', age: 20, address: '654 Maple St', program: 'BSIT' },
        { studentId: 'S006', firstName: 'Eve', lastName: 'Miller', sex: 'Female', email: 'eve.miller@example.com', age: 20, address: '987 Cedar Blvd', program: 'BSHM' },
        { studentId: 'S007', firstName: 'Frank', lastName: 'Wilson', sex: 'Male', email: 'frank.wilson@example.com', age: 20, address: '246 Birch Ln', program: 'BSCS' }
    ];
    // Dummy faculty data
    const dummyFacultyData: StudentFacultyRowProps[] = [
        { facultyId: 'F001', firstName: 'Dr. Smith', lastName: 'Anderson', sex: 'Male', email: 'smith.anderson@example.com', age: 45, address: '12 University Blvd', department: 'Computer Science' },
        { facultyId: 'F002', firstName: 'Dr. Emily', lastName: 'Clark', sex: 'Female', email: 'emily.clark@example.com', age: 38, address: '34 College Ave', department: 'Information Technology' },
        { facultyId: 'F003', firstName: 'Dr. Robert', lastName: 'Johnson', sex: 'Male', email: 'robert.johnson@example.com', age: 50, address: '56 Campus Rd', department: 'Hospitality Management' },
        { facultyId: 'F004', firstName: 'Dr. Alice', lastName: 'Miller', sex: 'Female', email: 'alice.miller@example.com', age: 42, address: '78 Academic St', department: 'Computer Science' },
        { facultyId: 'F005', firstName: 'Dr. Michael', lastName: 'Brown', sex: 'Male', email: 'michael.brown@example.com', age: 55, address: '90 College Lane', department: 'Information Technology' },
        { facultyId: 'F006', firstName: 'Dr. Jessica', lastName: 'Davis', sex: 'Female', email: 'jessica.davis@example.com', age: 36, address: '23 University Rd', department: 'Hospitality Management' },
        { facultyId: 'F007', firstName: 'Dr. William', lastName: 'Wilson', sex: 'Male', email: 'william.wilson@example.com', age: 48, address: '45 Campus Blvd', department: 'Computer Science' }
    ];

    const roleOptions: RoleProps[] = [
        'Student',
        'Faculty'
    ];

    useEffect(() => {
        setSelectedRole(roleOptions[0]);
    }, []);

    useEffect(() => {
        setStudentRowData(dummyStudentData);
        setFacultyRowData(dummyFacultyData);
        setColumnDefs(getColumnDefs(selectedRole));
    }, [selectedRole]);

    function renderInputCell({ params, field }: InputCellRendererParams) {
        const data = params.data;

        if (!data) {
            return null;
        };

        const value = data[field] ?? '';

        return (
            <div className="flex h-full items-center justify-center">
                <CommonTableInput
                    value={value as string}
                    className="w-full"
                    onChange={(e) => {
                        data[field] = e.target.value as string;
                        params.api.refreshCells({
                            rowNodes: [params.node],
                            columns: [field as string]
                        });
                    }}
                />
            </div>
        );
    }

    function getColumnDefs( selectedRole: RoleProps ): ColDef<StudentFacultyRowProps>[] {
        const isStudent = selectedRole === 'Student';

        return [
            {
                field: isStudent ? 'studentId' : 'facultyId',
                headerName: isStudent ? 'Student ID' : 'Faculty ID',
                width: 120,
                headerClass: 'ag-grade-header',
                cellClass: 'text-[#080612] text-[13px] flex items-center justify-center',
                cellRenderer: (params: ICellRendererParams<StudentFacultyRowProps>) =>
                    renderInputCell({ params, field: isStudent ? 'studentId' : 'facultyId' })
            },
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
                field: 'address',
                headerName: 'Address',
                flex: 2,
                headerClass: 'ag-grade-header',
                cellClass: 'text-[#080612] text-[13px] flex justify-center items-center',
                cellRenderer: (params: ICellRendererParams<StudentFacultyRowProps>) =>
                    renderInputCell({ params, field: 'address' })
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
                field: isStudent ? 'program' : 'department',
                headerName: isStudent ? 'Program' : 'Department',
                width: 120,
                headerClass: 'ag-grade-header',
                cellClass: 'text-[#080612] text-[13px] flex items-center justify-center',
                cellRenderer: (params: ICellRendererParams<StudentFacultyRowProps>) => (
                    <select
                        value={String(
                            isStudent ? params.data?.program : params.data?.department
                        ) || (isStudent ? 'BSCS' : 'IT')}
                        onChange={(e) => {
                            if (!params.data) return;
                            if (isStudent) {
                                params.data.program = e.target.value as React.ReactNode;
                            } else {
                                params.data.department = e.target.value as React.ReactNode;
                            }
                            params.api.refreshCells({
                                rowNodes: [params.node],
                                columns: [isStudent ? 'program' : 'department']
                            });
                        }}
                        className="border px-2 py-1 rounded text-[13px]"
                    >
                        {isStudent ? (
                            <>
                                <option value="BSCS">BSCS</option>
                                <option value="BSIT">BSIT</option>
                                <option value="BSHM">BSHM</option>
                            </>
                        ) : (
                            <>
                                <option value="HR">HR</option>
                                <option value="Finance">Finance</option>
                                <option value="IT">IT</option>
                            </>
                        )}
                    </select>
                )
            }
        ];
    }

    function createEmptyRow(data: StudentFacultyRowProps[]) {
        const emptyRow: StudentFacultyRowProps = {};
        const nextIndex = data.length + 1; // 1-based index
        const paddedIndex = String(nextIndex)
            .padStart(3, '0');

        // Copy keys from first row if exists
        if (data.length > 0) {
            Object.keys(data[0])
                .forEach((key) => {
                    emptyRow[key as keyof StudentFacultyRowProps] = '' as unknown;
                });
        }

        if (selectedRole === 'Student') {
            emptyRow.studentId = `S${paddedIndex}`;
        } else {
            emptyRow.facultyId = `F${paddedIndex}`;
        }

        return emptyRow;
    }

    return renderOutlet
        ? <Outlet />
        : (
            <div className="flex flex-col gap-[20px]">
                <CommonHeader title="Account Management" />
                <CommonGroupRadioCheckbox
                    options={roleOptions}
                    value={selectedRole}
                    onChange={setSelectedRole}
                />
                <ShadowCard>
                    <div className="flex flex-col gap-[12px] justify-end p-[20px] w-full">
                        <NewGridTable<StudentFacultyRowProps>
                            columnDefs={columnDefs}
                            domLayout="normal"
                            height={400}
                            hasAddRemoveColumn
                            isPaginated={true}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            rowData={
                                selectedRole === 'Student'
                                    ? studentRowData
                                    : facultyRowData
                            }
                            onCreateEmptyRow={createEmptyRow}
                            onRowDataChange={
                                selectedRole === 'Student'
                                    ? setStudentRowData
                                    : setFacultyRowData
                            }
                        />
                    </div>
                </ShadowCard>
            </div>
        );
}