import { CustomAxios } from '@services/index.service';
import { Answer } from '@type/http';

export function postCoursework(formData: FormData) {
    return CustomAxios.post<Answer<string>>('/api/coursework/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}