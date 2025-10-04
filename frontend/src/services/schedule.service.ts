import { CustomAxios } from '@services/index.service';
import { Answer } from '@type/http';
import { ScheduleManagementColumnProps } from '@type/management.type';

export function getAllSchedules() {
    return CustomAxios.get<Answer<ScheduleManagementColumnProps[]>>('/api/schedule/get');
}

export function getActiveSchedules() {
    return CustomAxios.get<Answer<ScheduleManagementColumnProps[]>>('/api/schedule/get', { params: { status: 'active' } });
}

export function postSchedules(params: ScheduleManagementColumnProps[]) {
    return CustomAxios.post<Answer<string>>('/api/schedule/add', params);
}

export function putSchedules(params: ScheduleManagementColumnProps[]) {
    return CustomAxios.put<Answer<string>>('/api/schedule/update', params);
}

export function deleteSchedules(id: string[]) {
    return CustomAxios.delete<Answer<string>>('/api/schedule/delete', { data: { data: id } });
}