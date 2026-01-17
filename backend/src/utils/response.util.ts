// Response utils
import { MakeResponseProps } from '@app-types/http.js';

// Format reponse
export function makeResponse<T>(props: MakeResponseProps<T>): MakeResponseProps<T> {
    const { result, retCode, retMsg, status } = props;

    if (retCode) {
        return {
            result,
            retCode: retCode ?? '',
            retMsg: retMsg ?? '',
            status: status ?? 0,
            timeZone: Intl.DateTimeFormat()
                .resolvedOptions().timeZone
        };
    }

    return { result };
}