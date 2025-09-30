import { CustomAxios } from '@services/index.service';
import { FacultyAccountColumnProps } from '@type/account.type';
import { Answer } from '@type/http';

export function getAllFaculties() {
    return CustomAxios.get<Answer<FacultyAccountColumnProps[]>>('/api/faculty/get');
}

export function getActiveFaculties() {
    return CustomAxios.get<Answer<FacultyAccountColumnProps[]>>('/api/faculty/get', { params: { status: 'active' } });
}

export function postFaculties(params: FacultyAccountColumnProps[]) {
    return CustomAxios.post<Answer<string>>('/api/faculty/add', params);
}

export function putFaculties(params: FacultyAccountColumnProps[]) {
    return CustomAxios.put<Answer<string>>('/api/faculty/update', params);
}

export function deleteFaculties(id: string[]) {
    return CustomAxios.delete<Answer<string>>('/api/faculty/delete', { data: { data: id } });
}