import { CustomAxios } from '@services/index.service';
import { Answer } from '@type/http';
import { DepartmentManagementColumnProps } from '@type/management.type';

export function getActiveDepartments() {
    return CustomAxios.get<Answer<DepartmentManagementColumnProps[]>>('/api/department/get', { params: { status: 'active' } });
}

export function postDepartments(params: DepartmentManagementColumnProps[]) {
    return CustomAxios.post<Answer<string>>('/api/department/add', params);
}

export function putDepartments(params: DepartmentManagementColumnProps[]) {
    return CustomAxios.put<Answer<string>>('/api/department/update', params);
}

export function deleteDepartments(id: string[]) {
    return CustomAxios.delete<Answer<string>>('/api/department/delete', { data: { data: id } });
}