import { CustomAxios } from '@services/index.service';
import { Answer } from '@type/http';
import { ProgramManagementColumnProps } from '@type/management.type';

export function getActivePrograms() {
    return CustomAxios.get<Answer<ProgramManagementColumnProps[]>>('/api/program/get', { params: { status: 'active' } });
}

export function postPrograms(params: ProgramManagementColumnProps[]) {
    return CustomAxios.post<Answer<string>>('/api/program/add', params);
}

export function putPrograms(params: ProgramManagementColumnProps[]) {
    return CustomAxios.put<Answer<string>>('/api/program/update', params);
}

export function deletePrograms(id: string[]) {
    return CustomAxios.delete<Answer<string>>('/api/program/delete', { data: { data: id } });
}