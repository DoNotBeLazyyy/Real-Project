interface AccountBaseProps {
    [key: string]: unknown;
    address: string;
    age: string;
    email: string;
    firstName: string;
    lastName: string;
    sex: string;
}

export interface StudentAccountColumnProps extends AccountBaseProps {
    program?: string;
    studentId?: string;
    studentNumber: string;
    yearLevel?: string;
}

export interface FacultyAccountColumnProps extends AccountBaseProps {
    department?: string;
    facultyId?: string;
    facultyNumber: string;
}