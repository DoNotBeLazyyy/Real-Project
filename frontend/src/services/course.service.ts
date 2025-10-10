import { CustomAxios } from '@services/index.service';
import { Answer } from '@type/http';
import { CourseManagementColumnProps } from '@type/management.type';

export function getAllCourses() {
    return CustomAxios.get<Answer<CourseManagementColumnProps[]>>('/api/course/get');
}

export function getActiveCourses() {
    return CustomAxios.get<Answer<CourseManagementColumnProps[]>>('/api/course/get', { params: { status: 'active' } });
}

export function postCourses(params: CourseManagementColumnProps[]) {
    return CustomAxios.post<Answer<string>>('/api/course/add', params);
}

export function putCourses(params: CourseManagementColumnProps[]) {
    return CustomAxios.put<Answer<string>>('/api/course/update', params);
}

export function deleteCourses(id: string[]) {
    return CustomAxios.delete<Answer<string>>('/api/course/delete', { data: { data: id } });
}