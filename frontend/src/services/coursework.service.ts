import { CourseWorkFormValues } from '@components/course/CourseworkCreation';
import { CustomAxios } from '@services/index.service';
import { Answer } from '@type/http';

export function postCoursework(params: CourseWorkFormValues) {
    return CustomAxios.post<Answer<string>>('/api/coursework/add', params);
}