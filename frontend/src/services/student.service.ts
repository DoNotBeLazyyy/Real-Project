import { CustomAxios } from '@services/index.service';
import { StudentAccountColumnProps } from '@type/account.type';
import { Answer } from '@type/http';

export function getAllStudents() {
    return CustomAxios.get<Answer<StudentAccountColumnProps[]>>('/api/student/get');
}

export function getActiveStudents() {
    return CustomAxios.get<Answer<StudentAccountColumnProps[]>>('/api/student/get', { params: { status: 'active' } });
}

export function postStudents(params: StudentAccountColumnProps[]) {
    return CustomAxios.post<Answer<string>>('/api/student/add', params);
}

export function putStudents(params: StudentAccountColumnProps[]) {
    return CustomAxios.put<Answer<string>>('/api/student/update', params);
}

export function deleteStudents(id: string[]) {
    return CustomAxios.delete<Answer<string>>('/api/student/delete', { data: { data: id } });
}