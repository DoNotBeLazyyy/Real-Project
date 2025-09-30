// Response utils
import { Answer } from '../types/http.js';

// Format reponse
export function makeResponse<T>(
    status: number,
    result: T,
    retMsg: string,
    retCode: 'SUCCESS' | 'ERROR'
): Answer<T> {
    return {
        result,
        retCode,
        retMsg,
        status,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
}