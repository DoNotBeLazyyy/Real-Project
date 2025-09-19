import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import NewGridCell from '@components/GridTable/NewGridCell';
import NewGridFormTable from '@components/GridTable/NewGridFormTable';
import { handleFieldChange } from '@utils/ag-grid.util';
import { ColDef, ICellRendererParams, RowNode } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import AccountActionBar from './AccountActionBar';

type RoleProps = 'Student' | 'Faculty';

interface StudentFacultyRowProps {
    [key: string]: unknown;
    address?: string;
    age?: string;
    department?: string;
    email?: string;
    firstName?: string;
    id: string;
    lastName?: string;
    program?: string;
    sex?: string;
    yearLevel?: string;
}

export interface ButtonOptionsProps {
    condition: boolean;
    label: string;
    submitRef?: RefObject<HTMLButtonElement | null>;
    onButtonClick: () => void;
}

export default function AdminAccount() {
    // Ref variables
    const submitRef = useRef<HTMLButtonElement>(null);
    // State variables
    const [studentRowData, setStudentRowData] = useState<StudentFacultyRowProps[]>([]);
    const [facultyRowData, setFacultyRowData] = useState<StudentFacultyRowProps[]>([]);
    const [selectedRole, setSelectedRole] = useState<RoleProps>('Student');
    const [isModify, setIsModify] = useState(false);
    const [isAddRemove, setIsAddRemove] = useState(false);
    const [columnDefs, setColumnDefs] = useState<ColDef<StudentFacultyRowProps>[]>([]);
    // Dummy Student data
    const dummyStudentData: StudentFacultyRowProps[] = [
        { id: 'S005', firstName: 'Charlie', lastName: 'Davis', sex: 'Male', email: 'charlie.davis@example.com', age: '20', address: '654 Maple St', program: 'BSIT', yearLevel: '3rd Year' },
        { id: 'S006', firstName: 'Eve', lastName: 'Miller', sex: 'Female', email: 'eve.miller@example.com', age: '20', address: '987 Cedar Blvd', program: 'BSHM', yearLevel: '2nd Year' },
        { id: 'S003', firstName: 'Alice', lastName: 'Johnson', sex: 'Female', email: 'alice.johnson@example.com', age: '20', address: '789 Oak Ave', program: 'BSHM', yearLevel: '1st Year' },
        { id: 'S004', firstName: 'Bob', lastName: 'Brown', sex: 'Male', email: 'bob.brown@example.com', age: '20', address: '321 Pine Rd', program: 'BSCS', yearLevel: '4th Year' },
        { id: 'S005', firstName: 'Charlie', lastName: 'Davis', sex: 'Male', email: 'charlie.davis@example.com', age: '20', address: '654 Maple St', program: 'BSIT', yearLevel: '3rd Year' },
        { id: 'S006', firstName: 'Eve', lastName: 'Miller', sex: 'Female', email: 'eve.miller@example.com', age: '20', address: '987 Cedar Blvd', program: 'BSHM', yearLevel: '2nd Year' },
        { id: 'S007', firstName: 'Frank', lastName: 'Wilson', sex: 'Male', email: 'frank.wilson@example.com', age: '20', address: '246 Birch Ln', program: 'BSCS', yearLevel: '4th Year' }
    ];
    // Dummy faculty data
    const dummyFacultyData: StudentFacultyRowProps[] = [
        { id: 'F002', firstName: 'Dr. Emily', lastName: 'Clark', sex: 'Female', email: 'emily.clark@example.com', age: '38', address: '34 College Ave', department: 'Information Technology' },
        { id: 'F003', firstName: 'Dr. Robert', lastName: 'Johnson', sex: 'Male', email: 'robert.johnson@example.com', age: '50', address: '56 Campus Rd', department: 'Hospitality Management' },
        { id: 'F004', firstName: 'Dr. Alice', lastName: 'Miller', sex: 'Female', email: 'alice.miller@example.com', age: '42', address: '78 Academic St', department: 'Computer Science' },
        { id: 'F005', firstName: 'Dr. Michael', lastName: 'Brown', sex: 'Male', email: 'michael.brown@example.com', age: '55', address: '90 College Lane', department: 'Information Technology' },
        { id: 'F006', firstName: 'Dr. Jessica', lastName: 'Davis', sex: 'Female', email: 'jessica.davis@example.com', age: '36', address: '23 University Rd', department: 'Hospitality Management' },
        { id: 'F007', firstName: 'Dr. William', lastName: 'Wilson', sex: 'Male', email: 'william.wilson@example.com', age: '48', address: '45 Campus Blvd', department: 'Computer Science' }
    ];
    // User level options
    const roleOptions: RoleProps[] = [
        'Student',
        'Faculty'
    ];
    // Button list
    const buttonOptions: ButtonOptionsProps[] = [
        {
            label: 'New Record',
            condition: !isAddRemove && !isModify,
            onButtonClick: handleEnableAddRemove
        },
        {
            label: 'Modify',
            condition: !isAddRemove && !isModify,
            onButtonClick: handleEnableModification
        },
        {
            label: 'Save Changes',
            condition: isModify || isAddRemove,
            submitRef: submitRef,
            onButtonClick: handleSubmit
        },
        {
            label: 'Discard Changes',
            condition: isModify || isAddRemove,
            onButtonClick: isModify
                ? handleDisableModification
                : handleDisableAddRemove
        }
    ];
    // Year level options
    const yearLevelOptions = [
        '1st Year',
        '2nd Year',
        '3rd Year',
        '4th Year',
        '5th Year'
    ];

    useEffect(() => {
        setSelectedRole(roleOptions[0]);
    }, []);

    useEffect(() => {
        setStudentRowData(dummyStudentData);
        setFacultyRowData(dummyFacultyData);
        setColumnDefs(getColumnDefs(selectedRole));
    }, [selectedRole, isAddRemove, isModify]);

    function getColumnDefs( selectedRole: RoleProps ): ColDef<StudentFacultyRowProps>[] {
        const isStudent = selectedRole === 'Student';

        return [
            {
                field: isStudent ? 'id' : 'id',
                headerName: isStudent ? 'Student ID' : 'Faculty ID',
                minWidth: 160,
                cellRenderer: (params: ICellRendererParams) => {
                    const rowIndex = (params.node.rowIndex ?? 0) + 1;
                    const data = params.data;
                    const base = isStudent
                        ? 'S-25'
                        : 'F-25';

                    if (isAddRemove) {
                        return `${base}${String(rowIndex)
                            .padStart(3, '0')}`;
                    } else {
                        return `${data.id}`;;
                    }
                }
            },
            {
                field: 'firstName',
                headerName: 'First Name',
                minWidth: 160,
                cellRenderer: (params: ICellRendererParams) => (
                    <NewGridCell<StudentFacultyRowProps>
                        field="firstName"
                        isAddRemove={isAddRemove}
                        isModify={isModify}
                        inputType="alphabet"
                        params={params}
                    />
                )
            },
            {
                field: 'lastName',
                headerName: 'Last Name',
                minWidth: 160,
                cellRenderer: (params: ICellRendererParams) => (
                    <NewGridCell<StudentFacultyRowProps>
                        field="lastName"
                        isAddRemove={isAddRemove}
                        isModify={isModify}
                        inputType="alphabet"
                        params={params}
                        maxLength={25}
                    />
                )
            },
            {
                field: 'age',
                headerName: 'Age',
                minWidth: 120,
                cellRenderer: (params: ICellRendererParams) => (
                    <NewGridCell<StudentFacultyRowProps>
                        field="age"
                        isAddRemove={isAddRemove}
                        isModify={isModify}
                        inputType="number"
                        params={params}
                        maxLength={3}
                    />
                )
            },
            {
                field: 'sex',
                headerName: 'Sex',
                minWidth: 120,
                cellRenderer: (params: ICellRendererParams) => (
                    <NewGridCell<StudentFacultyRowProps>
                        field="sex"
                        isAddRemove={isAddRemove}
                        isModify={isModify}
                        inputType="alphabet"
                        params={params}
                        maxLength={6}
                    />
                )
            },
            {
                field: 'address',
                headerName: 'Address',
                minWidth: 200,
                cellRenderer: (params: ICellRendererParams) => (
                    <NewGridCell<StudentFacultyRowProps>
                        field="address"
                        isAddRemove={isAddRemove}
                        isModify={isModify}
                        inputType="alphanumeric"
                        params={params}
                        maxLength={150}
                    />
                )
            },
            {
                field: 'email',
                headerName: 'Email',
                minWidth: 200,
                cellRenderer: (params: ICellRendererParams) => (
                    <NewGridCell<StudentFacultyRowProps>
                        field="email"
                        isAddRemove={isAddRemove}
                        isModify={isModify}
                        inputType="email"
                        params={params}
                        maxLength={100}
                    />
                )
            },
            {
                field: isStudent ? 'program' : 'department',
                headerName: isStudent ? 'Program' : 'Department',
                minWidth: 180,
                cellRenderer: (params: ICellRendererParams) => (
                    <NewGridCell<StudentFacultyRowProps>
                        field={isStudent ? 'program' : 'department'}
                        isAddRemove={isAddRemove}
                        isModify={isModify}
                        inputType="alphabet"
                        params={params}
                        maxLength={8}
                    />
                )
            },
            ...(isStudent ? [{
                field: 'yearLevel',
                headerName: 'Year Level',
                minWidth: 150,
                cellRenderer: (params: ICellRendererParams) => {
                    const data = params.data;
                    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                        handleFieldChange<StudentFacultyRowProps>({
                            data,
                            fieldName: 'yearLevel',
                            value: e.target.value,
                            node: params.node as RowNode,
                            api: params.api
                        });
                    };

                    if (!data) {
                        return null;
                    } else if (isAddRemove) {
                        return (
                            <select
                                value={data.yearLevel ?? ''}
                                onChange={handleChange}
                                className="border border-gray-300 px-2 py-[2px] rounded w-full"
                            >
                                {yearLevelOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        );
                    } else {
                        return `${data.yearLevel}`;
                    }
                }
            }] : [])
        ];
    }

    function handleEnableModification() {
        setIsModify(true);
    }

    function handleDisableModification() {
        setIsModify(false);
    }

    function handleEnableAddRemove() {
        setIsAddRemove(true);
    }

    function handleDisableAddRemove() {
        setIsAddRemove(false);
    }

    function handleSubmit() {
        if (submitRef.current) {
            submitRef.current.click();
        }

        alert('Modification saved successfully');

        if (isModify) {
            handleEnableAddRemove();
        } else if (isAddRemove) {
            handleDisableAddRemove();
        }
    }

    return (
        <div className="flex flex-col gap-[20px]">
            <CommonHeader title="Account Management" />
            <AccountActionBar<RoleProps>
                buttonOptions={buttonOptions}
                options={roleOptions}
                value={selectedRole}
                onChange={setSelectedRole}
            />
            <ShadowCard>
                <div className="flex flex-col gap-[12px] justify-end p-[20px] w-full">
                    <NewGridFormTable<StudentFacultyRowProps>
                        columnDefs={columnDefs}
                        domLayout="normal"
                        height={580}
                        isModify={isModify}
                        hasAddRemoveColumn={isAddRemove}
                        pagination={true}
                        rowData={
                            selectedRole === 'Student'
                                ? studentRowData
                                : facultyRowData
                        }
                        submitRef={submitRef}
                    />
                </div>
            </ShadowCard>
        </div>
    );
}